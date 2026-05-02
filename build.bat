@echo off
REM LeetTracker Build Script for Windows
REM Compiles Java backend with required dependencies

echo 🔨 Building LeetTracker Backend...

REM Create data directory
if not exist "data" mkdir data

REM Check if json library exists
if not exist "lib\json.jar" (
    echo 📥 Downloading org.json library...
    if not exist "lib" mkdir lib
    cd lib
    REM You can manually download from: https://repo1.maven.org/maven2/org/json/json/20240303/json-20240303.jar
    echo Please download json-20240303.jar and place it in the lib\ folder
    cd ..
)

REM Compile Java files
echo ⚙️  Compiling Java backend...
javac -cp "lib/json.jar" backend/LeetTrackerServer.java

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo.
    echo 📝 To run the server:
    echo    java -cp lib/json.jar;backend LeetTrackerServer
    echo.
    echo 🌐 Open browser: http://localhost:8080
) else (
    echo ❌ Build failed!
    exit /b 1
)
