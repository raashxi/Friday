import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Brain, Cpu, BookOpen, AlertTriangle } from 'lucide-react';

import ParticleField from './components/ParticleField';
import VoiceVisualizer from './components/VoiceVisualizer';
import ChatPanel from './components/ChatPanel';
import SystemMetrics from './components/SystemMetrics';
import HolographicDisplay from './components/HolographicDisplay';
import { TopBar, BottomBar } from './components/StatusBar';
import { useApi } from './hooks/useApi';
import { useSpeech } from './hooks/useSpeech';

// Panel header component
function PanelHeader({ label, icon: Icon, children }) {
  return (
    <div className="flex items-center justify-between pb-2 mb-3"
      style={{ borderBottom: '1px solid rgba(0,229,255,0.1)' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-px h-3 rounded-full" style={{ background: '#00e5ff', boxShadow: '0 0 6px #00e5ff' }} />
        {Icon && <Icon size={11} style={{ color: 'rgba(0,180,220,0.6)' }} />}
        <span style={{ color: 'rgba(0,180,220,0.7)', fontSize: 9 }} className="font-mono uppercase tracking-widest">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

// Notification toast
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -10, x: '-50%' }}
      className="fixed bottom-16 left-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg"
      style={{
        background: 'rgba(0,10,30,0.95)',
        border: '1px solid rgba(255,100,100,0.3)',
        boxShadow: '0 0 20px rgba(255,100,100,0.15)',
      }}
    >
      <AlertTriangle size={12} style={{ color: '#ff6644', flexShrink: 0 }} />
      <span style={{ color: 'rgba(200,200,220,0.8)', fontSize: 11 }} className="font-mono">
        {message}
      </span>
    </motion.div>
  );
}

