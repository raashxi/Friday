from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess, json, requests, wave, os, time
import piper
from memory import FridayMemory

app = FastAPI(title="FRIDAY API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
memory = FridayMemory()

VOICE_PATH = os.path.expanduser("~/friday_phase0/voices/en_US-hfc_female-medium.onnx")
WHISPER_BIN = os.path.expanduser("~/friday_phase0/whisper.cpp/build/bin/whisper-cli")
WHISPER_MODEL = os.path.expanduser("~/friday_phase0/whisper.cpp/models/ggml-small.bin")

class AskRequest(BaseModel):
    question: str

class SpeakRequest(BaseModel):
    text: str

def ensure_ollama():
    try:
        requests.get("http://localhost:11434/api/tags", timeout=2)
    except:
        subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(3)

def ask_mistral(prompt: str) -> str:
    ensure_ollama()
    resp = requests.post("http://localhost:11434/api/generate",
        json={"model": "mistral:7b-instruct", "prompt": prompt, "stream": False})
    return json.loads(resp.text)["response"].strip()

@app.get("/")
def root():
    return {"status": "online", "assistant": "FRIDAY"}

@app.post("/ask")
def ask(req: AskRequest):
    context = memory.context_summary()
    prompt = f"""You are FRIDAY. Call the user "Daddy". Be concise and helpful.

Previous context:
{context}

Daddy: {req.question}
FRIDAY:"""
    response = ask_mistral(prompt)
    memory.remember(req.question, response)
    return {"question": req.question, "response": response}

@app.post("/speak")
def speak(req: SpeakRequest):
    voice = piper.PiperVoice.load(VOICE_PATH)
    audio = b""
    for chunk in voice.synthesize(req.text):
        audio += chunk.audio_int16_bytes
    path = "/tmp/friday_api_speak.wav"
    with wave.open(path, "wb") as wf:
        wf.setnchannels(chunk.sample_channels)
        wf.setsampwidth(chunk.sample_width)
        wf.setframerate(chunk.sample_rate)
        wf.writeframes(audio)
    subprocess.call(["afplay", path])
    return {"spoken": req.text}

@app.post("/brief")
def morning_brief():
    from EventKit import EKEventStore
    from datetime import datetime, timedelta
    import feedparser
    
    # Calendar
    store = EKEventStore.alloc().init()
    store.requestAccessToEntityType_completion_(0, lambda g, e: None)
    predicate = store.predicateForEventsWithStartDate_endDate_calendars_(
        datetime.now(), datetime.now() + timedelta(days=1), None
    )
    events = store.eventsMatchingPredicate_(predicate)
    cal = "\n".join([f"- {e.title()} at {e.startDate().strftime('%H:%M')}" for e in events]) or "No events."
    
    # News
    news = ""
    try:
        feed = feedparser.parse("https://feeds.bbci.co.uk/news/world/rss.xml")
        news = "\n".join([f"- {e.title}" for e in feed.entries[:5]])
    except:
        news = "News unavailable."
    
    prompt = f"""Generate a friendly morning briefing. Start with "Good morning, Daddy."
Calendar: {cal}
News: {news}
Keep it under 30 seconds spoken."""
    
    brief = ask_mistral(prompt)
    return {"brief": brief, "calendar": cal, "news": news}

@app.get("/memory")
def get_memory():
    return {"context": memory.context_summary()}

print("🚀 FRIDAY API running at http://localhost:8000")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)


@app.get("/brief")
def morning_brief_get():
    return morning_brief()

@app.get("/ask")
def ask_get(question: str = "Hello"):
    return ask(AskRequest(question=question))
from fastapi.responses import FileResponse

@app.post("/speak/file")
def speak_file(req: SpeakRequest):
    voice = piper.PiperVoice.load(VOICE_PATH)
    audio = b""
    for chunk in voice.synthesize(req.text):
        audio += chunk.audio_int16_bytes
    path = "/tmp/friday_api_speak.wav"
    with wave.open(path, "wb") as wf:
        wf.setnchannels(chunk.sample_channels)
        wf.setsampwidth(chunk.sample_width)
        wf.setframerate(chunk.sample_rate)
        wf.writeframes(audio)
    return FileResponse(path, media_type="audio/wav", filename="friday_response.wav")
