import { Link } from 'react-router-dom'

export default function ModeCard({ to, title, desc, icon }) {
  return (
    <Link to={to}>
      <div className="rounded-xl bg-canvas border border-hairline shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-4 flex items-center gap-4 cursor-pointer">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink">{title}</p>
          <p className="text-sm text-slate mt-0.5">{desc}</p>
        </div>
        <span className="text-steel text-lg">→</span>
      </div>
    </Link>
  )
}