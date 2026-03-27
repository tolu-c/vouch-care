import { createFileRoute } from "@tanstack/react-router";
import { Bot, ChevronDown, ChevronUp, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_app/support")({ component: SupportPage });

const SUPPORT_IMAGE =
  "https://images.pexels.com/photos/7709198/pexels-photo-7709198.jpeg?auto=compress&cs=tinysrgb&w=600";

const FAQS = [
  {
    q: "How do I link my HMO to my VouchCare account?",
    a: 'Go to your profile settings and select "Link HMO". Enter your HMO ID and select your provider from the dropdown list.',
  },
  {
    q: "What do I do in a medical emergency?",
    a: "Call 112 or your local emergency services immediately. VouchCare also provides an emergency button on the home screen to locate the nearest emergency facility.",
  },
  {
    q: "How do I cancel or reschedule an appointment?",
    a: 'Navigate to "Upcoming Activity" on your dashboard, tap the appointment, and select "Cancel" or "Reschedule". Changes must be made at least 24 hours in advance.',
  },
  {
    q: "Why is my referral token not working?",
    a: "Referral tokens expire after 48 hours. If yours has expired, visit the Find Care page, book a new appointment, and a fresh token will be generated.",
  },
  {
    q: "How does VouchCare protect my health data?",
    a: "VouchCare uses end-to-end encryption and complies with NDPR (Nigeria Data Protection Regulation) guidelines. Your data is never sold to third parties.",
  },
];

const FAQ_ITEM_STYLE = {
  background: "rgba(255,255,255,0.65)",
  border: "1px solid rgba(255,255,255,0.85)",
} as const;

const GLASS_PANEL_STYLE = { background: "rgba(255,255,255,0.65)" } as const;

function SupportSubHeader() {
  return (
    <div className="flex items-center gap-3 px-5 h-14">
      <Bot size={24} className="text-white" />
      <h2 className="font-display font-bold text-white text-lg tracking-wide">Support</h2>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-200" style={FAQ_ITEM_STYLE}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-navy text-sm">{q}</span>
        {open ? (
          <ChevronUp size={18} className="text-navy shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-navy/50 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function SupportPage() {
  return (
    <DashboardLayout activeTab="support" mobileSubHeader={<SupportSubHeader />}>
      <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-4xl mx-auto w-full pb-6">
        {/* Desktop title */}
        <div className="hidden lg:flex items-center gap-3 mb-6">
          <Bot size={28} className="text-navy" />
          <h2 className="font-display font-bold text-navy text-2xl">Support</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left col: Agent image + contact */}
          <div className="space-y-4">
            {/* Support agent card */}
            <div
              className="rounded-2xl overflow-hidden shadow-sm flex items-center gap-5 p-5"
              style={GLASS_PANEL_STYLE}
            >
              <img
                src={SUPPORT_IMAGE}
                alt="VouchCare support agent smiling with headset — MART PRODUCTION on Pexels"
                width={88}
                height={88}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div>
                <p className="font-display font-bold text-navy text-base mb-1">
                  We're here for you
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our support team is available Mon–Sat, 8am–8pm WAT.
                </p>
              </div>
            </div>

            {/* Contact options */}
            <div className="space-y-3">
              <a
                href="tel:+2347040800658"
                className="flex items-center gap-4 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                style={GLASS_PANEL_STYLE}
              >
                <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">Call Us</p>
                  <p className="text-slate-500 text-xs">+234 704 080 0658</p>
                </div>
              </a>

              <a
                href="mailto:support@vouchcare.com"
                className="flex items-center gap-4 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                style={GLASS_PANEL_STYLE}
              >
                <div className="w-11 h-11 rounded-xl bg-orange flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">Email Support</p>
                  <p className="text-slate-500 text-xs">support@vouchcare.com</p>
                </div>
              </a>

              <button
                type="button"
                className="w-full flex items-center gap-4 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
                style={GLASS_PANEL_STYLE}
              >
                <div className="w-11 h-11 rounded-xl bg-green flex items-center justify-center shrink-0">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">Live Chat</p>
                  <p className="text-slate-500 text-xs">Typical reply in &lt; 5 minutes</p>
                </div>
              </button>
            </div>

            {/* Emergency banner */}
            <div className="rounded-xl bg-red-600 px-5 py-4 flex items-center gap-4">
              <Phone size={22} className="text-white shrink-0" />
              <div>
                <p className="text-white font-display font-bold text-sm">Medical Emergency?</p>
                <p className="text-red-100 text-xs">Call 112 immediately</p>
              </div>
            </div>
          </div>

          {/* Right col: FAQ */}
          <div>
            <h3 className="font-display font-bold text-navy text-base mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
