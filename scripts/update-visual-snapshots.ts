#!/usr/bin/env node
// Regenerate a PR's visual-regression baselines without leaving your machine.
//
// It reuses, attaches to, or triggers the "Update Visual Snapshots" workflow for
// the PR's branch, waits for the cross-OS run to finish, downloads the per-OS
// artifacts, and drops the PNGs into the local working tree. Reviewing,
// committing and amending the result is intentionally left to you.
//
// Re-running is cheap and idempotent, keyed on the PR's head commit:
//   - a run still in progress for that commit  → re-attach and keep watching,
//   - a successful run for that commit          → just re-download (no re-trigger),
//   - a failed/absent run for that commit        → trigger a fresh run.
//
// Usage:
//   node scripts/update-visual-snapshots.ts <pr-number>
//   pnpm test:update-visual-snapshots <pr-number>
//
// Requires the GitHub CLI (`gh`) to be installed and authenticated.

import { spawn } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

const WORKFLOW = 'update-visual-snapshots.yml';
const ARTIFACT_PREFIX = 'visual-snapshots-';

const e2eDir = join(import.meta.dirname, '..', 'e2e');

interface GhOptions {
  /** Stream gh's output straight to the terminal instead of capturing it. */
  readonly capture?: boolean;
}

interface WorkflowRun {
  readonly id: number;
  /** `queued`, `in_progress`, `completed`, … */
  readonly status: string;
  /** `success`, `failure`, … (empty while the run is not yet completed). */
  readonly conclusion: string;
  /** Head commit the run was started against. */
  readonly sha: string;
}

type Plan =
  | { readonly action: 'reuse'; readonly runId: number }
  | { readonly action: 'attach'; readonly runId: number }
  | { readonly action: 'trigger' };

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Run `gh` and resolve with its stdout. `capture: false` inherits the terminal
// instead (used for the long-running `gh run watch`).
const gh = (args: string[], options: GhOptions = {}): Promise<string> => {
  const { capture = true } = options;

  return new Promise((resolve, reject) => {
    const child = spawn('gh', args, {
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });

    let stdout = '';
    let stderr = '';
    child.stdout?.setEncoding('utf8').on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr?.setEncoding('utf8').on('data', (chunk: string) => {
      stderr += chunk;
    });

    child.on('error', (error: NodeJS.ErrnoException) => {
      reject(
        error.code === 'ENOENT'
          ? new Error('The GitHub CLI (`gh`) was not found on your PATH.')
          : error,
      );
    });
    child.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`\`gh ${args.join(' ')}\` failed (exit ${code})\n${stderr.trim()}`));
      }
    });
  });
};

// The workflow_dispatch runs for a branch, newest first.
const listRuns = async (branch: string): Promise<WorkflowRun[]> => {
  const out = await gh([
    'run',
    'list',
    '--workflow',
    WORKFLOW,
    '--branch',
    branch,
    '--event',
    'workflow_dispatch',
    '--limit',
    '20',
    '--json',
    'databaseId,status,conclusion,headSha',
    '--jq',
    '.[] | [(.databaseId | tostring), .status, .conclusion, .headSha] | @tsv',
  ]);
  if (out === '') {
    return [];
  }

  return out.split('\n').map((line) => {
    const [id, status, conclusion, sha] = line.split('\t');

    return { id: Number(id), status: status ?? '', conclusion: conclusion ?? '', sha: sha ?? '' };
  });
};

const waitForNewRun = async (
  branch: string,
  known: ReadonlySet<number>,
  attemptsLeft = 30,
): Promise<number> => {
  if (attemptsLeft <= 0) {
    throw new Error('Timed out waiting for the dispatched run to appear.');
  }

  await sleep(2000);
  const fresh = (await listRuns(branch)).map((run) => run.id).find((id) => !known.has(id));

  return fresh ?? waitForNewRun(branch, known, attemptsLeft - 1);
};

// Decide what to do based on the runs that already exist for the PR's head
// commit, so re-running the script never duplicates work needlessly.
const planRun = async (branch: string, sha: string): Promise<Plan> => {
  const forHead = (await listRuns(branch)).filter((run) => run.sha === sha);

  const running = forHead.find((run) => run.status !== 'completed');
  if (running !== undefined) {
    return { action: 'attach', runId: running.id };
  }

  const latest = forHead[0];
  if (latest !== undefined && latest.conclusion === 'success') {
    return { action: 'reuse', runId: latest.id };
  }

  return { action: 'trigger' };
};

interface PrRef {
  readonly branch: string;
  readonly sha: string;
}

