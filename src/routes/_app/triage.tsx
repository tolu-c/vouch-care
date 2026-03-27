import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bot, Mic, SendHorizontal, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/_app/triage")({ component: TriagePage });

const USER_SYMPTOMS =
  "I have Severe headache, since morning, i feel nauseous , I feel like I am loosing consciousness";

function TriageSubHeader() {
  const navigate = useNavigate();
  const handleGoBack = useCallback(() => {
    void navigate({ to: "/home" });
  }, [navigate]);
  return (
    <div className="flex items-center gap-3 px-4 h-14">
      <button
        type="button"
        onClick={handleGoBack}
        aria-label="Go back to home"
        className="text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft size={22} />
      </button>
      <h2 className="font-display font-bold text-white text-lg tracking-wide">
        AI Symptoms Triage
      </h2>
    </div>
  );
}

const TYPING_BUBBLE_STYLE = { background: "rgba(100, 110, 185, 0.58)" } as const;

const AI_BUBBLE_STYLE = { background: "rgba(100, 110, 185, 0.60)" } as const;

const USER_BUBBLE_STYLE = { background: "rgba(165, 165, 180, 0.65)" } as const;

const DIAGNOSIS_CARD_STYLE = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.9)",
} as const;

const FULL_HEIGHT_STYLE = { height: "100%" } as const;

const GREEN_BANNER_STYLE = { background: "#1a5c25" } as const;

const INPUT_BAR_STYLE = {
  borderColor: "rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)",
} as const;

const INPUT_BORDER_STYLE = { border: "2px solid #e2e8f0" } as const;

function AiAvatar() {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center ring-2 ring-white/20">
        <Bot size={20} className="text-white" />
      </div>
      <span className="text-navy/70 text-[10px] font-bold tracking-wide">AI</span>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="w-10 h-10 rounded-full bg-navy/25 border-2 border-navy/30 flex items-center justify-center">
        <User size={20} className="text-navy" />
      </div>
      <span className="text-navy/70 text-[10px] font-bold tracking-wide">You</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <AiAvatar />
      <div
        className="rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-1.5"
        style={TYPING_BUBBLE_STYLE}
      >
        <span
          className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

function TriagePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleProceed = useCallback(() => {
    void navigate({ to: "/find-care" });
  }, [navigate]);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => {
      setTyping(true);
    }, 2500);
    const t4 = setTimeout(() => {
      setTyping(false);
      setStep(3);
    }, 3800);
    const t5 = setTimeout(() => setStep(4), 4600);
    const t6 = setTimeout(() => setStep(5), 5200);
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <DashboardLayout activeTab="home" mobileSubHeader={<TriageSubHeader />}>
      <div className="flex flex-col" style={FULL_HEIGHT_STYLE}>
        {/* VOUCHCARE AI ASSISTANT green banner */}
        <div className="shrink-0 py-2.5 text-center" style={GREEN_BANNER_STYLE}>
          <p className="text-white font-display font-bold text-xs tracking-[0.22em] uppercase">
            VOUCHCARE AI ASSISTANT
          </p>
        </div>

        {/* Scrollable chat area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 max-w-2xl mx-auto w-full">
          {/* AI: greeting */}
          {step >= 1 && (
            <div className="flex items-end gap-3 vc-fade-in">
              <AiAvatar />
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-3 max-w-[76%] shadow-sm"
                style={AI_BUBBLE_STYLE}
              >
                <p className="text-white text-sm leading-relaxed">How are you feeling today ?</p>
              </div>
            </div>
          )}

          {/* User message */}
          {step >= 2 && (
            <div className="flex items-end gap-3 flex-row-reverse vc-fade-in">
              <UserAvatar />
              <div
                className="rounded-2xl rounded-br-sm px-4 py-3 max-w-[76%] shadow-sm"
                style={USER_BUBBLE_STYLE}
              >
                <p className="text-slate-800 text-sm leading-relaxed">{USER_SYMPTOMS}</p>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {typing && (
            <div className="vc-fade-in">
              <TypingIndicator />
            </div>
          )}

          {/* AI: report intro */}
          {step >= 3 && (
            <div className="flex items-end gap-3 vc-fade-in">
              <AiAvatar />
              <div
                className="rounded-2xl rounded-bl-sm px-4 py-3 max-w-[76%] shadow-sm"
                style={AI_BUBBLE_STYLE}
              >
                <p className="text-white text-sm leading-relaxed">
                  Based on your symptoms, this is your report:
                </p>
              </div>
            </div>
          )}

          {/* Diagnosis card */}
          {step >= 4 && (
            <div className="pl-14 vc-fade-in">
              <div
                className="rounded-2xl px-5 py-4 shadow-md space-y-3.5"
                style={DIAGNOSIS_CARD_STYLE}
              >
                <div>
                  <span className="text-navy font-bold text-sm">Diagnosis: </span>
                  <span className="text-slate-800 text-sm font-medium">Stroke</span>
                </div>
                <div>
                  <span className="text-navy font-bold text-sm">Tier: </span>
                  <span className="text-orange font-bold text-sm">Emergency Care</span>
                </div>
                <div>
                  <span className="text-navy font-bold text-sm">Nearest Facility: </span>
                  <span className="text-slate-800 text-sm font-medium">LASUTH</span>
                </div>
                <div>
                  <span className="text-navy font-bold text-sm">Recommendation: </span>
                  <span className="text-slate-700 text-sm leading-relaxed">
                    Seek emergency service within the next 24 hours.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Proceed button */}
          {step >= 5 && (
            <div className="vc-fade-in pt-2">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full bg-navy text-white font-display font-bold text-lg py-4 rounded-2xl hover:bg-navy-dark active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Proceed
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar — appears with Proceed */}
        {step >= 5 && (
          <div className="shrink-0 px-4 sm:px-6 py-3 border-t vc-fade-in" style={INPUT_BAR_STYLE}>
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <div
                className="flex-1 flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-sm"
                style={INPUT_BORDER_STYLE}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
                  aria-label="Type your message"
                />
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0 hover:bg-navy-dark transition-colors"
                  aria-label="Send message"
                >
                  <SendHorizontal size={16} className="text-white" />
                </button>
              </div>
              <button
                type="button"
                className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-navy transition-colors shrink-0"
                aria-label="Voice input"
              >
                <Mic size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
