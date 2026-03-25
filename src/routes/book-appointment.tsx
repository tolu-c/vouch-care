import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CalendarCheck, ChevronDown } from 'lucide-react'
import DashboardLayout from '#/components/dashboard/DashboardLayout'

export const Route = createFileRoute('/book-appointment')({ component: BookAppointmentPage })

const DOCTOR_IMAGE =
  'https://images.pexels.com/photos/7578798/pexels-photo-7578798.jpeg?auto=compress&cs=tinysrgb&w=800'

const SERVICES = [
  'General Consultation',
  'Emergency Care',
  'Specialist Referral',
  'Diagnostic Imaging',
  'Lab Tests',
  'Physical Therapy',
  'Mental Health',
]

const FACILITIES = [
  'Lagos State University Teaching Hospital',
  'Lily Hospital Lagos',
  'Reddington Hospital',
  'St. Nicholas Hospital',
  'Island General Hospital',
]

function BookSubHeader() {
  return (
    <div className="flex items-center gap-3 px-5 h-14">
      <CalendarCheck size={24} className="text-white" />
      <h2 className="font-display font-bold text-white text-lg tracking-wide">Book Service</h2>
    </div>
  )
}

function BookAppointmentPage() {
  const [service, setService] = useState('')
  const [facility, setFacility] = useState('')
  const [booked, setBooked] = useState(false)

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault()
    setBooked(true)
  }

  return (
    <DashboardLayout activeTab="book-appointment" mobileSubHeader={<BookSubHeader />}>
      <div className="max-w-4xl mx-auto w-full">
        {/* Desktop page title */}
        <div className="hidden lg:flex items-center gap-3 px-8 pt-8 pb-4">
          <CalendarCheck size={28} className="text-navy" />
          <h2 className="font-display font-bold text-navy text-2xl">Book Service</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-0">
          {/* Hero image + banner */}
          <div className="lg:w-1/2 shrink-0 flex flex-col">
            <div className="overflow-hidden" style={{ height: '320px' }}>
              <img
                src={DOCTOR_IMAGE}
                alt="Doctor in white coat consulting patient at table with medical documents — cottonbro studio on Pexels"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
                loading="lazy"
              />
            </div>
            <div className="bg-navy px-6 py-6 lg:py-8">
              <p className="text-white font-display font-bold text-base sm:text-lg leading-snug text-center lg:text-left">
                VouchCare offers direct service and appointment bookings, with instant cost
                disclosure and payment
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-1/2 flex items-center px-4 sm:px-6 lg:px-8 py-6 lg:py-0">
            {booked ? (
              <div
                className="rounded-2xl p-8 text-center shadow-sm w-full"
                style={{ background: 'rgba(255,255,255,0.60)' }}
              >
                <div className="w-16 h-16 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-4">
                  <CalendarCheck size={32} className="text-green" />
                </div>
                <h3 className="font-display font-bold text-navy text-xl mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-slate-500 text-sm mb-1">
                  <strong>{service || 'General Consultation'}</strong>
                </p>
                <p className="text-slate-500 text-sm">
                  at{' '}
                  <strong>{facility || 'Lagos State University Teaching Hospital'}</strong>
                </p>
                <p className="text-slate-400 text-xs mt-3">
                  You'll receive a confirmation shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setBooked(false)}
                  className="mt-6 px-8 py-2.5 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-dark transition-colors"
                >
                  Book Another
                </button>
              </div>
            ) : (
              <div
                className="rounded-2xl p-5 sm:p-6 shadow-sm w-full"
                style={{ background: 'rgba(210,210,218,0.55)' }}
              >
                <form onSubmit={handleCheckIn} className="space-y-4">
                  {/* Select Service */}
                  <div className="relative">
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      aria-label="Select service"
                      className="w-full bg-white rounded-full px-5 py-3.5 text-sm text-navy font-semibold outline-none appearance-none focus:ring-2 focus:ring-navy/20 transition-all cursor-pointer"
                    >
                      <option value="">Select Service</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-navy pointer-events-none"
                    />
                  </div>

                  {/* Select Facility */}
                  <div className="relative">
                    <select
                      value={facility}
                      onChange={(e) => setFacility(e.target.value)}
                      aria-label="Select facility"
                      className="w-full bg-white rounded-full px-5 py-3.5 text-sm text-navy font-semibold outline-none appearance-none focus:ring-2 focus:ring-navy/20 transition-all cursor-pointer"
                    >
                      <option value="">Select Facility</option>
                      {FACILITIES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-navy pointer-events-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-navy text-white font-display font-bold text-base tracking-wide py-3.5 rounded-xl hover:bg-navy-dark transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  >
                    Check In
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

