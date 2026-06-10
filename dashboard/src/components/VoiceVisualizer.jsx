import { useRef, useEffect } from 'react'
import { useInterval } from '../hooks/useAnimation'

export default function VoiceVisualizer({ speaking = false, loading = false }) {
  const barsRef = useRef([])
  const containerRef = useRef(null)
  const NUM_BARS = 28

  // Initialize bar heights
  useEffect(() => {
    barsRef.current = Array.from({ length: NUM_BARS }, () => ({
      h: Math.random() * 15 + 5,
      target: 10,
      speed: Math.random() * 0.15 + 0.08,
    }))
  }, [])

  useInterval(() => {
    if (!containerRef.current) return
    const bars = containerRef.current.querySelectorAll('.vbar')
    barsRef.current.forEach((b, i) => {
      if (speaking || loading) {
        // Animate actively
        const center = NUM_BARS / 2
        const distFromCenter = Math.abs(i - center) / center
        const maxH = speaking
          ? (80 + Math.random() * 20) * (1 - distFromCenter * 0.4)
          : (40 + Math.random() * 30) * (1 - distFromCenter * 0.5)
        b.target = Math.random() * maxH + 5
      } else {
        // Idle — gentle minimal movement
        b.target = Math.random() * 18 + 4
      }
      b.h += (b.target - b.h) * b.speed
      if (bars[i]) {
        bars[i].style.height = `${b.h}%`
        const opacity = speaking ? 0.5 + (b.h / 100) * 0.5 : 0.25 + (b.h / 100) * 0.3
        bars[i].style.opacity = opacity
        const hue = speaking ? `rgba(0,212,255,${opacity})` : `rgba(0,168,204,${opacity})`
        bars[i].style.background = hue
        if (speaking) {
          bars[i].style.boxShadow = `0 0 ${Math.round(b.h / 15)}px rgba(0,212,255,0.5)`
        } else {
          bars[i].style.boxShadow = 'none'
        }
      }
    })
  }, 80)

  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="section-label">Voice Waveform</span>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: speaking ? 'var(--cyan)' : loading ? 'var(--orange)' : '#334',
          boxShadow: speaking ? '0 0 8px var(--cyan)' : loading ? '0 0 6px var(--orange)' : 'none',
          transition: 'all 0.3s',
          display: 'inline-block',
        }} />
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1,
          color: speaking ? 'var(--cyan)' : 'var(--text3)', transition: 'color 0.3s',
        }}>
          {speaking ? 'TRANSMITTING' : loading ? 'PROCESSING' : 'STANDBY'}
        </span>
      </div>

      {/* Waveform bars */}
      <div
        ref={containerRef}
        style={{
          display: 'flex', alignItems: 'center', gap: 3,
          height: 56, padding: '0 4px',
        }}
      >
        {Array.from({ length: NUM_BARS }).map((_, i) => (
          <div
            key={i}
            className="vbar"
            style={{
              width: 3,
              height: '10%',
              borderRadius: 2,
              background: 'rgba(0,168,204,0.3)',
              transition: 'height 0.08s ease, opacity 0.08s ease',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Mic status row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 10,
        fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text3)',
        letterSpacing: 1,
      }}>
        <span style={{ color: speaking ? 'var(--green)' : 'var(--text3)' }}>
          {speaking ? '◉' : '○'}
        </span>
        MIC {speaking ? 'ACTIVE' : 'IDLE'} &nbsp;·&nbsp; SENSITIVITY: HIGH &nbsp;·&nbsp; NOISE FILTER: ON
      </div>
    </div>
  )
}
