import { useState } from 'react'

export default function Card({ kata, jawaban }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      className="relative w-full max-w-md min-h-[240px] cursor-pointer select-none mx-auto"
    >
      <div className="perspective w-full h-full">
        <div
          className={`relative w-full min-h-[240px] transition-all duration-500 [transform-style:preserve-3d] ${
            flipped ? 'rotate-x-180' : ''
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 rounded-3xl border border-gray-100 bg-white shadow-lg flex items-center justify-center p-8 backface-hidden">
            <div className="text-center">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Kata</p>
              <p className="text-2xl font-bold text-gray-800">{kata}</p>
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 rounded-3xl border border-indigo-100 bg-indigo-50 shadow-lg flex items-center justify-center p-8 backface-hidden rotate-x-180">
            <div className="text-center">
              <p className="text-sm text-indigo-400 uppercase tracking-wider mb-2">Sinonim</p>
              <p className="text-xl font-semibold text-indigo-700">{jawaban}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-300 mt-4 text-center">Klik untuk membalik</p>
    </div>
  )
}