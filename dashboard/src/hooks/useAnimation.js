import { useEffect, useRef, useCallback } from 'react'

export function useTypewriter(text, onUpdate, speed = 20) {
  const timerRef = useRef(null)
  const iRef = useRef(0)

  const start = useCallback((str, onDone) => {
    if (timerRef.current) clearInterval(timerRef.current)
    iRef.current = 0
    timerRef.current = setInterval(() => {
      iRef.current++
      onUpdate(str.slice(0, iRef.current))
      if (iRef.current >= str.length) {
        clearInterval(timerRef.current)
        timerRef.current = null
        onDone?.()
      }
    }, speed)
  }, [onUpdate, speed])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => () => stop(), [stop])

  return { start, stop }
}

export function useAnimationFrame(callback, active = true) {
  const rafRef = useRef(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    let t = 0
    const loop = (ts) => {
      t = ts
      callbackRef.current(ts)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active])
}

export function useInterval(callback, delay) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => callbackRef.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
