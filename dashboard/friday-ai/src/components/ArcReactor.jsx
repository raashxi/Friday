import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ArcReactor({ isActive = false, size = 220 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = size;
    const H = size;
    const cx = W / 2;
    const cy = H / 2;

    let t = 0;

    const draw = () => {
      t += 0.02;
      frameRef.current++;
      ctx.clearRect(0, 0, W, H);

      const pulseIntensity = isActive
        ? 0.7 + Math.sin(t * 6) * 0.3
        : 0.5 + Math.sin(t * 2) * 0.15;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
      outerGlow.addColorStop(0, `rgba(0, 229, 255, ${0.06 * pulseIntensity})`);
      outerGlow.addColorStop(0.5, `rgba(0, 180, 220, ${0.03 * pulseIntensity})`);
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, W, H);

      // Ring 1 – outer rotating
      const r1 = W * 0.42;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.5);
      ctx.beginPath();
      ctx.arc(0, 0, r1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.25 * pulseIntensity})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 18]);
      ctx.stroke();
      ctx.setLineDash([]);
      // tick marks
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const inner = i % 6 === 0 ? r1 - 8 : r1 - 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        ctx.lineTo(Math.cos(angle) * (r1 + 3), Math.sin(angle) * (r1 + 3));
        ctx.strokeStyle = `rgba(0, 229, 255, ${i % 6 === 0 ? 0.7 : 0.3})`;
        ctx.lineWidth = i % 6 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }
      ctx.restore();

      // Ring 2 – counter rotate
      const r2 = W * 0.33;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.8);
      ctx.beginPath();
      ctx.arc(0, 0, r2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 200, 240, ${0.35 * pulseIntensity})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
      // 8 orbit nodes
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * r2;
        const py = Math.sin(angle) * r2;
        const nr = i % 2 === 0 ? 3.5 : 2;
        const ng = ctx.createRadialGradient(px, py, 0, px, py, nr * 3);
        ng.addColorStop(0, `rgba(0, 229, 255, ${pulseIntensity})`);
        ng.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.beginPath();
        ctx.arc(px, py, nr * 3, 0, Math.PI * 2);
        ctx.fillStyle = ng;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, nr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 240, 255, ${pulseIntensity})`;
        ctx.fill();
      }
      ctx.restore();

      // Ring 3 – medium slow rotate
      const r3 = W * 0.24;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 1.2);
      for (let i = 0; i < 3; i++) {
        const startA = (i / 3) * Math.PI * 2 + Math.PI * 0.1;
        const endA = startA + Math.PI * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, r3, startA, endA);
        ctx.strokeStyle = `rgba(0, 220, 255, ${0.5 * pulseIntensity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      // Hexagon
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.3);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const hx = Math.cos(angle) * r3 * 0.75;
        const hy = Math.sin(angle) * r3 * 0.75;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.4 * pulseIntensity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Core glow
      const coreR = W * 0.12;
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.5);
      coreGlow.addColorStop(0, `rgba(200, 245, 255, ${pulseIntensity})`);
      coreGlow.addColorStop(0.3, `rgba(0, 229, 255, ${0.8 * pulseIntensity})`);
      coreGlow.addColorStop(0.7, `rgba(0, 150, 200, ${0.4 * pulseIntensity})`);
      coreGlow.addColorStop(1, 'rgba(0, 100, 180, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGlow;
      ctx.fill();

      // Core solid
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      const coreFill = ctx.createRadialGradient(cx - coreR*0.3, cy - coreR*0.3, 0, cx, cy, coreR);
      coreFill.addColorStop(0, `rgba(220, 248, 255, ${pulseIntensity})`);
      coreFill.addColorStop(0.5, `rgba(0, 220, 255, ${0.9 * pulseIntensity})`);
      coreFill.addColorStop(1, `rgba(0, 80, 160, ${0.8 * pulseIntensity})`);
      ctx.fillStyle = coreFill;
      ctx.fill();

      // Inner cross lines
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * -0.6);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * pulseIntensity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-coreR * 0.7, 0);
      ctx.lineTo(coreR * 0.7, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -coreR * 0.7);
      ctx.lineTo(0, coreR * 0.7);
      ctx.stroke();
      ctx.restore();

      // Energy beams from core
      if (isActive) {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t;
          const beamLen = r2 + (Math.sin(t * 3 + i) * 0.5 + 0.5) * (r1 - r2) * 0.5;
          const beamAlpha = (Math.sin(t * 3 + i * 0.8) * 0.5 + 0.5) * 0.3;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          const beamGrad = ctx.createLinearGradient(coreR, 0, beamLen, 0);
          beamGrad.addColorStop(0, `rgba(0, 229, 255, ${beamAlpha})`);
          beamGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
          ctx.beginPath();
          ctx.moveTo(coreR, 0);
          ctx.lineTo(beamLen, 0);
          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, isActive]);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{
        filter: isActive
          ? ['drop-shadow(0 0 20px #00e5ff) drop-shadow(0 0 40px #00e5ff80)', 'drop-shadow(0 0 30px #00e5ff) drop-shadow(0 0 60px #00e5ffaa)']
          : ['drop-shadow(0 0 10px #00e5ff60)', 'drop-shadow(0 0 18px #00e5ff80)'],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ display: 'block' }}
      />
    </motion.div>
  );
}
