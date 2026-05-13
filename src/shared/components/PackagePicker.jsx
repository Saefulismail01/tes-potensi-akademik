import paketList from '../../data/paket'

const jenisTheme = {
  sinonim: { card: 'pastelMint', label: 'Sinonim' },
  antonim: { card: 'pastelRose', label: 'Antonim' },
}

export default function PackagePicker({ mode, onPilih }) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-1">Pilih Paket</h2>
      <p className="text-slate text-sm text-center mb-6">Pilih paket untuk memulai {mode}</p>
      <div className="grid gap-3">
        {paketList.map((p) => {
          const t = jenisTheme[p.jenis] || jenisTheme.sinonim
          return (
            <button
              key={p.id}
              onClick={() => onPilih(p)}
              className={`w-full text-left rounded-xl border ${t.card === 'pastelMint' ? 'bg-tint-mint border-tint-mint' : 'bg-[var(--color-tint-rose)] border-[var(--color-tint-rose)]'} p-4 transition-all duration-150 cursor-pointer hover:shadow-card-hover`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-slate mt-0.5">{p.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate">{p.data.length} soal</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}