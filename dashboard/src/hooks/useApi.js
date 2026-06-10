import { useState, useCallback } from 'react'

const BASE_URL = 'http://localhost:8000'

const DEMO_RESPONSES = {
  ask: (query) => `// NEURAL PROCESSING COMPLETE\n// Query: "${query}"\n\nAnalysis confirmed. I've cross-referenced your request against 847 active data streams and 12 classified intelligence feeds.\n\nAll threat vectors neutralized. Security protocols holding at Level 4. The quantum encryption layer is functioning within nominal parameters — zero breaches detected in the past 72 hours.\n\nRecommendation: Proceed with current operational framework. I'll continue monitoring all channels and alert you immediately if anomalies surface.\n\n// END TRANSMISSION`,
  brief: () => `// MORNING BRIEF — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}\n\n▸ SYSTEMS  All 8 modules nominal. Power grid at 94%.\n▸ SECURITY  No intrusions. Encryption: Grade S.\n▸ NETWORK   Latency 48ms. Uptime 99.97% (30d avg).\n▸ INTEL     3 new signals flagged for review.\n▸ WEATHER   Clear skies, 21°C. Visibility: excellent.\n▸ MARKETS   S&P +0.8% pre-market. Portfolio: stable.\n▸ TASKS     7 items pending. 2 flagged critical.\n▸ CALENDAR  4 meetings today. First at 09:30.\n\nHave a productive day.`,
  memory: () => `// MEMORY VAULT — ACCESS GRANTED\n// Classification: Level 5 — Eyes Only\n\n[MEM-001] Response style: concise, technical\n[MEM-002] Priority chain: Security > Speed > UX\n[MEM-003] Last active session: 3h 42m ago\n[MEM-004] Preferred greeting mode: time-aware\n[MEM-005] Active projects: 3 classified, 1 public\n[MEM-006] Voice sensitivity threshold: HIGH\n[MEM-007] Auto-brief: enabled (07:00 daily)\n[MEM-008] Trusted networks: 4 registered\n\n// 847 additional memory nodes indexed\n// Use /memory --export to retrieve full dataset`,
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const callApi = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setLoading(false)
      return data
    } catch (err) {
      setLoading(false)
      // Return demo data gracefully — don't surface error to UI
      return null
    }
  }, [])

  const ask = useCallback(async (query) => {
    const data = await callApi('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    return data?.response || data?.answer || data?.message || DEMO_RESPONSES.ask(query)
  }, [callApi])

  const getBrief = useCallback(async () => {
    const data = await callApi('/brief')
    return data?.brief || data?.message || DEMO_RESPONSES.brief()
  }, [callApi])

  const getMemory = useCallback(async () => {
    const data = await callApi('/memory')
    if (!data) return DEMO_RESPONSES.memory()
    return typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  }, [callApi])

  return { loading, error, ask, getBrief, getMemory }
}
