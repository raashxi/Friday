import piper
import wave
import time

model_path = "voices/en_US-lessac-medium.onnx"
voice = piper.PiperVoice.load(model_path)

text = "Hello, I am Friday, your local AI assistant. This is a speech synthesis test."
start = time.time()
audio = b""
for chunk in voice.synthesize(text):
    audio += chunk.audio_int16_bytes
duration = time.time() - start
print(f"Generated {len(audio)} bytes of audio in {duration:.2f}s")

with wave.open("tts_output.wav", "wb") as wf:
    wf.setnchannels(chunk.sample_channels)
    wf.setsampwidth(chunk.sample_width)
    wf.setframerate(chunk.sample_rate)
    wf.writeframes(audio)
print("Saved to tts_output.wav")
print(f"Sample rate: {chunk.sample_rate} Hz")
