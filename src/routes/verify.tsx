import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useRef } from 'react'
import AuthCloudLayout from '#/components/auth/AuthCloudLayout'
import SubmitButton from '#/components/form/SubmitButton'
import { validateOtpDigit } from '#/lib/formValidators'

const VERIFY_IMAGE =
  'https://images.pexels.com/photos/7580260/pexels-photo-7580260.jpeg?auto=compress&cs=tinysrgb&w=700'

export const Route = createFileRoute('/verify')({ component: VerifyPage })

const DIGIT_FIELDS = ['digit0', 'digit1', 'digit2', 'digit3'] as const

function VerifyPage() {
  const navigate = useNavigate()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null])
  const form = useForm({
    defaultValues: {
      digit0: '',
      digit1: '',
      digit2: '',
      digit3: '',
    },
    onSubmit: async ({ value }) => {
      const otp = `${value.digit0}${value.digit1}${value.digit2}${value.digit3}`
      if (!/^\d{4}$/.test(otp)) return
      await new Promise((resolve) => setTimeout(resolve, 700))
      void navigate({ to: '/verify-success' })
    },
  })

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

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-7"
        >
          {/* OTP boxes */}
          <div className="flex gap-3" role="group" aria-label="Verification code">
            {DIGIT_FIELDS.map((name, i) => (
              <form.Field
                key={name}
                name={name}
                validators={{
                  onChange: ({ value }) => validateOtpDigit(value),
                }}
              >
                {(field) => (
                  <input
                    ref={(el) => {
                      inputRefs.current[i] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={field.state.value}
                    onChange={(e) => {
                      const nextVal = e.target.value.replace(/\D/g, '').slice(-1)
                      field.handleChange(nextVal)
                      if (nextVal && i < 3) inputRefs.current[i + 1]?.focus()
                    }}
                    onBlur={field.handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !field.state.value && i > 0) {
                        inputRefs.current[i - 1]?.focus()
                      }
                    }}
                    autoFocus={i === 0}
                    aria-label={`Verification digit ${i + 1}`}
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl bg-slate-200/90 border-2 border-slate-300 focus:border-navy focus:outline-hidden text-slate-800 transition-colors"
                  />
                )}
              </form.Field>
            ))}
          </div>

          <form.Subscribe
            selector={(state) => {
              const { digit0, digit1, digit2, digit3 } = state.values
              const fullOtp = `${digit0}${digit1}${digit2}${digit3}`
              const canVerify = /^\d{4}$/.test(fullOtp)
              return [state.canSubmit && canVerify, state.isSubmitting] as const
            }}
          >
            {([canSubmit, isSubmitting]) => (
              <SubmitButton
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
                idleLabel="VERIFY"
                submittingLabel="VERIFYING..."
                className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.18em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            )}
          </form.Subscribe>

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
