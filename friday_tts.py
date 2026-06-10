import torch
# Fix PyTorch 2.6 loading issue
_original_load = torch.load
def _patched_load(*args, **kwargs):
    kwargs['weights_only'] = False
    return _original_load(*args, **kwargs)
torch.load = _patched_load

from TTS.api import TTS
import subprocess
import wave
import os

VOICE_MODEL = "tts_models/en/vctk/vits"
VOICE_SPEAKER = "p243"
OUTPUT_PATH = "/tmp/friday_tts_output.wav"

_tts = None

def _get_tts():
    global _tts
    if _tts is None:
        _tts = TTS(VOICE_MODEL, gpu=False)
    return _tts

def speak(text: str, play: bool = True) -> str:
    """Convert text to speech. Returns path to wav file."""
    tts = _get_tts()
    tts.tts_to_file(text=text, speaker=VOICE_SPEAKER, file_path=OUTPUT_PATH)
    if play:
        subprocess.call(["afplay", OUTPUT_PATH])
    return OUTPUT_PATH

def speak_file(text: str) -> str:
    """Speak and return the audio file path."""
    return speak(text, play=True)

# Test
if __name__ == "__main__":
    print("🔊 Testing FRIDAY voice...")
    speak("Hello Daddy. I am Friday. Voice systems online.")
    print("✅ TTS module ready.")
