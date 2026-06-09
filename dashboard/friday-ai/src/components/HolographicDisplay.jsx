import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArcReactor from './ArcReactor';

const STATUS_MESSAGES = [
  'NEURAL NETWORKS ACTIVE',
  'SCANNING THREAT VECTORS',
  'PROCESSING QUERY...',
  'MEMORY SYNC COMPLETE',
  'STARK SYSTEMS ONLINE',
  'AI CORE OPERATIONAL',
];

function WireframeSphere({ isActive }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = 100;

    let t = 0;
    const LATITUDES = 10;
    const LONGITUDES = 16;

    function project(x, y, z) {
      const fov = 400;
      const depth = z + fov + 200;
      return {
        x: cx + (x * fov) / depth,
        y: cy + (y * fov) / depth,
        z,
      };
    }

    function rotateY(x, y, z, a) {
      return { x: x * Math.cos(a) + z * Math.sin(a), y, z: -x * Math.sin(a) + z * Math.cos(a) };
    }

    function rotateX(x, y, z, a) {
      return { x, y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) };
    }

    function rotateZ(x, y, z, a) {
      return { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a), z };
    }

    const draw = () => {
      t += isActive ? 0.012 : 0.006;
      ctx.clearRect(0, 0, W, H);

      const ay = t;
      const ax = Math.sin(t * 0.4) * 0.3;
      const az = Math.cos(t * 0.3) * 0.1;

      const alpha = isActive ? 0.7 : 0.45;

      // Draw latitude lines
      for (let i = 0; i <= LATITUDES; i++) {
        const phi = (i / LATITUDES) * Math.PI;
        const y = R * Math.cos(phi);
        const r = R * Math.sin(phi);
        const steps = 64;
        ctx.beginPath();
        for (let j = 0; j <= steps; j++) {
          const theta = (j / steps) * 2 * Math.PI;
          let p = { x: r * Math.cos(theta), y, z: r * Math.sin(theta) };
          p = rotateX(p.x, p.y, p.z, ax);
          p = rotateY(p.x, p.y, p.z, ay);
          p = rotateZ(p.x, p.y, p.z, az);
          const proj = project(p.x, p.y, p.z);
          if (j === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        const depthFade = i === 0 || i === LATITUDES ? 0.2 : alpha * 0.5;
        ctx.strokeStyle = `rgba(0, 200, 240, ${depthFade})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Draw longitude lines
      for (let i = 0; i < LONGITUDES; i++) {
        const theta = (i / LONGITUDES) * 2 * Math.PI;
        const steps = 48;
        ctx.beginPath();
        for (let j = 0; j <= steps; j++) {
          const phi = (j / steps) * Math.PI;
          let p = {
            x: R * Math.sin(phi) * Math.cos(theta),
            y: R * Math.cos(phi),
            z: R * Math.sin(phi) * Math.sin(theta),
          };
          p = rotateX(p.x, p.y, p.z, ax);
          p = rotateY(p.x, p.y, p.z, ay);
          p = rotateZ(p.x, p.y, p.z, az);
          const proj = project(p.x, p.y, p.z);
          const a = alpha * (0.3 + (p.z + R) / (2 * R) * 0.5);
          if (j === 0) {
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y);
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.45})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Vertex nodes at intersections
      for (let i = 0; i <= LATITUDES; i++) {
        for (let j = 0; j < LONGITUDES; j++) {
          const phi = (i / LATITUDES) * Math.PI;
          const theta = (j / LONGITUDES) * 2 * Math.PI;
          let p = {
            x: R * Math.sin(phi) * Math.cos(theta),
            y: R * Math.cos(phi),
            z: R * Math.sin(phi) * Math.sin(theta),
          };
          p = rotateX(p.x, p.y, p.z, ax);
          p = rotateY(p.x, p.y, p.z, ay);
          p = rotateZ(p.x, p.y, p.z, az);
          const proj = project(p.x, p.y, p.z);
          const depth = (p.z + R) / (2 * R);
          if (depth > 0.3) {
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, depth * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${depth * alpha * 0.8})`;
            ctx.fill();
          }
        }
      }

      // Scan line sweep
      if (isActive) {
        const scanAngle = t * 2;
        const scanSteps = 60;
        ctx.beginPath();
        for (let j = 0; j <= scanSteps; j++) {
          const phi = (j / scanSteps) * Math.PI;
          let p = {
            x: R * Math.sin(phi) * Math.cos(scanAngle),
            y: R * Math.cos(phi),
            z: R * Math.sin(phi) * Math.sin(scanAngle),
          };
          p = rotateX(p.x, p.y, p.z, ax);
          p = rotateY(p.x, p.y, p.z, ay);
          const proj = project(p.x, p.y, p.z);
          if (j === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={260}
      style={{
        filter: isActive ? 'drop-shadow(0 0 12px rgba(0,229,255,0.4))' : 'drop-shadow(0 0 6px rgba(0,229,255,0.2))',
      }}
    />
  );
}

export default function HolographicDisplay({ isActive, currentResponse, loading }) {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStatusIdx(i => (i + 1) % STATUS_MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between h-full gap-3 py-2">
      {/* Status ticker */}
      <div className="w-full flex items-center justify-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,229,255,0.3))' }} />
        <AnimatePresence mode="wait">
          <motion.span
            key={statusIdx}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs tracking-widest uppercase whitespace-nowrap"
            style={{ color: 'rgba(0,229,255,0.5)' }}
          >
            {STATUS_MESSAGES[statusIdx]}
          </motion.span>
        </AnimatePresence>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(0,229,255,0.3))' }} />
      </div>

      {/* Main sphere + reactor */}
      <div className="relative flex items-center justify-center">
        {/* Outer decorative rings */}
        <div className="absolute rounded-full"
          style={{
            width: 290, height: 290,
            border: '1px solid rgba(0,229,255,0.06)',
            animation: 'spin 20s linear infinite',
          }}
        />
        <div className="absolute rounded-full"
          style={{
            width: 310, height: 310,
            border: '1px dashed rgba(0,229,255,0.04)',
            animation: 'spin 30s linear infinite reverse',
          }}
        />

        {/* Sphere */}
        <div className="relative z-10">
          <WireframeSphere isActive={isActive} />
        </div>

        {/* Center reactor overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div style={{ opacity: 0.85 }}>
            <ArcReactor isActive={isActive} size={110} />
          </div>
        </div>

        {/* Corner data readouts */}
        {[
          { pos: 'top-2 left-2', label: 'AXIS-X', val: '023.4°' },
          { pos: 'top-2 right-2', label: 'AXIS-Y', val: '187.2°' },
          { pos: 'bottom-2 left-2', label: 'FREQ', val: '2.4GHz' },
          { pos: 'bottom-2 right-2', label: 'NODES', val: '160' },
        ].map(({ pos, label, val }) => (
          <div key={label} className={`absolute ${pos} text-right`}>
            <div style={{ color: 'rgba(0,180,220,0.35)', fontSize: 8 }} className="font-mono uppercase tracking-wider">{label}</div>
            <div style={{ color: 'rgba(0,229,255,0.6)', fontSize: 10 }} className="font-mono">{val}</div>
          </div>
        ))}
      </div>

      {/* Response display */}
      <div className="w-full flex-1 flex flex-col gap-2" style={{ minHeight: 0 }}>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 4px #22c55e' }} />
          <span style={{ color: 'rgba(0,180,220,0.5)', fontSize: 9 }} className="font-mono uppercase tracking-widest">
            FRIDAY Response Buffer
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,229,255,0.08)' }} />
        </div>

        <div className="flex-1 overflow-y-auto rounded-lg px-3.5 py-3"
          style={{
            background: 'rgba(0,10,30,0.6)',
            border: '1px solid rgba(0,229,255,0.1)',
            minHeight: 80,
            maxHeight: 140,
          }}
        >
          {loading ? (
            <div className="flex items-center gap-3 h-full">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-5 rounded-full"
                    style={{ background: '#00e5ff' }}
                    animate={{ scaleY: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
              <span style={{ color: 'rgba(0,180,220,0.5)', fontSize: 11 }} className="font-mono">
                Processing query...
              </span>
            </div>
          ) : currentResponse ? (
            <p style={{ color: 'rgba(180,230,250,0.85)', fontSize: 12, lineHeight: 1.7 }} className="font-mono">
              {currentResponse}
            </p>
          ) : (
            <p style={{ color: 'rgba(0,180,220,0.25)', fontSize: 11 }} className="font-mono italic">
              Awaiting query input. Systems standing by...
            </p>
          )}
        </div>
      </div>

      {/* Bottom data strip */}
      <div className="w-full grid grid-cols-4 gap-2">
        {[
          { label: 'SIGNAL', val: '98.7%' },
          { label: 'ENCRYPT', val: 'AES-256' },
          { label: 'NODES', val: '4 / 4' },
          { label: 'UPLINK', val: '∞' },
        ].map(({ label, val }) => (
          <div key={label} className="text-center rounded py-1.5 px-1"
            style={{ background: 'rgba(0,10,30,0.4)', border: '1px solid rgba(0,229,255,0.07)' }}
          >
            <div style={{ color: 'rgba(0,180,220,0.4)', fontSize: 8 }} className="font-mono uppercase tracking-wider">{label}</div>
            <div style={{ color: 'rgba(0,229,255,0.7)', fontSize: 10 }} className="font-mono mt-0.5">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
