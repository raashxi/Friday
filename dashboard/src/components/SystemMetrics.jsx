import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInterval, useAnimationFrame } from '../hooks/useAnimation'

const MODULES = [
  { icon: '🧠', name: 'NEURAL CORE', status: 'active' },
  { icon: '🔒', name: 'ENCRYPTION', status: 'active' },
  { icon: '📡', name: 'SENSOR ARRAY', status: 'active' },
  { icon: '⚡', name: 'POWER GRID', status: 'warn' },
  { icon: '🌐', name: 'NETWORK HUB', status: 'active' },
  { icon: '🎯', name: 'TARGETING SYS', status: 'standby' },
  { icon: '💾', name: 'MEMORY VAULT', status: 'active' },
  { icon: '🔬', name: 'ANALYSIS AI', status: 'standby' },
]

const statusStyle = {
  active: { bg: 'rgba(0,255,136,0.08)', color: 'var(--green)', border: 'rgba(0,255,136,0.2)' },
  standby: { bg: 'rgba(0,212,255,0.06)', color: 'var(--cyan-dark)', border: 'rgba(0,212,255,0.12)' },
  warn: { bg: 'rgba(255,102,0,0.08)', color: 'var(--orange)', border: 'rgba(255,102,0,0.2)' },
}

function MetricRow({ label, valueId, barId, initialPct, initialVal }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 10,
          color: 'var(--text2)', letterSpacing: 1,
        }}>{label}</span>
        <span id={valueId} style={{
          fontFamily: 'JetBrains Mono', fontSize: 12,
          color: 'var(--cyan)', fontWeight: 500,
        }}>{initialVal}</span>
      </div>
      <div className="metric-bar-track">
        <div id={barId} className="metric-bar-fill" style={{ width: `${initialPct}%` }} />
      </div>
    </div>
  )
}

// Mini graph canvas
function MiniGraph({ id }) {
  const canvasRef = useRef(null)
  const histRef = useRef([])
  const tRef = useRef(0)

  // Seed history
  useEffect(() => {
    histRef.current = Array.from({ length: 40 }, () => 40 + Math.random() * 40)
    const c = canvasRef.current
    if (c) { c.width = c.offsetWidth || 220; c.height = 72 }
  }, [])

  useInterval(() => {
    const last = histRef.current[histRef.current.length - 1] || 60
    const next = Math.min(98, Math.max(8, last + (Math.random() - 0.48) * 10))
    histRef.current.push(next)
    if (histRef.current.length > 48) histRef.current.shift()
    draw()
  }, 1100)

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width, h = canvas.height
    const data = histRef.current
    ctx.clearRect(0, 0, w, h)
    if (data.length < 2) return

    const step = w / (data.length - 1)

    // Grid
    for (let i = 1; i < 4; i++) {
      const y = (h / 4) * i
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y)
      ctx.strokeStyle = 'rgba(0,212,255,0.06)'; ctx.lineWidth = 0.5; ctx.stroke()
    }

    // Area
    ctx.beginPath()
    data.forEach((v, i) => {
      const x = i * step, y = h - (v / 100) * h * 0.88
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath()
    const gr = ctx.createLinearGradient(0, 0, 0, h)
    gr.addColorStop(0, 'rgba(0,212,255,0.22)')
    gr.addColorStop(1, 'rgba(0,212,255,0)')
    ctx.fillStyle = gr; ctx.fill()

    // Line
    ctx.beginPath()
    data.forEach((v, i) => {
      const x = i * step, y = h - (v / 100) * h * 0.88
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = 'rgba(0,212,255,0.75)'; ctx.lineWidth = 1.5; ctx.stroke()

    // Live dot
    const last = data[data.length - 1]
    const lx = (data.length - 1) * step
    const ly = h - (last / 100) * h * 0.88
    ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,212,255,0.9)'; ctx.fill()
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 72, display: 'block' }}
    />
  )
}

