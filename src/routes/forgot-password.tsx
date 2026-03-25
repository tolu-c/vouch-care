import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import AuthCloudLayout from '#/components/auth/AuthCloudLayout'

const FORGOT_IMAGE =
  'https://images.pexels.com/photos/5327864/pexels-photo-5327864.jpeg?auto=compress&cs=tinysrgb&w=700'

export const Route = createFileRoute('/forgot-password')({ component: ForgotPasswordPage })

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [contact, setContact] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void navigate({ to: '/verify' })
  }

  return (
    <AuthCloudLayout
      imageUrl={FORGOT_IMAGE}
      imageAlt="Female doctor discussing results with patient using a tablet — Thirdman on Pexels"
    >
      <div className="rounded-2xl p-7 sm:p-9 shadow-md" style={{ backgroundColor: '#ddd9ce' }}>
        <h1 className="font-display font-extrabold text-[#3535C8] text-2xl sm:text-3xl tracking-wide mb-2">
          Forgot Password?
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Enter you email or phone number to reset it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Phone  Number or  Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-hidden focus:border-navy transition-colors"
            aria-label="Phone number or email"
            autoComplete="username"
          />

          <button
            type="submit"
            className="w-full bg-[#1B2880] text-white font-display font-bold text-base tracking-[0.12em] py-3.5 rounded-lg hover:bg-navy-dark transition-colors"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don&apos;t have an account yet?{' '}
          <a href="#" className="text-[#3535C8] font-semibold hover:underline">
            Create Account
          </a>
        </p>
      </div>
    </AuthCloudLayout>
  )
}
