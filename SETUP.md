# 🔧 LeetTracker - Setup & Configuration Guide

Complete step-by-step instructions to get LeetTracker running on your machine.

---

## ✅ System Requirements

- **Operating System**: macOS, Linux, or Windows
- **Java**: JDK 8 or higher
- **Browser**: Chrome, Firefox, Safari, Edge (any modern browser)
- **Disk Space**: ~50MB (including libraries)
- **RAM**: Minimum 256MB

### Check Java Installation

**macOS/Linux:**
```bash
java -version
javac -version
```

**Windows:**
```cmd
java -version
javac -version
```

Should show Java 8 or higher. If not, [download Java](https://www.oracle.com/java/technologies/downloads/).

---

## 📥 Installation Steps

### Option A: Using Git (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/LeetTracker.git

# Navigate to project
cd LeetTracker

# View structure
ls -la
```

### Option B: Manual Download

1. Download the ZIP file
2. Extract to desired location
3. Open terminal/command prompt in extracted folder

---

## 🔨 Build Configuration

### Step 1: Download org.json Library

**Automatic (if curl available):**
```bash
./build.sh  # macOS/Linux
# or
build.bat   # Windows
```

**Manual Method:**
1. Download: [json-20240303.jar](https://repo1.maven.org/maven2/org/json/json/20240303/json-20240303.jar)
2. Create `lib` folder:
   ```bash
   mkdir lib
   ```
3. Move downloaded JAR to `lib/json.jar`

### Step 2: Compile Backend

**macOS/Linux:**
```bash
# Make build script executable
chmod +x build.sh

# Run build
./build.sh
```

**Windows:**
```cmd
# Double-click build.bat or run in Command Prompt
build.bat
```

**Manual Compilation:**
```bash
# macOS/Linux
javac -cp lib/json.jar backend/LeetTrackerServer.java

# Windows
javac -cp "lib\json.jar" backend\LeetTrackerServer.java
```

Expected output:
```
✅ Build successful!

📝 To run the server:
   java -cp lib/json.jar:backend LeetTrackerServer
```

---

## 🚀 Running the Server

### Option 1: Using Run Scripts (Recommended)

**macOS/Linux:**
```bash
# Make executable
chmod +x run.sh

# Run
./run.sh
```

**Windows:**
```cmd
# Double-click run.bat or run in Command Prompt
run.bat
```

### Option 2: Manual Start

**macOS/Linux:**
```bash
java -cp "lib/json.jar:backend" LeetTrackerServer
```

**Windows:**
```cmd
java -cp "lib/json.jar;backend" LeetTrackerServer
```

### Expected Server Output

```
🚀 LeetTracker Server started on http://127.0.0.1:8080
Frontend available at http://127.0.0.1:8080
```

---

## 🌐 Accessing the Application

1. **Open your browser**
2. **Navigate to**: `http://127.0.0.1:8080`
3. **You should see the LeetTracker dashboard**

If it doesn't load:
- Check server is running (terminal shows "started" message)
- Try refreshing the page (Ctrl+R or Cmd+R)
- Try a different browser
- Check port 8080 is not blocked

---

## 📁 Project Structure Breakdown

```
LeetTracker/
│
├── backend/
│   ├── LeetTrackerServer.java       # Main server file
│   └── LeetTrackerServer.class      # Compiled output (after build)
│
├── frontend/
│   ├── index.html                   # Main HTML file
│   ├── style.css                    # Styling
│   └── script.js                    # JavaScript logic
│
├── data/
│   └── problems.json                # Problem database
│
├── lib/
│   └── json.jar                     # org.json library
│
├── build.sh / build.bat             # Compilation script
├── run.sh / run.bat                 # Execution script
├── README.md                        # Main documentation
└── SETUP.md                         # This file
```

---

## ⚙️ Configuration Options

### Change Server Port

Edit `backend/LeetTrackerServer.java` (line 51):

```java
// Default
private static final int PORT = 8080;

// Change to any available port
private static final int PORT = 8081;
```

Then recompile:
```bash
./build.sh  # or build.bat on Windows
```

### Change Data File Location

Edit `backend/LeetTrackerServer.java` (line 52):

```java
// Default
private static final String DATA_FILE = "data/problems.json";

// Change to custom path
private static final String DATA_FILE = "/path/to/custom/file.json";
```

### Increase Server Thread Pool

Edit `backend/LeetTrackerServer.java` (line 69):

```java
// Default (10 threads)
server.setExecutor(Executors.newFixedThreadPool(10));

// For high load
server.setExecutor(Executors.newFixedThreadPool(50));
```

---

## 🔒 Security Notes

### For Development Only
This setup is ideal for development and learning. For production:

1. Add authentication
2. Validate all inputs
3. Use HTTPS instead of HTTP
4. Implement rate limiting
5. Add request logging
6. Use proper database instead of JSON

### File Permissions
Ensure proper permissions on data directory:

```bash
# macOS/Linux
chmod 755 data/
chmod 644 data/problems.json
```

---

## 🐛 Troubleshooting Compilation

### Error: "javac: command not found"
**Solution**: Java Development Kit (JDK) not installed.
1. Download [JDK](https://www.oracle.com/java/technologies/downloads/)
2. Install it
3. Add to PATH
4. Restart terminal

### Error: "cannot find symbol: class JSONArray"
**Solution**: org.json library not in classpath.
1. Verify `lib/json.jar` exists
2. Check filename: should be exactly `json.jar`
3. Try recompiling with full path:
   ```bash
   javac -cp /full/path/to/lib/json.jar backend/LeetTrackerServer.java
   ```

### Error: "Package com.sun.net.httpserver does not exist"
**Solution**: This comes with JDK. Try:
1. Use full JDK path: `$JAVA_HOME/bin/javac`
2. Update Java installation

---

## 🐛 Troubleshooting Runtime

### Error: "Port 8080 already in use"
**Solution**: Another program using port 8080.

**Find process (macOS/Linux):**
```bash
lsof -i :8080
kill -9 <PID>
```

**Find process (Windows):**
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Alternative:** Change port (see Configuration section)

### Error: "Connection refused"
**Solution**: Server not running.
1. Check terminal where you ran the server
2. Look for error messages
3. Verify port is correct
4. Restart server

### Error: "Cannot create file: Permission denied"
**Solution**: Insufficient permissions.

**macOS/Linux:**
```bash
chmod 777 data/
```

**Windows:** Right-click folder → Properties → Security → Edit permissions

### Error: "Frontend not loading"
**Solution**: Server running but frontend files missing.
1. Verify files exist:
   - `frontend/index.html`
   - `frontend/style.css`
   - `frontend/script.js`
2. Check server logs for 404 errors
3. Restart server

---

## 📊 Initial Data

The project includes 10 sample problems in `data/problems.json` to demonstrate functionality.

To **start fresh**:
1. Stop the server (Ctrl+C)
2. Delete `data/problems.json`
3. Restart the server (it creates an empty file)

To **load sample data**:
- Sample file is pre-populated with 10 LeetCode problems
- Shows features like filtering and analytics
- Can be modified or replaced anytime

---

## 🔄 Backup & Restore

### Backup Your Data
```bash
# Create backup
cp data/problems.json data/problems.json.backup

# Or on Windows
copy data\problems.json data\problems.json.backup
```

### Restore from Backup
```bash
# Restore
cp data/problems.json.backup data/problems.json

# Or on Windows
copy data\problems.json.backup data\problems.json
```

### Export Data
The JSON file is human-readable and can be opened in any text editor:
```bash
cat data/problems.json  # macOS/Linux
type data/problems.json # Windows
```

---

## 📈 Performance Tuning

### For Large Datasets (1000+ problems)

1. **Increase Java Heap Memory:**
   ```bash
   # macOS/Linux
   java -Xmx512m -cp "lib/json.jar:backend" LeetTrackerServer
   
   # Windows
   java -Xmx512m -cp "lib/json.jar;backend" LeetTrackerServer
   ```

2. **Optimize Frontend Search** (in script.js):
   ```javascript
   // Add debouncing to search
   let searchTimeout;
   searchInput.addEventListener('input', () => {
       clearTimeout(searchTimeout);
       searchTimeout = setTimeout(applyFilters, 200);
   });
   ```

3. **Enable Caching** (in server code):
   - Cache analytics results
   - Cache filtered results
   - Implement LRU cache for frequent queries

---

## 🔗 Environment Variables

### Optional: Set Java Home
```bash
# macOS/Linux
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$JAVA_HOME/bin:$PATH

# Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-21"
setx PATH "%JAVA_HOME%\bin;%PATH%"
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Java version is 8+
- [ ] Build completes without errors
- [ ] Server starts without errors
- [ ] Browser loads http://localhost:8080
- [ ] Form fields visible and functional
- [ ] Can add a new problem
- [ ] Problem appears in table
- [ ] Analytics dashboard updates
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Data persists after refresh

---

## 🎓 Next Steps

After successful setup:

1. **Add Your Problems**: Start tracking DSA problems
2. **Explore Features**: Try all CRUD operations
3. **Test Analytics**: Add 10+ problems to see charts
4. **Customize**: Modify CSS, add new features
5. **Deploy**: Share with others or deploy online

---

## 📞 Getting Help

### Check These First:
1. This setup guide
2. README.md for features
3. Browser console (F12 → Console tab)
4. Server terminal output
5. Verify file paths and permissions

### Common Issues & Quick Fixes:

| Issue | Solution |
|-------|----------|
| Port already in use | Change port (see Configuration) |
| javac not found | Install JDK |
| json.jar missing | Download and place in lib/ |
| Blank screen | Refresh browser, check console |
| Data not saving | Check data/ folder permissions |
| Slow performance | Increase Java heap memory |

---

## 🎉 Congratulations!

You've successfully set up LeetTracker! 🚀

Start tracking your DSA journey and watch your progress in real-time.

**Happy problem-solving!**
