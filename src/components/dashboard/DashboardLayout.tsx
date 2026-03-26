import { Link, linkOptions, useNavigate } from "@tanstack/react-router";
import { Bot, CalendarCheck, Home, Hospital, LogOut, User } from "lucide-react";
import type { ReactNode } from "react";

export type DashboardTab = "home" | "find-care" | "book-appointment" | "support";

const NAV_ITEMS = linkOptions([
  { to: "/home", id: "home" as DashboardTab, label: "Home", icon: Home },
  { to: "/find-care", id: "find-care" as DashboardTab, label: "Find Care", icon: Hospital },
  {
    to: "/book-appointment",
    id: "book-appointment" as DashboardTab,
    label: "Book Appointment",
    icon: CalendarCheck,
  },
  { to: "/support", id: "support" as DashboardTab, label: "Support", icon: Bot },
]);

const SKY_BG = {
  background:
    "linear-gradient(160deg, #a8c4d8 0%, #bbd4e8 25%, #cfe3f0 50%, #ddeef8 75%, #edf6fc 100%)",
};

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  mobileSubHeader: ReactNode;
  children: ReactNode;
}

export default function DashboardLayout({
  activeTab,
  mobileSubHeader,
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    void navigate({ to: "/login" });
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh", overflow: "hidden" }}>
      {/* VOUCHCARE Brand Bar */}
      <div className="bg-[#080d42] shrink-0 h-12 sm:h-14 flex items-center justify-between px-4 sm:px-6 z-50">
        <div className="w-8" />
        <h1 className="font-display font-extrabold text-white text-xl sm:text-2xl tracking-[0.22em]">
          VOUCHCARE
        </h1>
        {/* Mobile logout — hidden on desktop (sidebar has its own) */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut size={18} />
        </button>
        <div className="hidden lg:block w-8" />
      </div>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-56 xl:w-64 bg-navy shrink-0"
          aria-label="Main navigation"
        >
          {/* Patient info */}
          <div className="px-5 py-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 ring-2 ring-white/20">
              <User size={24} className="text-white" />
            </div>
            <p className="text-white/55 text-[10px] font-bold tracking-widest uppercase mb-0.5">
              Welcome Back
            </p>
            <p className="text-white font-display font-bold text-lg leading-tight">Chisomaga</p>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                    active
                      ? "bg-orange text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={19} strokeWidth={active ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status footer */}
          <div className="px-5 py-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              <span className="text-white/50 text-xs">System Online</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <LogOut size={17} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden" style={SKY_BG}>
          {/* Mobile sub-header */}
          <div className="lg:hidden bg-navy shrink-0">{mobileSubHeader}</div>

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="lg:hidden shrink-0 bg-navy flex items-center justify-around px-1 pt-2 pb-3 z-50"
        aria-label="Bottom navigation"
      >
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={[
                "flex flex-col items-center gap-0.5 min-w-16 px-2 py-1.5 rounded-xl transition-all duration-200",
                active ? "bg-orange" : "",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} className="text-white" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-white text-[9px] sm:text-[10px] font-semibold text-center leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
