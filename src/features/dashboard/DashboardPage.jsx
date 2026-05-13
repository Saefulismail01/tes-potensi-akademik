import { useState } from 'react'
import paketList from '../../data/paket'
import useProgressStore from '../../stores/useProgressStore'
import ModeCard from './components/ModeCard'
import MasteryOverview from './components/MasteryOverview'
import WeakWordsList from './components/WeakWordsList'

const modes = [
  { to: '/flashcard', title: 'Flashcard', desc: 'Baca dan hafal dengan kartu', icon: '📇' },
  { to: '/quiz', title: 'Quiz', desc: 'Uji kemampuan dengan timer', icon: '⏱️' },
  { to: '/latihan', title: 'Latihan', desc: 'Ronde berulang sampai semua benar', icon: '✍️' },
  { to: '/review', title: 'Review', desc: 'Fokus di kata yang sering salah', icon: '🔄' },
]

const jenisTheme = {
  sinonim: { accent: 'border-green-300/60', bg: 'bg-green-50', bar: 'bg-gradient-to-r from-green-400 to-green-500', badge: 'bg-green-200 text-green-800' },
  antonim: { accent: 'border-red-300/60', bg: 'bg-red-50', bar: 'bg-gradient-to-r from-red-400 to-red-500', badge: 'bg-red-200 text-red-800' },
}

export default function DashboardPage() {
  const getWeakWords = useProgressStore((s) => s.getWeakWords)
  const getMastery = useProgressStore((s) => s.getMastery)
  const pakets = useProgressStore((s) => s.pakets)
  const [showDetail, setShowDetail] = useState(false)

  const weak = paketList[0] ? getWeakWords(paketList[0].id, 10) : []

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Hai 👋</h1>
        <p className="text-gray-500 mt-1 text-sm">Ayo lanjutkan belajarmu</p>
      </div>

      {/* Mode Cards */}
      <div className="grid gap-3 mb-8">
        {modes.map((m) => (
          <ModeCard key={m.to} {...m} />
        ))}
      </div>

      {/* Progress per paket */}
      <h2 className="font-bold text-base mb-3 text-gray-600">Progress</h2>
      <div className="grid gap-3 mb-8">
        {paketList.map((p) => {
          const js = jenisTheme[p.jenis] || jenisTheme.sinonim
          const mastery = getMastery(p.id)
          const stats = pakets[p.id]
          return (
            <MasteryOverview
              key={p.id}
              paket={p.name}
              jenis={{ label: js === jenisTheme.sinonim ? 'Sinonim' : 'Antonim', accent: js.accent, bg: js.bg, bar: js.bar, badge: js.badge }}
              mastery={mastery}
              totalCorrect={stats?.totalCorrect ?? 0}
              totalWrong={stats?.totalWrong ?? 0}
              sessions={stats?.sessionsCompleted ?? 0}
            />
          )
        })}
      </div>

      {/* Weak Words */}
      <WeakWordsList words={weak} />
    </div>
  )
}