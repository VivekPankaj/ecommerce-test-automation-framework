#!/bin/bash
# =============================================================================
# Vulcan E-Commerce Test Dashboard Launcher
# =============================================================================

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║           🚀 Vulcan E-Commerce Test Dashboard                         ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Kill any existing process on port 3001
echo "🔄 Checking for existing processes on port 3001..."
lsof -ti :3001 | xargs kill -9 2>/dev/null && echo "   ✓ Killed existing process" || echo "   ✓ No existing process found"

# Wait a moment
sleep 1

# Start the dashboard server
echo ""
echo "🚀 Starting Dashboard Server..."
echo ""

cd "$SCRIPT_DIR/dashboard"
node server.js &

# Wait for server to start
sleep 2

# Check if server started successfully
if lsof -i :3001 > /dev/null 2>&1; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════"
    echo "✅ Dashboard is running!"
    echo ""
    echo "   📊 Dashboard URL: http://localhost:3001/"
    echo "   📡 API Endpoint:  http://localhost:3001/api/modules"
    echo ""
    echo "   💡 Press Ctrl+C to stop the server"
    echo "═══════════════════════════════════════════════════════════════════════"
    echo ""
    
    # Open in browser
    open http://localhost:3001/
    
    # Keep script running
    wait
else
    echo ""
    echo "❌ Failed to start dashboard server"
    echo "   Please check for errors and try again"
    exit 1
fi
