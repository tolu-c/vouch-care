import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, Menu, X } from 'lucide-react'


const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'PROFILE', href: '/profile' },
  { label: 'EMERGENCY', href: '/emergency' },
  { label: 'BOOK', href: '/book' },
  { label: 'MY COVERAGE', href: '/coverage' },
]

export default function VouchHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md' : 'border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row */}
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link
            to="/"
            className="font-display font-extrabold text-[1.35rem] text-navy tracking-tight"
          >
            VouchCare
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold tracking-[0.14em] text-slate-600 hover:text-navy transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange rounded-full transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              aria-label="Search"
              className="flex items-center gap-2 border border-navy/30 text-navy rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.12em] hover:bg-navy hover:text-white hover:border-navy transition-all duration-200"
            >
              <Search size={13} strokeWidth={2.5} />
              SEARCH
            </button>
            <Link
              to="/login"
              className="bg-navy text-white rounded-full px-5 py-2 text-[11px] font-bold tracking-[0.12em] hover:bg-navy-dark transition-colors duration-200"
            >
              LOGIN
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/login"
              className="bg-orange text-white rounded-full px-4 py-1.5 text-xs font-bold tracking-wide hover:bg-orange-dark transition-colors duration-200"
            >
              LOGIN
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="p-2 text-navy rounded-lg hover:bg-slate-100 transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="lg:hidden border-t border-slate-100 py-3 space-y-0.5"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold tracking-wide text-slate-700 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 pb-1 border-t border-slate-100 mt-2">
              <button
                type="button"
                className="flex items-center gap-2 border border-navy/30 text-navy rounded-full px-4 py-2 text-xs font-semibold tracking-wide hover:bg-navy hover:text-white transition-all"
              >
                <Search size={13} />
                SEARCH
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
