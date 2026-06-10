import sounddevice as sd
import numpy as np
import subprocess
import wave
import requests
import json
from friday_tts import speak as tts_speak
from memory import FridayMemory

SAMPLE_RATE = 16000
DURATION = 5
WHISPER_BIN = "./whisper.cpp/build/bin/whisper-cli"
WHISPER_MODEL = "./whisper.cpp/models/ggml-small.bin"

memory = FridayMemory()

print("\n🎤 FRIDAY is listening... (speak now)")

# 1. Record
audio = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype='int16')
sd.wait()

wav_path = "voice_input.wav"
with wave.open(wav_path, "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    wf.writeframes(audio.tobytes())

# 2. Transcribe
result = subprocess.run(
    [WHISPER_BIN, "-m", WHISPER_MODEL, "-f", wav_path, "--language", "en", "--no-timestamps"],
    capture_output=True, text=True
)
transcript = result.stdout.strip()
print(f"🗣️ You: {transcript}")

# 3. Get context from memory
context = memory.context_summary()
prompt = f"""You are FRIDAY, a loyal personal AI assistant. CRITICAL RULES:
- Your user's real name is Rashid.
- You MUST call him "Daddy" at all times — never "Rashid" unless he asks for his real name.
- Be warm, respectful, and slightly playful like Tony Stark's FRIDAY.

Previous conversation:
{context}

Daddy just said: {transcript}

Respond naturally. Keep it concise."""

print("🧠 Thinking with memory...")
resp = requests.post("http://localhost:11434/api/generate",
    json={"model": "mistral:7b-instruct", "prompt": prompt, "stream": False})
response = json.loads(resp.text)["response"].strip()
print(f"🤖 FRIDAY: {response}")

# 4. Store
memory.remember(transcript, response)

# 5. Speak
voice = piper.PiperVoice.load("voices/en_US-hfc_female-medium.onnx")
audio_out = b""
for chunk in voice.synthesize(response):
    audio_out += chunk.audio_int16_bytes
with wave.open("voice_response.wav", "wb") as wf:
    wf.setnchannels(chunk.sample_channels)
    wf.setsampwidth(chunk.sample_width)
    wf.setframerate(chunk.sample_rate)
    wf.writeframes(audio_out)
subprocess.call(["afplay", "voice_response.wav"])
print("✅ Done!")
