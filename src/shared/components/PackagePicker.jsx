import paketList from '../../data/paket'

const jenisStyle = {
  sinonim: { border: 'border-green-200', bg: 'bg-green-50', hover: 'hover:border-green-300 hover:bg-green-100', badge: 'bg-green-200 text-green-700' },
  antonim: { border: 'border-red-200', bg: 'bg-red-50', hover: 'hover:border-red-300 hover:bg-red-100', badge: 'bg-red-200 text-red-700' },
}

export default function PackagePicker({ mode, onPilih }) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold text-center mb-1">Pilih Paket</h2>
      <p className="text-sm text-gray-400 text-center mb-6">Pilih paket untuk memulai {mode}</p>
      <div className="grid gap-2.5">
        {paketList.map((p) => {
          const js = jenisStyle[p.jenis] || jenisStyle.sinonim
          return (
            <button
              key={p.id}
              onClick={() => onPilih(p)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer ${js.border} ${js.bg} ${js.hover} hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-base">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${js.badge}`}>
                    {p.jenis === 'antonim' ? 'Antonim' : 'Sinonim'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{p.data.length} soal</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}