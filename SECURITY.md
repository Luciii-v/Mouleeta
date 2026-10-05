# Security implementation and deployment notes

## Shared OTP and abuse-control state

`src/lib/security-state.ts` implements the security logic, and
`src/lib/security-store.ts` persists it using Firebase Admin / Firestore
transactions. OTP sending, verification, NextAuth login, and API rate limits all
use this shared store. There is no process-local production fallback.

- Email challenges use cryptographically random six-digit codes and 32-byte
  challenge IDs. Only an HMAC-SHA256 of the code is stored.
- Document identifiers are keyed hashes; raw email addresses, IP addresses, and
  order identifiers are not written into security-state documents.
- Hashes include deployment namespace, identity, authentication method, purpose,
  and challenge ID. A profile-email code cannot authenticate a user.
- A challenge becomes usable only after delivery succeeds. A late failure or
  activation for an older delivery cannot revoke or activate a newer challenge.
- Codes expire after ten minutes and are consumed once in a transaction. The
  fifth incorrect attempt deletes the challenge. Concurrent consumers across
  instances cannot both succeed.
- Rate limits use a bounded sliding log of accepted request timestamps in a
  transaction. Requests expire individually rather than at fixed-window edges.
- Store failures reject authentication and block rate-limited operations.
  Rate-limit storage failures currently produce the endpoint's 429 response and
  a generic server log message; they never silently disable rate limits.

### Environment configuration

Use the existing `FIREBASE_SERVICE_ACCOUNT_BASE64` with an Admin service account
authorized to read, write, and transact against Firestore. Browser Firebase
configuration is not sufficient for these operations.

| Variable | Purpose |
| --- | --- |
| `SECURITY_STATE_SECRET` | Optional dedicated server-only HMAC secret, at least 32 characters. Generate at least 32 random bytes and store the encoded secret in the deployment's secret manager. Falls back to `NEXTAUTH_SECRET`, which must also meet the length requirement. |
| `SECURITY_STORE_NAMESPACE` | Explicit isolation for production, staging, preview, and local testing. Defaults to `VERCEL_ENV`, then `NODE_ENV`. Use distinct values/secrets if multiple sites or projects share the database. |
| `RESEND_API_KEY` | Required for real email OTP delivery. Phone OTPs remain on Firebase Auth. |
| `OTP_DEV_SANDBOX` | Only `true` in local development, with no Resend key, allows a code in the development response. Production always ignores it. |

Set a separate namespace for local `next start` and staging runs: local
production-mode execution otherwise defaults to the production namespace. Prefer
a separate Firebase project for staging. Never prefix any of these private
variables with `NEXT_PUBLIC_`.

Rotating the HMAC secret invalidates pending challenges and gives rate limits new
identifiers. Old documents remain subject to TTL cleanup. If it is the fallback
`NEXTAUTH_SECRET`, rotating it also invalidates NextAuth cookies.

### Firestore TTL and client-access rules

Enable TTL on **`expiresAt`** for both collection groups:

- `securityOtpChallenges`
- `securityRateLimits`

`expiresAt` is stored as a Firestore Timestamp. `expiresAtMs` is the corresponding
numeric value used for application checks. Firestore TTL deletion is
asynchronous, often delayed; code validity is always enforced by the transaction
even if an expired document has not been deleted yet. TTL is for cleanup, not
authorization. TTL deletes are billable.

Example setup commands, to run against the intended project after reviewing its
configuration:

```sh
gcloud firestore fields ttls update expiresAt --collection-group=securityOtpChallenges --enable-ttl --project=YOUR_PROJECT_ID
gcloud firestore fields ttls update expiresAt --collection-group=securityRateLimits --enable-ttl --project=YOUR_PROJECT_ID
```

Client SDKs must have **no read or write access** to either collection. Merge
equivalent deny rules into the deployed rules and test them in the Firebase
Rules simulator or emulator:

```text
match /securityOtpChallenges/{document} {
  allow read, write: if false;
}
match /securityRateLimits/{document} {
  allow read, write: if false;
}
```

Firestore rules combine matching allow statements with OR semantics. A broad
`allow` elsewhere can still grant access; adding these matches alone does not
override such an allow. Firebase Admin bypasses client rules and is controlled by
the service account's IAM permissions.

These point-read transactions require no composite indexes. Consider exempting
`requests`, `codeHash`, and expiry fields from ordinary indexes if appropriate;
TTL policies can coexist with an exemption on the TTL field. Monitor transaction
contention, latency, request volume, and Firestore costs. If traffic demands a
cheaper/faster rate limiter, the `AtomicSecurityStore` boundary allows a Redis
adapter with equivalent atomicity.

Vercel IP limits use `x-vercel-forwarded-for`, which Vercel overwrites. On a
self-hosted deployment, the trusted reverse proxy must overwrite
`x-forwarded-for`. Missing/invalid addresses share an `unknown` bucket. An IP
limit is an abuse-control layer, not proof of identity.

### Session migration

JWTs issued after this change carry `securityVersion: 2`. Older JWTs are not
upgraded on refresh and expose no authenticated user through the session
callback. Existing users must sign in again after deploying. The account layout
redirects legacy sessions to login. This also rejects sessions potentially minted
using the former client-supplied `verified` flag.

Phone sessions require a Firebase Admin-verified, non-revoked token from the
phone sign-in provider with recent authentication. An unverified email on a
Firebase account is not used to authorize Shopify order access.

