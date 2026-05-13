import { useState, useMemo, useEffect } from 'react'
import Timer from '../components/Timer'
import Button from '../shared/components/ui/Button'
import PackagePicker from '../shared/components/PackagePicker'
import useTimer from '../hooks/useTimer'
import { trackMistake } from '../data/stats'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const [paket, setPaket] = useState(null)
  const [data, setData] = useState(null)
  const [soalIndex, setSoalIndex] = useState(0)
  const [jawaban, setJawaban] = useState(null)
  const [selesai, setSelesai] = useState(false)
  const [benar, setBenar] = useState(0)
  const [salah, setSalah] = useState(0)

  const timer = useTimer(0)

  function pilih(p) { setPaket(p); setData(p.data) }

  useEffect(() => { if (data && !timer.running && timer.seconds === 0) timer.start() }, [data])

  const soal = useMemo(() => data ? shuffle(data).slice(0, 10) : [], [data])
  const current = soal[soalIndex]

  const pilihan = useMemo(() => {
    if (!current) return []
    const b = current.jawaban
    const lain = data.filter((d) => d.jawaban !== b).sort(() => Math.random() - 0.5).slice(0, 3).map((d) => d.jawaban)
    return shuffle([b, ...lain])
  }, [current, data])

  function handlePilih(p) {
    if (jawaban !== null) return
    setJawaban(p)
    if (p === current.jawaban) setBenar((b) => b + 1)
    else { setSalah((s) => s + 1); trackMistake(current.kata) }
  }

  useEffect(() => {
    if (jawaban === null) return
    const t = setTimeout(() => {
      if (soalIndex >= soal.length - 1) { timer.pause(); setSelesai(true) }
      else { setSoalIndex((i) => i + 1); setJawaban(null) }
    }, 1000)
    return () => clearTimeout(t)
  }, [jawaban, soalIndex])

  function quizReset() {
    timer.reset(); setSoalIndex(0); setJawaban(null)
    setSelesai(false); setBenar(0); setSalah(0)
  }

  function restart() { window.location.reload() }

  if (!paket) return <PackagePicker mode="quiz" onPilih={pilih} />

  const progress = ((soalIndex + (jawaban !== null ? 1 : 0)) / soal.length) * 100

  if (selesai) {
    const persen = Math.round((benar / soal.length) * 100)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
        <div className="text-6xl mb-4">{persen >= 70 ? '🎉' : persen >= 50 ? '😊' : '📚'}</div>
        <h2 className="text-xl font-bold mb-1">Quiz Selesai!</h2>
        <p className="text-gray-400 text-sm mb-6">{persen}% benar — {timer.seconds}s</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{benar}</p>
            <p className="text-xs text-emerald-500">Benar</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{salah}</p>
            <p className="text-xs text-red-500">Salah</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={quizReset}>Quiz Lagi</Button>
          <Button variant="secondary" onClick={() => setPaket(null)}>Ganti Paket</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{paket.name}</h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Quiz</p>
        </div>
        <Timer seconds={timer.seconds} running={timer.running} start={timer.start} pause={timer.pause} reset={timer.reset} />
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-xs text-gray-400 mb-6">
        Soal {soalIndex + 1} dari {soal.length}
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Pilih sinonim dari</p>
        <p className="text-2xl font-bold text-indigo-600">"{current.kata}"</p>
      </div>

      <div className="grid gap-2.5">
        {pilihan.map((p, i) => {
          let cls = 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30'
          if (jawaban !== null) {
            if (p === current.jawaban) cls = 'border-emerald-300 bg-emerald-50'
            else if (p === jawaban) cls = 'border-red-300 bg-red-50'
            else cls = 'border-gray-100 bg-white/50'
          }
          return (
            <button key={i} onClick={() => handlePilih(p)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${cls}`}
              disabled={jawaban !== null}>
              {p}
            </button>
          )
        })}
      </div>
    </div>
  )
}