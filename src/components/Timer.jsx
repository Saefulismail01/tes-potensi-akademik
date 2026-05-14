export default function Timer({ remaining, running, className = '' }) {
  const m = String(Math.floor(Math.max(remaining, 0) / 60)).padStart(2, '0')
  const s = String(Math.max(remaining, 0) % 60).padStart(2, '0')
  const urgent = remaining > 0 && remaining <= 5

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-medium tracking-tight ${className}`}>
      <span className={`text-lg ${urgent ? 'text-red-500 animate-pulse' : running ? 'text-ink' : 'text-slate'}`}>
        {m}:{s}
      </span>
    </span>
  )
}
