export default function Timer({ seconds, running, start, pause, reset, className = '' }) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-sm font-mono font-medium tracking-tight">
        <span className="text-xs text-slate font-normal mr-1">Waktu</span>
        <span className={running ? 'text-error' : 'text-ink'}>{m}:{s}</span>
      </span>
      <div className="flex gap-1.5">
        {!running && seconds === 0 && (
          <button onClick={start} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-primary text-white transition-colors hover:bg-[var(--color-primary-pressed)]">Mulai</button>
        )}
        {running && (
          <button onClick={pause} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-warning text-white transition-colors hover:bg-amber-600">Jeda</button>
        )}
        {!running && seconds > 0 && (
          <button onClick={reset} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface text-slate border border-hairline-strong transition-colors hover:bg-hairline">Reset</button>
        )}
      </div>
    </div>
  )
}