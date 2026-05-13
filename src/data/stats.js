const KEY = 'paps_stats_paket1'

export function getStats() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function trackMistake(kata) {
  const stats = getStats()
  stats[kata] = (stats[kata] || 0) + 1
  localStorage.setItem(KEY, JSON.stringify(stats))
}

export function getWeakWords(limit = 10) {
  const stats = getStats()
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([kata, count]) => ({ kata, count }))
}

export function clearStats() {
  localStorage.removeItem(KEY)
}
