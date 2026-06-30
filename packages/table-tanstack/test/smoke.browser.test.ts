import { test, expect } from "vitest";
import { adapterName } from "../src/index";

test("exposes the adapter name", () => {
  expect(adapterName).toBe("tanstack");
});
