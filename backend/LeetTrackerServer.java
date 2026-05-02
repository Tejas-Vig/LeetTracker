import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.json.*;

/**
 * LeetTracker Server - RESTful API for DSA Problem Tracking
 * Embedded HTTP Server using Java's com.sun.net.httpserver
 * No external dependencies except org.json for JSON parsing
 */
public class LeetTrackerServer {
    
    private static final int PORT = 8080;
    private static final String DATA_FILE = "data/problems.json";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    private static JSONArray problems = new JSONArray();
    private static final Object lock = new Object();
    
    public static void main(String[] args) throws IOException {
        // Initialize data
        loadDataFromFile();
        
        // Create HTTP server
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", PORT), 0);
        
        // Register endpoints
        server.createContext("/api/problems", new ProblemsHandler());
        server.createContext("/api/analytics", new AnalyticsHandler());
        server.createContext("/api/search", new SearchHandler());
        server.createContext("/api/filter", new FilterHandler());
        server.createContext("/", new RootHandler());
        
        // Set executor
        server.setExecutor(null);
        
        // Start server
        server.start();
        System.out.println("LeetTracker Server started on http://127.0.0.1:" + PORT);
        System.out.println("Frontend available at http://127.0.0.1:" + PORT);
    }
    
    /**
     * Load problems from JSON file
     */
    private static void loadDataFromFile() {
        try {
            File file = new File(DATA_FILE);
            if (file.exists()) {
                String content = new String(Files.readAllBytes(file.toPath()));
                if (!content.trim().isEmpty()) {
                    problems = new JSONArray(content);
                }
            } else {
                // Create data directory if not exists
                file.getParentFile().mkdirs();
                saveDataToFile();
            }
        } catch (Exception e) {
            System.err.println("Error loading data: " + e.getMessage());
        }
    }
    
    /**
     * Save problems to JSON file
     */
    private static void saveDataToFile() {
        try {
            Files.write(
                Paths.get(DATA_FILE),
                problems.toString(2).getBytes(),
                StandardOpenOption.CREATE,
                StandardOpenOption.WRITE,
                StandardOpenOption.TRUNCATE_EXISTING
            );
        } catch (Exception e) {
            System.err.println("Error saving data: " + e.getMessage());
        }
    }
    
