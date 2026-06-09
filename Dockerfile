FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY server.py memory.py INTEGRATIONS.md ./
RUN mkdir -p voices && mkdir -p friday_memory

RUN pip install --no-cache-dir fastapi uvicorn requests piper-tts chromadb feedparser pydantic

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
