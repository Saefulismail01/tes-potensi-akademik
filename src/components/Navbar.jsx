import { Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/flashcard', label: 'Flashcard' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/latihan', label: 'Latihan' },
]

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-blue-600">
          PAPS
        </Link>
        <div className="flex gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
