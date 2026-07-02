import { expect, test } from 'vitest';
import { adapterName } from '../src/index';

test('exposes the adapter name', () => {
  expect(adapterName).toBe('tanstack');
});
