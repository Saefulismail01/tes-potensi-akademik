const LEVEL_NAMES = ['', 'Pemula', 'Pelajar', 'Mahasiswa', 'Sarjana', 'Magister', 'Doktor']

const categoryTheme = {
  sinonim: { badge: 'bg-tint-mint text-[var(--color-success)]', dot: 'bg-[var(--color-success)]' },
  antonim: { badge: 'bg-[var(--color-tint-rose)] text-error', dot: 'bg-error' },
}

export default function Leaderboard({ highScores, pakets, getMastery }) {
  const entries = pakets.map((p) => {
    const key = p.jenis === 'antonim' ? 'antonim' : 'sinonim'
    const hs = highScores[key]
    const mastery = getMastery ? getMastery(p.id) : 0
    return {
      id: p.id,
      name: p.name,
      jenis: p.jenis,
      desc: p.desc,
      totalSoal: p.data.length,
      score: hs?.score ?? 0,
      level: hs?.level ?? 0,
      streak: hs?.streak ?? 0,
      mastery,
    }
  })
  .sort((a, b) => b.score - a.score || b.mastery - a.mastery)

  const hasData = entries.some((e) => e.score > 0)

  return (
    <div className="animate-fade-in">
      <h2 className="text-sm font-semibold text-slate mb-3">Leaderboard</h2>

      {!hasData && (
        <div className="rounded-xl border border-dashed border-hairline-strong bg-canvas p-6 text-center">
          <p className="text-2xl mb-2">🏆</p>
          <p className="text-sm text-slate">Belum ada skor</p>
          <p className="text-xs text-stone mt-1">Mainkan quiz untuk mengisi leaderboard</p>
        </div>
      )}

      {hasData && (
        <div className="space-y-1.5">
          {entries.map((e, i) => {
            const t = categoryTheme[e.jenis] || categoryTheme.sinonim
            return (
              <div
                key={e.id}
                className="rounded-xl border border-hairline bg-canvas p-3.5 flex items-center gap-3 transition-all duration-150"
              >
                {/* Rank */}
                <span className="w-6 text-center text-sm font-bold text-slate shrink-0">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-ink">{e.name}</h3>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${t.badge}`}>
                      {e.jenis === 'antonim' ? 'Antonim' : 'Sinonim'}
                    </span>
                  </div>
                  <p className="text-xs text-slate mt-0.5">{e.totalSoal} soal</p>
                </div>

                {/* Score stats */}
                {e.score > 0 ? (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-ink-deep">{e.score}</p>
                    <p className="text-[10px] text-slate">
                      Level {e.level} ({LEVEL_NAMES[e.level]}) · 🔥 {e.streak}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-stone shrink-0">—</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
