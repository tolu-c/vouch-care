import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '#/components/HeroSection'
import OfferSection from '#/components/OfferSection'
import MissionSection from '#/components/MissionSection'
import { getSession, login, logout, refreshSession, sendOtp, signup, verifyOtp } from "@/server/auth";
import { useState } from "react";

export const Route = createFileRoute('/')({ component: HomePage })
function HomePage() {
  return (
    <main>
      <HeroSection />
      <OfferSection />
      <MissionSection />
      <AuthDemo />
    </main>
  );
}

// ─── Temporary auth server-function demo (dev only) ──────────────────────────

function AuthDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState<unknown>(null);

  async function run(fn: () => Promise<unknown>) {
    try {
      setResult(await fn());
    } catch (e) {
      setResult({ error: String(e) });
    }
  }

  return (
    <section className="island-shell mt-8 rounded-2xl p-6 font-mono text-sm">
      <p className="island-kicker mb-4">Auth server-fn demo (dev only)</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-[rgba(23,58,64,0.2)] px-3 py-1.5 text-sm"
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-[rgba(23,58,64,0.2)] px-3 py-1.5 text-sm"
        />
        <input
          placeholder="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="rounded border border-[rgba(23,58,64,0.2)] px-3 py-1.5 text-sm w-24"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => run(() => signup({ data: { email, password, confirmPassword: password } }))}
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          signup
        </button>
        <button
          onClick={() => run(() => login({ data: { email, password } }))}
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          login
        </button>
        <button
          onClick={() => run(() => sendOtp({ data: { email } }))}
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          sendOtp
        </button>
        <button
          onClick={() => run(() => verifyOtp({ data: { email, otp } }))}
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          verifyOtp
        </button>
        <button
          onClick={() => run(() => getSession())}
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          getSession
        </button>
        <button
          onClick={() => run(() => refreshSession())}
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          refreshSession
        </button>
        <button
          onClick={() => run(() => logout())}
          className="rounded bg-red-500 px-3 py-1 text-white"
        >
          logout
        </button>
      </div>

      {result !== null && (
        <pre className="mt-4 overflow-x-auto rounded bg-black/5 p-3 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
