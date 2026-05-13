import ProgressBar from '../../../shared/components/ui/ProgressBar'
import Badge from '../../../shared/components/ui/Badge'

export default function MasteryOverview({ paket, jenis, mastery, totalCorrect, totalWrong, sessions }) {
  const label = mastery >= 0.7 ? 'Mastered' : mastery >= 0.4 ? 'Learning' : 'Beginner'
  const barTrack = 'bg-gray-100'

  return (
    <div className={`rounded-2xl p-4 border ${jenis?.bg || 'bg-white'} ${jenis?.accent || 'border-gray-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{paket}</h3>
          {jenis && <Badge variant="soft">{jenis.label}</Badge>}
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          mastery >= 0.7 ? 'bg-emerald-100 text-emerald-700' :
          mastery >= 0.4 ? 'bg-amber-100 text-amber-700' :
          'bg-gray-100 text-gray-500'
        }`}>
          {label}
        </span>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${jenis?.bar || 'bg-gradient-to-r from-indigo-400 to-indigo-600'}`}
          style={{ width: `${mastery * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="text-emerald-500">✓</span> {totalCorrect}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-400">✗</span> {totalWrong}
        </span>
        <span>{sessions} sesi</span>
      </div>
    </div>
  )
}