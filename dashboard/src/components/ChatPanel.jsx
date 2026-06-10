import { motion, AnimatePresence } from 'framer-motion'
import VoiceVisualizer from './VoiceVisualizer'

const INITIAL_CONVOS = [
  { id: 1, time: '09:41', text: 'Morning brief complete. 7 tasks pending, markets stable.', type: 'brief' },
  { id: 2, time: '09:15', text: 'Quantum encryption protocols updated. Security: S-Tier.', type: 'security' },
  { id: 3, time: '08:52', text: 'Anomalies detected in sector 7-G. Patched and logged.', type: 'alert' },
  { id: 4, time: '08:30', text: 'All power grid systems calibrated. Efficiency: 94%.', type: 'system' },
  { id: 5, time: 'Yesterday', text: 'Full diagnostics complete. Zero critical failures.', type: 'system' },
]

const typeColors = {
  brief: 'var(--cyan)',
  security: 'var(--green)',
  alert: 'var(--orange)',
  system: 'var(--text3)',
}

export default function ChatPanel({ conversations = INITIAL_CONVOS, speaking, loading, onSelectConvo }) {
  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      style={{
        width: '28%',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--panel)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Panel header */}
      <div style={{
        padding: '13px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative',
      }}>
        <span className="section-label">Audio Interface</span>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          padding: '2px 8px', borderRadius: 10,
          border: '1px solid var(--border-bright)',
          color: 'var(--text3)', letterSpacing: 1,
        }}>LIVE</span>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent)',
        }} />
      </div>

      {/* Voice visualizer */}
      <VoiceVisualizer speaking={speaking} loading={loading} />

      {/* Command history header */}
      <div style={{
        padding: '13px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span className="section-label">Command History</span>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 9,
          padding: '2px 8px', borderRadius: 10,
          border: '1px solid var(--border)',
          color: 'var(--text3)', letterSpacing: 1,
        }}>{conversations.length} LOG</span>
      </div>

      {/* Conversation list */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 12px', minHeight: 0,
      }}>
        <AnimatePresence initial={false}>
          {conversations.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => onSelectConvo?.(c.text)}
              style={{
                padding: '9px 11px',
                borderRadius: 5,
                border: '1px solid var(--border)',
                background: 'rgba(0,20,38,0.5)',
                marginBottom: 7,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              whileHover={{
                borderColor: 'rgba(0,212,255,0.3)',
                backgroundColor: 'rgba(0,212,255,0.04)',
              }}
            >
              {/* Left accent bar */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
                  background: typeColors[c.type] || 'var(--cyan)',
                  borderRadius: '2px 0 0 2px',
                }}
              />
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: 9,
                color: typeColors[c.type] || 'var(--text3)',
                letterSpacing: 1, marginBottom: 4,
              }}>{c.time}</div>
              <div style={{
                fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{c.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom status */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border)',
        fontFamily: 'JetBrains Mono', fontSize: 9,
        color: 'var(--text3)', letterSpacing: 1,
      }}>
        <span style={{ color: 'var(--green)' }}>●</span> SESSION ACTIVE &nbsp;·&nbsp; ENCRYPTED
      </div>
    </motion.div>
  )
}
