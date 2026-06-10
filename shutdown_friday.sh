#!/bin/bash
echo "Shutting down FRIDAY..."

# Kill API server
if [ -f /tmp/friday_api.pid ]; then
    kill $(cat /tmp/friday_api.pid) 2>/dev/null
    rm /tmp/friday_api.pid
fi

# Kill dashboard
if [ -f /tmp/friday_dash.pid ]; then
    kill $(cat /tmp/friday_dash.pid) 2>/dev/null
    rm /tmp/friday_dash.pid
fi

# Cleanup
rm -f /tmp/friday_*.pid

osascript -e 'display notification "Goodbye, Daddy." with title "FRIDAY"'
echo "✅ FRIDAY offline."
