import assert from "node:assert/strict";
import test from "node:test";
import config from "../../next.config.mjs";

test("CSP denies inline event handlers and active embedded objects", async () => {
  const getHeaders = config.headers;
  assert.ok(getHeaders);
  const routes = await getHeaders();
  const csp = routes[0].headers.find((header) => header.key === "Content-Security-Policy")?.value;
  assert.ok(csp);
  assert.match(csp, /(?:^|; )script-src-attr 'none'(?:;|$)/);
  assert.match(csp, /(?:^|; )object-src 'none'(?:;|$)/);
  assert.match(csp, /(?:^|; )base-uri 'self'(?:;|$)/);
});
