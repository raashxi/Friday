<div align="center">

<!-- Animated typing header -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=32&duration=3000&pause=1200&color=00E5FF&center=true&vCenter=true&width=700&height=80&lines=FRIDAY+AI+Assistant;Phase+5+%E2%80%94+Complete.;All+Systems+Operational.;Zero+Cloud.+Full+Control." alt="FRIDAY Typing SVG" />
</a>

<br/>

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/STATUS-OPERATIONAL-00e5ff?style=for-the-badge&logo=statuspage&logoColor=black&labelColor=0a0f1e" />
  <img src="https://img.shields.io/badge/PHASE-5%20COMPLETE-00e5ff?style=for-the-badge&logo=checkmarx&logoColor=black&labelColor=0a0f1e" />
  <img src="https://img.shields.io/badge/SILICON-Apple%20M2-00e5ff?style=for-the-badge&logo=apple&logoColor=black&labelColor=0a0f1e" />
  <img src="https://img.shields.io/badge/CLOUD-ZERO%20DEPENDENCY-00e5ff?style=for-the-badge&logo=cloudflare&logoColor=black&labelColor=0a0f1e" />
</p>
<p>
  <img src="https://img.shields.io/badge/LLM-Mistral--7B%20%40%2019.75%20tok%2Fs-22c55e?style=flat-square&logo=meta&logoColor=white&labelColor=0a0f1e" />
  <img src="https://img.shields.io/badge/STT-Whisper.cpp-22c55e?style=flat-square&logo=openai&logoColor=white&labelColor=0a0f1e" />
  <img src="https://img.shields.io/badge/TTS-Coqui%20JARVIS%20Voice-22c55e?style=flat-square&logo=soundcloud&logoColor=white&labelColor=0a0f1e" />
  <img src="https://img.shields.io/badge/Dashboard-React%20%2B%20Framer%20Motion-22c55e?style=flat-square&logo=react&logoColor=white&labelColor=0a0f1e" />
  <img src="https://img.shields.io/badge/Memory-ChromaDB-22c55e?style=flat-square&logo=databricks&logoColor=white&labelColor=0a0f1e" />
</p>

<br/>

> *"Good evening, Sir. I am FRIDAY. All systems operational."*

<br/>

</div>

---

## ◈ What is FRIDAY?

FRIDAY is a **fully local, privacy-first AI assistant** that runs entirely on your machine — no API keys, no subscriptions, no data leaving your device. Ever. Speak a command and watch a complete intelligence pipeline activate: your voice is transcribed by Whisper, processed by a locally-running Mistral-7B, spoken back in a hand-cloned JARVIS voice via Coqui TTS, and stored in a persistent ChromaDB memory layer — all while a cinematic React dashboard renders everything in real time. Automate your morning brief, manage your calendar, push Slack summaries, and organize files through a single unified interface. This is what happens when you decide the cloud was never necessary.

> **No API keys. No subscriptions. No surveillance. Just raw, local intelligence.**

---

## ◈ System Architecture

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                         F R I D A Y  —  LOCAL AI PIPELINE                      ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║   🎙  VOICE INPUT                                                                ║
║       Microphone ──► Whisper.cpp (base.en) ──► Transcript                      ║
║                      [ ~300ms · M2 Neural Engine · On-Device ]                  ║
║                                   │                                              ║
║                                   ▼                                              ║
║   🧠  INTELLIGENCE CORE                                                          ║
║       Transcript ──► Ollama ──► Mistral-7B-Instruct                            ║
║                      [ 19.75 tok/s · 4-bit quantized · M2 GPU ]                 ║
║                                   │                                              ║
║              ┌────────────────────┼────────────────────┐                        ║
║              ▼                    ▼                     ▼                        ║
║   💾  MEMORY LAYER         🗣  VOICE OUTPUT      ⚡  ACTION ENGINE              ║
║   ChromaDB Vector DB   Coqui TTS (JARVIS)     ┌──────────────────┐             ║
║   Semantic Recall      Hand-cloned voice      │  📅 Calendar     │             ║
║   Conversation Ctx     VCTK Speaker 6097      │  🔔 Notifications │             ║
║   Long-term Storage    [ ~800ms latency ]     │  💬 Slack API    │             ║
║                                               │  📰 RSS Feeds    │             ║
║                                               └──────────────────┘             ║
║                                   │                                              ║
║                                   ▼                                              ║
║   🖥  STARK DASHBOARD + API SERVER                                               ║
║       FastAPI (:8000) ──► React + Vite + Framer Motion                         ║
║       /ask · /brief · /memory · /status                                          ║
║                                   │                                              ║
║              ┌────────────────────┼────────────────────┐                        ║
║              ▼                    ▼                     ▼                        ║
║        🐳 Docker           🍎 LaunchAgent          🌐 ngrok                     ║
║        Containerized       Auto-start on boot      Public HTTPS tunnel          ║
║        Portable Deploy     macOS background svc    Remote access anywhere       ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

