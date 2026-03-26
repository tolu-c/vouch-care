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

### Database Setup

Run migrations to create the schema:

```bash
pnpm prisma migrate deploy
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

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
    middleware/
      auth.ts         # requireAuth middleware for protected server functions
    schemas/
      auth.ts         # Zod validation schemas
    types/
      auth.ts         # Shared types (ApiResponse)
    lib/
      db.ts           # Prisma client singleton
      redis.ts        # Upstash Redis client
      email.ts        # sendEmail helper (Resend + console fallback)
prisma/
  schema.prisma       # Database schema
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

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/).

## Learn More

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Prisma](https://www.prisma.io/docs)
