# 🎯 LeetTracker - DSA Problem Tracking & Analytics System

A complete full-stack application for tracking, managing, and analyzing your DSA (Data Structures & Algorithms) problem-solving journey. Built with **Java (Backend)**, **Vanilla JavaScript (Frontend)**, and **JSON (Data Persistence)**.

---

## ✨ Features

### 📊 Core Problem Management
- ✅ **Add Problems** - Track problem name, difficulty, topic, status
- ✅ **View All Problems** - Clean table with pagination and sorting
- ✅ **Edit Problems** - Modify existing problem details
- ✅ **Delete Problems** - Remove problems from tracking
- ✅ **Search & Filter** - Find problems by name, difficulty, topic, or status
- ✅ **Sort Problems** - Sort by date, name, or difficulty

### 📈 Analytics Dashboard
- 📊 **Difficulty Distribution** - Easy/Medium/Hard breakdown with visual charts
- 📈 **Status Distribution** - Solved/Pending/Revision statistics
- 🏷️ **Topic-wise Analysis** - Count problems by topic
- 🎯 **Quick Stats** - Total problems, solved count, weakest topic
- 🔄 **Real-time Updates** - Analytics update automatically

### 💡 Learning System
- 📝 **Problem Notes** - Store approach, mistakes, and key learnings
- 🔂 **Revision Tracking** - Mark problems for revision
- ⏱️ **Time Tracking** - Record time spent on each problem
- 📊 **Attempt Tracking** - Track number of attempts

### 💾 Data Management
- 📁 **File-based Storage** - All data saved in `data/problems.json`
- 🔄 **Auto-save** - Changes persist automatically
- 🚀 **Zero Database Setup** - No external database required

---

## 🏗️ Architecture

```
LeetTracker/
├── backend/
│   └── LeetTrackerServer.java       # Java HTTP server with REST API
├── frontend/
│   ├── index.html                   # Modern HTML5 structure
│   ├── style.css                    # Elegant, responsive CSS
│   └── script.js                    # Complete JavaScript logic
├── data/
│   └── problems.json                # JSON data storage
├── lib/
│   └── json.jar                     # org.json library
├── build.sh / build.bat             # Build scripts
├── run.sh / run.bat                 # Run scripts
└── README.md                        # This file
```

### Tech Stack
- **Backend**: Java 8+ (com.sun.net.httpserver)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data**: JSON
- **Dependencies**: org.json (for JSON parsing)
- **No External Frameworks**: Pure vanilla implementation

---

## 🚀 Quick Start

### Prerequisites
- Java 8 or higher installed
- Any modern web browser
- Git (optional)

### Step 1: Clone or Download
```bash
# Clone the repository
git clone https://github.com/yourusername/LeetTracker.git
cd LeetTracker

# OR manually download and extract the ZIP
```

### Step 2: Build the Project

**On macOS/Linux:**
```bash
chmod +x build.sh run.sh
./build.sh
```

**On Windows:**
```bash
build.bat
```

### Step 3: Download org.json Library

The build script attempts to download `org.json` automatically. If it fails:

