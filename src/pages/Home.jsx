import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getWeakWords, clearStats } from '../data/stats'
import data from '../data/paket1.json'

const modes = [
  { to: '/flashcard', title: 'Flashcard', desc: 'Baca dan hafal sinonim dengan kartu', emoji: '📇' },
  { to: '/quiz', title: 'Quiz', desc: 'Uji kemampuan dengan timer dan skor', emoji: '⏱️' },
  { to: '/latihan', title: 'Latihan', desc: 'Soal acak tanpa tekanan waktu', emoji: '✍️' },
]

export default function Home() {
  const [weak, setWeak] = useState(() => getWeakWords(10))

  function hapusStats() {
    clearStats()
    setWeak([])
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-2">PAPS</h1>
      <p className="text-gray-500 text-center mb-8">
        Platform Akademik Penalaran Verbal
      </p>

      <div className="grid gap-4 mb-8">
        {modes.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="block rounded-xl border-2 border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{m.emoji}</span>
              <div>
                <p className="font-semibold text-lg">{m.title}</p>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {weak.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">📖 Kata Lemah</h2>
            <button onClick={hapusStats} className="text-xs text-gray-400 hover:text-red-500 transition">
              Reset
            </button>
          </div>
          <div className="space-y-1">
            {weak.map((w, i) => {
              const entry = data.find((d) => d.kata === w.kata)
              return (
                <Link
                  key={w.kata}
                  to={`/flashcard?kata=${encodeURIComponent(w.kata)}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-red-300 hover:bg-red-50 transition"
                >
                  <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                  <span className="font-medium flex-1">{w.kata}</span>
                  <span className="text-sm text-red-500 font-mono">{w.count}x salah</span>
                  {entry && (
                    <span className="text-xs text-gray-400 hidden sm:block">{entry.sinonim}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
