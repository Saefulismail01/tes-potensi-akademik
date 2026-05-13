import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../../components/Card'
import ProgressBar from '../../shared/components/ui/ProgressBar'
import Button from '../../shared/components/ui/Button'
import PackagePicker from '../../shared/components/PackagePicker'
import useProgressStore from '../../stores/useProgressStore'

export default function FlashcardPage() {
  const [params] = useSearchParams()
  const [paket, setPaket] = useState(null)
  const [data, setData] = useState(null)
  const [index, setIndex] = useState(0)
  const recordAnswer = useProgressStore((s) => s.recordAnswer)

  function pilih(p) {
    setPaket(p); setData(p.data)
    const startKata = params.get('kata')
    if (startKata) {
      const idx = p.data.findIndex((d) => d.kata === startKata)
      if (idx > -1) setIndex(idx)
    }
  }

  if (!paket) return <PackagePicker mode="flashcard" onPilih={pilih} />

  const item = data[index]
  const label = paket.jenis === 'antonim' ? 'Antonim' : 'Sinonim'

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">{paket.name}</h2>
        <Button variant="ghost" size="sm" onClick={() => setPaket(null)}>Ganti Paket</Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span className="uppercase tracking-wide text-xs text-blue-500 font-medium">{label}</span>
        <span className="text-gray-300">•</span>
        <span>{index + 1} / {data.length}</span>
        <span className="text-gray-300">•</span>
        <span>{data.length - index - 1} tersisa</span>
      </div>
      <ProgressBar value={((index + 1) / data.length) * 100} size="sm" className="mb-6" />
      <Card key={index} kata={item.kata} jawaban={item.jawaban} />
      <div className="flex justify-center gap-2 mt-6">
        <Button variant="ghost" size="sm" onClick={() => setIndex((i) => (i - 1 + data.length) % data.length)}>← Sebelumnya</Button>
        <Button size="sm" onClick={() => setIndex((i) => (i + 1) % data.length)}>Selanjutnya →</Button>
      </div>
    </div>
  )
}
