import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../components/Card'
import ProgressBar from '../shared/components/ui/ProgressBar'
import Button from '../shared/components/ui/Button'
import PackagePicker from '../shared/components/PackagePicker'

export default function FlashcardPage() {
  const [params] = useSearchParams()
  const [paket, setPaket] = useState(null)
  const [data, setData] = useState(null)
  const [index, setIndex] = useState(0)

  function pilih(p) {
    setPaket(p); setData(p.data)
    const startKata = params.get('kata')
    if (startKata) {
      const idx = p.data.findIndex((d) => d.kata === startKata)
      if (idx > -1) setIndex(idx)
    }
  }

  function reset() { setPaket(null); setData(null); setIndex(0) }

  if (!paket) return <PackagePicker mode="flashcard" onPilih={pilih} />

  const item = data[index]
  const next = () => setIndex((i) => (i + 1) % data.length)
  const prev = () => setIndex((i) => (i - 1 + data.length) % data.length)

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{paket.name}</h2>
          <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">Flascard</p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>Ganti Paket</Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <span>{index + 1}</span>
        <span className="text-gray-200">/</span>
        <span>{data.length}</span>
      </div>

      <ProgressBar value={((index + 1) / data.length) * 100} size="sm" className="mb-8" />

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card key={index} kata={item.kata} jawaban={item.jawaban} />
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button variant="secondary" size="md" onClick={() => setIndex((i) => (i - 1 + data.length) % data.length)}>
          ← Sebelumnya
        </Button>
        <Button variant="primary" size="md" onClick={() => setIndex((i) => (i + 1) % data.length)}>
          Selanjutnya →
        </Button>
      </div>
    </div>
  )
}