import test from "node:test";
import assert from "node:assert/strict";
import { liveDemoHost } from "../lib/demo-host.ts";

test("live demos only on the canonical host or local dev", () => {
  assert.equal(liveDemoHost("hammer.ad"), true);
  assert.equal(liveDemoHost("HAMMER.AD"), true);
  assert.equal(liveDemoHost("localhost:3000"), true);
  assert.equal(liveDemoHost("hammathyme-abc123-projectnamedates-projects.vercel.app"), false);
  assert.equal(liveDemoHost("www.hammer.ad"), false);
  assert.equal(liveDemoHost(null), false);
});
