import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import AuthHeader from '#/components/auth/AuthHeader'

export const Route = createFileRoute('/link-hmo')({ component: LinkHmoPage })

const CLOUD_BG = {
  background:
    'linear-gradient(155deg, #a4c0d8 0%, #b8d2e8 20%, #c8dff0 40%, #d8ecf8 60%, #e8f3fc 80%, #f4f9fd 100%)',
}

const HMO_OPTIONS = [
  'Hygeia HMO',
  'Reliance HMO',
  'Leadway Health',
  'Avon HMO',
  'AXA Mansard',
  'Total Energies',
  'Clearline HMO',
]

function LinkHmoPage() {
  const navigate = useNavigate()
  const [hmoId, setHmoId] = useState('')
  const [selectedHmo, setSelectedHmo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void navigate({ to: '/verify' })
  }

  return (
    <div className="flex flex-col min-h-screen" style={CLOUD_BG}>
      <AuthHeader />

      <div className="relative flex-1 flex items-center justify-center px-4 py-8 overflow-hidden">
        {/* Large moon — center-left */}
        <div
          className="absolute rounded-full pointer-events-none select-none"
          style={{
            width: '420px',
            height: '420px',
            background:
              'radial-gradient(circle at 38% 32%, #f8f8fc, #dce4ef 45%, #c0ccd8 72%, #a8b8cc)',
            boxShadow:
              'inset -10px -10px 24px rgba(0,0,0,0.1), inset 8px 8px 20px rgba(255,255,255,0.5)',
            opacity: 0.75,
            top: '50%',
            left: '32%',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />

        {/* Page content */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row gap-10 items-center justify-center">
          {/* Left: Illustration */}
          <div className="w-full md:w-[46%] flex items-center justify-center">
            <img
              src="/digital-payment.svg"
              alt="Digital payment celebration illustration"
              className="w-64 h-64 sm:w-72 sm:h-72 object-contain drop-shadow-lg"
              aria-hidden="true"
            />
          </div>

          {/* Right: Form card */}
          <div
            className="w-full md:w-[54%] max-w-sm rounded-2xl p-8 shadow-md"
            style={{ backgroundColor: '#ddd9ce' }}
          >
            <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl tracking-wide mb-2">
              SUCCESSFUL!
            </h1>
            <p className="text-slate-500 text-sm mb-7">Now link your account to your HMO</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="HMO ID"
                value={hmoId}
                onChange={(e) => setHmoId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-hidden focus:border-navy transition-colors"
                aria-label="HMO ID"
              />

              {/* SELECT HMO */}
              <div className="relative">
                <ChevronDown
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <select
                  value={selectedHmo}
                  onChange={(e) => setSelectedHmo(e.target.value)}
                  aria-label="Select HMO"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-3 text-sm text-slate-600 outline-hidden focus:border-navy transition-colors appearance-none"
                >
                  <option value="">SELECT HMO</option>
                  {HMO_OPTIONS.map((hmo) => (
                    <option key={hmo} value={hmo}>
                      {hmo}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.16em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors"
              >
                LINK UP
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-[#3535C8] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
