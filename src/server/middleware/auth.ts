import { createMiddleware } from "@tanstack/react-start";
import { getCookie, setResponseStatus } from "@tanstack/react-start/server";
import { errors as joseErrors, jwtVerify } from "jose";

function getJwtKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export type AuthUser = { id: string; email: string; role: string };

export const requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const token = getCookie("session");
  if (!token) {
    setResponseStatus(401);
    throw new Error("Unauthorized");
  }

  try {
    const { payload } = await jwtVerify(token, getJwtKey());
    const user: AuthUser = {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
    };
    return next({ context: { user } });
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      setResponseStatus(401);
      throw new Error("Session expired");
    }
    setResponseStatus(401);
    throw new Error("Unauthorized");
  }
});
