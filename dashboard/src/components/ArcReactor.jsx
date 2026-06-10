import { useRef, useEffect } from 'react'
import { useAnimationFrame } from '../hooks/useAnimation'

export default function ArcReactor({ speaking = false, size = 220 }) {
  const canvasRef = useRef(null)
  const tRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = size
    canvas.height = size
  }, [size])

  useAnimationFrame((ts) => {
    tRef.current = ts * 0.001
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const t = tRef.current
    const cx = size / 2
    const cy = size / 2
    const spk = speaking ? 1.3 : 1

    ctx.clearRect(0, 0, size, size)

    // Outer ambient glow
    const outerGlow = ctx.createRadialGradient(cx, cy, size * 0.3, cx, cy, size * 0.5)
    outerGlow.addColorStop(0, `rgba(0,212,255,${0.04 * spk})`)
    outerGlow.addColorStop(0.6, `rgba(0,100,200,${0.06 * spk})`)
    outerGlow.addColorStop(1, 'rgba(0,212,255,0)')
    ctx.fillStyle = outerGlow
    ctx.beginPath()
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2)
    ctx.fill()

    // Static outer ring
    ctx.beginPath()
    ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,212,255,0.1)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,212,255,0.06)'
    ctx.lineWidth = 0.5
    ctx.stroke()

    // Rotating outer segments (12 arcs)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 0.6)
    const seg12 = (Math.PI * 2) / 12
    for (let i = 0; i < 12; i++) {
      const a = seg12 * i
      const brightness = 0.35 + 0.25 * Math.sin(t * 2 + i * 0.5)
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.41, a + 0.08, a + seg12 - 0.08)
      ctx.strokeStyle = `rgba(0,212,255,${brightness * spk})`
      ctx.lineWidth = 2
      ctx.stroke()
    }
    ctx.restore()

    // Counter-rotating mid ring (8 arcs)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-t * 0.9)
    const seg8 = (Math.PI * 2) / 8
    for (let i = 0; i < 8; i++) {
      const a = seg8 * i
      const brightness = 0.4 + 0.3 * Math.sin(t * 3 - i * 0.7)
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.32, a + 0.12, a + seg8 - 0.12)
      ctx.strokeStyle = `rgba(0,150,255,${brightness * spk})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    ctx.restore()

    // Rotating inner hex ring (6 arcs)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 1.4)
    const seg6 = (Math.PI * 2) / 6
    for (let i = 0; i < 6; i++) {
      const a = seg6 * i
      const brightness = 0.5 + 0.3 * Math.sin(t * 4 + i)
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.22, a + 0.18, a + seg6 - 0.18)
      ctx.strokeStyle = `rgba(0,212,255,${brightness * spk})`
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    ctx.restore()

    // Hexagon outline (slowly rotating)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 0.3)
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i - Math.PI / 6
      const r = size * 0.18
      i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    ctx.closePath()
    ctx.strokeStyle = `rgba(0,212,255,${0.55 * spk})`
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()

    // Inner hex (counter-rotating)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-t * 0.5)
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i - Math.PI / 6
      const r = size * 0.12
      i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    ctx.closePath()
    const pulse = (0.5 + 0.5 * Math.sin(t * 2)) * spk
    ctx.fillStyle = `rgba(0,212,255,${0.07 * pulse})`
    ctx.fill()
    ctx.strokeStyle = `rgba(0,212,255,${0.4 * spk})`
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()

    // Spokes
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 0.4)
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i
      const brightness = 0.25 + 0.15 * Math.sin(t * 2 + i)
      ctx.beginPath()
      ctx.moveTo(Math.cos(a) * size * 0.055, Math.sin(a) * size * 0.055)
      ctx.lineTo(Math.cos(a) * size * 0.175, Math.sin(a) * size * 0.175)
      ctx.strokeStyle = `rgba(0,212,255,${brightness * spk})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.restore()

    // Core glow
    const pulse2 = 0.5 + 0.5 * Math.sin(t * 2)
    const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.14)
    coreGlow.addColorStop(0, `rgba(200,245,255,${(0.85 + 0.15 * pulse2) * spk})`)
    coreGlow.addColorStop(0.3, `rgba(0,212,255,${(0.5 + 0.3 * pulse2) * spk})`)
    coreGlow.addColorStop(0.7, `rgba(0,100,200,${0.2 * spk * pulse2})`)
    coreGlow.addColorStop(1, 'rgba(0,212,255,0)')
    ctx.fillStyle = coreGlow
    ctx.beginPath()
    ctx.arc(cx, cy, size * 0.14, 0, Math.PI * 2)
    ctx.fill()

    // Center dot
    ctx.beginPath()
    ctx.arc(cx, cy, size * 0.03, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(230,250,255,${0.9 + 0.1 * pulse2})`
    ctx.fill()
  })

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, display: 'block' }}
    />
  )
}