// Resolve the PR's head branch + commit. workflow_dispatch can only target
// branches in this repo, so fork PRs must use the `/update-snapshots` comment.
const resolvePr = async (pr: number): Promise<PrRef> => {
  const raw = await gh([
    'pr',
    'view',
    String(pr),
    '--json',
    'headRefName,headRefOid,isCrossRepository,state',
    '--jq',
    '[.headRefName, .headRefOid, (.isCrossRepository | tostring), .state] | @tsv',
  ]);
  const [branch, sha, isCrossRepository, state] = raw.split('\t');

  if (branch === undefined || branch === '' || sha === undefined || sha === '') {
    throw new Error(`Could not resolve the head branch/commit for PR #${pr}.`);
  }
  if (isCrossRepository === 'true') {
    throw new Error(
      `PR #${pr} comes from a fork; workflow_dispatch cannot target a fork branch.\n` +
        'Comment "/update-snapshots" on the PR instead.',
    );
  }
  if (state !== 'OPEN') {
    console.warn(`Warning: PR #${pr} is ${state ?? 'in an unknown state'}.`);
  }

  return { branch, sha };
};

const triggerRun = async (branch: string): Promise<number> => {
  const known = new Set((await listRuns(branch)).map((run) => run.id));
  console.log(`Dispatching "${WORKFLOW}" on "${branch}"…`);
  await gh(['workflow', 'run', WORKFLOW, '--ref', branch]);

  return waitForNewRun(branch, known);
};

const runUrl = (runId: number): Promise<string> =>
  gh(['run', 'view', String(runId), '--json', 'url', '--jq', '.url']);

// Streams progress and exits non-zero (→ throws) if any OS leg fails.
const watchRun = (runId: number): Promise<string> =>
  gh(['run', 'watch', String(runId), '--exit-status', '--interval', '15'], { capture: false });

// Turn a plan into a finished, successful run id — reusing, attaching, or
// triggering as needed.
const resolveRun = async (branch: string, plan: Plan): Promise<number> => {
  if (plan.action === 'reuse') {
    console.log(`Reusing successful run ${plan.runId} — PR head unchanged since it ran.`);

    return plan.runId;
  }

  const runId = plan.action === 'attach' ? plan.runId : await triggerRun(branch);
  const verb = plan.action === 'attach' ? 'Attaching to' : 'Watching';
  console.log(`${verb} run ${runId}: ${await runUrl(runId)}`);
  await watchRun(runId);

  return runId;
};

// GitHub runner OS (the artifact's suffix) → the Playwright platform token that
// ends each baseline filename.
const PLATFORM_BY_OS: Record<string, string | undefined> = {
  Linux: 'linux',
  macOS: 'darwin',
  Windows: 'win32',
};

// Merge each artifact back into `e2e/`. Two subtleties:
//   - Every artifact carries the *whole* committed snapshot dir, but only the
//     files for its own platform were freshly regenerated — so we copy just
//     those, or a later artifact's stale copies would clobber earlier fresh ones.
//   - `copyFile` per file, because `fs.cp` with `recursive` does not reliably
//     overwrite an existing destination tree.
const copyArtifacts = async (downloadDir: string, names: string[]): Promise<void> => {
  const [name, ...rest] = names;
  if (name === undefined) {
    return;
  }

  const os = name.slice(ARTIFACT_PREFIX.length);
  const platform = PLATFORM_BY_OS[os];
  if (platform === undefined) {
    throw new Error(`Unknown artifact OS "${os}" (from "${name}").`);
  }

  const artifactDir = join(downloadDir, name);
  const entries = await readdir(artifactDir, { withFileTypes: true, recursive: true });
  const own = entries.filter((entry) => entry.isFile() && entry.name.endsWith(`-${platform}.png`));
  await Promise.all(
    own.map(async (entry) => {
      const src = join(entry.parentPath, entry.name);
      const dest = join(e2eDir, relative(artifactDir, src));
      await mkdir(dirname(dest), { recursive: true });
      await copyFile(src, dest);
    }),
  );
  console.log(`  ✓ ${name} (${own.length} baselines)`);
  await copyArtifacts(downloadDir, rest);
};

const downloadBaselines = async (runId: number): Promise<void> => {
  const downloadDir = await mkdtemp(join(tmpdir(), 'bankai-snaps-'));

  try {
    console.log('Downloading artifacts…');
    await gh(['run', 'download', String(runId), '-D', downloadDir]);

    const names = (await readdir(downloadDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(ARTIFACT_PREFIX))
      .map((entry) => entry.name);
    if (names.length === 0) {
      throw new Error(`No "${ARTIFACT_PREFIX}*" artifacts found on run ${runId}.`);
    }

    await copyArtifacts(downloadDir, names);
  } finally {
    await rm(downloadDir, { recursive: true, force: true });
  }
};

const main = async (): Promise<void> => {
  const prArg = process.argv[2];
  if (prArg === undefined || !/^\d+$/u.test(prArg)) {
    console.error('Usage: node scripts/update-visual-snapshots.ts <pr-number>');
    process.exitCode = 1;

    return;
  }
  const pr = Number(prArg);

  const { branch, sha } = await resolvePr(pr);
  console.log(`PR #${pr} → branch "${branch}" @ ${sha.slice(0, 7)}`);

  const runId = await resolveRun(branch, await planRun(branch, sha));
  await downloadBaselines(runId);

  console.log('\nDone. Review with `git status` / `git diff`, then commit or amend.');
};

await main();
