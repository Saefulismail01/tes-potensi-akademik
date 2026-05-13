import paketList from '../data/paket'

const jenisStyle = {
  sinonim: {
    border: 'border-green-300',
    bg: 'bg-green-50',
    hover: 'hover:bg-green-100 hover:border-green-400',
    badge: 'bg-green-200 text-green-800',
    label: 'Sinonim',
  },
  antonim: {
    border: 'border-red-300',
    bg: 'bg-red-50',
    hover: 'hover:bg-red-100 hover:border-red-400',
    badge: 'bg-red-200 text-red-800',
    label: 'Antonim',
  },
}

export default function PackagePicker({ mode, onPilih }) {
  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <h2 className="text-xl font-bold text-center mb-2">Pilih Paket Soal</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Pilih paket untuk memulai {mode}
      </p>
      <div className="grid gap-3">
        {paketList.map((p) => {
          const js = jenisStyle[p.jenis] || jenisStyle.sinonim
          return (
            <button
              key={p.id}
              onClick={() => onPilih(p)}
              className={`w-full text-left rounded-xl border-2 p-4 transition cursor-pointer ${js.border} ${js.bg} ${js.hover}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${js.badge}`}>
                    {js.label}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{p.data.length} soal</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
