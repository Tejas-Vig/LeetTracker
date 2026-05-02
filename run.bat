@echo off
REM LeetTracker Run Script for Windows
REM Starts the server on localhost:8080

echo 🚀 Starting LeetTracker Server...
echo.

REM Check if compiled class exists
if not exist "backend\LeetTrackerServer.class" (
    echo ❌ Compiled class not found. Please run 'build.bat' first
    exit /b 1
)

REM Check if json.jar exists
if not exist "lib\json.jar" (
    echo ❌ org.json library not found. Please run 'build.bat' first
    exit /b 1
)

REM Start server
echo 📊 LeetTracker running on: http://127.0.0.1:8080
echo 📁 Data saved to: %cd%\data\problems.json
echo.
echo Press Ctrl+C to stop the server
echo.

java -cp "lib/json.jar;backend" LeetTrackerServer
