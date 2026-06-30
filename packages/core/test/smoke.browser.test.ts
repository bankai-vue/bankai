import { test, expect } from "vitest";
import { createApp, defineComponent, h } from "vue";
import { version } from "../src/version";

test("exposes a version string", () => {
  expect(typeof version).toBe("string");
});

// Runs in a real browser (Vitest browser mode / Playwright provider) so the
// native-HTML behavior to come (<dialog>, Popover, focus) is tested faithfully.
test("mounts a Vue app into the real browser DOM", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);

  const App = defineComponent(() => () => h("span", { class: "probe" }, "bankai"));
  createApp(App).mount(host);

  expect(host.querySelector(".probe")?.textContent).toBe("bankai");
  host.remove();
});
