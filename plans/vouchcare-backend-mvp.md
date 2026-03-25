# Plan: VouchCare Backend MVP

> Source PRD: [GitHub Issue #1](https://github.com/tolu-c/vouch-care/issues/1)

## Architectural decisions

Durable decisions that apply across all phases:

- **Runtime**: All business logic in TanStack Start `createServerFn`. No separate backend service. Webhooks via Vinxi `defineEventHandler` API routes.
- **Routes**:
  - `/auth/login` — email entry
  - `/auth/verify` — OTP entry
  - `/patient/triage` — symptom form
  - `/patient/token` — QR code display
  - `/hospital/scan` — token scanner
  - `/hospital/claims` — claims dashboard (polling)
- **Schema**: Prisma + PostgreSQL. 10 MVP models: `User`, `OtpSession`, `Enrollee`, `Facility`, `FacilityStaff`, `TriageSession`, `ReferralToken`, `Claim`, `Payment`, `EscrowLedger`
- **Key data models**:
  - `User.role` enum: `PATIENT | RECEPTIONIST | ACCOUNTANT | MEDICAL_DIRECTOR | CLAIMS_OFFICER | NETWORK_MANAGER | HMO_ADMIN`
  - `Claim.status` enum: `PENDING | APPROVED | REJECTED`
  - `TriageSession.status` enum: `PENDING | TOKEN_ISSUED | CHECKED_IN | COMPLETED`
  - `Facility.tier` enum: `PRIMARY | SECONDARY | TERTIARY`
  - `Payment.type` enum: `ESCROW_HOLD | HMO_SETTLEMENT | COPAY | ESCROW_RELEASE`
  - `Payment.status` enum: `INITIATED | PENDING | SUCCESSFUL | FAILED | REVERSED`
- **Auth**: Email + 6-digit OTP via Resend. bcrypt-hashed OTP in Upstash Redis (TTL 600s). JWT in `httpOnly` cookie (15min). Refresh token in DB.
- **Cache keys**:
  - `otp:{email}` → bcrypt hash, TTL 600s
  - `policy_matrix:{hmoId}:{planId}` → JSON, TTL 86400s
  - `token:{tokenHash}` → `"valid"` sentinel, TTL 60s
- **Token security**: AES-256-GCM encrypted payload. SHA-256 hash stored in DB. Full payload in Redis only (60s TTL).
- **Real-time**: 5-second `setInterval` polling on claims dashboard. No WebSockets in MVP.
- **LLM chain**: Groq `llama-3.3-70b-versatile` (1,500ms timeout) → Gemini `gemini-2.5-flash-lite` (2,000ms timeout) → rules engine (deterministic fallback). All at `temperature: 0`.
- **Payments**: Interswitch Transfer API + Paycode. Escrow hold triggered at token generation. Co-pay split + Paycode triggered at claim approval. Webhook via Vinxi API route at `/api/webhooks/interswitch` (idempotent, deduplicated by `interswitchReference`).
- **Server function layout**: `src/server/lib/` for singletons (db, redis, groq, email, crypto, interswitch). `src/server/` for domain modules (auth, triage, token, claims, payments).

---

## Phase 1: Foundation — Auth, Schema, Seed Data & Interswitch Setup

**Day**: 1

**User stories**: 1, 2, 3, 4, 5, 6, 7, 8

### What to build

Install and configure all infrastructure dependencies (Prisma, Upstash Redis, Resend, bcryptjs, jose, Interswitch SDK or axios for Interswitch REST). Define the full MVP Prisma schema — including `Payment` and `EscrowLedger` — and run the initial migration. Seed the database with 5–10 facilities across tiers and 3 mock HMO plans (Hygeia Topaz, AXA Mansard Diamond, Reliance Emerald) with their ICD-10 coverage ranges loaded into Redis. Each seeded HMO record includes an `escrowWalletId` referencing an Interswitch sandbox wallet.

Build the authentication server functions end-to-end:
- `sendOtp` — generates a 6-digit code, bcrypt-hashes it, stores in Redis with 600s TTL, sends via Resend
- `verifyOtp` — retrieves hash from Redis, compares, deletes key on success, upserts `User`, sets signed JWT `httpOnly` cookie, creates `RefreshToken` in DB
- `getSession` — reads and verifies JWT cookie, returns `{ user }` or `null`
- `logout` — clears cookie, revokes refresh token in DB

Build the **Interswitch integration layer**:
- Interswitch client singleton (`src/server/lib/interswitch.ts`) — wraps the Transfer API, Webpay, and Paycode endpoints with typed request/response shapes. Reads `INTERSWITCH_CLIENT_ID`, `INTERSWITCH_SECRET`, `INTERSWITCH_BASE_URL` from env.
- `initiateEscrowHold({ hmoId, claimEstimate, reference })` — calls Interswitch Transfer API to pre-authorise a hold against the HMO's escrow wallet. Returns `{ interswitchReference, status }`. Writes an `EscrowLedger` entry (`type: HOLD`) and a `Payment` row (`type: ESCROW_HOLD, status: PENDING`).
- Vinxi webhook handler at `/api/webhooks/interswitch` — receives Interswitch payment status callbacks (`POST`). Validates the request signature using `INTERSWITCH_WEBHOOK_SECRET`. Updates the matching `Payment` row by `interswitchReference`. Idempotent: if the row is already `SUCCESSFUL`, discard the duplicate. Emits no side-effects for unknown references (returns 200 silently).

Wire the auth pages so the full email → OTP → redirect flow is runnable in the browser. The Interswitch client does not need a UI at this stage — only the singleton and webhook route need to be working.

### Todo

#### 1. Dependencies & environment ✅
- [x] Install `prisma@5`, `@prisma/client@5` — downgraded from v7 (v7 removed `new PrismaClient()` constructor, requires driver adapter)
- [x] Install `@upstash/redis`
- [x] Install `resend`
- [x] Install `bcryptjs`, `@types/bcryptjs`
- [x] Install `jose` (JWT sign/verify — ESM-native, replaces `jsonwebtoken`)
- [x] Install `axios` (Interswitch REST calls)
- [x] Install `tsx` (seed script runner)
- [x] Create `.env` with all required keys (DB, Redis, Resend, JWT, Interswitch)

#### 2. Prisma schema & migration ✅
- [x] `prisma init` — `prisma/schema.prisma` created, `DATABASE_URL` points at Render PostgreSQL (`vouchcaredb`)
- [x] Full schema written: 7 enums (`Role`, `Tier`, `SessionStatus`, `ClaimStatus`, `PaymentType`, `PaymentStatus`, `LedgerEntryType`), 12 models (`User`, `OtpSession`, `RefreshToken`, `HMO`, `HMOPlan`, `Enrollee`, `Facility`, `FacilityStaff`, `TriageSession`, `ReferralToken`, `Claim`, `Payment`, `EscrowLedger`). Money fields stored as `Int` (kobo).
- [x] `pnpm prisma migrate dev --name init` — migration `20260324023147_init` applied, all 12 tables created
- [x] `pnpm prisma generate` — Prisma Client v5.22.0 generated

#### 3. Server lib singletons ✅
- [x] `src/server/lib/db.ts` — PrismaClient singleton with `globalThis` caching for Vite HMR
- [x] `src/server/lib/redis.ts` — Upstash Redis (REST-based, reads from env)
- [x] `src/server/lib/email.ts` — Resend client singleton
- [x] `src/server/lib/interswitch.ts` — typed REST client: OAuth2 token cache, `initiateEscrowHold` implemented, `releaseEscrow` + `generatePaycode` stubbed for Phase 3
- [x] `pnpm typecheck` — zero errors

#### 4. Seed script
- [ ] Create `prisma/seed.ts`
- [ ] Seed 10 facilities with real Nigerian geo-coordinates (mix of PRIMARY / SECONDARY / TERTIARY tiers across Lagos, Abuja, Kano)
- [ ] Seed 3 HMO records with sandbox `escrowWalletId` values (Hygeia, AXA Mansard, Reliance Health)
- [ ] Seed 3 HMO plans (Topaz, Diamond, Emerald) with `coveredTiers`, `coveredIcd10Ranges`, `copayPercentage`, `annualLimit`
- [ ] Load each plan's policy matrix JSON into Upstash Redis under key `policy_matrix:{hmoId}:{planId}` with TTL 86400s
- [ ] Add `"prisma": { "seed": "tsx prisma/seed.ts" }` to `package.json`
- [ ] Run `pnpm prisma db seed` and verify Redis keys exist

#### 5. Auth server functions
- [ ] `sendOtp({ email })` — generate 6-digit code, bcrypt-hash, store in Redis (`otp:{email}`, TTL 600s), send via Resend, return `{ sent: true }`
- [ ] `verifyOtp({ email, otp })` — get hash from Redis, bcrypt.compare, delete key, upsert `User`, sign JWT (15min), set `httpOnly` cookie, create `RefreshToken` row, return `{ userId }`
- [ ] `getSession()` — verify JWT cookie, return `{ user }` or `null`
- [ ] `logout()` — clear cookie, set `RefreshToken.revoked = true`

#### 6. Auth route pages (minimal wiring)
- [ ] `src/routes/auth/login.tsx` — email input form, calls `sendOtp`, redirects to `/auth/verify`
- [ ] `src/routes/auth/verify.tsx` — OTP input form, calls `verifyOtp`, redirects to `/patient/triage` (patient) or `/hospital/claims` (staff) based on role

#### 7. Interswitch integration layer
- [ ] Implement `initiateEscrowHold({ hmoId, claimEstimate, reference })` in the Interswitch client — calls Transfer API pre-auth, writes `EscrowLedger` entry (`type: HOLD`), creates `Payment` row (`type: ESCROW_HOLD, status: PENDING`), returns `{ interswitchReference, status }`
- [ ] Create Vinxi API route `src/routes/api/webhooks/interswitch.ts` (`defineEventHandler`):
  - Validate HMAC-SHA256 request signature against `INTERSWITCH_WEBHOOK_SECRET`; return 401 on mismatch
  - Look up `Payment` by `interswitchReference`
  - If already `SUCCESSFUL`, return 200 (idempotent discard)
  - Otherwise update `Payment.status` from webhook body; return 200

#### 8. Verification
- [x] `pnpm prisma migrate dev` runs without errors
- [ ] `pnpm prisma db seed` populates DB + Redis without errors
- [ ] Manual smoke: call `sendOtp` from browser → email arrives → call `verifyOtp` → JWT cookie set in DevTools
- [ ] Manual smoke: call `initiateEscrowHold` in a test script → `Payment` row created in DB
- [x] `pnpm typecheck` — zero errors

---

### Acceptance criteria

- [ ] `pnpm prisma migrate dev` runs cleanly and includes `Payment` and `EscrowLedger` tables
- [ ] Seed script populates 3 HMO plans in Redis and 10 facilities in DB; each HMO row has a sandbox `escrowWalletId`
- [ ] Calling `sendOtp({ email })` delivers an email via Resend and stores a bcrypt hash in Redis
- [ ] Calling `verifyOtp({ email, otp })` with the correct code sets an `httpOnly` JWT cookie and creates a `RefreshToken` row
- [ ] Calling `verifyOtp` with an expired or wrong OTP returns a descriptive error
- [ ] `getSession()` returns the current user when a valid cookie is present
- [ ] `logout()` clears the cookie and marks the refresh token as revoked
- [ ] `initiateEscrowHold` against the Interswitch sandbox returns a reference and creates a `Payment` row with `status: PENDING`
- [ ] `POST /api/webhooks/interswitch` with a valid signature and `status: successful` updates the matching `Payment` row to `SUCCESSFUL`
- [ ] `POST /api/webhooks/interswitch` with an invalid signature returns 401
- [ ] Duplicate webhook delivery for the same `interswitchReference` is silently deduplicated
- [ ] `pnpm typecheck` passes with zero errors

---

## Phase 2: AI Triage Engine + QR Referral Token

**Day**: 2

**User stories**: 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 40, 41, 42, 43, 44, 45, 46, 47

### What to build

Build the complete triage-to-token pipeline as a chain of isolated, independently testable modules called from a single `runTriage` server function:

**Emergency bypass** — synchronous regex check runs before any LLM call. Keyword patterns (chest pain, stroke, can't breathe, seizure, etc.) trigger an immediate emergency response with the nearest tertiary facility. A second check on LLM-returned ICD-10 prefixes (`I21`, `I63`, `S06`, `T71`, `O60`, `R57`, `J96`) provides belt-and-suspenders coverage.

**LLM symptom parser** — calls Groq with a structured JSON-only system prompt that includes Nigerian Pidgin glossary entries (`"body dey hot" = fever`, `"e dey purge" = diarrhoea`). Hard 1,500ms timeout via `Promise.race`. On failure, falls back to Gemini 2.5 Flash-Lite (2,000ms timeout). On that failure, falls back to the deterministic rules engine. LLM output is strictly validated (ICD-10 format regex, tier/urgency enums, confidence 0–1) before use.

**Policy validation** — reads the `PolicyMatrix` from Upstash Redis (warm from seed data). Checks: tier covered, ICD-10 in covered ranges (range parsing), annual limit headroom. Calculates co-pay and HMO portion. Returns `approved` boolean and `denialReason`.

**Facility matcher** — Haversine SQL query (`cos/acos`) filtered by tier and HMO accreditation. Radius expansion: 10km → 25km → 50km. Always returns up to 3 results.

**Token generator** — if policy approved, calls `initiateEscrowHold` (built in Phase 1) to pre-authorise the HMO's estimated portion against their Interswitch escrow wallet. On a successful hold (or `PENDING` hold in sandbox), encrypts payload `{ enrolleeId, sessionId, triageResult, hmoAuthStatus: "guaranteed", facilityId, expiresAt, escrowReference }` with AES-256-GCM. SHA-256 hashes the ciphertext for the DB. Stores `token:{hash} = "valid"` in Redis with 60s TTL. Persists `ReferralToken` row with the encrypted payload and hash. If the escrow hold fails, `hmoAuthStatus` is set to `"pending_auth"` and the token is still issued but without the "Payment Guaranteed" badge.

Build `scanToken` server function: decrypts and validates the token payload, checks Redis TTL and `is_used` flag, marks `ReferralToken.isUsed = true` and `scannedAt`, creates a `Claim` row in `PENDING` status with the `escrowReference` from the token payload, returns enrollee name, plan tier, co-pay, payment status, and escrow reference to the UI.

Wire both server functions to minimal route pages: a symptom form at `/patient/triage` that renders the result card (tier badge, facility list, co-pay, disclaimer), and a scan page at `/hospital/scan` that accepts a token string and renders the green/red result.

### Acceptance criteria

- [ ] `runTriage` with "I have fever and body aches" returns `tier: PRIMARY`, valid ICD-10 codes, co-pay estimate, and 3 nearby facilities within 3 seconds
- [ ] `runTriage` with "chest pain" bypasses the LLM entirely and returns `urgency: emergency` synchronously
- [ ] `runTriage` returns a valid result when the Groq SDK is mocked to timeout (rules engine fallback activates)
- [ ] `runTriage` with symptoms outside the patient's plan coverage returns `policyResult.approved: false` with a `denialReason`
- [ ] `generateToken` calls `initiateEscrowHold`, produces an AES-256-GCM ciphertext, and creates a `ReferralToken` row with `isUsed: false` and `hmoAuthStatus: "guaranteed"` when the sandbox hold succeeds
- [ ] `generateToken` still issues a token (with `hmoAuthStatus: "pending_auth"`) if the escrow hold returns a non-fatal error
- [ ] `scanToken` with a valid hash returns `valid: true`, creates a `Claim` row carrying the `escrowReference`, and marks the token as used
- [ ] A second `scanToken` call with the same hash returns `valid: false` with reason `"already_used"`
- [ ] `scanToken` with an expired hash (TTL elapsed in Redis) returns `valid: false` with reason `"expired"`
- [ ] Confidence score < 0.6 includes `lowConfidenceWarning` in the triage result
- [ ] `pnpm typecheck` passes with zero errors

---

## Phase 3: Claims Dashboard, RBAC & Deploy

**Day**: 3

**User stories**: 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39

### What to build

Build the hospital-side claims dashboard with full RBAC enforcement:

**`getActiveClaims` server function** — queries claims for the caller's `facilityId` (derived from `FacilityStaff` lookup via JWT user ID) created in the last 24 hours, ordered by `createdAt DESC`. Includes enrollee name, ICD-10 codes, bill amounts, HMO portion, co-pay, and adjudication status.

**`updateClaimStatus` server function** — updates `Claim.status` to `APPROVED` or `REJECTED` with an optional reason. When status transitions to `APPROVED`, triggers the Interswitch settlement flow:
1. Release the escrow hold (`escrowReference` on the `Claim`) → transfer HMO portion to the hospital's Interswitch wallet. Creates a `Payment` row (`type: HMO_SETTLEMENT`).
2. Generate an Interswitch Paycode tied to the co-pay amount for the patient to pay at the billing desk. Stores the `paycode` string on the `Claim`. Creates a `Payment` row (`type: COPAY`).
3. Write an `EscrowLedger` release entry.

Both Interswitch calls are fire-and-forget at the server function level — final status is confirmed asynchronously via the webhook built in Phase 1. Enforces that only `ACCOUNTANT` role can approve/reject. `RECEPTIONIST` and `MEDICAL_DIRECTOR` get read-only access.

**RBAC middleware** — a `requireRole(...roles)` wrapper that reads the JWT cookie, verifies it, extracts the role, and throws a typed `ForbiddenError` if the role is not in the allowed list. Applied at the server function level, not the route level, so protection travels with the function regardless of where it is called.

**Hospital claims route** (`/hospital/claims`) — renders a table of claims with status colour badges. Calls `getActiveClaims` on mount, then re-calls every 5 seconds via `setInterval`. Cleans up the interval on unmount. Clicking a claim opens a detail panel showing full claim data plus approve/reject controls (hidden for `RECEPTIONIST` and `MEDICAL_DIRECTOR` roles).

**Deploy** — configure all environment variables: `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `JWT_SECRET`, `TOKEN_ENCRYPTION_KEY`, `INTERSWITCH_CLIENT_ID`, `INTERSWITCH_SECRET`, `INTERSWITCH_BASE_URL`, `INTERSWITCH_WEBHOOK_SECRET`. Deploy to Railway (full-stack) or Vercel (frontend) + Railway (DB only). Verify the end-to-end demo flow including the Interswitch sandbox escrow hold and Paycode generation.

**Demo smoke test** — walk the full flow: Funke signs up → triage → QR token displayed → Chidi scans token at `/hospital/scan` → claim appears in Ade's accountant dashboard within 5 seconds → Ade approves the claim.

### Acceptance criteria

- [ ] `getActiveClaims` returns only claims belonging to the caller's facility
- [ ] `getActiveClaims` excludes claims older than 24 hours
- [ ] `updateClaimStatus` to `APPROVED` calls Interswitch to release the escrow hold and creates an `HMO_SETTLEMENT` `Payment` row
- [ ] `updateClaimStatus` to `APPROVED` generates an Interswitch Paycode and stores it on the `Claim` row
- [ ] `updateClaimStatus` to `APPROVED` writes an `EscrowLedger` release entry
- [ ] `updateClaimStatus` called by an `ACCOUNTANT` succeeds and updates the DB row
- [ ] `updateClaimStatus` called by a `PATIENT` or `RECEPTIONIST` throws `ForbiddenError`
- [ ] Claims list on the dashboard refreshes automatically every 5 seconds without a page reload
- [ ] A new claim created by `scanToken` appears on the dashboard within the next polling cycle
- [ ] `MEDICAL_DIRECTOR` can view claims but approve/reject controls are not rendered
- [ ] Full end-to-end demo flow works on the deployed URL
- [ ] `pnpm typecheck && pnpm build` pass with zero errors in the deployed environment
