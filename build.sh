#!/bin/bash

# LeetTracker Build Script
# Compiles Java backend with required dependencies

echo "🔨 Building LeetTracker Backend..."

# Create data directory
mkdir -p data

# Check if json library exists
if [ ! -f "lib/json.jar" ]; then
    echo "📥 Downloading org.json library..."
    mkdir -p lib
    cd lib
    # Download org.json jar
    curl -o json.jar "https://repo1.maven.org/maven2/org/json/json/20240303/json-20240303.jar"
    cd ..
fi

# Compile Java files
echo "⚙️  Compiling Java backend..."
javac -cp "lib/json.jar" backend/LeetTrackerServer.java 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📝 To run the server:"
    echo "   java -cp lib/json.jar:backend LeetTrackerServer"
    echo ""
    echo "🌐 Open browser: http://localhost:8080"
else
    echo "❌ Build failed!"
    exit 1
fi
