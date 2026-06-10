import sounddevice as sd
import numpy as np
import subprocess
import wave
import requests
import json
from friday_tts import speak as tts_speak
from memory import FridayMemory
from pynput import keyboard
import threading
import os
import time

HOME = os.path.expanduser("~")
SAMPLE_RATE = 16000
DURATION = 5
WHISPER_BIN = f"{HOME}/friday_phase0/whisper.cpp/build/bin/whisper-cli"
WHISPER_MODEL = f"{HOME}/friday_phase0/whisper.cpp/models/ggml-small.bin"


memory = FridayMemory()
is_listening = False

def ensure_ollama():
    """Start Ollama if not running"""
    try:
        requests.get("http://localhost:11434/api/tags", timeout=2)
    except:
        print("🔄 Starting Ollama...")
        subprocess.Popen(["ollama", "serve"], 
                        stdout=subprocess.DEVNULL, 
                        stderr=subprocess.DEVNULL)
        time.sleep(3)  # Wait for it to boot

def speak(text):
    def _speak():
        tts_speak(text)
    threading.Thread(target=_speak).start()

def process_command():
    global is_listening
    if is_listening:
        return
    is_listening = True
    
    subprocess.call(["osascript", "-e", 'display notification "Listening..." with title "FRIDAY"'])
    
    audio = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype='int16')
    sd.wait()
    
    wav_path = "/tmp/friday_input.wav"
    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio.tobytes())
    
    result = subprocess.run(
        [WHISPER_BIN, "-m", WHISPER_MODEL, "-f", wav_path, "--language", "en", "--no-timestamps"],
        capture_output=True, text=True
    )
    transcript = result.stdout.strip()
    print(f"\n🗣️ Daddy: {transcript}")
    
    if not transcript or transcript in ["[Music]", ".", ""]:
        is_listening = False
        return
    
    ensure_ollama()
    
    context = memory.context_summary()
    prompt = f"""You are FRIDAY. Call your user "Daddy". His real name is Rashid. Be warm, concise, helpful. Max 2 sentences.

Previous context:
{context}

Daddy: {transcript}
FRIDAY:"""
    
    resp = requests.post("http://localhost:11434/api/generate",
        json={"model": "mistral:7b-instruct", "prompt": prompt, "stream": False})
    response = json.loads(resp.text)["response"].strip()
    print(f"🤖 FRIDAY: {response}")
    
    memory.remember(transcript, response)
    speak(response)
    is_listening = False

def on_press(key):
    if key == keyboard.Key.cmd_r:
        threading.Thread(target=process_command).start()

print("""
╔══════════════════════════════════╗
║      FRIDAY DAEMON ONLINE       ║
║  Tap Right ⌘ to talk            ║
║  Press Ctrl+C to exit           ║
╚══════════════════════════════════╝
""")

ensure_ollama()
print("✅ Ollama ready.")

with keyboard.Listener(on_press=on_press) as listener:
    listener.join()
