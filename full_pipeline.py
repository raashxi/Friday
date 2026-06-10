import requests, json, subprocess, time, wave
from friday_tts import speak as tts_speak

# 1. Use a sample text as input (we'll swap in live STT later)
user_input = "Tell me a one-sentence productivity tip for today."

print(f"[INPUT] {user_input}")

# 2. Send to Ollama Mistral
print("[LLM] Thinking...")
start = time.time()
resp = requests.post("http://localhost:11434/api/generate",
    json={"model": "mistral:7b-instruct", "prompt": user_input, "stream": False})
response_text = json.loads(resp.text)["response"].strip()
llm_time = time.time() - start
print(f"[LLM] Response ({llm_time:.1f}s): {response_text}")

# 3. TTS with Piper
print("[TTS] Generating speech...")
voice = piper.PiperVoice.load("voices/en_US-hfc_female-medium.onnx")
audio = b""
for chunk in voice.synthesize(response_text):
    audio += chunk.audio_int16_bytes

with wave.open("pipeline_output.wav", "wb") as wf:
    wf.setnchannels(chunk.sample_channels)
    wf.setsampwidth(chunk.sample_width)
    wf.setframerate(chunk.sample_rate)
    wf.writeframes(audio)

print(f"[TTS] Generated {len(audio)} bytes")
print("[OUTPUT] Speaking...")
subprocess.call(["afplay", "pipeline_output.wav"])
print("[DONE] Full pipeline completed!")
