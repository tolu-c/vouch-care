import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Offer {
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  headerBg: string;
  cardBg: string;
}

const offers: Offer[] = [
  {
    title: "What we offer patients",
    image:
      "https://images.pexels.com/photos/5357838/pexels-photo-5357838.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
    imageAlt: "Woman smiling while holding smartphone — Roberto Hund on Pexels",
    description:
      "Vouchcare gives you AI-powered symptom triage that instantly routes you to the correct hospital tier, a pre-authorized digital referral token you can show before leaving home, real-time visibility of exactly what your HMO will cover at the pharmacy, and guaranteed payment so you walk in and get treated without delays, queues, or surprise bills — all on any phone, even on 2G networks.",
    headerBg: "#16a34a",
    cardBg: "#0d2118",
  },
  {
    title: "What we offer hospitals",
    image:
      "https://images.pexels.com/photos/5452188/pexels-photo-5452188.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
    imageAlt: "African-American female doctor using tablet — Tima Miroshnichenko on Pexels",
    description:
      'Vouchcare delivers instant QR token scanning at reception, real-time "Payment Guaranteed" status that eliminates cash deposit demands, automated split payments that hit your wallet in seconds, a live ledger showing every settled claim, and pharmacy stock visibility — giving you reliable cash flow, zero manual reconciliation, and the confidence to accept more HMO patients without hesitation.',
    headerBg: "#1b2880",
    cardBg: "#0a1240",
  },
  {
    title: "What we offer everyone",
    image:
      "https://images.pexels.com/photos/3803517/pexels-photo-3803517.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
    imageAlt: "Digital data analytics on monitor — Brett Sayles on Pexels",
    description:
      "Vouchcare is the complete orchestration platform that brings together AI triage for correct referrals, instant digital tokens with guaranteed payments, real-time pharmacy coverage, automated HMO settlements, and powerful dashboards for hospitals and managers — ending wrong-tier visits, authorization delays, and cash-flow problems for patients, hospitals, and HMOs across Nigeria, even in low-bandwidth areas.",
    headerBg: "#15803d",
    cardBg: "#062312",
  },
];

function OfferCard({ offer, delayClass }: { offer: Offer; delayClass: string }) {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${delayClass} flex flex-col rounded-3xl overflow-hidden shadow-lg hover:-translate-y-1.5 transition-transform duration-300 cursor-default`}
    >
      {/* Coloured header band */}
      <div className="px-6 py-5" style={{ backgroundColor: offer.headerBg }}>
        <h2 className="font-display font-bold text-white text-[1.05rem] leading-snug">
          {offer.title}
        </h2>
      </div>

      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden shrink-0">
        <img
          src={offer.image}
          alt={offer.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Description */}
      <div className="flex-1 px-6 py-7" style={{ backgroundColor: offer.cardBg }}>
        <p className="text-white/80 text-sm leading-relaxed">{offer.description}</p>
      </div>
    </div>
  );
}

const DELAY_CLASSES = ["reveal-delay-1", "reveal-delay-2", "reveal-delay-3"];

export default function OfferSection() {
  const headingRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-16 sm:py-24 px-4 bg-white" aria-label="What we offer">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div ref={headingRef} className="reveal text-center mb-12">
          <span className="text-vc-muted text-xs font-semibold tracking-[0.18em] uppercase">
            Our Services
          </span>
          <h2 className="font-display font-extrabold text-navy text-2xl sm:text-3xl mt-2">
            Connecting Patients, Hospitals &amp; HMOs
          </h2>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {offers.map((offer, i) => (
            <OfferCard key={offer.title} offer={offer} delayClass={DELAY_CLASSES[i] ?? ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
