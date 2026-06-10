import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArcReactor from './ArcReactor'
import { useAnimationFrame } from '../hooks/useAnimation'

// 3D Wireframe sphere on canvas
function WireframeSphere({ size = 180, speaking }) {
  const canvasRef = useRef(null)
  const tRef = useRef(0)

  useEffect(() => {
    const c = canvasRef.current
    if (c) { c.width = size; c.height = size }
  }, [size])

  useAnimationFrame((ts) => {
    tRef.current = ts * 0.0004
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const t = tRef.current
    const cx = size / 2, cy = size / 2, R = size * 0.44
    ctx.clearRect(0, 0, size, size)

    const project = (x, y, z) => {
      // Simple orthographic with slight perspective
      const fov = 1.8
      const d = fov / (fov + z / R)
      return { x: cx + x * d, y: cy + y * d, z }
    }

    const rotY = t
    const rotX = t * 0.4

    const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX)

    const rotate = (x, y, z) => {
      // Rotate around Y
      let x1 = x * cosY + z * sinY
      let z1 = -x * sinY + z * cosY
      // Rotate around X
      let y1 = y * cosX - z1 * sinX
      let z2 = y * sinX + z1 * cosX
      return { x: x1, y: y1, z: z2 }
    }

    const LATS = 10, LONS = 14
    const spk = speaking ? 1.2 : 1

    // Draw latitude circles
    for (let i = 1; i < LATS; i++) {
      const phi = (Math.PI * i) / LATS - Math.PI / 2
      const pts = []
      for (let j = 0; j <= LONS * 2; j++) {
        const theta = (Math.PI * 2 * j) / (LONS * 2)
        const x = R * Math.cos(phi) * Math.cos(theta)
        const y = R * Math.sin(phi)
        const z = R * Math.cos(phi) * Math.sin(theta)
        const rot = rotate(x, y, z)
        pts.push(project(rot.x, rot.y, rot.z))
      }
      ctx.beginPath()
      pts.forEach((p, idx) => idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      const brightness = 0.12 + 0.08 * Math.sin(t * 2 + i) * spk
      ctx.strokeStyle = `rgba(0,212,255,${brightness})`
      ctx.lineWidth = 0.7
      ctx.stroke()
    }

    // Draw longitude circles
    for (let j = 0; j < LONS; j++) {
      const theta = (Math.PI * 2 * j) / LONS
      const pts = []
      for (let i = 0; i <= LATS * 2; i++) {
        const phi = (Math.PI * i) / (LATS * 2) - Math.PI / 2
        const x = R * Math.cos(phi) * Math.cos(theta)
        const y = R * Math.sin(phi)
        const z = R * Math.cos(phi) * Math.sin(theta)
        const rot = rotate(x, y, z)
        pts.push(project(rot.x, rot.y, rot.z))
      }
      ctx.beginPath()
      pts.forEach((p, idx) => idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      const brightness = 0.1 + 0.07 * Math.sin(t * 1.5 + j) * spk
      ctx.strokeStyle = `rgba(0,180,255,${brightness})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    }

    // Equatorial highlight ring
    ctx.beginPath()
    for (let j = 0; j <= 80; j++) {
      const theta = (Math.PI * 2 * j) / 80
      const x = R * Math.cos(theta), y = 0, z = R * Math.sin(theta)
      const rot = rotate(x, y, z)
      const p = project(rot.x, rot.y, rot.z)
      j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    }
    const highlightBrightness = 0.3 + 0.15 * Math.sin(t * 2)
    ctx.strokeStyle = `rgba(0,212,255,${highlightBrightness * spk})`
    ctx.lineWidth = 1.2
    ctx.stroke()
  })

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block', opacity: 0.8 }} />
}

export default function HolographicDisplay({
  displayText,
  loading,
  speaking,
  inputVal,
  onInputChange,
  onSubmit,
}) {
  const textRef = useRef(null)

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight
    }
  }, [displayText])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 16px',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035,
        backgroundImage: `linear-gradient(rgba(0,212,255,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)`,
        backgroundSize: '36px 36px',
      }} />

      {/* Holographic rings (ambient) */}
      {[340, 280, 235].map((d, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: d, height: d,
            borderRadius: '50%',
            border: `1px solid rgba(0,212,255,${0.07 + i * 0.03})`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Top: Sphere + Reactor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexShrink: 0, marginTop: 8 }}>
        <WireframeSphere size={170} speaking={speaking} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <ArcReactor speaking={speaking} size={210} />
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 3,
            color: 'var(--cyan)', opacity: 0.55,
          }}>
            ARC REACTOR — {speaking ? 'ACTIVE' : 'NOMINAL'}
          </span>
        </div>
      </div>

      {/* Response output */}
      <div style={{
        width: '100%',
        flex: 1,
        minHeight: 0,
        margin: '14px 0 10px',
        padding: '14px 18px',
        background: 'rgba(0,10,22,0.85)',
        border: '1px solid var(--border-bright)',
        borderRadius: 6,
        backdropFilter: 'blur(16px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top shimmer line */}
        <motion.div
          animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
          style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
            transformOrigin: 'left',
          }}
        />

        <div className="section-label" style={{ marginBottom: 8 }}>▸ FRIDAY OUTPUT</div>

        <div
          ref={textRef}
          style={{
            fontFamily: 'JetBrains Mono', fontSize: 12.5, color: 'var(--text)',
            lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            overflowY: 'auto', maxHeight: 'calc(100% - 36px)',
            paddingRight: 4,
          }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: 'var(--text3)' }}
              >
                <span style={{
                  display: 'inline-block', width: 14, height: 14,
                  border: '2px solid rgba(0,212,255,0.2)',
                  borderTopColor: 'var(--cyan)',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  marginRight: 8, verticalAlign: 'middle',
                }} />
                Processing neural query...
              </motion.span>
            ) : displayText ? (
              <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {displayText}
                {speaking && <span className="cursor-blink" />}
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: 'var(--text3)' }}
              >
                {'// Systems initialized. Awaiting command...\n// Type below or use a quick action.'}
                <span className="cursor-blink" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Command input */}
      <div style={{ width: '100%', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--cyan)',
            pointerEvents: 'none', zIndex: 1,
          }}>▸</span>
          <input
            className="holo-input"
            type="text"
            value={inputVal}
            onChange={(e) => onInputChange?.(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Enter command or query..."
            disabled={loading}
          />
        </div>
        <motion.button
          className="holo-btn primary"
          onClick={onSubmit}
          disabled={loading || !inputVal?.trim()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ flexShrink: 0, padding: '11px 22px', fontSize: 10 }}
        >
          {loading ? 'PROCESSING' : 'EXECUTE'}
        </motion.button>
      </div>

      {/* CSS for spin */}
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
    </motion.div>
  )
}