## Product HTML and CSP

`sanitize-html` applies a narrow allowlist on the server in
`getProductByHandle()` before product content becomes client props. Passive text,
headings, links, and tables are retained; scripts, event handlers, styles,
forms, embedded objects, and active media are discarded. Encoded/malformed
content is handled by the parser rather than regular-expression stripping.
The sanitized HTML is identical for initial rendering and browser hydration.
Future components rendering Shopify HTML must use this sanitized data path.

Product JSON-LD escapes `<` in serialized content. Security headers deny inline
event attributes with `script-src-attr 'none'`, embedded objects with
`object-src 'none'`, and unexpected base URLs with `base-uri 'self'`.

**The policy is not yet a strict script CSP:** `script-src` retains
`'unsafe-inline'` for statically generated Next.js hydration. It does not
guarantee that arbitrary injected script tags will be blocked. Sanitization and
authorization remain essential.

The installed Next.js CSP guide requires dynamic rendering for fresh nonces;
using a global nonce would disable static generation/ISR and CDN page caching.
That conflicts with this project's documented SSG priority. Fixed/reused nonces
are not a secure substitute. Asset SRI hashes alone do not authorize Next.js's
inline hydration/streaming scripts. This build uses Turbopack; assess the actual
bundler support before adopting experimental SRI.

A strict script-CSP migration needs an explicit rendering decision and browser
tests covering direct loads, hydration, client navigation, dynamic products,
Firebase/reCAPTCHA, Shopify checkout, and consent-gated scripts. For static pages,
all inline script hashes must match the HTML actually served; dynamic/streaming
responses require appropriate response handling or fresh per-response nonces.

The search drawer now reads a bounded public catalog API instead of importing
the server Shopify module. This keeps sanitizer and server dependencies out of
browser bundles while retaining cached public catalog data.

## Dependency override and remaining advisory

`package.json` retains one override:

| Package | Pin | Why |
| --- | --- | --- |
| `@grpc/grpc-js` | `1.14.5` | Firebase's Node Firestore client otherwise resolves `1.9.16`. The pin addresses GHSA-m9gg-hp2v-232j and GHSA-f596-whhp-79r4 without the Firebase major downgrade suggested by `npm audit fix --force`. |

The override crosses the client dependency's declared minor range; passing a
build alone does not establish runtime compatibility. This application's browser
Firebase client currently uses Auth, while server Firestore uses Firebase Admin.
Validate Firebase Admin transactions and any future Node client Firestore usage
against staging or an emulator whenever updating Firebase/gRPC. Remove the
override once upstream dependencies resolve a patched compatible version, and
rerun the tests/audit. Do not force dependency downgrades just to clear an audit.

The earlier `braces: 3.0.3` override was removed: it did not patch
GHSA-vfj7-8cjw-p6xm. At this review, `3.0.3` is still the latest published version.
The full audit reports that high-severity stack-exhaustion advisory and its
development-only chain through `micromatch`, `fast-glob`,
`@next/eslint-plugin-next`, and `eslint-config-next` (five package entries).
The production-only audit is clean. Lint globs should remain trusted repository
configuration; track the upstream fix and avoid the suggested incompatible
Next ESLint downgrade.

`sanitize-html@2.18.0` requires Node >=22.12; the project targets Node 22.x.
Configure local tooling and Vercel's runtime accordingly.

## Future Shopify webhook endpoints

No webhook receiver is currently implemented. When adding one:

1. Read the original request body bytes **before** parsing JSON.
2. Calculate HMAC-SHA256 of those bytes with the Shopify app secret.
3. Strictly decode `X-Shopify-Hmac-Sha256` as a 32-byte base64 digest. Reject
   missing/malformed values and compare equal-length digests using
   `crypto.timingSafeEqual`.
4. Reject invalid signatures before database writes or privileged calls.
5. Verify the intended shop/topic and deduplicate deliveries in durable storage
   using the Shopify event/webhook identifier. Retries must not repeat actions.
6. Validate schemas, bound payload size, and derive payment/order state from
   authenticated Shopify events or trusted API reads rather than browser input.

Avoid logging raw customer payloads, secrets, or HMAC headers. Use Shopify's
supported verification library or verify the implementation against its current
documentation and signed/malformed/replayed test fixtures.

## Verification and deployment

```sh
npm run test:security
npm run lint
npm run build
npm audit --omit=dev
npm audit
```

Regression tests use synthetic identities, transactional fakes, and a mock
Firestore adapter. They cover cross-instance OTP consumption/limits, expiry,
purpose/namespace isolation, delivery races, secret-free records, rejection of
legacy authentication, malformed HTML, and configured CSP directives. They do
not prove live Firestore IAM/rules, provider delivery, OAuth, or browser behavior;
validate those in staging with synthetic accounts.

Before production deployment:

- Configure shared-state credentials/secret/namespace, TTL, client-access rules,
  and Node runtime. Test concurrent OTP requests against staging Firestore.
- Rotate the previously exposed Shopify client secret and assess revocation of
  Admin tokens returned by the former installation callback.
- Set `NEXTAUTH_URL` to the canonical domain and align Google OAuth redirect
  URIs. The installation utility remains disabled.
- Test Google login, email OTP, Firebase phone login, profiles, checkout, order
  ownership, returns, sanitized product formatting, and tracking.
- Deploy and confirm old sessions require reauthentication. Review database
  latency/costs and generic security-store failure logs afterward.
