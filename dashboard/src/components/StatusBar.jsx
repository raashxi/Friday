import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function PulsingDot({ color, glowColor, size = 8 }) {
  return (
    <motion.div
      animate={{ opacity: [1, 0.4, 1], scale: [1, 0.85, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size + 2}px ${glowColor}`,
        flexShrink: 0,
      }}
    />
  )
}

export function TopBar() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const n = new Date()
      const h = String(n.getHours()).padStart(2, '0')
      const m = String(n.getMinutes()).padStart(2, '0')
      const s = String(n.getSeconds()).padStart(2, '0')
      setTime(`${h}:${m}:${s}`)
      setDate(n.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      }).toUpperCase())
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{
        height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
        background: 'rgba(0,10,20,0.92)',
        borderBottom: '1px solid var(--border-bright)',
        backdropFilter: 'blur(24px)',
        flexShrink: 0, zIndex: 10, position: 'relative',
      }}
    >
      {/* Bottom accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)',
      }} />

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700,
        letterSpacing: 5, color: 'var(--cyan)',
        textShadow: '0 0 20px rgba(0,212,255,0.5)',
        userSelect: 'none',
      }}>
        <PulsingDot color="var(--green)" glowColor="rgba(0,255,136,0.6)" size={9} />
        FRIDAY
      </div>

      {/* Center: time */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 300,
          color: 'var(--cyan)', letterSpacing: 3,
          textShadow: '0 0 20px rgba(0,212,255,0.4)',
        }}>{time}</div>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          color: 'var(--text3)', letterSpacing: 2.5, marginTop: 1,
        }}>{date}</div>
      </div>

      {/* Status chips */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { dot: { color: 'var(--green)', glow: 'rgba(0,255,136,0.6)' }, label: 'SYSTEMS ONLINE' },
          { dot: { color: 'var(--cyan)', glow: 'rgba(0,212,255,0.6)' }, label: 'AI CORE ACTIVE' },
          { dot: { color: 'var(--orange)', glow: 'rgba(255,102,0,0.6)' }, label: 'POWER 94%' },
        ].map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
            border: '1px solid var(--border-bright)',
            background: 'rgba(0,212,255,0.04)',
            fontFamily: 'JetBrains Mono', fontSize: 9.5,
            color: 'var(--text2)', letterSpacing: 1,
          }}>
            <PulsingDot color={c.dot.color} glowColor={c.dot.glow} size={6} />
            {c.label}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function BottomBar({ onBrief, onMemory, onClear, loading }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      style={{
        height: 54, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
        background: 'rgba(0,10,20,0.92)',
        borderTop: '1px solid var(--border-bright)',
        backdropFilter: 'blur(24px)',
        flexShrink: 0, zIndex: 10, position: 'relative',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent)',
      }} />

      {/* Hint */}
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 9.5,
        color: 'var(--text3)', letterSpacing: 2,
      }}>
        ⌘ TAP RIGHT TO SPEAK &nbsp;&nbsp;·&nbsp;&nbsp; HOLD FOR CONTINUOUS INPUT
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { label: '☀ MORNING BRIEF', action: onBrief },
          { label: '⬡ MEMORY VAULT', action: onMemory },
          { label: '⊘ CLEAR', action: onClear },
        ].map((btn, i) => (
          <motion.button
            key={i}
            className="holo-btn"
            onClick={btn.action}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      {/* Right: version */}
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 9,
        color: 'var(--text3)', letterSpacing: 1, textAlign: 'right',
        lineHeight: 1.7,
      }}>
        FRIDAY v4.1.0 // STARK INDUSTRIES<br />
        <span style={{ color: 'var(--green)' }}>● ALL SYSTEMS NOMINAL</span>
      </div>
    </motion.div>
  )
}
