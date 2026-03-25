import AuthHeader from './AuthHeader'

interface AuthCloudLayoutProps {
  imageUrl: string
  imageAlt: string
  children: React.ReactNode
}

export default function AuthCloudLayout({ imageUrl, imageAlt, children }: AuthCloudLayoutProps) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background:
          'linear-gradient(155deg, #a4c0d8 0%, #b8d2e8 20%, #c8dff0 40%, #d8ecf8 60%, #e8f3fc 80%, #f4f9fd 100%)',
      }}
    >
      <AuthHeader />

      <div className="relative flex-1 flex items-center justify-center px-4 py-10 overflow-hidden">
        {/* Moon orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none select-none"
          style={{
            background:
              'radial-gradient(circle at 38% 32%, #f8f8fc, #dce4ef 45%, #c0ccd8 72%, #a8b8cc)',
            boxShadow:
              'inset -8px -8px 20px rgba(0,0,0,0.1), inset 6px 6px 16px rgba(255,255,255,0.55)',
            opacity: 0.75,
            marginTop: '-3rem',
          }}
          aria-hidden="true"
        />

        {/* Page content */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center">
          {/* Left: image card */}
          <div className="w-full md:w-[52%] shrink-0 rounded-3xl overflow-hidden shadow-md bg-white">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full aspect-[4/3] object-cover"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Right: form slot */}
          <div className="w-full md:w-[48%]">{children}</div>
        </div>
      </div>
    </div>
  )
}
