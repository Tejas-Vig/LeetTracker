#!/bin/bash

# LeetTracker Run Script
# Starts the server on localhost:8080

echo "🚀 Starting LeetTracker Server..."
echo ""

# Check if compiled class exists
if [ ! -f "backend/LeetTrackerServer.class" ]; then
    echo "❌ Compiled class not found. Please run './build.sh' first"
    exit 1
fi

# Check if json.jar exists
if [ ! -f "lib/json.jar" ]; then
    echo "❌ org.json library not found. Please run './build.sh' first"
    exit 1
fi

# Start server
echo "📊 LeetTracker running on: http://127.0.0.1:8080"
echo "📁 Data saved to: $(pwd)/data/problems.json"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

java -cp "lib/json.jar:backend" LeetTrackerServer
