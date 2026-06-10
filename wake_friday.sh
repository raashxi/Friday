#!/bin/bash

# ⚡ FRIDAY WAKE SEQUENCE ⚡
# One command to bring everything online

FRIDAY_DIR="$HOME/friday_phase0"
ENV="$FRIDAY_DIR/friday_env/bin/python3"

clear
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║                                              ║"
echo "║           ███████╗██████╗ ██╗██████╗          ║"
echo "║           ██╔════╝██╔══██╗██║██╔══██╗         ║"
echo "║           █████╗  ██████╔╝██║██║  ██║         ║"
echo "║           ██╔══╝  ██╔══██╗██║██║  ██║         ║"
echo "║           ██║     ██║  ██║██║██████╔╝         ║"
echo "║           ╚═╝     ╚═╝  ╚═╝╚═╝╚═════╝          ║"
echo "║                                              ║"
echo "║         Fully Responsive Intelligent         ║"
echo "║             Digital Assistant                ║"
echo "║                                              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Play startup sound
echo "�� Initializing systems..."
afplay "$FRIDAY_DIR/startup.wav" &

# Start Ollama if not running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "🧠 Starting neural core (Ollama)..."
    ollama serve > /tmp/ollama.log 2>&1 &
    sleep 3
fi

# Start FRIDAY API server
echo "🌐 Starting API server..."
cd "$FRIDAY_DIR"
$ENV server.py > /tmp/friday_api.log 2>&1 &
API_PID=$!
sleep 2

# Start dashboard
echo "🖥️  Starting dashboard..."
cd "$FRIDAY_DIR/dashboard/friday-ai"
npm run dev -- --host 0.0.0.0 > /tmp/friday_dash.log 2>&1 &
DASH_PID=$!
sleep 2

# Store PIDs for shutdown
echo $API_PID > /tmp/friday_api.pid
echo $DASH_PID > /tmp/friday_dash.pid

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║        FRIDAY IS ONLINE                      ║"
echo "║                                              ║"
echo "║  Dashboard:  http://localhost:5173           ║"
echo "║  API:        http://localhost:8000           ║"
echo "║  API Docs:   http://localhost:8000/docs      ║"
echo "║                                              ║"
echo "║  Run './shutdown_friday.sh' to stop          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Send welcome notification
osascript -e 'display notification "All systems online, Daddy." with title "FRIDAY"'

# Wait for any key to show menu
echo "Press Enter to start voice daemon, or Ctrl+C to exit..."
read

# Start voice daemon
echo "🎤 Starting voice daemon..."
$ENV "$FRIDAY_DIR/friday_daemon.py"
