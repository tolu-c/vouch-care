import { createServerFn } from "@tanstack/react-start";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { decodeJwt, errors as joseErrors, jwtVerify, SignJWT } from "jose";
import { db } from "@/server/lib/db";
import { sendEmail } from "@/server/lib/email";
import { redis } from "@/server/lib/redis";
import { loginSchema, sendOtpSchema, signupSchema, verifyOtpSchema } from "@/server/schemas/auth";
import type { ApiResponse } from "@/server/types/auth";

export type { ApiResponse } from "@/server/types/auth";

function getJwtKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

async function issueSession(user: { id: string; email: string; role: string }) {
  const key = getJwtKey();
  const jwt = await new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(key);

  await db.refreshToken.updateMany({
    where: { userId: user.id, revoked: false },
    data: { revoked: true },
  });

  const rawToken = crypto.randomUUID();
  const tokenHash = await bcrypt.hash(rawToken, 10);
  await db.refreshToken.create({
    data: {
      userId: user.id,
      token: tokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const isProd = process.env.NODE_ENV === "production";
  setCookie("session", jwt, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 900,
    path: "/",
  });
  setCookie("refresh_token", rawToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return { userId: user.id, role: user.role };
}

async function dispatchOtp(email: string): Promise<void> {
  const ttl = await redis.ttl(`otp:${email}`);
  if (ttl > 540) {
    throw new Error("Please wait before requesting a new code");
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const hash = await bcrypt.hash(code, 10);

  await redis.set(`otp:${email}`, JSON.stringify({ hash, attempts: 0 }), { ex: 600 });
  await db.otpSession.create({ data: { email } });
  await sendEmail({
    to: email,
    subject: "Your VouchCare verification code",
    html: `<p>Your VouchCare code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  });
}

export const signup = createServerFn({ method: "POST" })
  .inputValidator(signupSchema)
  .handler(
    async ({
      data,
    }): Promise<ApiResponse<{ userId: string; role: string } | null>> => {
      try {
        const { email, password } = data;

        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
          return { success: false, error: "An account with this email already exists", data: null };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await db.user.create({
          data: { email, passwordHash },
        });

        const session = await issueSession(user);
        return { success: true, data: session };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signup failed";
        return { success: false, error: message, data: null };
      }
    },
  );

export const login = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(
    async ({
      data,
    }): Promise<ApiResponse<{ userId: string; role: string } | null>> => {
      try {
        const { email, password } = data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
          return { success: false, error: "Invalid email or password", data: null };
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          return { success: false, error: "Invalid email or password", data: null };
        }

        const session = await issueSession(user);
        return { success: true, data: session };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        return { success: false, error: message, data: null };
      }
    },
  );

export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator(sendOtpSchema)
  .handler(async ({ data }): Promise<ApiResponse<{ sent: boolean }>> => {
    try {
      const { email } = data;
      await dispatchOtp(email);
      return { success: true, data: { sent: true } };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      return { success: false, error: message, data: { sent: false } };
    }
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator(verifyOtpSchema)
  .handler(
    async ({
      data,
    }): Promise<ApiResponse<{ userId: string; role: string } | null>> => {
      try {
        const { email, otp } = data;

        const raw = await redis.get<string>(`otp:${email}`);
        if (!raw) {
          return { success: false, error: "OTP expired or not found", data: null };
        }

        const stored = JSON.parse(raw) as { hash: string; attempts: number };
        const valid = await bcrypt.compare(otp, stored.hash);

        if (!valid) {
          const newAttempts = stored.attempts + 1;
          if (newAttempts >= 5) {
            await redis.del(`otp:${email}`);
            return {
              success: false,
              error: "Too many failed attempts. Please request a new code.",
              data: null,
            };
          }
          const remainingTtl = await redis.ttl(`otp:${email}`);
          await redis.set(
            `otp:${email}`,
            JSON.stringify({ hash: stored.hash, attempts: newAttempts }),
            { ex: remainingTtl > 0 ? remainingTtl : 1 },
          );
          return { success: false, error: "Invalid OTP", data: null };
        }

        await redis.del(`otp:${email}`);
        await db.otpSession.deleteMany({ where: { email } });

        const user = await db.user.upsert({
          where: { email },
          create: { email },
          update: {},
        });

        const session = await issueSession(user);
        return { success: true, data: session };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Verification failed";
        return { success: false, error: message, data: null };
      }
    },
  );

export const getSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<ApiResponse<{ id: string; email: string; role: string } | null>> => {
    try {
      const token = getCookie("session");
      if (!token) return { success: true, data: null };

      const { payload } = await jwtVerify(token, getJwtKey());
      return {
        success: true,
        data: {
          id: payload.sub as string,
          email: payload["email"] as string,
          role: payload["role"] as string,
        },
      };
    } catch (err) {
      if (err instanceof joseErrors.JWTExpired || err instanceof joseErrors.JWTInvalid) {
        return { success: true, data: null };
      }
      return { success: false, error: "Session check failed", data: null };
    }
  },
);

export const logout = createServerFn({ method: "POST" }).handler(
  async (): Promise<ApiResponse<{ ok: boolean }>> => {
    try {
      const rawToken = getCookie("refresh_token");

      if (rawToken) {
        const sessionToken = getCookie("session");
        if (sessionToken) {
          try {
            const { payload } = await jwtVerify(sessionToken, getJwtKey());
            const userId = payload.sub as string;
            const rows = await db.refreshToken.findMany({
              where: { userId, revoked: false },
            });
            for (const row of rows) {
              const matches = await bcrypt.compare(rawToken, row.token);
              if (matches) {
                await db.refreshToken.update({
                  where: { id: row.id },
                  data: { revoked: true },
                });
                break;
              }
            }
          } catch {
            // session already expired — nothing to revoke
          }
        }
      }

      deleteCookie("session");
      deleteCookie("refresh_token");

      return { success: true, data: { ok: true } };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      return { success: false, error: message, data: { ok: false } };
    }
  },
);

export const refreshSession = createServerFn({ method: "POST" }).handler(
  async (): Promise<ApiResponse<{ userId: string; role: string } | null>> => {
    try {
      const rawToken = getCookie("refresh_token");
      if (!rawToken) {
        return { success: false, error: "No refresh token found", data: null };
      }

      const sessionToken = getCookie("session");
      if (!sessionToken) {
        return { success: false, error: "No session found", data: null };
      }

      let userId: string;
      try {
        const payload = decodeJwt(sessionToken);
        userId = payload.sub as string;
      } catch {
        return { success: false, error: "Invalid session", data: null };
      }

      const rows = await db.refreshToken.findMany({
        where: {
          userId,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      let matchedRow: (typeof rows)[number] | undefined;
      for (const row of rows) {
        const matches = await bcrypt.compare(rawToken, row.token);
        if (matches) {
          matchedRow = row;
          break;
        }
      }

      if (!matchedRow) {
        return {
          success: false,
          error: "Refresh token not found, revoked, or expired",
          data: null,
        };
      }

      await db.refreshToken.update({
        where: { id: matchedRow.id },
        data: { revoked: true },
      });

      const session = await issueSession(matchedRow.user);
      return { success: true, data: session };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Token refresh failed";
      return { success: false, error: message, data: null };
    }
  },
);
