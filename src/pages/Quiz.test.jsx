import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Quiz from './Quiz'

vi.mock('../hooks/useTimer', () => ({
  default: () => ({
    remaining: 20,
    running: false,
    start: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn(),
  }),
}))

vi.mock('../stores/useProgressStore', () => ({
  default: Object.assign(
    vi.fn((selector) => {
      const state = {
        recordAnswer: vi.fn(),
        updateQuizHighScore: vi.fn(),
        quizHighScore: {
          sinonim: { score: 0, level: 0, streak: 0 },
          antonim: { score: 0, level: 0, streak: 0 },
        },
      }
      return selector ? selector(state) : state
    }),
    { getState: vi.fn(), setState: vi.fn(), subscribe: vi.fn() }
  ),
}))

describe('Quiz', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders package picker in pick phase', () => {
    render(<Quiz />)
    expect(screen.getByText('Pilih Paket')).toBeInTheDocument()
    expect(screen.getByText(/Pilih paket/)).toBeInTheDocument()
  })

  it('shows at least one package option', () => {
    render(<Quiz />)
    expect(screen.getAllByText('Paket 1').length).toBeGreaterThanOrEqual(1)
  })
})
