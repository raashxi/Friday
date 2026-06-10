export function useSpeech() {
  const speak = async (text) => {
    // Don't use browser TTS — Coqui handles all voice output via /speak/file
    try {
      const res = await fetch('http://localhost:8000/speak/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      }
    } catch (e) {
      console.log('Speech via API:', e.message);
    }
  };
  return { speak };
}
