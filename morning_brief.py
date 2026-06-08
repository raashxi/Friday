import requests, json, subprocess, time, wave, feedparser
import piper
from EventKit import EKEventStore
from datetime import datetime, timedelta

print("\n===== FRIDAY SMART MORNING BRIEF =====\n")

# 1. Fetch Calendar Events
print("[CALENDAR] Fetching today's events...")
store = EKEventStore.alloc().init()
store.requestAccessToEntityType_completion_(0, lambda g, e: None)
predicate = store.predicateForEventsWithStartDate_endDate_calendars_(
    datetime.now(), datetime.now() + timedelta(days=1), None
)
events = store.eventsMatchingPredicate_(predicate)
calendar_text = ""
if events:
    for e in events:
        calendar_text += f"- {e.title()} at {e.startDate().strftime('%H:%M')}\n"
else:
    calendar_text = "No events scheduled for today."
print(f"[CALENDAR] Found {len(events) if events else 0} events")

# 2. Fetch News via RSS (bypasses API restrictions)
print("[NEWS] Fetching headlines via RSS...")
news_text = ""
try:
    feed = feedparser.parse("https://feeds.bbci.co.uk/news/world/rss.xml")
    for entry in feed.entries[:5]:
        news_text += f"- {entry.title}\n"
    print(f"[NEWS] Fetched {min(5, len(feed.entries))} headlines")
except:
    try:
        resp = requests.get("https://newsapi.org/v2/top-headlines?country=in&pageSize=5&apiKey=60b38ee6223b4308a64699d4d9a2a6d5")
        articles = resp.json().get("articles", [])
        for a in articles:
            news_text += f"- {a['title']}\n"
        print(f"[NEWS] Fetched {len(articles)} headlines via API")
    except:
        news_text = "News feed unavailable."
        print("[NEWS] All sources failed")

# 3. Build Prompt & Get AI Brief
prompt = f"""You are FRIDAY, a personal AI assistant. Generate a friendly, concise morning briefing based on:

TODAY'S CALENDAR:
{calendar_text}

TOP NEWS HEADLINES:
{news_text}

Speak naturally. Start with "Good morning, Rashid." Keep it under 30 seconds when spoken. Make it motivating and useful."""

print("[LLM] Generating your morning brief...")
resp = requests.post("http://localhost:11434/api/generate",
    json={"model": "mistral:7b-instruct", "prompt": prompt, "stream": False})
brief = json.loads(resp.text)["response"].strip()
print(f"[LLM] Brief generated ({len(brief)} chars)")
print(f"\n--- BRIEF ---\n{brief}\n-------------")

# 4. Speak it
print("[TTS] Speaking...")
voice = piper.PiperVoice.load("voices/en_US-hfc_female-medium.onnx")
audio = b""
for chunk in voice.synthesize(brief):
    audio += chunk.audio_int16_bytes
with wave.open("morning_brief.wav", "wb") as wf:
    wf.setnchannels(chunk.sample_channels)
    wf.setsampwidth(chunk.sample_width)
    wf.setframerate(chunk.sample_rate)
    wf.writeframes(audio)
subprocess.call(["afplay", "morning_brief.wav"])
print("\n[DONE] Morning brief delivered!")
