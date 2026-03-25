import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import AuthCloudLayout from '#/components/auth/AuthCloudLayout'

const VERIFY_IMAGE =
  'https://images.pexels.com/photos/7580260/pexels-photo-7580260.jpeg?auto=compress&cs=tinysrgb&w=700'

export const Route = createFileRoute('/verify')({ component: VerifyPage })

function VerifyPage() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState(['', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null])

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...digits]
    next[i] = val.slice(-1)
    setDigits(next)
    if (val && i < 3) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void navigate({ to: '/verify-success' })
  }

  return (
    <AuthCloudLayout
      imageUrl={VERIFY_IMAGE}
      imageAlt="Doctor using pulse oximeter on patient — cottonbro studio on Pexels"
    >
      <div className="rounded-2xl p-7 sm:p-9 shadow-md" style={{ backgroundColor: '#ddd9ce' }}>
        <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl tracking-[0.16em] mb-3">
          VERIFICATION
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Now enter the verification code sent to your email or phone number.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* OTP boxes */}
          <div className="flex gap-3" role="group" aria-label="Verification code">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
                aria-label={`Verification digit ${i + 1}`}
                className="w-14 h-14 text-center text-2xl font-bold rounded-xl bg-slate-200/90 border-2 border-slate-300 focus:border-navy focus:outline-hidden text-slate-800 transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.18em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors"
          >
            VERIFY
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3535C8] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthCloudLayout>
  )
}
