import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getSession, login, logout, refreshSession, sendOtp, signup, verifyOtp } from "@/server/auth";
import { generateReferralToken, triageSymptoms } from "@/server/triage";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">TanStack Start Base Template</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Start simple, ship quickly.
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          This base starter intentionally keeps things light: two routes, clean
          structure, and the essentials you need to build from scratch.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/about"
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            About This Starter
          </a>
          <a
            href="https://tanstack.com/router"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
          >
            Router Guide
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "Type-Safe Routing",
            "Routes and links stay in sync across every page.",
          ],
          [
            "Server Functions",
            "Call server code from your UI without creating API boilerplate.",
          ],
          [
            "Streaming by Default",
            "Ship progressively rendered responses for faster experiences.",
          ],
          [
            "Tailwind Native",
            "Design quickly with utility-first styling and reusable tokens.",
          ],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h2>
            <p className="m-0 text-sm text-sea-ink-soft">{desc}</p>
          </article>
        ))}
      </section>

      <section className="island-shell mt-8 rounded-2xl p-6">
        <p className="island-kicker mb-2">Quick Start</p>
        <ul className="m-0 list-disc space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
          <li>
            Edit <code>src/routes/index.tsx</code> to customize the home page.
          </li>
          <li>
            Update <code>src/components/Header.tsx</code> and{" "}
            <code>src/components/Footer.tsx</code> for brand links.
          </li>
          <li>
            Add routes in <code>src/routes</code> and tweak visual tokens in{" "}
            <code>src/styles.css</code>.
          </li>
        </ul>
      </section>

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
  const [lastSessionId, setLastSessionId] = useState("");

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
        <button
          onClick={() =>
            run(async () => {
              const res = await triageSymptoms({
                data: { symptoms: ["headache", "fever"], latitude: 6.5244, longitude: 3.3792 },
              });
              if (res.success && res.data) {
                setLastSessionId(res.data.sessionId);
              }
              return res;
            })
          }
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          triageSymptoms
        </button>
        <button
          onClick={() => run(() => generateReferralToken({ data: { sessionId: lastSessionId } }))}
          className="rounded bg-[var(--lagoon-deep)] px-3 py-1 text-white"
        >
          generateReferralToken
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
