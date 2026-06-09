import { motion } from 'framer-motion';
import { useTime } from '../hooks/useAnimation';
import { Wifi, Shield, Database, Zap, Command } from 'lucide-react';

export function TopBar({ systemStatus }) {
  const time = useTime();

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  }).toUpperCase();
  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  return (
    <div className="flex items-center justify-between px-5 py-2 relative"
      style={{
        background: 'rgba(4, 10, 25, 0.95)',
        borderBottom: '1px solid rgba(0,229,255,0.12)',
        boxShadow: '0 1px 0 rgba(0,229,255,0.05), 0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Left – Logo */}
      <div className="flex items-center gap-3">
        {/* Arc reactor mini icon */}
        <div className="relative w-7 h-7">
          <svg viewBox="0 0 28 28" className="w-full h-full">
            <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(0,229,255,0.3)" strokeWidth="1" />
            <circle cx="14" cy="14" r="8" fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth="1"
              strokeDasharray="4 4" style={{ animation: 'spin 4s linear infinite' }} />
            <circle cx="14" cy="14" r="4" fill="rgba(0,229,255,0.15)" stroke="rgba(0,229,255,0.8)" strokeWidth="1" />
            <circle cx="14" cy="14" r="2.5" fill="rgba(0,229,255,0.9)"
              style={{ filter: 'drop-shadow(0 0 3px #00e5ff)' }} />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono font-semibold tracking-[0.25em] uppercase"
              style={{ color: '#00e5ff', fontSize: 16, textShadow: '0 0 12px rgba(0,229,255,0.6), 0 0 30px rgba(0,229,255,0.2)' }}>
              FRIDAY
            </h1>
            <span className="font-mono"
              style={{ color: 'rgba(0,180,220,0.4)', fontSize: 10, marginTop: 1 }}>
              v4.2.1
            </span>
          </div>
          <div style={{ color: 'rgba(0,150,200,0.45)', fontSize: 8.5 }} className="font-mono uppercase tracking-widest">
            Female Replacement Intelligence Digital Yearbook Avatar
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ color: '#22c55e', fontSize: 9 }} className="font-mono uppercase tracking-wider">
            Online
          </span>
        </div>
      </div>

      {/* Center – decorative circuit trace */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
        {['STARK-NET', 'SECURE-CHANNEL', 'AI-CORE'].map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            {i > 0 && <div className="w-4 h-px" style={{ background: 'rgba(0,229,255,0.15)' }} />}
            <div className="px-2 py-0.5 rounded"
              style={{ background: 'rgba(0,20,50,0.8)', border: '1px solid rgba(0,229,255,0.1)' }}
            >
              <span style={{ color: 'rgba(0,180,220,0.4)', fontSize: 8 }} className="font-mono uppercase tracking-widest">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Right – time & stats */}
      <div className="flex items-center gap-4">
        {/* Mini stats */}
        <div className="flex items-center gap-3">
          {[
            { icon: Wifi, label: 'NET', val: '1Gbps', color: '#22c55e' },
            { icon: Shield, label: 'SEC', val: 'MAX', color: '#00e5ff' },
            { icon: Database, label: 'SYNC', val: '100%', color: '#00e5ff' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="flex items-center gap-1">
              <Icon size={10} style={{ color }} />
              <span style={{ color: 'rgba(140,200,220,0.45)', fontSize: 9 }} className="font-mono">
                {label}:
              </span>
              <span style={{ color, fontSize: 9 }} className="font-mono">{val}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5" style={{ background: 'rgba(0,229,255,0.1)' }} />

        {/* Time */}
        <div className="text-right">
          <div style={{ color: '#00e5ff', fontSize: 14 }} className="font-mono font-medium tracking-widest">
            {timeStr}
          </div>
          <div style={{ color: 'rgba(0,180,220,0.4)', fontSize: 8.5 }} className="font-mono">
            {dateStr}
          </div>
        </div>

        {/* Stark Industries badge */}
        <div className="px-2.5 py-1 rounded"
          style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}
        >
          <span style={{ color: 'rgba(0,180,220,0.5)', fontSize: 8 }} className="font-mono uppercase tracking-widest">
            STARK INDUSTRIES
          </span>
        </div>
      </div>
    </div>
  );
}

export function BottomBar({ onBrief, onMemory, loading, voiceActive }) {
  return (
    <div className="flex items-center justify-between px-5 py-2"
      style={{
        background: 'rgba(4, 10, 25, 0.95)',
        borderTop: '1px solid rgba(0,229,255,0.12)',
        boxShadow: '0 -1px 0 rgba(0,229,255,0.05)',
      }}
    >
      {/* Left – keyboard hint */}
      <div className="flex items-center gap-2">
        <kbd className="px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)', color: 'rgba(0,180,220,0.6)', fontSize: 10, fontFamily: 'JetBrains Mono' }}>
          ⌘
        </kbd>
        <span style={{ color: 'rgba(0,180,220,0.4)', fontSize: 10 }} className="font-mono">
          SPEAK
        </span>
        <div className="w-px h-3 mx-1" style={{ background: 'rgba(0,229,255,0.1)' }} />
        <kbd className="px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)', color: 'rgba(0,180,220,0.6)', fontSize: 10, fontFamily: 'JetBrains Mono' }}>
          ↵
        </kbd>
        <span style={{ color: 'rgba(0,180,220,0.4)', fontSize: 10 }} className="font-mono">
          SEND
        </span>
      </div>

      {/* Center – voice indicator */}
      <div className="flex items-center gap-3">
        {voiceActive ? (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: '#00e5ff' }}
                animate={{
                  height: [3, Math.random() * 16 + 4, 3],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.4 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
            <span style={{ color: '#00e5ff', fontSize: 10 }} className="font-mono ml-1 uppercase tracking-widest">
              Listening
            </span>
          </div>
        ) : (
          <span style={{ color: 'rgba(0,180,220,0.3)', fontSize: 10 }} className="font-mono uppercase tracking-widest">
            — Voice Standby —
          </span>
        )}
      </div>

      {/* Right – quick actions */}
      <div className="flex items-center gap-2">
        {[
          { label: 'Morning Brief', onClick: onBrief, icon: Zap },
          { label: 'Memory', onClick: onMemory, icon: Database },
        ].map(({ label, onClick, icon: Icon }) => (
          <motion.button
            key={label}
            onClick={onClick}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="stark-btn flex items-center gap-1.5 px-3 py-1.5 rounded"
            style={{
              background: 'rgba(0,229,255,0.06)',
              border: '1px solid rgba(0,229,255,0.15)',
              color: loading ? 'rgba(0,180,220,0.3)' : 'rgba(0,200,240,0.7)',
              fontSize: 10,
              fontFamily: 'JetBrains Mono',
              letterSpacing: '0.05em',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Icon size={10} />
            {label}
          </motion.button>
        ))}

        {/* Stark shield icon */}
        <div className="w-6 h-6 flex items-center justify-center rounded"
          style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.1)' }}
        >
          <Shield size={12} style={{ color: 'rgba(0,180,220,0.4)' }} />
        </div>
      </div>
    </div>
  );
}
