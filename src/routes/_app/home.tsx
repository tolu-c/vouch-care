import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, CalendarDays, FastForward, ListFilter, Mic, UserCircle } from "lucide-react";
import { useCallback, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_app/home")({ component: HomePage });

const QR_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VOUCHCARE-REF-TOKEN-2025-CHI001&color=000000&bgcolor=ffffff";

const SAMPLE_SYMPTOMS =
  "I have Severe headache, since morning, i feel nauseous , I feel like I am loosing consciousness";

const GLASS_CARD_STYLE = {
  background: "rgba(255,255,255,0.42)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow: "0 8px 32px rgba(27,40,128,0.10)",
} as const;

const PEACH_BG_STYLE = { background: "#fdd5c3" } as const;

function HomeSubHeader() {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 h-14">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/25 shrink-0">
        <UserCircle size={22} className="text-white" />
      </div>
      <div className="text-center">
        <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase">
          Welcome Back
        </p>
        <p className="text-white font-display font-bold text-sm tracking-wide">CHISOMAGA</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Search and filter"
          className="text-white/75 hover:text-white transition-colors"
        >
          <ListFilter size={20} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="text-white/75 hover:text-white transition-colors relative"
        >
          <Bell size={20} />
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange rounded-full border-2 border-navy"
            role="status"
            aria-label="1 new notification"
          />
        </button>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState(SAMPLE_SYMPTOMS);

  const handleAnalyze = useCallback(() => {
    void navigate({ to: "/triage" });
  }, [navigate]);

  return (
    <DashboardLayout activeTab="home" mobileSubHeader={<HomeSubHeader />}>
      {/* Desktop welcome bar (only on lg+) */}
      <div className="hidden lg:flex items-center justify-between px-8 pt-8 pb-2">
        <div>
          <p className="text-navy/60 text-xs font-bold tracking-widest uppercase">Today</p>
          <h2 className="font-display font-bold text-navy text-2xl">Good morning, Chisomaga 👋</h2>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Bell size={18} className="text-navy" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange rounded-full" />
        </button>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-6 max-w-2xl lg:max-w-4xl mx-auto w-full pb-6">
        {/* Symptom checker card */}
        <div className="rounded-2xl p-5 sm:p-6" style={GLASS_CARD_STYLE}>
          <h2 className="font-display font-bold text-navy text-xl sm:text-2xl text-center leading-snug mb-5">
            How are you feeling today?
          </h2>
          <div className="relative mb-4">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
              placeholder="Describe how you are feeling…"
              className="w-full rounded-xl bg-white/75 border border-white/60 px-4 py-3 pr-12 text-slate-700 text-sm leading-relaxed resize-none outline-none focus:ring-2 focus:ring-navy/20 transition-all placeholder:text-slate-400"
              aria-label="Describe your symptoms"
            />
            <button
              type="button"
              aria-label="Voice input"
              className="absolute bottom-3 right-3 text-slate-400 hover:text-navy transition-colors"
            >
              <Mic size={20} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            className="w-full bg-navy text-white font-display font-bold text-base tracking-wide py-3.5 rounded-xl hover:bg-navy-dark active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Analyze Symptoms
          </button>
        </div>

        {/* Desktop: 2-col grid for activity cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div>
            <h3 className="font-display font-semibold text-navy text-base mb-3">Recent Activity</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm" style={PEACH_BG_STYLE}>
              <div className="flex items-start gap-4 p-4">
                <img
                  src={QR_URL}
                  alt="Referral QR code — VouchCare"
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-xl object-cover shrink-0 bg-white p-1"
                />
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-slate-800 text-sm leading-snug mb-4">
                    Your Referral Token is ready. Scan it at the desk
                  </p>
                  <button
                    type="button"
                    className="border-2 border-orange text-orange font-display font-bold text-sm px-6 py-2 rounded-full hover:bg-orange hover:text-white transition-all duration-200"
                  >
                    Check in
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Activity */}
          <div>
            <h3 className="font-display font-semibold text-navy text-base mb-3">
              Upcoming Activity
            </h3>
            <button
              type="button"
              className="w-full flex items-center gap-4 px-5 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left"
              style={PEACH_BG_STYLE}
              aria-label="View General Check up appointment"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <CalendarDays size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-slate-900 text-sm">General Check up</p>
                <p className="text-slate-600 text-xs mt-0.5">ST John's Hospital: 10:30am</p>
              </div>
              <FastForward size={22} className="text-navy shrink-0" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
