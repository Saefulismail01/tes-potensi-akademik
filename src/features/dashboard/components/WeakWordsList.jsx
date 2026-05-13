import { Link } from 'react-router-dom'

export default function WeakWordsList({ words }) {
  if (!words.length) return null

  return (
    <div className="animate-fade-in-up animation-delay-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-sm text-gray-600">📖 Perlu Diulang</h2>
      </div>
      <div className="space-y-1.5">
        {words.slice(0, 8).map((w, i) => (
          <Link
            key={w.kata}
            to={`/flashcard?kata=${encodeURIComponent(w.kata)}`}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm transition-all duration-200 group"
          >
            <span className="text-[10px] text-gray-300 font-medium w-4">{i + 1}</span>
            <span className="font-medium text-sm flex-1">{w.kata}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-14 h-1 rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-red-400 transition-all duration-500"
                  style={{ width: `${Math.max((w.mastery || 0) * 100, 8)}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {w.right + w.wrong}x
              </span>
            </div>
            <span className="text-gray-300 group-hover:text-gray-400 text-xs">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}