    /**
     * Utility to set CORS headers
     */
    private static void setCORSHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().add("Content-Type", "application/json");
    }
    
    /**
     * Root handler - serves static frontend
     */
    static class RootHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equals("OPTIONS")) {
                setCORSHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            String path = exchange.getRequestURI().getPath();
            File file = null;
            
            if (path.equals("/") || path.equals("")) {
                file = new File("frontend/index.html");
            } else if (path.endsWith(".html")) {
                file = new File("frontend" + path);
            } else if (path.endsWith(".css")) {
                file = new File("frontend" + path);
            } else if (path.endsWith(".js")) {
                file = new File("frontend" + path);
            } else {
                sendError(exchange, 404, "Not Found");
                return;
            }
            
            if (file != null && file.exists()) {
                byte[] content = Files.readAllBytes(file.toPath());
                exchange.getResponseHeaders().add("Content-Type", getContentType(file));
                exchange.sendResponseHeaders(200, content.length);
                exchange.getResponseBody().write(content);
                exchange.close();
            } else {
                sendError(exchange, 404, "File not found");
            }
        }
        
        private String getContentType(File file) {
            if (file.getName().endsWith(".css")) return "text/css";
            if (file.getName().endsWith(".js")) return "application/javascript";
            return "text/html";
        }
    }
    
    /**
     * Handle /api/problems - CRUD operations
     */
    static class ProblemsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equals("OPTIONS")) {
                setCORSHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            setCORSHeaders(exchange);
            
            String method = exchange.getRequestMethod();
            String query = exchange.getRequestURI().getQuery();
            
            synchronized (lock) {
                try {
                    if (method.equals("GET")) {
                        handleGetProblems(exchange);
                    } else if (method.equals("POST")) {
                        handlePostProblem(exchange);
                    } else if (method.equals("PUT")) {
                        handlePutProblem(exchange, query);
                    } else if (method.equals("DELETE")) {
                        handleDeleteProblem(exchange, query);
                    } else {
                        sendError(exchange, 405, "Method not allowed");
                    }
                } catch (Exception e) {
                    sendError(exchange, 500, e.getMessage());
                }
            }
        }
        
        private void handleGetProblems(HttpExchange exchange) throws IOException {
            sendJSON(exchange, 200, problems);
        }
        
        private void handlePostProblem(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            JSONObject problem = new JSONObject(body);
            
            // Generate ID
            int maxId = 0;
            for (int i = 0; i < problems.length(); i++) {
                int id = problems.getJSONObject(i).getInt("id");
                maxId = Math.max(maxId, id);
            }
            problem.put("id", maxId + 1);
            problem.put("dateAdded", LocalDateTime.now().format(DATE_FORMATTER));
            
            problems.put(problem);
            saveDataToFile();
            
            sendJSON(exchange, 201, problem);
        }
        
        private void handlePutProblem(HttpExchange exchange, String query) throws IOException {
            int id = Integer.parseInt(query.split("=")[1]);
            String body = readBody(exchange);
            JSONObject updatedProblem = new JSONObject(body);
            
            for (int i = 0; i < problems.length(); i++) {
                if (problems.getJSONObject(i).getInt("id") == id) {
                    updatedProblem.put("id", id);
                    updatedProblem.put("dateAdded", problems.getJSONObject(i).getString("dateAdded"));
                    problems.put(i, updatedProblem);
                    saveDataToFile();
                    sendJSON(exchange, 200, updatedProblem);
                    return;
                }
            }
            sendError(exchange, 404, "Problem not found");
        }
        
        private void handleDeleteProblem(HttpExchange exchange, String query) throws IOException {
            int id = Integer.parseInt(query.split("=")[1]);
            
            for (int i = 0; i < problems.length(); i++) {
                if (problems.getJSONObject(i).getInt("id") == id) {
                    problems.remove(i);
                    saveDataToFile();
                    sendJSON(exchange, 200, new JSONObject().put("message", "Problem deleted"));
                    return;
                }
            }
            sendError(exchange, 404, "Problem not found");
        }
    }
    
    /**
     * Handle /api/analytics - Get statistics
     */
    static class AnalyticsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equals("OPTIONS")) {
                setCORSHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            setCORSHeaders(exchange);
            
            synchronized (lock) {
                try {
                    JSONObject analytics = new JSONObject();
                    
                    // Total problems
                    analytics.put("totalProblems", problems.length());
                    
                    // Difficulty distribution
                    Map<String, Integer> difficultyCount = new HashMap<>();
                    difficultyCount.put("Easy", 0);
                    difficultyCount.put("Medium", 0);
                    difficultyCount.put("Hard", 0);
                    
                    // Status distribution
                    Map<String, Integer> statusCount = new HashMap<>();
                    statusCount.put("Solved", 0);
                    statusCount.put("Pending", 0);
                    statusCount.put("Revision", 0);
                    
                    // Topic distribution
                    Map<String, Integer> topicCount = new HashMap<>();
                    
                    // Topic-wise solved count
                    Map<String, Integer> topicSolved = new HashMap<>();
                    
                    for (int i = 0; i < problems.length(); i++) {
                        JSONObject p = problems.getJSONObject(i);
                        
                        String difficulty = p.getString("difficulty");
                        difficultyCount.put(difficulty, difficultyCount.get(difficulty) + 1);
                        
                        String status = p.getString("status");
                        statusCount.put(status, statusCount.get(status) + 1);
                        
                        String topic = p.getString("topic");
                        topicCount.put(topic, topicCount.getOrDefault(topic, 0) + 1);
                        
                        if (status.equals("Solved")) {
                            topicSolved.put(topic, topicSolved.getOrDefault(topic, 0) + 1);
                        }
                    }
                    
                    // Add to analytics
                    JSONObject diffObj = new JSONObject();
                    for (String key : difficultyCount.keySet()) {
                        diffObj.put(key, difficultyCount.get(key));
                    }
                    analytics.put("difficultyDistribution", diffObj);
                    
                    JSONObject statObj = new JSONObject();
                    for (String key : statusCount.keySet()) {
                        statObj.put(key, statusCount.get(key));
                    }
                    analytics.put("statusDistribution", statObj);
                    
                    JSONObject topicObj = new JSONObject();
                    for (String key : topicCount.keySet()) {
                        topicObj.put(key, topicCount.get(key));
                    }
                    analytics.put("topicDistribution", topicObj);
                    
                    // Weakest topic (lowest solved count)
                    String weakestTopic = "";
                    int minSolved = Integer.MAX_VALUE;
                    for (String topic : topicCount.keySet()) {
                        int solved = topicSolved.getOrDefault(topic, 0);
                        if (solved < minSolved) {
                            minSolved = solved;
                            weakestTopic = topic;
                        }
                    }
                    analytics.put("weakestTopic", weakestTopic);
                    
                    // Progress tracking
                    int solvedCount = statusCount.get("Solved");
                    analytics.put("solvedCount", solvedCount);
                    analytics.put("pendingCount", statusCount.get("Pending"));
                    analytics.put("revisionCount", statusCount.get("Revision"));
                    
                    sendJSON(exchange, 200, analytics);
                } catch (Exception e) {
                    sendError(exchange, 500, e.getMessage());
                }
            }
        }
    }
    
    /**
     * Handle /api/search - Search problems
     */
    static class SearchHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equals("OPTIONS")) {
                setCORSHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            setCORSHeaders(exchange);
            
            String query = exchange.getRequestURI().getQuery();
            String searchTerm = "";
            
            if (query != null && query.contains("q=")) {
                searchTerm = query.split("q=")[1].toLowerCase();
            }
            
            synchronized (lock) {
                JSONArray results = new JSONArray();
                
                for (int i = 0; i < problems.length(); i++) {
                    JSONObject p = problems.getJSONObject(i);
                    if (p.getString("name").toLowerCase().contains(searchTerm)) {
                        results.put(p);
                    }
                }
                
                try {
                    sendJSON(exchange, 200, results);
                } catch (IOException e) {
                    sendError(exchange, 500, e.getMessage());
                }
            }
        }
    }
    
    /**
     * Handle /api/filter - Filter problems
     */
    static class FilterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equals("OPTIONS")) {
                setCORSHeaders(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            setCORSHeaders(exchange);
            
            String query = exchange.getRequestURI().getQuery();
            String difficulty = "";
            String topic = "";
            String status = "";
            
            if (query != null) {
                String[] params = query.split("&");
                for (String param : params) {
                    if (param.startsWith("difficulty=")) {
                        difficulty = param.split("=")[1].toLowerCase();
                    } else if (param.startsWith("topic=")) {
                        topic = param.split("=")[1].toLowerCase();
                    } else if (param.startsWith("status=")) {
                        status = param.split("=")[1].toLowerCase();
                    }
                }
            }
            
            synchronized (lock) {
                JSONArray results = new JSONArray();
                
                for (int i = 0; i < problems.length(); i++) {
                    JSONObject p = problems.getJSONObject(i);
                    
                    boolean matchDifficulty = difficulty.isEmpty() || 
                        p.getString("difficulty").toLowerCase().equals(difficulty);
                    boolean matchTopic = topic.isEmpty() || 
                        p.getString("topic").toLowerCase().equals(topic);
                    boolean matchStatus = status.isEmpty() || 
                        p.getString("status").toLowerCase().equals(status);
                    
                    if (matchDifficulty && matchTopic && matchStatus) {
                        results.put(p);
                    }
                }
                
                try {
                    sendJSON(exchange, 200, results);
                } catch (IOException e) {
                    sendError(exchange, 500, e.getMessage());
                }
            }
        }
    }
    
    /**
     * Utility: Read request body
     */
    private static String readBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        while ((length = is.read(buffer)) != -1) {
            result.write(buffer, 0, length);
        }
        return result.toString("UTF-8");
    }
    
    /**
     * Utility: Send JSON response
     */
    private static void sendJSON(HttpExchange exchange, int statusCode, Object json) throws IOException {
        byte[] response = json.toString().getBytes("UTF-8");
        exchange.sendResponseHeaders(statusCode, response.length);
        exchange.getResponseBody().write(response);
        exchange.close();
    }
    
    /**
     * Utility: Send error response
     */
    private static void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        JSONObject error = new JSONObject();
        error.put("error", message);
        byte[] response = error.toString().getBytes("UTF-8");
        exchange.sendResponseHeaders(statusCode, response.length);
        exchange.getResponseBody().write(response);
        exchange.close();
    }
}
