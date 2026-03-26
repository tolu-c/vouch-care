import { useScrollReveal } from "#/hooks/useScrollReveal";

const HERO_IMAGE =
  "https://images.pexels.com/photos/1770818/pexels-photo-1770818.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop";

export default function HeroSection() {
  const cardRef = useScrollReveal();

  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center px-4 py-16 overflow-hidden"
      aria-label="Hero — Get the Right Care Instantly"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        role="presentation"
        aria-hidden="true"
      />

      {/* Layered dark overlay for depth */}
      <div
        className="absolute inset-0 bg-linear-to-br from-navy-dark/85 via-navy/80 to-navy/70"
        aria-hidden="true"
      />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,rgba(27,40,128,0.35),transparent)]"
        aria-hidden="true"
      />

      {/* Hero card */}
      <div
        ref={cardRef}
        className="reveal relative z-10 w-full max-w-2xl mx-auto text-center px-8 py-14 sm:py-18 rounded-3xl border border-white/10 shadow-2xl"
        style={{
          background: "rgba(14, 21, 87, 0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Eyebrow tag */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
          <span className="text-green text-xs font-semibold tracking-[0.18em] uppercase">
            AI-Powered Healthcare
          </span>
        </div>

        <h1 className="font-display font-extrabold text-white text-[2.1rem] sm:text-[3rem] leading-[1.08] tracking-tight mb-6">
          Get the Right Care <span className="text-orange">Instantly</span>
        </h1>

        <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          AI-powered triage sends you to the correct hospital tier with a guaranteed payment token.
        </p>

        <button type="button" className="btn-orange text-base sm:text-lg px-10 py-4">
          Get Started
        </button>
      </div>
    </section>
  );
}
