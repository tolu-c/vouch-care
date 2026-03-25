import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle, Hospital, MapPin, Search, XCircle } from 'lucide-react'
import DashboardLayout from '#/components/dashboard/DashboardLayout'

export const Route = createFileRoute('/find-care')({ component: FindCarePage })

interface HospitalListing {
  id: string
  name: string
  hmoCovered: boolean
  tier: string
  openNow: boolean
  distance: string
}

const HOSPITALS: HospitalListing[] = [
  {
    id: '1',
    name: 'Lagos State University Teaching Hospital',
    hmoCovered: true,
    tier: 'Tier 1 Care - Public',
    openNow: true,
    distance: '2KM away',
  },
  {
    id: '2',
    name: 'Lily Hospital Lagos',
    hmoCovered: false,
    tier: 'Tier 1 Care - Private',
    openNow: true,
    distance: '5KM away',
  },
  {
    id: '3',
    name: 'Reddington Hospital',
    hmoCovered: true,
    tier: 'Tier 2 Care - Private',
    openNow: false,
    distance: '8KM away',
  },
]

function FindCareSubHeader() {
  return (
    <div className="flex items-center gap-3 px-5 h-14">
      <Hospital size={24} className="text-white" />
      <h2 className="font-display font-bold text-white text-lg tracking-wide">Find Care</h2>
    </div>
  )
}

function HospitalCard({ hospital }: { hospital: HospitalListing }) {
  const navigate = useNavigate()
  return (
    <div
      className="rounded-2xl p-5 shadow-sm"
      style={{ background: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.85)' }}
    >
      <h3 className="font-display font-bold text-navy text-base mb-3">{hospital.name}</h3>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {hospital.hmoCovered ? (
            <CheckCircle size={16} className="text-green shrink-0" />
          ) : (
            <XCircle size={16} className="text-orange shrink-0" />
          )}
          <span
            className={`text-sm font-semibold ${hospital.hmoCovered ? 'text-green' : 'text-orange'}`}
          >
            {hospital.hmoCovered ? 'HMO Covered' : 'HMO Uncovered'}
          </span>
        </div>
        <span className="text-slate-500 text-sm">{hospital.tier}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            hospital.openNow
              ? 'text-green bg-green/10'
              : 'text-slate-500 bg-slate-100'
          }`}
        >
          {hospital.openNow ? 'Open Now' : 'Closed'}
        </span>
        <span className="text-slate-500 text-sm">{hospital.distance}</span>
      </div>
      <button
        type="button"
        onClick={() => void navigate({ to: '/book-appointment' })}
        className="w-full bg-navy text-white font-display font-bold text-sm tracking-wide py-3 rounded-xl hover:bg-navy-dark transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
      >
        Book Service
      </button>
    </div>
  )
}

function FindCarePage() {
  const [query, setQuery] = useState('')

  const filtered = query
    ? HOSPITALS.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
    : HOSPITALS

  return (
    <DashboardLayout activeTab="find-care" mobileSubHeader={<FindCareSubHeader />}>
      <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-4xl mx-auto w-full">

        {/* Desktop page title */}
        <div className="hidden lg:flex items-center gap-3 mb-6">
          <Hospital size={28} className="text-navy" />
          <h2 className="font-display font-bold text-navy text-2xl">Find Care</h2>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search hospitals, clinics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white rounded-full pl-11 pr-5 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none focus:ring-2 focus:ring-navy/20 transition-all"
            aria-label="Search care providers"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Map + location */}
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: '220px' }}>
              <iframe
                src="https://maps.google.com/maps?q=Lagos+State+University+Teaching+Hospital,+Lagos&hl=en&z=14&output=embed"
                style={{ border: 0, width: '100%', height: '100%' }}
                title="Map showing LASUTH location in Lagos, Nigeria"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Current location card */}
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.75)' }}
            >
              <MapPin size={18} className="text-navy shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">
                <span className="text-navy font-semibold">Current Location: </span>
                #3A Ukwa Street, Pipeline Road. Idumota Lagos
              </p>
            </div>
          </div>

          {/* Right: Recommended hospitals */}
          <div>
            <div
              className="rounded-2xl px-5 py-4 mb-4 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.60)' }}
            >
              <h3 className="font-display font-bold text-navy text-lg text-center">
                Recommended for You
              </h3>
            </div>

            <div className="space-y-4">
              {filtered.length > 0 ? (
                filtered.map((h) => <HospitalCard key={h.id} hospital={h} />)
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No providers found for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
