import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Timer from './Timer'

describe('Timer', () => {
  it('renders remaining time in MM:SS format', () => {
    render(<Timer remaining={125} running={false} />)
    expect(screen.getByText('02:05')).toBeInTheDocument()
  })

  it('renders 00:00 when remaining is 0', () => {
    render(<Timer remaining={0} running={false} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('renders negative remaining as 00:00', () => {
    render(<Timer remaining={-5} running={false} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('renders single-digit seconds with leading zero', () => {
    render(<Timer remaining={5} running={false} />)
    expect(screen.getByText('00:05')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Timer remaining={30} running={false} className="custom-class" />
    )
    const span = container.firstChild
    expect(span.className).toContain('custom-class')
  })
})
