import { motion } from 'framer-motion';
import { useMetrics, useMemoryGraph } from '../hooks/useAnimation';
import { Cpu, HardDrive, Zap, Thermometer, Activity, Clock } from 'lucide-react';

function MetricBar({ label, value, max = 100, unit = '%', color = '#00e5ff', icon: Icon }) {
  const pct = Math.min(100, (value / max) * 100);
  const getColor = () => {
    if (pct > 80) return '#ff4466';
    if (pct > 60) return '#ffaa00';
    return color;
  };
  const c = getColor();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon size={10} style={{ color: c }} />}
          <span style={{ color: 'rgba(160,210,230,0.7)', fontSize: 10 }} className="font-mono uppercase tracking-wider">
            {label}
          </span>
        </div>
        <span style={{ color: c, fontSize: 11 }} className="font-mono font-medium">
          {typeof value === 'number' ? value.toFixed(0) : value}{unit}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(0,229,255,0.06)' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(to right, ${c}40, ${c})`,
            boxShadow: `0 0 8px ${c}60`,
          }}
        />
        {/* Shimmer */}
        <motion.div
          className="absolute inset-y-0 w-8 rounded-full"
          animate={{ left: ['-10%', '110%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          style={{ background: `linear-gradient(to right, transparent, ${c}40, transparent)` }}
        />
      </div>
    </div>
  );
}

function RadialGauge({ value, max = 100, label, size = 72 }) {
  const pct = Math.min(100, value / max);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * 0.75;
  const offset = strokeDash - pct * strokeDash;
  const color = pct > 0.8 ? '#ff4466' : pct > 0.6 ? '#ffaa00' : '#00e5ff';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none"
          stroke="rgba(0,229,255,0.08)"
          strokeWidth="4"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeDashoffset={-circumference * 0.125}
          strokeLinecap="round"
          transform={`rotate(135 ${size/2} ${size/2})`}
        />
        {/* Fill */}
        <motion.circle
          cx={size/2} cy={size/2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size/2} ${size/2})`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          animate={{ strokeDashoffset: offset }}
          initial={{ strokeDashoffset: strokeDash }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Value */}
        <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="13" fontFamily="JetBrains Mono" fontWeight="500">
          {Math.round(value)}
        </text>
        <text x={size/2} y={size/2 + 11} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(0,180,220,0.4)" fontSize="7" fontFamily="JetBrains Mono">
          %
        </text>
      </svg>
      <span style={{ color: 'rgba(140,200,220,0.6)', fontSize: 9 }} className="font-mono uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function MemoryGraph({ data }) {
  const W = 240;
  const H = 60;
  const max = 100;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / max) * H;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Activity size={10} style={{ color: '#00e5ff' }} />
          <span style={{ color: 'rgba(160,210,230,0.7)', fontSize: 10 }} className="font-mono uppercase tracking-wider">
            RAM Timeline
          </span>
        </div>
        <span style={{ color: '#00e5ff', fontSize: 10 }} className="font-mono">
          {data[data.length - 1].toFixed(0)}%
        </span>
      </div>
      <div className="relative rounded overflow-hidden"
        style={{ background: 'rgba(0,10,30,0.5)', border: '1px solid rgba(0,229,255,0.08)' }}
      >
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,229,255,0.3)" />
              <stop offset="100%" stopColor="rgba(0,229,255,0.02)" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {[25, 50, 75].map(y => (
            <line key={y}
              x1="0" y1={H * (1 - y/100)}
              x2={W} y2={H * (1 - y/100)}
              stroke="rgba(0,229,255,0.06)" strokeWidth="1"
            />
          ))}
          {/* Fill */}
          <polygon points={fillPoints} fill="url(#memGrad)" />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="rgba(0,229,255,0.8)"
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 3px rgba(0,229,255,0.6))' }}
          />
        </svg>
      </div>
    </div>
  );
}

const MODULES = [
  { name: 'Neural Core', status: 'active', load: 94 },
  { name: 'Voice Engine', status: 'active', load: 67 },
  { name: 'Security Layer', status: 'active', load: 12 },
  { name: 'Memory Bank', status: 'active', load: 78 },
  { name: 'Threat Analysis', status: 'standby', load: 0 },
  { name: 'Web Crawler', status: 'standby', load: 0 },
];

export default function SystemMetrics() {
  const metrics = useMetrics();
  const memHistory = useMemoryGraph();

  const formatUptime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Radial Gauges */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-3 h-px" style={{ background: 'rgba(0,229,255,0.5)' }} />
          <span style={{ color: 'rgba(0,229,255,0.6)', fontSize: 9 }} className="font-mono uppercase tracking-widest">
            Core Vitals
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,229,255,0.1)' }} />
        </div>
        <div className="flex justify-around">
          <RadialGauge value={metrics.cpu} label="CPU" />
          <RadialGauge value={metrics.ram} label="RAM" />
          <RadialGauge value={metrics.gpu} label="GPU" />
        </div>
      </div>

      {/* Bar metrics */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-3 h-px" style={{ background: 'rgba(0,229,255,0.5)' }} />
          <span style={{ color: 'rgba(0,229,255,0.6)', fontSize: 9 }} className="font-mono uppercase tracking-widest">
            Performance
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,229,255,0.1)' }} />
        </div>
        <div className="space-y-3">
          <MetricBar label="Model Latency" value={metrics.latency} max={500} unit="ms" icon={Zap} />
          <MetricBar label="Temperature" value={metrics.temperature} max={100} unit="°C"
            color={metrics.temperature > 70 ? '#ff6644' : '#00e5ff'} icon={Thermometer} />
        </div>
      </div>

      {/* Memory graph */}
      <MemoryGraph data={memHistory} />

      {/* Uptime */}
      <div className="flex items-center justify-between rounded-lg px-3 py-2"
        style={{ background: 'rgba(0,10,30,0.5)', border: '1px solid rgba(0,229,255,0.08)' }}
      >
        <div className="flex items-center gap-1.5">
          <Clock size={10} style={{ color: 'rgba(0,180,220,0.5)' }} />
          <span style={{ color: 'rgba(140,200,220,0.6)', fontSize: 10 }} className="font-mono uppercase tracking-wider">
            Uptime
          </span>
        </div>
        <span style={{ color: '#00e5ff', fontSize: 11 }} className="font-mono">
          {formatUptime(metrics.uptime)}
        </span>
      </div>

      {/* Active modules */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-3 h-px" style={{ background: 'rgba(0,229,255,0.5)' }} />
          <span style={{ color: 'rgba(0,229,255,0.6)', fontSize: 9 }} className="font-mono uppercase tracking-widest">
            Modules
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(0,229,255,0.1)' }} />
        </div>
        <div className="space-y-1.5">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between rounded px-2.5 py-1.5"
              style={{ background: 'rgba(0,10,30,0.4)', border: '1px solid rgba(0,229,255,0.06)' }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  animate={mod.status === 'active'
                    ? { opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }
                    : { opacity: 0.3 }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: mod.status === 'active' ? '#22c55e' : '#475569' }}
                />
                <span style={{ color: mod.status === 'active' ? 'rgba(180,225,245,0.8)' : 'rgba(100,140,160,0.5)', fontSize: 10 }}
                  className="font-mono">
                  {mod.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {mod.status === 'active' && (
                  <div className="w-12 h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(0,229,255,0.06)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      animate={{ width: `${mod.load}%` }}
                      initial={{ width: '0%' }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      style={{ background: 'rgba(0,229,255,0.6)' }}
                    />
                  </div>
                )}
                <span style={{
                  color: mod.status === 'active' ? 'rgba(0,229,255,0.7)' : 'rgba(100,140,160,0.4)',
                  fontSize: 9
                }} className="font-mono uppercase">
                  {mod.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
