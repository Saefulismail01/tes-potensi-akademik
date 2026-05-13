import { useState, useMemo, useEffect, useRef } from 'react'
import paketList from '../data/paket'
import ProgressBar from '../shared/components/ui/ProgressBar'
import Button from '../shared/components/ui/Button'
import PackagePicker from '../shared/components/PackagePicker'
import { trackMistake } from './../data/stats'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickPilihan(current, allData) {
  const b = current.jawaban
  const lain = allData.filter((d) => d.jawaban !== b).sort(() => Math.random() - 0.5).slice(0, 3).map((d) => d.jawaban)
  return shuffle([b, ...lain])
}

function storageKey(paketId) { return `paps_latihan_${paketId}` }

function toIndices(arr, data) { return arr.map((q) => data.indexOf(q)) }

function fromIndices(indices, data) { return indices.map((i) => data[i]).filter(Boolean) }

function loadState(paketId, data) {
  try {
    const raw = localStorage.getItem(storageKey(paketId))
    if (!raw) return null
    const s = JSON.parse(raw)
    if (!s.pool || !Array.isArray(s.pool)) return null
    const pool = fromIndices(s.pool, data)
    if (!pool.length || s.index >= pool.length) return null
    return { round: s.round ?? 1, pool, missed: fromIndices(s.missed ?? [], data), index: s.index ?? 0, totalBenar: s.totalBenar ?? 0, totalSalah: s.totalSalah ?? 0, selesai: s.selesai ?? false }
  } catch { return null }
}

function saveState(paketId, round, pool, missed, index, totalBenar, totalSalah, selesai, dataRef) {
  try { localStorage.setItem(storageKey(paketId), JSON.stringify({ round, pool: toIndices(pool, dataRef), missed: toIndices(missed, dataRef), index, totalBenar, totalSalah, selesai })) } catch {}
}

function clearState(paketId) { try { localStorage.removeItem(storageKey(paketId)) } catch {} }

export default function Latihan() {
  const [paket, setPaket] = useState(null)
  const [data, setData] = useState(null)
  function pilih(p) { setPaket(p); setData(p.data) }

  return (
    <div className="animate-fade-in">
      {!paket ? <PackagePicker mode="latihan" onPilih={pilih} /> : <LatihanContent paket={paket} data={data} onGanti={() => { setPaket(null); setData(null) }} />}
    </div>
  )
}

function LatihanContent({ paket, data, onGanti }) {
  const dataRef = useRef(data); dataRef.current = data
  const init = useRef(true)
  const saved = useRef(null)
  if (saved.current === null && data) saved.current = loadState(paket.id, data)

  const [round, setRound] = useState(() => saved.current?.round ?? 1)
  const [pool, setPool] = useState(() => saved.current?.pool ?? shuffle(data))
  const [missedCount, setMissedCount] = useState(0)
  const [index, setIndex] = useState(() => saved.current?.index ?? 0)
  const [jawaban, setJawaban] = useState(null)
  const [totalBenar, setTotalBenar] = useState(() => saved.current?.totalBenar ?? 0)
  const [totalSalah, setTotalSalah] = useState(() => saved.current?.totalSalah ?? 0)
  const [selesai, setSelesai] = useState(() => saved.current?.selesai ?? false)
  const missedRef = useRef(saved.current?.missed ?? [])

  useEffect(() => {
    if (init.current) { init.current = false; if (!pool.length || index >= pool.length) { setPool(shuffle(data)); setIndex(0); missedRef.current = []; setMissedCount(0); setTotalBenar(0); setTotalSalah(0); setSelesai(false) } return }
    saveState(paket.id, round, pool, missedRef.current, index, totalBenar, totalSalah, selesai, data)
  })

  const current = pool[index]
  const pilihan = useMemo(() => current ? pickPilihan(current, data) : [], [current])

  function handlePilih(p) {
    if (jawaban !== null) return
    setJawaban(p)
    if (p === current.jawaban) setTotalBenar((b) => b + 1)
    else { setTotalSalah((s) => s + 1); missedRef.current = [...missedRef.current, current]; setMissedCount(missedRef.current.length); trackMistake(current.kata) }
  }

  function advance() {
    const m = missedRef.current
    if (index >= pool.length - 1) {
      if (m.length > 0) { setPool(shuffle(m)); missedRef.current = []; setMissedCount(0); setRound((r) => r + 1); setIndex(0); setJawaban(null) }
      else { clearState(paket.id); setSelesai(true) }
    } else { setIndex((i) => i + 1); setJawaban(null) }
  }

  useEffect(() => { if (!current || jawaban !== current.jawaban) return; const t = setTimeout(advance, 800); return () => clearTimeout(t) }, [jawaban, current])

  function restart() { clearState(paket.id); setRound(1); setPool(shuffle(data)); missedRef.current = []; setMissedCount(0); setIndex(0); setJawaban(null); setTotalBenar(0); setTotalSalah(0); setSelesai(false) }

  if (selesai) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-xl font-semibold tracking-tight text-ink mb-1">Latihan Selesai!</h2>
        <p className="text-slate text-sm mb-6">Semua soal terjawab dengan benar ✓</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
          <div className="bg-tint-mint rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{totalBenar}</p>
            <p className="text-xs text-slate">Benar</p>
          </div>
          <div className="bg-[var(--color-tint-rose)] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-error">{totalSalah}</p>
            <p className="text-xs text-slate">Terulang</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={restart}>Latihan Lagi</Button>
          <Button variant="secondary" onClick={onGanti}>Ganti Paket</Button>
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">{paket.name}</h2>
          <p className="text-xs text-slate uppercase tracking-wider mt-0.5">Latihan</p>
        </div>
        <button onClick={onGanti} className="text-xs text-slate hover:text-ink transition-colors">Ganti Paket</button>
      </div>

      <div className="flex items-center justify-between text-sm text-slate mb-4">
        <span>Ronde {round}</span>
        <span className="flex items-center gap-1.5">
          <span style={{ color: 'var(--color-success)' }}>✓ {totalBenar}</span>
          <span className="text-hairline-strong">/</span>
          <span className="text-error">✗ {totalSalah}</span>
        </span>
      </div>

      <ProgressBar value={((index + 1) / pool.length) * 100} size="sm" className="mb-5" />

      <div className="rounded-xl bg-canvas border border-hairline shadow-card p-6 mb-5 text-center">
        <p className="text-xl font-semibold text-ink-deep">{current.kata}</p>
      </div>

      <div className="grid gap-2.5">
        {pilihan.map((p, i) => {
          let cls = 'border-hairline bg-canvas hover:shadow-card-hover'
          if (jawaban !== null) {
            if (p === current.jawaban) cls = 'border-[var(--color-success)] bg-tint-mint'
            else if (p === jawaban) cls = 'border-error bg-[var(--color-tint-rose)]'
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

      {jawaban !== null && (
        <div className="text-center mt-5">
          {jawaban === current.jawaban ? (
            <p className="text-sm text-slate">Soal selanjutnya...</p>
          ) : (
            <Button onClick={advance}>Lanjut →</Button>
          )}
        </div>
      )}
    </div>
  )
}