import { useScrollReveal } from "#/hooks/useScrollReveal";

const MISSION_IMAGE =
  "https://images.pexels.com/photos/7163432/pexels-photo-7163432.jpeg?auto=compress&cs=tinysrgb&w=800&h=960&fit=crop";

export default function MissionSection() {
  const imageRef = useScrollReveal();
  const textRef = useScrollReveal();

  return (
    <section
      className="relative bg-navy py-20 sm:py-28 px-4 overflow-hidden"
      aria-label="Mission — Healthcare Accessible to Everyone"
    >
      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.8) 1.5px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      />

      {/* Soft glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-orange/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center relative z-10">
        {/* Left: Image with badge */}
        <div ref={imageRef} className="reveal order-2 lg:order-1">
          <div className="relative max-w-md mx-auto lg:max-w-none rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={MISSION_IMAGE}
              alt="Young African man smiling and using smartphone — Antoni Shkraba Studio on Pexels"
              className="w-full aspect-[4/5] object-cover object-top"
              loading="lazy"
              decoding="async"
            />

            {/* Payment Guaranteed badge */}
            <div className="absolute top-6 right-6 bg-green rounded-2xl px-5 py-4 shadow-xl">
              <p className="font-display font-extrabold text-white text-xl leading-tight">
                Payment
                <br />
                Guaranteed
              </p>
            </div>

            {/* Bottom shimmer */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy/60 to-transparent" />
          </div>
        </div>

        {/* Right: Headline + CTA */}
        <div
          ref={textRef}
          className="reveal reveal-delay-2 order-1 lg:order-2 text-center lg:text-left"
        >
          <span className="inline-block text-green text-xs font-semibold tracking-[0.18em] uppercase mb-5">
            Our Mission
          </span>
          <h2 className="font-display font-extrabold text-white text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] leading-[1.08] tracking-tight mb-8">
            We are here to make <span className="text-orange">Healthcare</span> Accessible to
            Everyone
          </h2>
          <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
            Bringing AI-powered triage, guaranteed payments, and real-time visibility together — so
            no patient is turned away and no provider loses revenue.
          </p>
          <button
            type="button"
            className="btn-orange text-base sm:text-lg w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            Join Us Today
          </button>
        </div>
      </div>
    </section>
  );
}
