# FRIDAY AI Dashboard
### Stark Industries · Neural Interface v4.1.0

A cinematic, production-ready AI dashboard UI inspired by Tony Stark's FRIDAY/JARVIS.

---

## Stack
- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **Framer Motion 11**
- **JetBrains Mono** + **Inter** (Google Fonts)

---

## Setup (2 commands)

```bash
npm install
npm run dev
```

Open → **http://localhost:5173**

---

## Connect Your Backend

The dashboard connects to `http://localhost:8000` by default.

Edit `src/hooks/useApi.js` to change `BASE_URL`.

### Expected endpoints:

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/ask`   | `{ "query": "..." }` | `{ "response": "..." }` |
| `GET`  | `/brief` | —    | `{ "brief": "..." }` |
| `GET`  | `/memory`| —    | `{ "memory": "..." }` or any JSON |

If the backend is unreachable, FRIDAY automatically runs in **demo mode** with pre-written responses — so the UI always works.

---

## Build for Production

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

---

## Project Structure

```
src/
├── App.jsx                      # Root layout + state
├── main.jsx                     # Entry point
├── index.css                    # Global styles, scanlines, utilities
├── components/
│   ├── ArcReactor.jsx           # Canvas arc reactor animation
│   ├── ParticleField.jsx        # Canvas floating particle background
│   ├── VoiceVisualizer.jsx      # Animated waveform bars
│   ├── ChatPanel.jsx            # Left panel — voice + conversation history
│   ├── HolographicDisplay.jsx   # Center panel — sphere, reactor, output, input
│   ├── SystemMetrics.jsx        # Right panel — metrics, graph, modules
│   └── StatusBar.jsx            # Top & bottom bars
└── hooks/
    ├── useApi.js                # Fetch wrapper with demo fallback
    └── useAnimation.js          # useTypewriter, useAnimationFrame, useInterval
```

---

## Features

- 🔵 **Arc Reactor** — multi-layer canvas animation, dual counter-rotating rings, pulsing core
- 🌐 **3D Wireframe Sphere** — orthographic projection, animated latitude/longitude lines
- ✨ **Particle Field** — 130 floating particles with flicker effect
- 📊 **Live Metrics** — CPU/RAM/GPU/Latency bars updating every 1.2s
- 📈 **CPU History Graph** — canvas area chart, 48-point rolling window
- ⌨️ **Typewriter Output** — character-by-character response rendering
- 🎙️ **Voice Waveform** — 28 animated bars, reacts to speaking/loading state
- 🪟 **Glassmorphism Panels** — backdrop-filter blur, subtle borders
- 📡 **Scanline Overlay** — CRT aesthetic with moving scan beam
- 🎬 **Framer Motion** — slide-in panels, hover effects, animated presence

---

*Built for Stark Industries. Unauthorized access is monitored.*