// Memory modal
function MemoryModal({ data, onClose }) {
  const entries = data?.entries || data?.memories || (Array.isArray(data) ? data : []);
  const summary = data?.summary || 'Memory module accessed.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="corner-deco rounded-xl p-5 w-full max-w-md"
        style={{
          background: 'rgba(5, 12, 30, 0.98)',
          border: '1px solid rgba(0,229,255,0.2)',
          boxShadow: '0 0 40px rgba(0,229,255,0.1)',
          maxHeight: '70vh',
          overflow: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain size={14} style={{ color: '#00e5ff' }} />
          <h2 style={{ color: '#00e5ff', fontSize: 13 }} className="font-mono uppercase tracking-widest">
            Memory Bank
          </h2>
          <div className="flex-1" />
          <button onClick={onClose} style={{ color: 'rgba(0,180,220,0.4)', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>

        <p style={{ color: 'rgba(160,210,230,0.7)', fontSize: 11 }} className="font-mono mb-4">
          {summary}
        </p>

        {entries.length > 0 ? (
          <div className="space-y-2">
            {entries.slice(0, 10).map((entry, i) => (
              <div key={i} className="rounded px-3 py-2"
                style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.08)' }}
              >
                <p style={{ color: 'rgba(180,225,245,0.8)', fontSize: 11 }} className="font-mono">
                  {typeof entry === 'string' ? entry : JSON.stringify(entry)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p style={{ color: 'rgba(0,180,220,0.3)', fontSize: 11 }} className="font-mono">
              No memory entries found. Backend may be offline.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Recent conversations for left panel
const RECENT_CONVS = [
  { time: '08:43', preview: 'Stark Tower security audit...' },
  { time: '07:22', preview: 'Repulsor array calibration...' },
  { time: 'Yesterday', preview: 'Mission debrief: Budapest...' },
  { time: 'Mon', preview: 'Avengers team status report...' },
];

export default function App() {
  const [voiceActive, setVoiceActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [toast, setToast] = useState(null);
  const [memoryData, setMemoryData] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'history'
  const { ask, getBrief, getMemory, loading, error } = useApi();
  const { speak } = useSpeech();

  useEffect(() => {
    // Stagger mount animation
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleAsk = async (query) => {
    try {
      const response = await ask(query);
      setCurrentResponse(response);
      speak(response);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const handleBrief = async () => {
    try {
      const brief = await getBrief();
      setCurrentResponse(brief);
      speak(brief);
      speak(brief);
    } catch (err) {
      setToast('Morning brief unavailable — backend offline');
    }
  };

  const handleMemory = async () => {
    try {
      const data = await getMemory();
      setMemoryData(data);
    } catch (err) {
      setMemoryData({ summary: 'Backend offline. Memory module requires http://localhost:8000', entries: [] });
    }
  };

  const panelVariants = {
    hidden: (dir) => ({ opacity: 0, x: dir }),
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden scanlines"
      style={{ background: 'linear-gradient(135deg, #03080f 0%, #050b1a 50%, #020710 100%)' }}
    >
      {/* Particle background */}
      <ParticleField />

      {/* Ambient light blobs */}
      <div className="fixed pointer-events-none" style={{
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,229,255,0.025) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'pulse 6s ease-in-out infinite',
      }} />
      <div className="fixed pointer-events-none" style={{
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0,80,200,0.04) 0%, transparent 70%)',
        top: '20%', left: '15%',
        animation: 'pulse 8s ease-in-out infinite 2s',
      }} />

      {/* Main layout */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <TopBar />
        </motion.div>

        {/* Main content */}
        <div className="flex flex-1 gap-3 px-3 py-3 overflow-hidden">

          {/* ====== LEFT PANEL ====== */}
          <motion.div
            custom={-60}
            variants={panelVariants}
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-panel corner-deco rounded-xl p-4 flex flex-col gap-4"
            style={{ width: '28%', flexShrink: 0 }}
          >
            {/* Voice section */}
            <div>
              <PanelHeader label="Voice Interface" icon={MessageSquare} />
              <VoiceVisualizer isActive={voiceActive} onToggle={() => setVoiceActive(v => !v)} />
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: 'rgba(0,229,255,0.07)' }} />

            {/* Tab switcher */}
            <div className="flex gap-1 p-0.5 rounded-lg"
              style={{ background: 'rgba(0,10,30,0.5)', border: '1px solid rgba(0,229,255,0.08)' }}
            >
              {[
                { id: 'chat', label: 'Chat', icon: MessageSquare },
                { id: 'history', label: 'History', icon: BookOpen },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all"
                  style={{
                    background: activeTab === id ? 'rgba(0,229,255,0.1)' : 'transparent',
                    border: activeTab === id ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
                    color: activeTab === id ? '#00e5ff' : 'rgba(0,180,220,0.4)',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Icon size={10} />
                  {label}
                </button>
              ))}
            </div>

            {/* Chat or History */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chat' ? (
                <ChatPanel onAsk={handleAsk} loading={loading} />
              ) : (
                <div className="space-y-2">
                  <PanelHeader label="Recent Sessions" icon={BookOpen} />
                  {RECENT_CONVS.map((conv, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="stark-btn rounded-lg px-3 py-2.5 cursor-pointer"
                      style={{
                        background: 'rgba(0,229,255,0.03)',
                        border: '1px solid rgba(0,229,255,0.08)',
                      }}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(0,229,255,0.5)' }} />
                          <span style={{ color: 'rgba(0,229,255,0.5)', fontSize: 9 }} className="font-mono uppercase">
                            Session
                          </span>
                        </div>
                        <span style={{ color: 'rgba(0,150,200,0.4)', fontSize: 9 }} className="font-mono">
                          {conv.time}
                        </span>
                      </div>
                      <p style={{ color: 'rgba(160,210,230,0.6)', fontSize: 10.5 }} className="font-mono">
                        {conv.preview}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ====== CENTER PANEL ====== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-panel-bright corner-deco rounded-xl p-5 flex flex-col"
            style={{ flex: 1 }}
          >
            <PanelHeader label="Holographic Display — Main Interface" icon={Cpu}>
              <div className="flex items-center gap-2">
                {['SYS', 'NET', 'AI'].map(label => (
                  <div key={label} className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 4px #22c55e' }} />
                    <span style={{ color: 'rgba(34,197,94,0.6)', fontSize: 8.5 }} className="font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </PanelHeader>

            <div className="flex-1 overflow-hidden">
              <HolographicDisplay
                isActive={voiceActive || loading}
                currentResponse={currentResponse}
                loading={loading}
              />
            </div>
          </motion.div>

          {/* ====== RIGHT PANEL ====== */}
          <motion.div
            custom={60}
            variants={panelVariants}
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-panel corner-deco rounded-xl p-4 flex flex-col gap-3"
            style={{ width: '28%', flexShrink: 0 }}
          >
            <PanelHeader label="System Diagnostics" icon={Cpu} />
            <div className="flex-1 overflow-hidden">
              <SystemMetrics />
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <BottomBar
            onBrief={handleBrief}
            onMemory={handleMemory}
            loading={loading}
            voiceActive={voiceActive}
          />
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* Memory modal */}
      <AnimatePresence>
        {memoryData && (
          <MemoryModal data={memoryData} onClose={() => setMemoryData(null)} />
        )}
      </AnimatePresence>

      {/* Scan line animation overlay */}
      <div className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.015) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  );
}
