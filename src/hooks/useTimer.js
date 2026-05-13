import { useState, useRef, useCallback } from 'react'

export default function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  const start = useCallback(() => {
    if (ref.current) return
    ref.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    clearInterval(ref.current)
    ref.current = null
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(ref.current)
    ref.current = null
    setSeconds(0)
    setRunning(false)
  }, [])

  return { seconds, running, start, pause, reset }
}