import { describe, it, expect, beforeEach } from 'vitest'
import useProgressStore from './useProgressStore'

const PAKET_ID = 'sinonim-paket1'

describe('useProgressStore', () => {
  beforeEach(() => {
    useProgressStore.setState({
      pakets: {},
      quizHighScore: {
        sinonim: { score: 0, level: 0, streak: 0 },
        antonim: { score: 0, level: 0, streak: 0 },
      },
    })
    localStorage.clear()
  })

  describe('recordAnswer', () => {
    it('records a correct answer and updates mastery', () => {
      useProgressStore.getState().recordAnswer(PAKET_ID, 'Abolisi', true)
      const state = useProgressStore.getState()
      const ws = state.pakets[PAKET_ID].wordStats['Abolisi']
      expect(ws.right).toBe(1)
      expect(ws.wrong).toBe(0)
      expect(ws.mastery).toBe(1 / (1 + 0 + 3))
      expect(ws.lastSeen).toBeTruthy()
      expect(state.pakets[PAKET_ID].totalCorrect).toBe(1)
      expect(state.pakets[PAKET_ID].totalWrong).toBe(0)
    })

    it('records a wrong answer and updates mastery', () => {
      useProgressStore.getState().recordAnswer(PAKET_ID, 'Abolisi', false)
      const ws = useProgressStore.getState().pakets[PAKET_ID].wordStats['Abolisi']
      expect(ws.right).toBe(0)
      expect(ws.wrong).toBe(1)
      expect(ws.mastery).toBe(0 / (0 + 1 + 3))
      expect(useProgressStore.getState().pakets[PAKET_ID].totalWrong).toBe(1)
    })

    it('accumulates multiple records for the same word', () => {
      const store = useProgressStore.getState()
      store.recordAnswer(PAKET_ID, 'Abolisi', true)
      store.recordAnswer(PAKET_ID, 'Abolisi', true)
      store.recordAnswer(PAKET_ID, 'Abolisi', false)

      const ws = useProgressStore.getState().pakets[PAKET_ID].wordStats['Abolisi']
      expect(ws.right).toBe(2)
      expect(ws.wrong).toBe(1)
      expect(ws.mastery).toBe(2 / (2 + 1 + 3))
    })
  })

  describe('updateQuizHighScore', () => {
    it('updates high score when new score is higher', () => {
      useProgressStore.getState().updateQuizHighScore(100, 3, 5, 'sinonim')
      expect(useProgressStore.getState().quizHighScore.sinonim).toEqual({
        score: 100, level: 3, streak: 5,
      })
    })

    it('does not update when new score is lower', () => {
      const store = useProgressStore.getState()
      store.updateQuizHighScore(100, 3, 5, 'sinonim')
      store.updateQuizHighScore(50, 2, 3, 'sinonim')
      expect(useProgressStore.getState().quizHighScore.sinonim.score).toBe(100)
    })

    it('treats antonim category separately', () => {
      const store = useProgressStore.getState()
      store.updateQuizHighScore(100, 3, 5, 'sinonim')
      store.updateQuizHighScore(200, 5, 10, 'antonim')
      const hs = useProgressStore.getState().quizHighScore
      expect(hs.sinonim.score).toBe(100)
      expect(hs.antonim.score).toBe(200)
    })
  })

  describe('getWeakWords', () => {
    it('returns words with mastery below 0.5', () => {
      const store = useProgressStore.getState()
      store.recordAnswer(PAKET_ID, 'Abolisi', true)
      store.recordAnswer(PAKET_ID, 'Abolisi', true)
      store.recordAnswer(PAKET_ID, 'Abolisi', true)
      store.recordAnswer(PAKET_ID, 'Abolisi', true)
      store.recordAnswer(PAKET_ID, 'Abrasi', false)
      store.recordAnswer(PAKET_ID, 'Absurd', false)
      store.recordAnswer(PAKET_ID, 'Absurd', false)

      const weak = useProgressStore.getState().getWeakWords(PAKET_ID)
      expect(weak.length).toBe(2)
      expect(weak.find(w => w.kata === 'Abrasi')).toBeTruthy()
      expect(weak.find(w => w.kata === 'Absurd')).toBeTruthy()
      expect(weak.find(w => w.kata === 'Abolisi')).toBeFalsy()
    })

    it('returns empty array for unknown paket', () => {
      const weak = useProgressStore.getState().getWeakWords('unknown')
      expect(weak).toEqual([])
    })
  })

  describe('getMastery', () => {
    it('returns 0 for unknown paket', () => {
      expect(useProgressStore.getState().getMastery('unknown')).toBe(0)
    })

    it('returns 0 for paket with no words', () => {
      useProgressStore.getState()._ensure(PAKET_ID)
      expect(useProgressStore.getState().getMastery(PAKET_ID)).toBe(0)
    })

    it('returns average mastery across all words', () => {
      const store = useProgressStore.getState()
      store.recordAnswer(PAKET_ID, 'Abolisi', true)
      store.recordAnswer(PAKET_ID, 'Abrasi', false)

      const mastery = useProgressStore.getState().getMastery(PAKET_ID)
      const ws = useProgressStore.getState().pakets[PAKET_ID].wordStats
      const expected =
        (ws['Abolisi'].mastery + ws['Abrasi'].mastery) / 2
      expect(mastery).toBe(expected)
    })
  })

  describe('completeSession', () => {
    it('increments sessionsCompleted', () => {
      useProgressStore.getState().completeSession(PAKET_ID)
      expect(
        useProgressStore.getState().pakets[PAKET_ID].sessionsCompleted
      ).toBe(1)

      useProgressStore.getState().completeSession(PAKET_ID)
      expect(
        useProgressStore.getState().pakets[PAKET_ID].sessionsCompleted
      ).toBe(2)
    })

    it('sets lastSession date', () => {
      useProgressStore.getState().completeSession(PAKET_ID)
      expect(
        useProgressStore.getState().pakets[PAKET_ID].lastSession
      ).toBeTruthy()
    })
  })
})
