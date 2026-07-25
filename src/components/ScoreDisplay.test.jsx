import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreDisplay from './ScoreDisplay'

describe('ScoreDisplay', () => {
  it('renders benar, salah, total, and waktu', () => {
    render(<ScoreDisplay benar={8} salah={2} total={10} waktu="5:30" />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5:30')).toBeInTheDocument()
  })

  it('renders all zero values', () => {
    render(<ScoreDisplay benar={0} salah={0} total={0} waktu="0:00" />)
    expect(screen.getAllByText('0')).toHaveLength(3)
    expect(screen.getByText('0:00')).toBeInTheDocument()
  })

  it('renders labels for each stat', () => {
    render(<ScoreDisplay benar={5} salah={3} total={8} waktu="2:15" />)
    expect(screen.getByText('Benar')).toBeInTheDocument()
    expect(screen.getByText('Salah')).toBeInTheDocument()
    expect(screen.getByText('Total Soal')).toBeInTheDocument()
    expect(screen.getByText('Waktu')).toBeInTheDocument()
  })
})
