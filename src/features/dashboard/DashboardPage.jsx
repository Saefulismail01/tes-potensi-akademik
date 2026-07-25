import paketList from '../../data/paket'
import useProgressStore from '../../stores/useProgressStore'
import ModeCard from './components/ModeCard'
import MasteryOverview from './components/MasteryOverview'
import WeakWordsList from './components/WeakWordsList'
import Leaderboard from './components/Leaderboard'

const modes = [
  { to: '/flashcard', title: 'Flashcard', desc: 'Baca dan hafal dengan kartu', icon: '📇' },
  { to: '/quiz', title: 'Quiz', desc: 'Level + streak + countdown', icon: '⏱️' },
  { to: '/latihan', title: 'Latihan', desc: 'Ronde berulang sampai semua benar', icon: '✍️' },
  { to: '/review', title: 'Review', desc: 'Fokus di kata yang sering salah', icon: '🔄' },
]

export default function DashboardPage() {
  const getWeakWords = useProgressStore((s) => s.getWeakWords)
  const getMastery = useProgressStore((s) => s.getMastery)
  const pakets = useProgressStore((s) => s.pakets)
  const quizHighScore = useProgressStore((s) => s.quizHighScore)

  const weak = paketList[0] ? getWeakWords(paketList[0].id, 10) : []

  return (
    <div className="animate-fade-in">
      {/* Hero greeting */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-deep">
          Selamat belajar, Pejuang TPA
        </h1>
        <p className="text-slate mt-1.5">
          Platform Akademik Penalaran Verbal
        </p>
      </div>

      {/* Leaderboard */}
      <div className="mb-6">
        <Leaderboard
          highScores={quizHighScore}
          pakets={paketList}
          getMastery={getMastery}
        />
      </div>

      {/* Mode cards */}
      <div className="grid gap-2.5 mb-8">
        {modes.map((m) => <ModeCard key={m.to} {...m} />)}
      </div>

      {/* Progress */}
      <h2 className="text-sm font-semibold text-slate mb-3">Progress</h2>
      <div className="grid gap-2.5 mb-8">
        {paketList.map((p) => {
          const mastery = getMastery(p.id)
          const stats = pakets[p.id]
          return (
            <MasteryOverview
              key={p.id}
              paket={p.name}
              jenis={{ label: p.jenis === 'antonim' ? 'Antonim' : 'Sinonim' }}
              mastery={mastery}
              totalCorrect={stats?.totalCorrect ?? 0}
              totalWrong={stats?.totalWrong ?? 0}
              sessions={stats?.sessionsCompleted ?? 0}
            />
          )
        })}
      </div>

      <WeakWordsList words={weak} />

      <p className="text-xs text-stone text-center mt-10">
        {paketList.length} paket — {paketList.reduce((s, p) => s + p.data.length, 0)} soal
      </p>
    </div>
  )
}