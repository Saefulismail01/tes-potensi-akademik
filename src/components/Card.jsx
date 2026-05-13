import { useState } from 'react'

export default function Card({ kata, jawaban }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div onClick={() => setFlipped((f) => !f)} className="relative min-h-[200px] max-w-md mx-auto cursor-pointer select-none">
      <div className="perspective w-full h-full">
        <div className={`relative min-h-[200px] transition-all duration-500 [transform-style:preserve-3d] ${flipped ? 'rotate-x-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 rounded-xl bg-canvas border border-hairline shadow-card flex flex-col items-center justify-center p-8 backface-hidden">
            <p className="text-xs text-slate font-medium uppercase tracking-wider mb-2">Kata</p>
            <p className="text-xl font-semibold text-ink-deep">{kata}</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 rounded-xl bg-tint-lavender border border-primary/10 flex flex-col items-center justify-center p-8 backface-hidden rotate-x-180">
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-primary)' }}>Jawaban</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{jawaban}</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-stone text-center mt-3">Klik untuk membalik</p>
    </div>
  )
}