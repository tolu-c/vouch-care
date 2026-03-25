import { Twitter, Facebook, Linkedin } from 'lucide-react'

const QUICKLINKS = [
  'Home',
  'Profile',
  'Find Care',
  'Book Appointment',
  'Emergency',
  'V Assistant',
]

export default function VouchFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-vc-surface border-t border-vc-border" aria-label="Site footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* About Us */}
          <div>
            <h3 className="font-display font-bold text-navy text-xl mb-3">About Us</h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Vouchcare is an AI powered web app that bridges gaps between patients,
              hospitals and HMO's.
            </p>
            <div className="mt-6 h-px w-1/2 bg-orange opacity-70" />
          </div>

          {/* Quicklinks */}
          <div className="sm:text-center lg:text-center">
            <h3 className="font-display font-bold text-navy text-xl mb-5">Quicklinks</h3>
            <nav aria-label="Footer quick links">
              <ul className="space-y-3">
                {QUICKLINKS.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-orange font-semibold text-sm hover:text-orange-dark transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div className="sm:text-right lg:text-right">
            <h3 className="font-display font-bold text-navy text-xl mb-4">Contact us</h3>
            <address className="not-italic space-y-1.5 text-sm font-semibold text-slate-800">
              <p>16 Avenue Lagos</p>
              <p>+2347040800658</p>
            </address>
            <div className="flex items-center gap-4 mt-5 sm:justify-end lg:justify-end">
              <a
                href="#"
                aria-label="Follow us on Twitter"
                className="text-slate-600 hover:text-navy transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Follow us on Facebook"
                className="text-slate-600 hover:text-navy transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Connect on LinkedIn"
                className="text-slate-600 hover:text-navy transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-vc-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            &copy; {year} VouchCare. All rights reserved.
          </p>
          <p className="font-display font-semibold text-xs text-navy/50 tracking-wide">
            Healthcare. Reimagined.
          </p>
        </div>
      </div>
    </footer>
  )
}
