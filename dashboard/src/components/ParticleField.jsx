import { useEffect, useRef } from 'react'
import { useAnimationFrame } from '../hooks/useAnimation'

const NUM_PARTICLES = 130

function initParticles(w, h) {
  return Array.from({ length: NUM_PARTICLES }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.4 + 0.1),
    r: Math.random() * 1.4 + 0.4,
    baseOpacity: Math.random() * 0.45 + 0.08,
    flicker: Math.random() * Math.PI * 2,
    flickerSpeed: Math.random() * 0.04 + 0.01,
  }))
}

export default function ParticleField() {
  const canvasRef = useRef(null)
  const partsRef = useRef([])
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      sizeRef.current = { w: canvas.width, h: canvas.height }
      partsRef.current = initParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useAnimationFrame(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { w, h } = sizeRef.current
    ctx.clearRect(0, 0, w, h)

    partsRef.current.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.flicker += p.flickerSpeed

      if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
      if (p.x < -4) p.x = w + 4
      if (p.x > w + 4) p.x = -4

      const opacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(p.flicker))
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,212,255,${opacity})`
      ctx.fill()
    })
  })

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
