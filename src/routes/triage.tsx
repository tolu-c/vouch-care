import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
  CheckCircle,
  Hospital,
  Loader2,
  Stethoscope,
} from 'lucide-react'
import DashboardLayout from '#/components/dashboard/DashboardLayout'

export const Route = createFileRoute('/triage')({ component: TriagePage })

const SYMPTOMS =
  'I have Severe headache, since morning, I feel nauseous, I feel like I am losing consciousness'

interface Condition {
  name: string
  likelihood: 'High' | 'Moderate' | 'Low'
}

const CONDITIONS: Condition[] = [
  { name: 'Migraine with Aura', likelihood: 'High' },
  { name: 'Hypertensive Crisis', likelihood: 'Moderate' },
  { name: 'Meningitis', likelihood: 'Moderate' },
  { name: 'Subarachnoid Hemorrhage', likelihood: 'Low' },
]

const RECOMMENDATIONS = [
  'Visit the nearest emergency room immediately',
  'Do not drive or operate heavy machinery',
  'Have someone stay with you at all times',
  'Monitor blood pressure if possible',
  'Avoid bright lights and loud sounds',
]

const LIKELIHOOD_COLORS: Record<Condition['likelihood'], string> = {
  High: 'bg-red-100 text-red-600',
  Moderate: 'bg-orange/10 text-orange',
  Low: 'bg-slate-100 text-slate-500',
}

function TriageSubHeader() {
  return (
    <div className="flex items-center gap-3 px-5 h-14">
      <Stethoscope size={24} className="text-white" />
      <h2 className="font-display font-bold text-white text-lg tracking-wide">
        AI Symptom Analysis
      </h2>
    </div>
  )
}

function TriagePage() {
  const [analyzing, setAnalyzing] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setAnalyzing(false), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <DashboardLayout activeTab="home" mobileSubHeader={<TriageSubHeader />}>
      <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-2xl lg:max-w-3xl mx-auto w-full pb-6">
        {/* Desktop title */}
        <div className="hidden lg:flex items-center gap-3 mb-6">
          <Stethoscope size={28} className="text-navy" />
          <h2 className="font-display font-bold text-navy text-2xl">AI Symptom Analysis</h2>
        </div>

        {/* Back link */}
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 text-navy/60 hover:text-navy text-sm font-medium mb-5 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* User symptom bubble */}
        <div className="flex justify-end mb-6">
          <div
            className="max-w-[85%] rounded-2xl rounded-tr-sm px-5 py-4 shadow-sm"
            style={{ background: 'rgba(27,40,128,0.12)', border: '1px solid rgba(27,40,128,0.15)' }}
          >
            <p className="text-navy text-sm leading-relaxed">{SYMPTOMS}</p>
            <p className="text-navy/50 text-[10px] mt-1.5 text-right">You</p>
          </div>
        </div>

        {/* Analysis result */}
        {analyzing ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-4 shadow-sm"
            style={{ background: 'rgba(255,255,255,0.55)' }}
          >
            <Loader2 size={36} className="text-navy animate-spin" />
            <p className="font-display font-semibold text-navy text-base">
              Analyzing your symptoms…
            </p>
            <p className="text-slate-500 text-sm text-center">
              Our AI is reviewing your inputs against medical databases
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AI response label */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center">
                <Stethoscope size={14} className="text-white" />
              </div>
              <span className="text-navy/60 text-xs font-semibold">VouchCare AI</span>
            </div>

            {/* Severity badge */}
            <div
              className="rounded-2xl p-5 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.65)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="font-display font-bold text-red-600 text-lg">URGENT</p>
                  <p className="text-slate-500 text-xs">Seek immediate medical attention</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Based on your symptoms — severe headache, nausea, and near-loss of consciousness —
                this could indicate a serious neurological or cardiovascular event. Please seek
                emergency care immediately.
              </p>
            </div>

            {/* Possible conditions */}
            <div
              className="rounded-2xl p-5 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.65)' }}
            >
              <h3 className="font-display font-bold text-navy text-base mb-3">
                Possible Conditions
              </h3>
              <div className="space-y-2">
                {CONDITIONS.map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-3">
                    <span className="text-slate-700 text-sm">{c.name}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        LIKELIHOOD_COLORS[c.likelihood]
                      }`}
                    >
                      {c.likelihood}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-[11px] mt-4">
                ⚠ This is not a diagnosis. Consult a licensed physician.
              </p>
            </div>

            {/* Recommendations */}
            <div
              className="rounded-2xl p-5 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.65)' }}
            >
              <h3 className="font-display font-bold text-navy text-base mb-3">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {RECOMMENDATIONS.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-green shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Link
                to="/find-care"
                className="flex items-center justify-center gap-2 bg-red-600 text-white font-display font-bold text-sm py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Hospital size={18} />
                Find Emergency Care
              </Link>
              <Link
                to="/book-appointment"
                className="flex items-center justify-center gap-2 bg-navy text-white font-display font-bold text-sm py-3.5 rounded-xl hover:bg-navy-dark transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <CalendarCheck size={18} />
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
