import { Link } from 'react-router-dom'

export default function WeakWordsList({ words }) {
  if (!words.length) return null

  return (
    <div className="animate-fade-in">
      <h2 className="text-sm font-semibold text-slate mb-3">📖 Perlu Diulang</h2>
      <div className="space-y-1">
        {words.slice(0, 8).map((w, i) => (
          <Link
            key={w.kata}
            to={`/flashcard?kata=${encodeURIComponent(w.kata)}`}
            className="flex items-center gap-3 rounded-xl border border-hairline bg-canvas px-4 py-3 hover:shadow-card-hover transition-all duration-150 group"
          >
            <span className="text-[10px] text-stone font-medium w-4">{i + 1}</span>
            <span className="font-medium text-sm text-ink flex-1">{w.kata}</span>
            <div className="flex items-center gap-2">
              <div className="w-14 h-1 bg-hairline rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max((w.mastery || 0) * 100, 8)}%`, backgroundColor: 'var(--color-error)' }} />
              </div>
              <span className="text-xs text-steel font-mono">{w.right + w.wrong}x</span>
            </div>
            <span className="text-hairline-strong group-hover:text-slate text-xs transition-colors">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}