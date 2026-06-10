import { useState, useCallback, useRef } from 'react'
import ParticleField from './components/ParticleField'
import ChatPanel from './components/ChatPanel'
import HolographicDisplay from './components/HolographicDisplay'
import SystemMetrics from './components/SystemMetrics'
import { TopBar, BottomBar } from './components/StatusBar'
import { useApi } from './hooks/useApi'
import { useTypewriter } from './hooks/useAnimation'

const MAX_CONVOS = 10

export default function App() {
  const [inputVal, setInputVal] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [conversations, setConversations] = useState([
    { id: 1, time: '09:41', text: 'Good morning. Systems nominal, 7 tasks pending.', type: 'brief' },
    { id: 2, time: '09:15', text: 'Quantum encryption protocols updated. Security: S-Tier.', type: 'security' },
    { id: 3, time: '08:52', text: 'Anomaly detected in sector 7-G. Patched and logged.', type: 'alert' },
    { id: 4, time: '08:30', text: 'Power grid calibration complete. Efficiency: 94%.', type: 'system' },
    { id: 5, time: 'Yesterday', text: 'Full diagnostics complete. Zero critical failures.', type: 'system' },
  ])

  const { loading, ask, getBrief, getMemory } = useApi()

  const onTypeUpdate = useCallback((text) => {
    setDisplayText(text)
  }, [])

  const { start: startTypewriter, stop: stopTypewriter } = useTypewriter(
    displayText,
    onTypeUpdate,
    20
  )

  const typeResponse = useCallback((text) => {
    stopTypewriter()
    setDisplayText('')
    setSpeaking(true)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setSpeaking(false)
      }
    }, 18)
  }, [stopTypewriter])

  const addConvo = useCallback((text, type = 'user') => {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    setConversations(prev => {
      const next = [{ id: Date.now(), time: `${h}:${m}`, text, type }, ...prev]
      return next.slice(0, MAX_CONVOS)
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    const query = inputVal.trim()
    if (!query || loading) return
    setInputVal('')
    addConvo(query, 'user')
    const response = await ask(query)
    typeResponse(response)
  }, [inputVal, loading, ask, addConvo, typeResponse])

  const handleBrief = useCallback(async () => {
    if (loading) return
    addConvo('Morning brief requested', 'brief')
    const response = await getBrief()
    typeResponse(response)
  }, [loading, getBrief, addConvo, typeResponse])

  const handleMemory = useCallback(async () => {
    if (loading) return
    addConvo('Memory vault accessed', 'security')
    const response = await getMemory()
    typeResponse(response)
  }, [loading, getMemory, addConvo, typeResponse])

  const handleClear = useCallback(() => {
    stopTypewriter()
    setSpeaking(false)
    setDisplayText('')
  }, [stopTypewriter])

  const handleSelectConvo = useCallback((text) => {
    setInputVal(text)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Particle background */}
      <ParticleField />

      {/* Subtle radial bg gradient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,30,55,0.5) 0%, rgba(2,10,15,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top Bar */}
      <TopBar />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <ChatPanel
          conversations={conversations}
          speaking={speaking}
          loading={loading}
          onSelectConvo={handleSelectConvo}
        />

        <HolographicDisplay
          displayText={displayText}
          loading={loading}
          speaking={speaking}
          inputVal={inputVal}
          onInputChange={setInputVal}
          onSubmit={handleSubmit}
        />

        <SystemMetrics />
      </div>

      {/* Bottom Bar */}
      <BottomBar
        onBrief={handleBrief}
        onMemory={handleMemory}
        onClear={handleClear}
        loading={loading}
      />
    </div>
  )
}
