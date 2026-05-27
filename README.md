# FRIDAY — Fully Responsive Intelligent Digital Assistant

A fully local, modular AI assistant running on Apple Silicon (M2) with voice interaction, task automation, memory, and context awareness — built as a private, offline-first alternative to cloud assistants.

## Phase 0: Feasibility Benchmarks ✅

| Module | Technology | Metric |
|--------|-----------|--------|
| STT | Whisper.cpp + CoreML/Metal | 0.035 RTF (35x real-time) |
| LLM | Mistral-7B-Instruct (Q4_K_M) via Ollama | 19.75 tok/s on-device |
| TTS | Piper TTS (hfc_female) | <150ms generation |

## Architecture

Modular microservices (STT, LLM, TTS, ChromaDB memory, action engine) over local message bus with macOS automation via pyobjc for calendar, notifications, and file operations. Privacy-first: 80% local processing with smart cloud fallback.

## Tech Stack

Python, Whisper.cpp, Ollama, Mistral-7B, Piper TTS, CoreML, Metal, ChromaDB, pyobjc, Docker, FastAPI, Redis, AppleScript

## Next: Phase 1 — Requirements & Full System Architecture
