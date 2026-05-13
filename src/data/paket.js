import rawSinonim1 from './paket1.json'
import rawSinonim2 from './paket2.json'
import rawAntonim1 from './antonim/paket1.json'

const sinonim = (data) => data.map((d) => ({ kata: d.kata, jawaban: d.sinonim }))
const antonim = (data) => data.map((d) => ({ kata: d.kata, jawaban: d.antonim }))

const paket = [
  { id: 'sinonim-paket1', name: 'Paket 1', jenis: 'sinonim', data: sinonim(rawSinonim1), desc: '412 soal sinonim TPA umum' },
  { id: 'sinonim-paket2', name: 'Paket 2', jenis: 'sinonim', data: sinonim(rawSinonim2), desc: '192 soal sinonim OTO BAPPENAS' },
  { id: 'antonim-paket1', name: 'Paket 1', jenis: 'antonim', data: antonim(rawAntonim1), desc: '50 soal antonim (mock)' },
]

export default paket