export default function SystemMetrics() {
  // Live metric updates
  const metricsRef = useRef({ cpu: 72, ram: 61, gpu: 83, lat: 48 })

  useInterval(() => {
    const m = metricsRef.current
    m.cpu = Math.min(99, Math.max(8, m.cpu + (Math.random() - 0.48) * 8))
    m.ram = Math.min(95, Math.max(28, m.ram + (Math.random() - 0.5) * 3))
    m.gpu = Math.min(99, Math.max(35, m.gpu + (Math.random() - 0.48) * 5))
    m.lat = Math.min(200, Math.max(10, m.lat + (Math.random() - 0.5) * 14))

    const set = (id, val, bar, pct) => {
      const el = document.getElementById(id)
      const b = document.getElementById(bar)
      if (el) el.textContent = val
      if (b) b.style.width = pct + '%'
    }
    set('m-cpu-val', `${Math.round(m.cpu)}%`, 'm-cpu-bar', m.cpu)
    set('m-ram-val', `${Math.round(m.ram)}%`, 'm-ram-bar', m.ram)
    set('m-gpu-val', `${Math.round(m.gpu)}%`, 'm-gpu-bar', m.gpu)
    set('m-lat-val', `${Math.round(m.lat)}ms`, 'm-lat-bar', Math.min(100, m.lat / 2))
  }, 1200)

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      style={{
        width: '28%',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--panel)',
        backdropFilter: 'blur(20px)',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '13px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative',
      }}>
        <span className="section-label">System Telemetry</span>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          padding: '2px 8px', borderRadius: 10,
          border: '1px solid var(--border-bright)',
          color: 'var(--text3)', letterSpacing: 1,
        }}>LIVE</span>
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent)',
        }} />
      </div>

      {/* Metrics */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <MetricRow label="CPU LOAD" valueId="m-cpu-val" barId="m-cpu-bar" initialPct={72} initialVal="72%" />
        <MetricRow label="RAM USAGE" valueId="m-ram-val" barId="m-ram-bar" initialPct={61} initialVal="61%" />
        <MetricRow label="GPU UTIL" valueId="m-gpu-val" barId="m-gpu-bar" initialPct={83} initialVal="83%" />
        <MetricRow label="MODEL LATENCY" valueId="m-lat-val" barId="m-lat-bar" initialPct={24} initialVal="48ms" />
      </div>

      {/* Graph */}
      <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="section-label">CPU History</span>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--cyan)', opacity: 0.7,
          }}>60s WINDOW</span>
        </div>
        <MiniGraph id="cpu-graph" />
      </div>

      {/* Modules header */}
      <div style={{
        padding: '13px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span className="section-label">Active Modules</span>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          padding: '2px 8px', borderRadius: 10,
          border: '1px solid var(--border)',
          color: 'var(--text3)', letterSpacing: 1,
        }}>8 LOADED</span>
      </div>

      {/* Module list */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 12px', minHeight: 0,
      }}>
        {MODULES.map((m, i) => {
          const s = statusStyle[m.status]
          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
              whileHover={{ borderColor: 'rgba(0,212,255,0.25)', backgroundColor: 'rgba(0,212,255,0.04)' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 10px', borderRadius: 5,
                border: '1px solid var(--border)',
                background: 'rgba(0,20,38,0.4)',
                marginBottom: 6,
                cursor: 'default',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 4,
                background: 'rgba(0,212,255,0.07)',
                border: '1px solid var(--border-bright)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, flexShrink: 0,
              }}>{m.icon}</div>
              <span style={{
                fontFamily: 'JetBrains Mono', fontSize: 9.5,
                color: 'var(--text2)', flex: 1, letterSpacing: 0.5,
              }}>{m.name}</span>
              <span style={{
                fontFamily: 'JetBrains Mono', fontSize: 8,
                padding: '2px 7px', borderRadius: 8, letterSpacing: 0.5,
                background: s.bg, color: s.color, border: `1px solid ${s.border}`,
              }}>{m.status.toUpperCase()}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom status */}
      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--border)',
        fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text3)', letterSpacing: 1,
      }}>
        UPTIME 99.97% &nbsp;·&nbsp; <span style={{ color: 'var(--green)' }}>● 0 FAULTS</span>
      </div>
    </motion.div>
  )
}
