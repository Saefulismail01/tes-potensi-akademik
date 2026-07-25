import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useTimer from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with given initial seconds', () => {
    const { result } = renderHook(() => useTimer(20))
    expect(result.current.remaining).toBe(20)
    expect(result.current.running).toBe(false)
  })

  it('starts counting down when start() is called', () => {
    const { result } = renderHook(() => useTimer(10))
    act(() => result.current.start())
    expect(result.current.running).toBe(true)

    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.remaining).toBe(7)
  })

  it('pauses the timer', () => {
    const { result } = renderHook(() => useTimer(10))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(3000))
    act(() => result.current.pause())

    expect(result.current.running).toBe(false)
    expect(result.current.remaining).toBe(7)

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.remaining).toBe(7)
  })

  it('resets the timer to initial seconds', () => {
    const { result } = renderHook(() => useTimer(15))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.reset())

    expect(result.current.remaining).toBe(15)
    expect(result.current.running).toBe(false)
  })

  it('resets to custom seconds when provided', () => {
    const { result } = renderHook(() => useTimer(15))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.reset(10))

    expect(result.current.remaining).toBe(10)
    expect(result.current.running).toBe(false)
  })

  it('calls onTimeout when timer reaches 0', () => {
    const onTimeout = vi.fn()
    const { result } = renderHook(() => useTimer(5, onTimeout))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))

    expect(onTimeout).toHaveBeenCalledTimes(1)
    expect(result.current.remaining).toBe(0)
    expect(result.current.running).toBe(false)
  })

  it('does not start a second interval if already running', () => {
    const { result } = renderHook(() => useTimer(10))
    act(() => result.current.start())
    act(() => result.current.start())

    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.remaining).toBe(7)
  })

  it('updates remaining when initialSeconds changes', () => {
    const { result, rerender } = renderHook(({ seconds }) => useTimer(seconds), {
      initialProps: { seconds: 20 },
    })
    expect(result.current.remaining).toBe(20)

    rerender({ seconds: 10 })
    expect(result.current.remaining).toBe(10)
  })
})