---

## ◈ Live Demo

> **The system is active. The door is open.**

| Interface | URL |
|-----------|-----|
| 🌐 **Public Demo (ngrok)** | `https://friday-stark.ngrok-free.app` |
| 🖥 **Local Dashboard** | `http://localhost:5173` |
| ⚙️ **API Server** | `http://localhost:8000` |
| 📡 **API Docs** | `http://localhost:8000/docs` |

---

## ◈ Features

- 🎙 **Wake-word voice interaction** — Whisper.cpp on the Neural Engine; speaks back in a hand-cloned JARVIS voice. Real two-way conversation, no internet required.
- 🧠 **On-device LLM** — Mistral-7B-Instruct running through Ollama at **19.75 tokens/second** on Apple M2. No OpenAI. No Anthropic. No bill.
- 🗣 **Natural JARVIS voice** — Coqui TTS fine-tuned on VCTK speaker 6097. Smooth, measured, cinematic. The voice you've always wanted your computer to have.
- 🖥 **Stark Dashboard** — Full-screen holographic UI built with **React + Vite + Framer Motion**. Arc reactor animation. Rotating 3D wireframe sphere. Real-time system metrics. Particle field background. Glassmorphism panels.
- 💾 **Persistent memory** — ChromaDB vector database. FRIDAY remembers what you've discussed, recalls relevant context automatically, and builds a long-term picture of your world.
- ⚡ **Task automation engine** — File organization, email triage, notification dispatch. Describe a task in plain English and watch it execute.
- 🌅 **Morning brief agent** — Every morning: live news via RSS + calendar events + weather → Mistral-7B synthesis → spoken brief via JARVIS TTS + pushed to Slack. One pipeline, zero manual effort.
- 🐳 **Docker deployment** — Fully containerized. Reproducible. Portable. Run FRIDAY on any machine in under five minutes.
- 🍎 **macOS LaunchAgent** — FRIDAY starts silently at login. Always on. Always listening. You never have to think about starting it.
- 💬 **Slack integration** — Morning briefs, alerts, and query responses piped directly to your workspace via Slack webhooks.
- 🔗 **Make.com + RSS** — Automate multi-step workflows. Connect anything with an API to FRIDAY's intelligence layer.
- 🌐 **Public ngrok tunnel** — Expose FRIDAY's API to the internet with a single command. Access your local AI from anywhere in the world.

---

## ◈ Project Structure

```
friday/
│
├── 🚀  wake_friday.sh          # Master launcher — one command to rule them all
├── 🤖  friday_daemon.py        # Core daemon loop — wake word, STT, LLM, TTS
├── ⚙️  server.py               # FastAPI server — /ask, /brief, /memory, /status
├── 🗣  friday_tts.py           # Coqui TTS engine — JARVIS voice synthesis
├── 💾  memory.py               # ChromaDB interface — store, recall, semantics
├── 🌅  morning_brief.py        # Brief agent — RSS + calendar → LLM → speech + Slack
├── 📁  file_organizer.py       # Autonomous file organization via LLM reasoning
├── 📧  email_brief.py          # Email triage and summary agent
├── 🔗  full_pipeline.py        # End-to-end integration test runner
├── 🎙  voice_with_memory.py    # Voice loop with persistent ChromaDB memory
│
├── 🐳  Dockerfile              # Container definition — reproducible anywhere
├── 📦  docker-compose.yml      # Multi-service orchestration
├── 🍎  com.friday.assistant.plist  # macOS LaunchAgent — boot persistence
│
├── 🖥  dashboard/              # React + Vite + Framer Motion frontend
│   ├── src/
│   │   ├── App.jsx             # Main layout — three-panel Stark interface
│   │   ├── components/
│   │   │   ├── ArcReactor.jsx          # Canvas arc reactor animation
│   │   │   ├── ParticleField.jsx       # Floating particle background
│   │   │   ├── VoiceVisualizer.jsx     # Real-time waveform bars
│   │   │   ├── HolographicDisplay.jsx  # 3D wireframe sphere + response
│   │   │   ├── SystemMetrics.jsx       # CPU / RAM / GPU / latency gauges
│   │   │   └── StatusBar.jsx           # Top bar + bottom controls
│   │   └── hooks/
│   │       ├── useApi.js               # Backend API integration
│   │       └── useAnimation.js         # Typewriter, waveform, metrics
│   └── vite.config.js
│
├── 🎤  voices/                 # Cloned TTS voice models
│   └── jarvis_v2.pth           # Fine-tuned VCTK 6097 checkpoint
│
└── 🔊  whisper.cpp/            # Compiled Whisper inference engine
    ├── main                    # CLI binary (M2 Metal backend)
    └── models/
        └── ggml-base.en.bin    # Quantized English model
```

