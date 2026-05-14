import { useState, useRef, useCallback, useEffect } from 'react'

export default function useTimer(initialSeconds = 30, onTimeout) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    setRemaining(initialSeconds)
  }, [initialSeconds])

  const start = useCallback(() => {
    if (ref.current) return
    ref.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(ref.current)
          ref.current = null
          setRunning(false)
          onTimeoutRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    clearInterval(ref.current)
    ref.current = null
    setRunning(false)
  }, [])

  const reset = useCallback((newSeconds) => {
    clearInterval(ref.current)
    ref.current = null
    setRemaining(newSeconds ?? initialSeconds)
    setRunning(false)
  }, [initialSeconds])

  return { remaining, running, start, pause, reset }
}
