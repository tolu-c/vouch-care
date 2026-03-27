import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import AuthHeader from "@/components/auth/AuthHeader";

export const Route = createFileRoute("/_auth/portal-select")({ component: PortalSelectPage });

const CLOUD_BG = {
  background:
    "linear-gradient(155deg, #a4c0d8 0%, #b8d2e8 20%, #c8dff0 40%, #d8ecf8 60%, #e8f3fc 80%, #f4f9fd 100%)",
};

const MOON_STYLE: CSSProperties = {
  width: "260px",
  height: "260px",
  background: "radial-gradient(circle at 38% 32%, #f8f8fc, #dce4ef 45%, #c0ccd8 72%, #a8b8cc)",
  boxShadow: "inset -8px -8px 20px rgba(0,0,0,0.1), inset 6px 6px 16px rgba(255,255,255,0.55)",
  opacity: 0.72,
};

const PATIENT_IMAGE =
  "https://images.pexels.com/photos/6129107/pexels-photo-6129107.jpeg?auto=compress&cs=tinysrgb&w=600";
const HOSPITAL_IMAGE =
  "https://images.pexels.com/photos/6010784/pexels-photo-6010784.jpeg?auto=compress&cs=tinysrgb&w=600";
const HMO_IMAGE =
  "https://images.pexels.com/photos/1770818/pexels-photo-1770818.jpeg?auto=compress&cs=tinysrgb&w=600";

interface Portal {
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  to: "/signup";
}

const PORTALS: Portal[] = [
  {
    title: "Patient Portal",
    image: PATIENT_IMAGE,
    imageAlt: "Hospital corridor with patients — RDNE Stock project on Pexels",
    description: "Sign up to start accessing your healthcare needs in the most efficient way.",
    to: "/signup",
  },
  {
    title: "Hospital Portal",
    image: HOSPITAL_IMAGE,
    imageAlt: "Doctor consulting patient in hospital room — Tima Miroshnichenko on Pexels",
    description:
      "Sign up to start accelerate your hospital's service and enhance patient care, creating an efficient and speedy system.",
    to: "/signup",
  },
  {
    title: "HMO Portal",
    image: HMO_IMAGE,
    imageAlt: "Modern hospital building — Tom Fisk on Pexels",
    description:
      "Sign up with us to connect your database to enhance your service delivery and to increase your productivity.",
    to: "/signup",
  },
];

function PortalSelectPage() {
  return (
    <div className="flex flex-col min-h-screen" style={CLOUD_BG}>
      <AuthHeader />

      <div className="relative flex-1 flex flex-col items-center px-4 py-8 overflow-hidden">
        {/* Moon */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full pointer-events-none select-none"
          style={{ ...MOON_STYLE, marginTop: "-40px" }}
          aria-hidden="true"
        />

        {/* Heading */}
        <div className="relative z-10 text-center mb-8 mt-4">
          <h1 className="font-display font-extrabold text-[#3535C8] text-3xl sm:text-4xl tracking-wide">
            WELCOME!
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Choose your category let&apos;s set you up in seconds.
          </p>
        </div>

        {/* 3 portal cards */}
        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PORTALS.map((portal) => (
            <PortalCard key={portal.title} portal={portal} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PortalCard({ portal }: { portal: Portal }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Card */}
      <div className="overflow-hidden rounded-md shadow-md">
        <div className="bg-navy px-5 py-4">
          <h2 className="font-display font-bold text-white text-lg">{portal.title}</h2>
        </div>
        <img
          src={portal.image}
          alt={portal.imageAlt}
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="bg-navy-card px-5 py-5">
          <p className="text-white/85 text-sm text-center leading-relaxed">{portal.description}</p>
        </div>
      </div>

      {/* Get Started button */}
      <Link
        to={portal.to}
        className="block w-full text-center bg-orange text-white font-display font-bold text-sm tracking-wide py-3 rounded-lg hover:bg-orange-dark transition-colors"
      >
        Get Started
      </Link>

      {/* Orange divider */}
      <div className="h-px bg-orange opacity-70" />
    </div>
  );
}
