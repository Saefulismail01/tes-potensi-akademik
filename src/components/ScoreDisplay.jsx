export default function ScoreDisplay({ benar, salah, total, waktu }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-center">
      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <p className="text-2xl font-bold text-green-700">{benar}</p>
        <p className="text-sm text-green-600">Benar</p>
      </div>
      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
        <p className="text-2xl font-bold text-red-700">{salah}</p>
        <p className="text-sm text-red-600">Salah</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-2xl font-bold text-blue-700">{total}</p>
        <p className="text-sm text-blue-600">Total Soal</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-2xl font-bold text-gray-700">{waktu}</p>
        <p className="text-sm text-gray-600">Waktu</p>
      </div>
    </div>
  )
}
