import { useState, useMemo, useEffect, useCallback } from 'react'
import Timer from '../components/Timer'
import Button from '../shared/components/ui/Button'
import PackagePicker from '../shared/components/PackagePicker'
import useTimer from '../hooks/useTimer'
import useProgressStore from '../stores/useProgressStore'
import paketList from '../data/paket'

const LEVELS = [
  { num: 1, name: 'Pemula', time: 20 },
  { num: 2, name: 'Pelajar', time: 18 },
  { num: 3, name: 'Mahasiswa', time: 15 },
  { num: 4, name: 'Sarjana', time: 12 },
  { num: 5, name: 'Magister', time: 10 },
  { num: 6, name: 'Doktor', time: 8 },
]

const MAX_LIVES = 5
const STREAK_BONUS_AT = [5, 10, 15, 20]
const SOAL_PER_LEVEL = 10
const CHECKPOINT_EVERY = 2

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadCP() {
  try { const d = localStorage.getItem('quiz_cp'); return d ? JSON.parse(d) : null } catch { return null }
}
function saveCP(d) { localStorage.setItem('quiz_cp', JSON.stringify(d)) }
function clearCP() { localStorage.removeItem('quiz_cp') }

export default function Quiz() {
  const recordAnswer = useProgressStore(s => s.recordAnswer)
  const updateHighScore = useProgressStore(s => s.updateQuizHighScore)
  const quizHighScore = useProgressStore(s => s.quizHighScore)

  const [phase, setPhase] = useState('pick')
  const [paket, setPaket] = useState(null)
  const [data, setData] = useState(null)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [totalBenar, setTotalBenar] = useState(0)
  const [totalSalah, setTotalSalah] = useState(0)
  const [soalIndex, setSoalIndex] = useState(0)
  const [jawaban, setJawaban] = useState(null)
  const [wrongList, setWrongList] = useState([])
  const [pool, setPool] = useState([])
  const [showBonus, setShowBonus] = useState(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const levelCfg = LEVELS[level - 1]

  const onTimeout = useCallback(() => {
    if (jawaban !== null || phase !== 'play') return
    setJawaban('__timeout__')
  }, [jawaban, phase])

  const timer = useTimer(levelCfg?.time ?? 20, onTimeout)

  const soalLevel = useMemo(() => {
    if (!pool.length || !levelCfg) return []
    const start = (level - 1) * SOAL_PER_LEVEL
    return pool.slice(start, start + SOAL_PER_LEVEL)
  }, [pool, level])

  const current = soalLevel[soalIndex]
  const isLast = soalIndex >= SOAL_PER_LEVEL - 1
  const checkpointLevels = LEVELS.filter(l => l.num % CHECKPOINT_EVERY === 0).map(l => l.num)

  const pilihan = useMemo(() => {
    if (!current || !data) return []
    const b = current.jawaban
    const lain = data.filter(d => d.jawaban !== b).sort(() => Math.random() - 0.5).slice(0, 3).map(d => d.jawaban)
    return shuffle([b, ...lain])
  }, [current, data])

  function startGame(p, fromCheckpoint) {
    setPaket(p)
    setData(p.data)
    const shuffled = shuffle(p.data)

    if (fromCheckpoint) {
      const cp = loadCP()
      if (cp) {
        setLevel(cp.level); setLives(3); setStreak(cp.streak)
        setScore(cp.score); setTotalBenar(cp.benar); setTotalSalah(cp.salah)
        setSoalIndex(0); setJawaban(null); setWrongList([]); setPool(shuffled); setShowBonus(null)
        setPhase('play')
        return
      }
    }
    setLevel(1); setLives(3); setStreak(0); setScore(0)
    setTotalBenar(0); setTotalSalah(0); setSoalIndex(0); setJawaban(null)
    setWrongList([]); setPool(shuffled); setShowBonus(null); clearCP()
    setPhase('play')
  }

  function handlePilihPaket(p) {
    setPaket(p)
    setData(p.data)
    const cp = loadCP()
    if (cp && cp.paketId === p.id) {
      setPhase('prompt')
    } else {
      startGame(p, false)
    }
  }

  function handleResume() { startGame(paket, true) }
  function handleFreshStart() { clearCP(); startGame(paket, false) }

  useEffect(() => {
    if (phase === 'play' && !timer.running && soalIndex === 0) timer.start()
  }, [phase, level])

  function handleCorrect() {
    const s = streak + 1
    setStreak(s)
    setScore(x => x + 10 + s * 2)
    setTotalBenar(x => x + 1)
    recordAnswer(paket.id, current.kata, true)
    if (STREAK_BONUS_AT.includes(s) && lives < MAX_LIVES) {
      setLives(x => Math.min(x + 1, MAX_LIVES))
      setShowBonus(s)
      setTimeout(() => setShowBonus(null), 1500)
    }
  }

  function handleWrong(isTimeout) {
    setStreak(0)
    setLives(x => x - 1)
    setTotalSalah(x => x + 1)
    setWrongList(w => [...w, current])
    if (!isTimeout) recordAnswer(paket.id, current.kata, false)
  }

  function handlePilih(p) {
    if (jawaban !== null) return
    setJawaban(p)
    timer.pause()
    if (p === current.jawaban) handleCorrect()
    else handleWrong(false)
  }

  useEffect(() => {
    if (jawaban === null) return
    const isTimeout = jawaban === '__timeout__'
    const isWrong = !isTimeout && jawaban !== current.jawaban

    if (isTimeout) handleWrong(true)

    const livesLeft = isTimeout ? lives - 1 : lives

    const t = setTimeout(() => {
      if (livesLeft <= 0) {
        timer.pause()
        updateHighScore(score, level, streak, paket.jenis)
        setPhase('gameOver')
        return
      }

      if (isLast) {
        timer.pause()
        updateHighScore(score, level, streak, paket.jenis)
        if (level >= LEVELS.length) {
          setPhase('allClear')
        } else {
          if (checkpointLevels.includes(level)) {
            saveCP({ paketId: paket.id, paketName: paket.name, jenis: paket.jenis, level: level + 1, lives: livesLeft, streak, score, benar: totalBenar, salah: totalSalah })
          }
          setPhase('levelUp')
        }
        return
      }

      setSoalIndex(i => i + 1)
      setJawaban(null)
      timer.reset(levelCfg.time)
      timer.start()
    }, isTimeout || isWrong ? 0 : 1000)

    return () => clearTimeout(t)
  }, [jawaban])

  function nextLevel() {
    setLevel(l => l + 1)
    setSoalIndex(0)
    setJawaban(null)
    setPhase('play')
  }

  function handleExit() {
    setShowExitConfirm(false)
    setPaket(null)
    setPhase('pick')
  }

  function goHome() { setPaket(null); setPhase('pick') }

  // ——— PICK phase —
  if (phase === 'pick') {
    return <PackagePicker mode="quiz" onPilih={handlePilihPaket} />
  }

  // ——— PROMPT phase —
  if (phase === 'prompt') {
    const cp = loadCP()
    const hs = quizHighScore[paket.jenis === 'antonim' ? 'antonim' : 'sinonim']
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Lanjutkan Quiz?</h2>
        <p className="text-slate text-sm mb-1">{paket.name} — Level {cp.level} ({LEVELS[cp.level - 1].name})</p>
        <p className="text-xs text-slate mb-6">❤️ 3 · Skor {cp.score}</p>
        <div className="flex gap-3 mb-8">
          <Button onClick={handleResume}>Lanjut</Button>
          <Button variant="secondary" onClick={handleFreshStart}>Mulai Baru</Button>
          <Button variant="ghost" onClick={goHome}>Kembali</Button>
        </div>
        {hs && hs.score > 0 && (
          <p className="text-xs text-yellow-700">🏆 High Score: {hs.score} · Level {hs.level} ({LEVELS[hs.level - 1]?.name})</p>
        )}
      </div>
    )
  }

  // ——— LEVEL UP phase —
  if (phase === 'levelUp') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Level {level} — {levelCfg.name} Selesai!</h2>
      <p className="text-slate text-sm mb-4">Skor: {score} · Streak: {streak}</p>
      <Button onClick={nextLevel}>Lanjut ke Level {level + 1}</Button>
    </div>
  )

  // ——— GAME OVER phase —
  if (phase === 'gameOver') {
    const cp = loadCP()
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in text-center">
        <div className="text-5xl mb-4">💀</div>
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Game Over!</h2>
        <p className="text-slate text-sm mb-1">Level {level} — {levelCfg.name} · Skor: {score}</p>
        <p className="text-xs text-slate mb-6">✅ {totalBenar} · ❌ {totalSalah} · 🔥 Streak: {streak}</p>
        {wrongList.length > 0 && (
          <div className="w-full max-w-sm mb-6">
            <p className="text-xs font-semibold text-slate mb-2">Kata yang salah:</p>
            <div className="flex flex-wrap gap-2">
              {wrongList.slice(-5).reverse().map(w => (
                <span key={w.kata} className="text-xs px-2.5 py-1 rounded-full bg-tint-rose text-error">{w.kata}</span>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          {cp && <Button onClick={handleResume}>Lanjut (3 ❤️)</Button>}
          <Button variant="secondary" onClick={handleFreshStart}>Mulai Awal</Button>
          <Button variant="ghost" onClick={goHome}>Beranda</Button>
        </div>
      </div>
    )
  }

  // ——— ALL CLEAR phase —
  if (phase === 'allClear') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in text-center">
      <div className="text-5xl mb-4">🏆</div>
      <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Semua Level Selesai!</h2>
      <p className="text-slate text-sm mb-2">Skor akhir: {score}</p>
      <p className="text-xs text-slate mb-6">✅ {totalBenar} · ❌ {totalSalah}</p>
      <div className="flex gap-3">
        <Button onClick={handleFreshStart}>Main Lagi</Button>
        <Button variant="secondary" onClick={goHome}>Beranda</Button>
      </div>
    </div>
  )

  // ——— EXIT CONFIRM —
  if (showExitConfirm) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in text-center">
      <div className="text-5xl mb-4">🚪</div>
      <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Yakin berhenti?</h2>
      <p className="text-slate text-sm mb-6">Progress di level ini bakal ilang.</p>
      <div className="flex gap-3">
        <Button variant="danger" onClick={handleExit}>Ya, Berhenti</Button>
        <Button variant="secondary" onClick={() => setShowExitConfirm(false)}>Batal</Button>
      </div>
    </div>
  )

  // ——— PLAY phase —
  const progress = ((soalIndex + (jawaban !== null ? 1 : 0)) / SOAL_PER_LEVEL) * 100

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Level {level} — {levelCfg.name}</h2>
          <p className="text-xs text-slate">{paket.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: lives }).map((_, i) => <span key={i} className="text-lg">❤️</span>)}
            {Array.from({ length: Math.max(0, MAX_LIVES - lives) }).map((_, i) => <span key={`e${i}`} className="text-lg opacity-30">❤️</span>)}
          </div>
          <Timer remaining={timer.remaining} running={timer.running} />
          <button onClick={() => setShowExitConfirm(true)}
            className="text-xs text-slate hover:text-error transition px-2 py-1 rounded-lg hover:bg-tint-rose">
            ✕ Berhenti
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 text-xs text-slate">
        <span>🔥 {streak}</span>
        <span>Skor: {score}</span>
      </div>

      {showBonus && (
        <div className="text-center mb-2 animate-scale-in">
          <span className="inline-block text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            🔥 {showBonus}! +1 ❤️
          </span>
        </div>
      )}

      <div className="h-1.5 bg-hairline rounded-full mb-4 overflow-hidden">
        <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-xs text-slate mb-4">Soal {soalIndex + 1} dari {SOAL_PER_LEVEL}</p>

      {current && (
        <>
          <div className="rounded-xl bg-canvas border border-hairline shadow-card p-6 mb-5 text-center">
            <p className="text-2xl font-semibold text-ink-deep">{current.kata}</p>
          </div>
          <div className="grid gap-2.5">
            {pilihan.map((p, i) => {
              let cls = 'border-hairline bg-canvas hover:shadow-card-hover'
              if (jawaban !== null) {
                if (p === current.jawaban) cls = 'border-[var(--color-success)] bg-tint-mint'
                else if (p === jawaban || jawaban === '__timeout__') cls = 'bg-error text-white border-error'
                else cls = 'border-hairline bg-canvas opacity-50'
              }
              return (
                <button key={i} onClick={() => handlePilih(p)}
                  className={`w-full text-left p-4 rounded-lg border text-sm transition-all duration-150 ${cls}`}
                  disabled={jawaban !== null}>
                  {p}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
