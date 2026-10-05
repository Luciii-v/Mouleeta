import assert from "node:assert/strict";
import test from "node:test";
import type { CredentialsConfig } from "next-auth/providers/credentials";
import { authOptions } from "../../src/app/api/auth/[...nextauth]/route";

test("legacy client-supplied verified flag cannot mint a session", async () => {
  const provider = authOptions.providers.find((candidate) => candidate.type === "credentials");
  assert.ok(provider);
  const config = provider.options as CredentialsConfig<Record<string, { label: string; type: string }>>;
  const result = await config.authorize(
    { target: "customer@example.com", type: "email", verified: "true" },
    { headers: {}, body: {}, query: {}, method: "POST" }
  );
  assert.equal(result, null);
});

test("pre-remediation JWT cannot expose a user identity", async () => {
  const callback = authOptions.callbacks?.session;
  assert.ok(callback);
  const input: Parameters<typeof callback>[0] = {
    session: { expires: "2099-01-01", user: { name: "Legacy", email: "customer@example.com" } },
    token: { id: "customer@example.com", email: "customer@example.com" },
    user: { id: "legacy", email: "customer@example.com", emailVerified: null },
    newSession: undefined,
    trigger: "update",
  };
  const session = await callback(input);
  assert.equal(session.user, undefined);
});
