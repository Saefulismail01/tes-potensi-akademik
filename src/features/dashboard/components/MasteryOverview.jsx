const jenisTheme = {
  sinonim: { card: 'bg-tint-mint border-tint-mint', dot: 'bg-[var(--color-success)]' },
  antonim: { card: 'bg-[var(--color-tint-rose)] border-[var(--color-tint-rose)]', dot: 'bg-error' },
}

export default function MasteryOverview({ paket, jenis, mastery, totalCorrect, totalWrong, sessions }) {
  const t = jenisTheme[jenis?.label?.toLowerCase()] || jenisTheme.sinonim
  const label = mastery >= 0.7 ? 'Mastered' : mastery >= 0.4 ? 'Learning' : 'New'

  return (
    <div className={`rounded-xl border p-4 ${t.card}`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${t.dot}`} />
          <h3 className="font-semibold text-sm text-ink">{paket}</h3>
        </div>
        <span className="text-xs font-medium text-slate">{label}</span>
      </div>
      <div className="h-2 bg-hairline rounded-full mb-2.5 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${mastery * 100}%` }} />
      </div>
      <div className="flex justify-between text-xs text-slate">
        <span className="text-[var(--color-success)]">✓ {totalCorrect}</span>
        <span className="text-error">✗ {totalWrong}</span>
        <span>{sessions} sesi</span>
      </div>
    </div>
  )
}