export default function Timer({ seconds, running, start, pause, reset, className = '' }) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <div className={`flex items-center gap-2.5 font-mono text-sm ${className}`}>
      <span className="tabular-nums font-bold tracking-wider">
        <span className="text-gray-400 text-[10px] uppercase tracking-wider mr-1">Waktu</span>
        <span className={running && seconds > 0 ? 'text-red-500' : 'text-gray-600'}>
          {m}:{s}
        </span>
      </span>
      <div className="flex gap-1.5">
        {!running && seconds === 0 && (
          <button onClick={start} className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition">Mulai</button>
        )}
        {running && (
          <button onClick={pause} className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition">Jeda</button>
        )}
        {!running && seconds > 0 && (
          <button onClick={reset} className="px-3 py-1 rounded-lg bg-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-300 transition">Reset</button>
        )}
      </div>
    </div>
  )
}