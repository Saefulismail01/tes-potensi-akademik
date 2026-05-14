import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/flashcard', label: 'Flashcard' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/latihan', label: 'Latihan' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-gray-900 tracking-tight">
          PAPS
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
