import { ArrowLeft } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

export default function AuthHeader() {
  const router = useRouter()

  return (
    <header className="bg-navy shrink-0 h-14 flex items-center justify-between px-5">
      <button
        type="button"
        onClick={() => router.history.back()}
        aria-label="Go back"
        className="text-white/70 hover:text-white transition-colors p-1"
      >
        <ArrowLeft size={22} />
      </button>
      <span className="font-display font-extrabold text-white text-xl tracking-tight">
        VouchCare
      </span>
    </header>
  )
}
