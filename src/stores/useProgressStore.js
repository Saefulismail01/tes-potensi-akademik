import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultPaket = () => ({
  wordStats: {},
  totalCorrect: 0,
  totalWrong: 0,
  sessionsCompleted: 0,
  lastSession: null,
})

const useProgressStore = create(
  persist(
    (set, get) => ({
      pakets: {},
      quizHighScore: { level: 0, score: 0, streak: 0, totalBenar: 0, totalSalah: 0 },

      updateQuizHighScore(score, level, streak) {
        const current = get().quizHighScore
        if (score > current.score) {
          set({ quizHighScore: { level, score, streak } })
        }
      },

      _ensure(paketId) {
        if (!get().pakets[paketId]) {
          set((s) => ({
            pakets: { ...s.pakets, [paketId]: defaultPaket() },
          }))
        }
      },

      recordAnswer(paketId, kata, correct) {
        get()._ensure(paketId)
        set((s) => {
          const p = { ...s.pakets[paketId] }
          const ws = { ...(p.wordStats[kata] || { right: 0, wrong: 0 }) }
          if (correct) ws.right++
          else ws.wrong++
          ws.mastery = ws.right / (ws.right + ws.wrong + 3)
          ws.lastSeen = new Date().toISOString()
          return {
            pakets: {
              ...s.pakets,
              [paketId]: {
                ...p,
                wordStats: { ...p.wordStats, [kata]: ws },
                totalCorrect: p.totalCorrect + (correct ? 1 : 0),
                totalWrong: p.totalWrong + (correct ? 0 : 1),
              },
            },
          }
        })
      },

      getWeakWords(paketId, limit = 10) {
        const p = get().pakets[paketId]
        if (!p) return []
        return Object.entries(p.wordStats)
          .filter(([, s]) => (s.mastery || 0) < 0.5)
          .sort((a, b) => (a[1].mastery || 0) - (b[1].mastery || 0))
          .slice(0, limit)
          .map(([kata, stats]) => ({ kata, ...stats }))
      },

      getMastery(paketId) {
        const p = get().pakets[paketId]
        if (!p) return 0
        const vals = Object.values(p.wordStats)
        if (!vals.length) return 0
        return vals.reduce((sum, v) => sum + (v.mastery || 0), 0) / vals.length
      },

      completeSession(paketId) {
        get()._ensure(paketId)
        set((s) => ({
          pakets: {
            ...s.pakets,
            [paketId]: {
              ...s.pakets[paketId],
              sessionsCompleted:
                s.pakets[paketId].sessionsCompleted + 1,
              lastSession: new Date().toISOString(),
            },
          },
        }))
      },
    }),
    { name: 'paps_progress' }
  )
)

export default useProgressStore
