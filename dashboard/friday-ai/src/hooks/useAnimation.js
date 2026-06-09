import { useEffect, useRef, useState, useCallback } from 'react';

export function useTypewriter(text, speed = 25) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;
    if (!text) return;

    timerRef.current = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  return { displayed, done };
}

export function useWaveform(isActive, barCount = 32) {
  const [bars, setBars] = useState(Array(barCount).fill(0.1));
  const frameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      setBars(Array(barCount).fill(0.1));
      return;
    }

    const animate = () => {
      timeRef.current += 0.08;
      const t = timeRef.current;
      setBars(prev => prev.map((_, i) => {
        const wave1 = Math.sin(t * 2.5 + i * 0.4) * 0.35;
        const wave2 = Math.sin(t * 4.1 + i * 0.7) * 0.2;
        const wave3 = Math.sin(t * 1.3 + i * 0.2) * 0.15;
        const noise = (Math.random() - 0.5) * 0.1;
        return Math.max(0.08, Math.min(1, 0.5 + wave1 + wave2 + wave3 + noise));
      }));
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isActive, barCount]);

  return bars;
}

export function usePulse(interval = 2000) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return pulse;
}

export function useTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState({
    cpu: 23,
    ram: 41,
    gpu: 67,
    latency: 142,
    uptime: 0,
    temperature: 48,
  });

  useEffect(() => {
    let uptimeSeconds = 0;
    const timer = setInterval(() => {
      uptimeSeconds++;
      setMetrics(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 8)),
        ram: Math.max(20, Math.min(85, prev.ram + (Math.random() - 0.5) * 3)),
        gpu: Math.max(10, Math.min(90, prev.gpu + (Math.random() - 0.5) * 6)),
        latency: Math.max(80, Math.min(400, prev.latency + (Math.random() - 0.5) * 30)),
        uptime: uptimeSeconds,
        temperature: Math.max(35, Math.min(85, prev.temperature + (Math.random() - 0.5) * 2)),
      }));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return metrics;
}

export function useMemoryGraph(points = 40) {
  const [history, setHistory] = useState(() => Array(points).fill(0).map(() => 30 + Math.random() * 20));

  useEffect(() => {
    const timer = setInterval(() => {
      setHistory(prev => {
        const last = prev[prev.length - 1];
        const next = Math.max(15, Math.min(90, last + (Math.random() - 0.48) * 5));
        return [...prev.slice(1), next];
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return history;
}
