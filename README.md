# VouchCare

A full-stack healthcare platform built with TanStack Start.

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database
- Upstash Redis account

## Getting Started

```bash
pnpm install
```

Copy the environment file and fill in the values:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) |
| `RESEND_API_KEY` | Resend API key (optional — logs to console if absent) |
| `EMAIL_FROM` | Sender address for transactional emails e.g. `VouchCare <noreply@vouchcare.ng>` |
| `GEMINI_API_KEY` | Google Gemini API key for AI-powered symptom triage |
| `TOKEN_ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM referral token encryption |
| `INTERSWITCH_CLIENT_ID` | Interswitch payment gateway client ID |
| `INTERSWITCH_SECRET` | Interswitch payment gateway secret |
| `INTERSWITCH_BASE_URL` | Interswitch API base URL |
| `INTERSWITCH_WEBHOOK_SECRET` | Interswitch webhook verification secret |

Generate a `TOKEN_ENCRYPTION_KEY` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Setup

Run migrations to create the schema:

```bash
pnpm prisma migrate deploy
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Seed the database with test data (HMO, plan, facilities, and a test patient):

```bash
pnpm db:seed
```

This creates a test patient account: `patient@test.com` / `password123`

### Dev Server

```bash
pnpm dev
```

The app runs at `http://localhost:3000`.

## Building for Production

```bash
pnpm build
```

## Testing

```bash
pnpm test
```

## Project Structure

```
src/
  routes/             # File-based routes (TanStack Router)
  server/
    auth.ts           # Auth server functions (signup, login, OTP, session)
    triage.ts         # Triage server functions (symptom triage, referral tokens)
    middleware/
      auth.ts         # requireAuth middleware for protected server functions
    schemas/
      auth.ts         # Zod validation schemas for auth
      triage.ts       # Zod validation schemas for triage
    types/
      auth.ts         # Shared types (ApiResponse)
      triage.ts       # Triage types (TriageResult, HmoValidation, etc.)
    lib/
      db.ts           # Prisma client singleton
      redis.ts        # Upstash Redis client
      email.ts        # sendEmail helper (Resend + console fallback)
      gemini.ts       # Gemini AI triage integration
      triage-rules.ts # Rule-based triage fallback engine
prisma/
  schema.prisma       # Database schema
  seed.ts             # Dev seed (HMO, plan, facilities, test patient)
  migrations/         # Applied migrations
```

## Auth Flow

**Email + Password**
1. `signup({ email, password, confirmPassword })` — creates account, issues session
2. `login({ email, password })` — verifies credentials, issues session
3. `getSession()` — returns current user from JWT cookie
4. `refreshSession()` — rotates access + refresh tokens
5. `logout()` — revokes refresh token, clears cookies

**OTP (passwordless / email verification)**
1. `sendOtp({ email })` — sends a 6-digit code (60s cooldown)
2. `verifyOtp({ email, otp })` — verifies code (max 5 attempts), issues session

## Triage Flow

Patients submit symptoms and receive an AI-powered triage result with HMO coverage validation and a nearest facility recommendation.

1. `triageSymptoms({ symptoms, latitude?, longitude? })` — runs symptom triage via Gemini (falls back to rules engine), validates HMO policy coverage, and returns a recommended care tier and nearest in-network facility
2. `generateReferralToken({ sessionId })` — issues an encrypted referral token (AES-256-GCM, 1-hour TTL) for facility check-in

**Triage logic**:
- Emergency keywords (chest pain, stroke, etc.) bypass the LLM and go straight to the rules engine
- Gemini AI classifies symptoms into an ICD-10 code, care tier, and urgency level
- HMO policy is validated against covered tiers and ICD-10 ranges (cached in Redis for 1 hour)

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/).

## Learn More

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Prisma](https://www.prisma.io/docs)
