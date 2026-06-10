<p align="center">
  <img src="https://img.shields.io/badge/FRIDAY-Production%20Ready-00e5ff?style=for-the-badge&logo=starship&logoColor=white" />
  <img src="https://img.shields.io/badge/Phase-5%20Complete-00ff88?style=for-the-badge&logo=checkmarx&logoColor=white" />
  <img src="https://img.shields.io/badge/Apple-M2%20Silicon-000000?style=for-the-badge&logo=apple&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Alive-ff3366?style=for-the-badge&logo=heart&logoColor=white&labelColor=111" />
</p>

<h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=40&duration=3000&pause=1000&color=00E5FF&center=true&vCenter=true&random=false&width=600&lines=FRIDAY;Fully+Responsive+Intelligent;Digital+Assistant+%26+Yielder" alt="FRIDAY" />
</h1>

<p align="center">
  <i>"Good evening, Sir. I am Friday. All systems operational."</i>
</p>

---

## ⚡ What is FRIDAY?

FRIDAY is a **fully local, privacy-first AI assistant** inspired by Tony Stark's JARVIS/FRIDAY. It runs entirely on-device with zero cloud dependency — voice interaction, on-device LLM reasoning, persistent memory, task automation, and a cinematic Stark-grade dashboard.

**No API keys. No subscriptions. No data leaving your machine. Just you and your AI.**

---

## 🧠 System Architecture
┌──────────────────────────────────────────────────────────┐
│ FRIDAY CORE │
│ │
│ ┌───────────┐ ┌──────────┐ ┌─────────────────────┐ │
│ │ Whisper │──▶│ Ollama │──▶│ Coqui TTS (p243) │ │
│ │ (STT) │ │ Mistral │ │ JARVIS-like Voice │ │
│ └───────────┘ │ 7B Q4 │ └─────────────────────┘ │
│ └────┬─────┘ │
│ │ │
│ ┌─────────────────────▼──────────────────────────────┐ │
│ │ Memory (ChromaDB) │ │
│ │ Persistent Context & Identity │ │
│ └───────────────────────────────────────────────────┘ │
│ │ │
│ ┌─────────────────────▼──────────────────────────────┐ │
│ │ Action Engine (pyobjc) │ │
│ │ Calendar │ Notifications │ Files │ Slack │ RSS │ │
│ └───────────────────────────────────────────────────┘ │
│ │ │
│ ┌─────────────────────▼──────────────────────────────┐ │
│ │ FastAPI Server + Stark Dashboard │ │
│ │ Docker │ LaunchAgent │ ngrok Live Demo │ │
│ └───────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘

text

---

## 🚀 Live Demo

🌐 **Stark Dashboard:** [https://paragraph-shrouded-puzzling.ngrok-free.dev](https://paragraph-shrouded-puzzling.ngrok-free.dev)  
📡 **API Docs:** `/docs` on the API server (local: http://localhost:8000/docs)  
🎤 **Voice Activation:** Right `⌘` (Command) key

---

## ✨ Features

- **🎙️ Voice Interaction** – Real‑time speech‑to‑text with Whisper.cpp + CoreML (RTF 0.035)
- **🧠 On‑Device LLM** – Quantized Mistral‑7B‑Instruct via Ollama + Metal (19.75 tok/s)
- **💬 Natural Voice** – Coqui TTS VITS with a JARVIS‑inspired voice (speaker p243)
- **🖥️ Stark Dashboard** – React + Vite + Framer Motion cinematic UI with live chat, morning brief, and system metrics
- **🧩 Persistent Memory** – ChromaDB vector store retains conversations and identity
- **⚙️ Task Automation** – Calendar, system notifications, file organizer, email brief, Slack webhooks
- **☀️ Morning Brief Agent** – Auto‑fetches news (RSS) + calendar → LLM summary → spoken audio + Slack
- **🚢 Docker Support** – Containerized API for consistent deployment
- **🔁 macOS LaunchAgent** – Auto‑starts on boot, survives crashes
- **🔌 Integrations** – Slack, Make.com, RSS feeds, REST APIs
- **🌍 Public Demo** – Instant ngrok tunnel for live sharing

---

## 📦 Project Structure
friday_phase0/
├── wake_friday.sh # One‑command wake sequence with startup sound
├── friday_daemon.py # Push‑to‑talk background service
├── server.py # FastAPI server (REST endpoints)
├── friday_tts.py # Unified TTS module (Coqui JARVIS voice)
├── memory.py # ChromaDB memory layer
├── morning_brief.py # Automated daily briefing agent
├── file_organizer.py # Downloads folder auto‑organizer
├── email_brief.py # Gmail unread summary
├── full_pipeline.py # STT → LLM → TTS test
├── voice_with_memory.py # Voice input with context
├── Dockerfile # Container build
├── com.friday.daemon.plist # macOS LaunchAgent config
├── dashboard/ # React Stark UI
│ ├── src/ # Components & hooks
│ ├── vite.config.js # Build config with ngrok proxy
│ └── ...
├── voices/ # TTS model configs (models excluded)
└── whisper.cpp/ # STT engine (submodule)

text

---

## ⚙️ Quick Start (macOS)

```bash
# 1. Wake everything up
./wake_friday.sh

# 2. Open the dashboard
open http://localhost:5173

# 3. Or let the world see it
ngrok http 5173
📈 Phase 5 Completion (Current)
Component	Status	Metric
STT (Whisper)	✅	0.035 RTF
LLM (Mistral‑7B)	✅	19.75 tok/s
TTS (Coqui VITS)	✅	p243 JARVIS voice
Dashboard	✅	Live chat + morning brief
Memory	✅	Persistent context
Docker	✅	Containerized API
macOS Service	✅	Auto‑start on boot
Integrations	✅	Slack, Make.com, RSS
🔮 The Road Ahead
FRIDAY is on a journey to become the most cinematic, capable personal AI in existence. Here's what's coming:

Phase 6 – Autonomous Agents
Multi‑step task decomposition & execution

Web browsing & research agent

Code generation & self‑debugging

Phase 7 – True JARVIS Experience
Voice cloning from Paul Bettany (Coqui XTTS v2)

Holographic‑style 3D dashboard

Gesture & presence detection

Phase 8 – Iron Man Suit (Maybe)
IoT & smart home control

Real‑time computer vision

And yes, maybe a suit.

<p align="center"> <b>Built with ❤️ by Rashid</b><br> <sub>One step closer to the movies every day.</sub> </p> EOF git add README.md && git commit -m "Update README: cinematic Phase 5 complete" && git push ```
 
