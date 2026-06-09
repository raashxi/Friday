import { useEffect, useRef } from 'react';

export default function ParticleField() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const PARTICLE_COUNT = 120;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.3,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      hue: Math.random() * 30 + 175, // cyan range
      pulse: Math.random() * Math.PI * 2,
    }));

    // Hexagonal grid dots
    const HEX_NODES = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));

    // Grid connections
    const connections = [];
    for (let i = 0; i < HEX_NODES.length; i++) {
      for (let j = i + 1; j < HEX_NODES.length; j++) {
        const dx = HEX_NODES[i].x - HEX_NODES[j].x;
        const dy = HEX_NODES[i].y - HEX_NODES[j].y;
        if (Math.sqrt(dx*dx + dy*dy) < 130) {
          connections.push([i, j]);
        }
      }
    }

    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle gradient background wash
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      grad.addColorStop(0, 'rgba(0, 30, 80, 0.08)');
      grad.addColorStop(1, 'rgba(0, 5, 20, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.lineWidth = 0.5;
      connections.forEach(([a, b]) => {
        const na = HEX_NODES[a];
        const nb = HEX_NODES[b];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const alpha = (1 - dist / 130) * 0.12;
        ctx.strokeStyle = `rgba(0, 180, 220, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      });

      // Draw hex nodes
      HEX_NODES.forEach(node => {
        node.phase += node.speed;
        const opacity = (Math.sin(node.phase) * 0.5 + 0.5) * 0.4 + 0.1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 240, ${opacity})`;
        ctx.fill();
      });

      // Draw floating particles
      particles.forEach(p => {
        p.pulse += 0.04;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.pulse * 0.5) * 0.15;
        p.opacity = (Math.sin(p.pulse) * 0.3 + 0.7) * 0.5;

        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }

        // Glow particle
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grd.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.opacity})`);
        grd.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${p.opacity * 1.5})`;
        ctx.fill();
      });

      // Occasional data streams
      if (frame % 180 === 0) {
        const x = Math.random() * canvas.width;
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            if (!canvas) return;
            ctx.fillStyle = `rgba(0, 229, 255, ${0.6 - i * 0.07})`;
            ctx.font = `${8 + Math.random() * 4}px JetBrains Mono`;
            ctx.fillText(
              String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)),
              x + (Math.random() - 0.5) * 10,
              Math.random() * canvas.height
            );
          }, i * 60);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