1. Download manually: [json-20240303.jar](https://repo1.maven.org/maven2/org/json/json/20240303/json-20240303.jar)
2. Create `lib/` folder in project root
3. Place `json.jar` in the `lib/` folder

### Step 4: Run the Server

**On macOS/Linux:**
```bash
./run.sh
```

**On Windows:**
```bash
run.bat
```

Expected output:
```
🚀 LeetTracker Server started on http://127.0.0.1:8080
```

### Step 5: Open in Browser
Navigate to: **http://127.0.0.1:8080**

---

## 📖 Usage Guide

### Adding a Problem
1. Fill in the **Problem Name** (e.g., "Two Sum")
2. Select **Difficulty** (Easy/Medium/Hard)
3. Enter **Topic** (e.g., "Array", "Hash Map")
4. Choose **Status** (Solved/Pending/Revision)
5. (Optional) Add attempts, time taken, and notes
6. Click **Add Problem** button

### Searching & Filtering
- **Search**: Type in the search box to find problems by name
- **Filter by Difficulty**: Select Easy, Medium, or Hard
- **Filter by Topic**: Select from available topics
- **Filter by Status**: Show Solved, Pending, or Revision problems
- **Reset**: Click "Reset Filters" to clear all filters

### Viewing Problem Details
1. Click the **View** button on any problem row
2. A modal opens with full problem details
3. You can **Edit** or **Delete** from the modal

### Editing a Problem
1. Click **View** on a problem
2. Click **Edit** in the modal
3. Form populates with existing data
4. Modify as needed and click **Update Problem**

### Deleting a Problem
1. Click **View** on a problem
2. Click **Delete** in the modal
3. Confirm deletion

### Analytics
The dashboard shows:
- **Difficulty Chart**: Visual breakdown of Easy/Medium/Hard problems
- **Status Chart**: Solved/Pending/Revision distribution
- **Topic List**: All topics with problem counts
- **Quick Stats**: Total, solved, pending, revision counts
- **Weakest Topic**: Topic with lowest solved problems

---

## 🔌 REST API Endpoints

All endpoints return JSON responses.

### Get All Problems
```
GET /api/problems
Response: [{id, name, difficulty, topic, status, notes, attempts, timeTaken, dateAdded}, ...]
```

### Create Problem
```
POST /api/problems
Body: {name, difficulty, topic, status, notes, attempts, timeTaken}
Response: {id, name, difficulty, topic, status, notes, attempts, timeTaken, dateAdded}
```

### Update Problem
```
PUT /api/problems?id={id}
Body: {name, difficulty, topic, status, notes, attempts, timeTaken}
Response: {id, name, difficulty, topic, status, notes, attempts, timeTaken, dateAdded}
```

### Delete Problem
```
DELETE /api/problems?id={id}
Response: {message: "Problem deleted"}
```

### Get Analytics
```
GET /api/analytics
Response: {
  totalProblems,
  difficultyDistribution: {Easy, Medium, Hard},
  statusDistribution: {Solved, Pending, Revision},
  topicDistribution: {topic1: count, topic2: count, ...},
  weakestTopic,
  solvedCount,
  pendingCount,
  revisionCount
}
```

### Search Problems
```
GET /api/search?q={searchTerm}
Response: [{...matching problems...}]
```

### Filter Problems
```
GET /api/filter?difficulty={diff}&topic={topic}&status={status}
Response: [{...filtered problems...}]
```

---

## 📊 Data Format

### Problem Object (problems.json)
```json
{
  "id": 1,
  "name": "Two Sum",
  "difficulty": "Easy",
  "topic": "Array",
  "status": "Solved",
  "notes": "Used hash map for O(n) solution",
  "attempts": 2,
  "timeTaken": 15,
  "dateAdded": "2024-01-15 10:30:45"
}
```

### Complete problems.json Structure
```json
[
  {
    "id": 1,
    "name": "Two Sum",
    "difficulty": "Easy",
    "topic": "Array",
    "status": "Solved",
    "notes": "Hash map approach",
    "attempts": 2,
    "timeTaken": 15,
    "dateAdded": "2024-01-15 10:30:45"
  },
  {
    "id": 2,
    "name": "Merge K Lists",
    "difficulty": "Hard",
    "topic": "Linked List",
    "status": "Revision",
    "notes": "Min-heap approach works best",
    "attempts": 3,
    "timeTaken": 45,
    "dateAdded": "2024-01-16 14:20:30"
  }
]
```

---

## 🎨 UI Features

### Modern Design
- 🌈 Clean, professional color scheme
- ⚡ Smooth animations and transitions
- 📱 Fully responsive (desktop, tablet, mobile)
- 🌙 Dark mode support (system preference)

### Key UI Components
- **Header**: Branding with gradient background
- **Sidebar**: Quick filters and statistics
- **Form Section**: Add/Edit problems with validation
- **Table Section**: Dynamic problem listing with actions
- **Analytics**: Visual charts with real-time updates
- **Modal**: Detailed problem view

### Keyboard Shortcuts
- `Escape` - Close modal
- `Ctrl+S` / `Cmd+S` - Save problem (when editing)

---

## 🔧 Troubleshooting

### Issue: "Port 8080 already in use"
**Solution**: Change port in `LeetTrackerServer.java` (line 51)
```java
private static final int PORT = 8081; // Change to any available port
```

### Issue: "org.json library not found"
**Solution**: 
1. Download from [Maven Central](https://repo1.maven.org/maven2/org/json/json/20240303/json-20240303.jar)
2. Place in `lib/` folder as `json.jar`
3. Recompile with `build.sh` or `build.bat`

### Issue: "Cannot find problems.json"
**Solution**: The file is created automatically on first run. Check `data/` folder permissions.

### Issue: "Frontend not loading (404)"
**Solution**: Ensure frontend files are in `frontend/` folder:
- `index.html`
- `style.css`
- `script.js`

### Issue: Frontend won't connect to backend
**Solution**: Check browser console (F12) for CORS errors. Backend is at `http://localhost:8080/api/`

---

## 📝 Interview Preparation

### What to Highlight
1. **Full-stack Implementation**: Built complete system from scratch
2. **System Design**: REST API, file persistence, real-time analytics
3. **Frontend Skills**: Pure JavaScript, DOM manipulation, fetch API
4. **Backend Skills**: Java HTTP server, JSON parsing, thread-safe operations
5. **Database Design**: Efficient JSON structure, no external dependencies
6. **Problem Solving**: CRUD operations, filtering, sorting, analytics
7. **User Experience**: Modern UI, responsive design, smooth interactions

### Talking Points
- "Why JSON over database?" → No setup, portable, perfect for learning projects
- "How does data persistence work?" → File I/O with JSON serialization
- "How is analytics calculated?" → Real-time aggregation from JSON
- "Why vanilla JavaScript?" → Demonstrates core web concepts
- "How would you scale?" → Add database, caching, authentication

---

## 🚀 Future Enhancements

### Possible Features
- [ ] User authentication & profiles
- [ ] Problem difficulty estimation
- [ ] Daily/weekly progress graphs
- [ ] Problem recommendations
- [ ] Integration with LeetCode API
- [ ] Tags and custom categories
- [ ] Export reports (PDF/CSV)
- [ ] Collaborative tracking (team mode)
- [ ] Mobile app version

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Feel free to fork, modify, and improve! Some ideas:
- Add more analytics
- Improve UI design
- Add more filter options
- Optimize performance

---

## 💬 Support

**Having issues?**
1. Check the Troubleshooting section
2. Review the browser console (F12)
3. Check server logs in terminal
4. Verify all files are in correct directories

---

## 📈 Sample Problem Workflow

1. **Add Problem**: "Two Sum" → Easy → Array → Pending
2. **Log Attempts**: Try 2-3 times, note time taken
3. **Update Status**: Mark as Solved when complete
4. **Add Notes**: Document approach and learnings
5. **Track Progress**: Watch analytics update in real-time
6. **Mark for Revision**: Set status to Revision if needed
7. **Review**: Use the dashboard to identify weak topics

---

## 🎓 Learning Resources

### DSA Topics to Track
- Arrays & Strings
- Linked Lists
- Stacks & Queues
- Trees & Graphs
- Hash Maps & Sets
- Sorting & Searching
- Dynamic Programming
- Greedy Algorithms
- Mathematical Algorithms
- System Design

---

**Happy Learning! 🚀 Track your progress, master DSA, and ace those interviews!**
