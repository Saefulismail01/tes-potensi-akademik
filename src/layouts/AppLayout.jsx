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
    <div className="min-h-screen bg-surface text-ink">
      {/* Top Navigation — Notion-style sticky white bar */}
      <nav className="sticky top-0 z-40 bg-canvas border-b border-hairline">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg tracking-tight text-ink-deep">
            PAPS
          </Link>
          <div className="flex items-center gap-1">
            {links.map((l) => {
              const active = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-primary text-white'
                      : 'text-slate hover:bg-surface hover:text-ink'
                  }`}
                >
                  {l.icon} <span className="ml-1.5">{l.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-canvas border-t border-hairline">
        <div className="flex justify-around py-1.5">
          {links.map((l) => {
            const active = location.pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[10px] font-medium transition-all ${
                  active ? 'text-primary' : 'text-steel'
                }`}
              >
                <span className="text-xl leading-none">{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-20 sm:pb-12">
        {children}
      </main>
    </div>
  )
}