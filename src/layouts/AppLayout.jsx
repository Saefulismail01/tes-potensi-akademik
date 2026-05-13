import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Beranda', icon: '🏠' },
  { to: '/flashcard', label: 'Flashcard', icon: '📇' },
  { to: '/quiz', label: 'Quiz', icon: '⏱️' },
  { to: '/latihan', label: 'Latihan', icon: '✍️' },
]

export default function AppLayout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar — glassmorphism */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg tracking-tight text-indigo-600">
            ✦ PAPS
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  {l.icon} {l.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden">
        <div className="bg-white/70 backdrop-blur-xl border-t border-gray-100/50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex justify-around py-2">
            {links.map((l) => {
              const active = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all ${
                    active
                      ? 'text-indigo-600'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="text-xl leading-none">{l.icon}</span>
                  <span className="tracking-tight">{l.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 sm:pb-8">
        {children}
      </main>
    </div>
  )
}