#!/bin/bash

echo "🧹 Cleaning up Node processes..."

# Kill any Node processes using ports 3000 or 3001
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true

# Kill any remaining npm or node processes related to this project
pkill -f "npm.*start" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

echo "✅ Cleanup complete! Ports 3000 and 3001 should now be free."

# Verify ports are free
if lsof -i :3000,3001 >/dev/null 2>&1; then
    echo "⚠️  Warning: Some processes may still be running:"
    lsof -i :3000,3001
else
    echo "✅ Confirmed: Ports 3000 and 3001 are now available."
fi 