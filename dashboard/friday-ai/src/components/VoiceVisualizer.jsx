import { motion } from 'framer-motion';
import { useWaveform } from '../hooks/useAnimation';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceVisualizer({ isActive, onToggle }) {
  const bars = useWaveform(isActive, 40);

  return (
    <div className="flex flex-col gap-3">
      {/* Waveform */}
      <div className="relative h-20 flex items-center justify-center gap-px overflow-hidden rounded-lg"
        style={{ background: 'rgba(0,10,30,0.6)', border: '1px solid rgba(0,229,255,0.1)' }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px)',
          backgroundSize: '100% 25%',
        }} />

        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="relative flex-1 rounded-sm"
            style={{
              minWidth: 2,
              maxWidth: 5,
              background: isActive
                ? `linear-gradient(to top, rgba(0,229,255,0.9), rgba(0,180,255,0.6))`
                : `rgba(0,229,255,0.25)`,
              boxShadow: isActive ? `0 0 4px rgba(0,229,255,0.5)` : 'none',
            }}
            animate={{ scaleY: h, originY: 0.5 }}
            transition={{ duration: 0.05, ease: 'linear' }}
            initial={{ scaleY: 0.08 }}
          />
        ))}

        {/* Center line */}
        <div className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: 'rgba(0,229,255,0.1)' }}
        />

        {/* Idle text */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ color: 'rgba(0,180,220,0.3)', fontSize: 11 }}
              className="font-mono tracking-widest uppercase">
              — STANDBY —
            </span>
          </div>
        )}
      </div>

      {/* Mic toggle */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className="stark-btn relative flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-xs tracking-wider uppercase"
        style={{
          background: isActive
            ? 'rgba(0,229,255,0.12)'
            : 'rgba(0,229,255,0.05)',
          border: `1px solid ${isActive ? 'rgba(0,229,255,0.5)' : 'rgba(0,229,255,0.15)'}`,
          color: isActive ? '#00e5ff' : 'rgba(0,180,220,0.6)',
          boxShadow: isActive ? '0 0 15px rgba(0,229,255,0.2)' : 'none',
        }}
      >
        {isActive ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Mic size={14} />
            </motion.div>
            <span>Voice Active</span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </>
        ) : (
          <>
            <MicOff size={14} />
            <span>Activate Voice</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
