import { Link } from 'react-router-dom'
import Card from '../../../shared/components/ui/Card'

export default function ModeCard({ to, title, desc, icon }) {
  return (
    <Link to={to}>
      <Card variant="interactive" className="flex items-center gap-4 p-5">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base">{title}</p>
          <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
        </div>
        <span className="text-gray-300 text-xl">→</span>
      </Card>
    </Link>
  )
}