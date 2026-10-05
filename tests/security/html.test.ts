import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeProductHtml } from "../../src/lib/sanitize-html";

test("product sanitizer preserves passive formatting on the server", () => {
  const html = '<h3>Details</h3><p class="fit">Organic <strong>cotton</strong></p><table><tr><td colspan="2">Size</td></tr></table>';
  assert.equal(sanitizeProductHtml(html), html);
});

test("product sanitizer removes active markup, unsafe URLs and event attributes", () => {
  const html = '<p onclick="steal()" style="color:red">Safe</p><script>steal()</script><iframe srcdoc="attack"></iframe><svg onload="steal()"></svg><form><input name="csrfToken"></form><img src=x onerror=steal()><a href="jav&#x61;script:steal()">click</a><a href="//attacker.example">external</a>';
  const result = sanitizeProductHtml(html);
  assert.doesNotMatch(result, /<(script|iframe|svg|form|input|img)\b|\bonclick\b|\bonerror\b|\bstyle=|\bjavascript:|href="\/\//i);
  assert.match(result, /<p>Safe<\/p>/);
});

test("encoded and malformed input stays escaped across repeated sanitization", () => {
  const cases = [
    '<p>&lt;img src=x onerror=steal()&gt;</p>',
    '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=steal()>">',
    '<a href="java\nscript:steal()">test</a>',
    '<p><b>Safe</p></b><script>attack()</script>',
  ];
  for (const html of cases) {
    const output = sanitizeProductHtml(html);
    assert.doesNotMatch(output, /<(script|style|math|svg|img)\b|<[^>]*\s(onerror|onload)=|href="javascript:/i);
    assert.equal(sanitizeProductHtml(output), output);
  }
});