---

## ◈ Quick Start

```bash
# Clone the system
git clone https://github.com/rashid/friday.git
cd friday

# One command. Everything activates.
./wake_friday.sh
```

```
[FRIDAY] Initializing systems...
[FRIDAY] Loading Whisper model .............. ✓  (base.en · 142MB)
[FRIDAY] Starting Ollama + Mistral-7B ....... ✓  (19.75 tok/s on M2)
[FRIDAY] Coqui TTS engine ready ............. ✓  (JARVIS voice · VCTK 6097)
[FRIDAY] ChromaDB memory layer online ....... ✓  (2,847 stored vectors)
[FRIDAY] FastAPI server listening ........... ✓  (http://localhost:8000)
[FRIDAY] Stark Dashboard launching .......... ✓  (http://localhost:5173)
[FRIDAY] ngrok tunnel established ........... ✓  (https://friday-stark.ngrok-free.app)

Good morning, Sir. All systems are operational. How can I assist you today?
```

---

## ◈ Phase 5 Status

| Component | Status | Detail |
|-----------|--------|--------|
| 🎙 **Speech-to-Text** | ✅ Production | Whisper.cpp base.en · ~300ms · M2 Neural Engine |
| 🧠 **On-Device LLM** | ✅ Production | Mistral-7B-Instruct · 19.75 tok/s · 4-bit quant |
| 🗣 **Text-to-Speech** | ✅ Production | Coqui TTS · JARVIS voice clone · VCTK 6097 |
| 🖥 **Stark Dashboard** | ✅ Production | React + Vite + Framer Motion · Full holographic UI |
| 💾 **Memory System** | ✅ Production | ChromaDB · semantic search · persistent recall |
| ⚡ **Action Engine** | ✅ Production | Calendar · Notifications · File Organizer · Email |
| 🐳 **Docker** | ✅ Production | Containerized · docker-compose · reproducible |
| 🍎 **macOS Service** | ✅ Production | LaunchAgent · boot persistence · silent background |
| 💬 **Slack Integration** | ✅ Production | Webhook delivery · morning brief · alerts |
| 🌅 **Morning Brief** | ✅ Production | RSS + Calendar → Mistral → Speech + Slack |
| 🌐 **ngrok Tunnel** | ✅ Production | Public HTTPS · remote access · zero config |
| 📡 **FastAPI Server** | ✅ Production | /ask · /brief · /memory · /status · OpenAPI docs |

---

## ◈ The Road Ahead

The system breathes. The foundation is solid. What comes next will make Phase 5 look like a warm-up.

### Phase 6 — Autonomous Agents *(In Development)*
> *"Sir, I've already handled it."*

FRIDAY stops waiting to be asked. A multi-agent framework — one coordinator, multiple specialized sub-agents — running in parallel. FRIDAY monitors your email, calendar, and Slack in the background, surfaces what matters, and executes routine tasks without prompting. ReAct-pattern reasoning chains. Tool-use loops that self-correct. The shift from assistant to autonomous partner.

### Phase 7 — True JARVIS *(On the Horizon)*
> *"Shall I render the holographic display, Sir?"*

XTTS v2 for zero-shot voice cloning with emotional range that matches the scene. A complete dashboard overhaul: true 3D holographic UI built in Three.js and WebGL, with real-time room-scale projections via the browser's WebXR API. FRIDAY speaks with nuance — urgent when threat levels rise, measured when briefing, warm when it's just the two of you. This is where the movie begins.

### Phase 8 — Iron Man Suite *(The Endgame)*
> *"Repulsor systems at 400%. Ready when you are."*

Computer vision module via CLIP and YOLOv8 — FRIDAY sees your screen, your camera feed, your environment, and reasons about it. IoT integration bridges the digital and physical: smart home, wearables, environmental sensors feeding a live situational awareness layer. The suit is the interface. The world is the display. Phase 8 is not a software update. It's a lifestyle.

---

<div align="center">

<br/>

```
╔═══════════════════════════════════════════════╗
║   F · R · I · D · A · Y                      ║
║   Female Replacement Intelligent              ║
║   Digital Assistant Youth                    ║
║                                               ║
║   Phase 5 of ∞                               ║
║   Ludhiana → The World                       ║
╚═══════════════════════════════════════════════╝
```

<br/>

Built with ❤️ by **Rashid**

*One step closer to the movies every day.*

<br/>

<img src="https://img.shields.io/badge/made%20with-obsession-00e5ff?style=flat-square&labelColor=0a0f1e" />
<img src="https://img.shields.io/badge/runs%20on-local%20iron-00e5ff?style=flat-square&labelColor=0a0f1e" />
<img src="https://img.shields.io/badge/cloud%20required-never-00e5ff?style=flat-square&labelColor=0a0f1e" />

<br/><br/>

*"The truth is... I am Iron Man."*

</div> 