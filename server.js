import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Simple logging middleware
const simpleLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(simpleLogger);

// JWT Configuration
const JWT_SECRET = "news-app-secret-key-2024";

// Mock user database
const users = [
  {
    id: 1,
    username: "user1",
    password: "password1",
    email: "user1@example.com",
  },
  {
    id: 2,
    username: "user2",
    password: "password2",
    email: "user2@example.com",
  },
];

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Authentication Routes
app.post("/api/login", (req, res) => {
  try {
    console.log("Login attempt:", req.body);

    const { username, password } = req.body;

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      console.log("Login failed: Invalid credentials for", username);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Login successful for user:", username);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Real News API Integration - Using Guardian Open Platform (free, no signup)
app.get("/api/news", authMiddleware, async (req, res) => {
  try {
    const { category = "general", search = "", page = 1 } = req.query;

    console.log("News request:", { category, search, page });

    // Using Guardian Open Platform API (free, no API key required for testing)
    let apiUrl = "https://content.guardianapis.com/search";

    const params = {
      "api-key": "test", // Using test mode - no real API key needed
      "show-fields": "thumbnail,trailText",
      "page-size": 9, // Changed to 9 for better grid layout (3x3)
      page: parseInt(page) || 1,
      format: "json",
    };

    if (search) {
      params.q = search;
    }

    if (category && category !== "general") {
      params.section = category;
    }

    console.log("Making request to Guardian API with params:", params);

    const response = await axios.get(apiUrl, { params });
    const articles = response.data.response.results;
    const totalResults = response.data.response.total;
    const pageSize = 9;
    const totalPages = Math.ceil(totalResults / pageSize);

    // Transform data to user-friendly format
    const transformedArticles = articles.map((article) => ({
      id: article.id,
      title: article.webTitle,
      description: article.fields?.trailText || "No description available",
      url: article.webUrl,
      image: article.fields?.thumbnail || "/placeholder-image.jpg",
      category: article.sectionName || "General",
      date: new Date(article.webPublicationDate).toLocaleDateString(),
      time: new Date(article.webPublicationDate).toLocaleTimeString(),
      source: "The Guardian",
    }));

    res.json({
      success: true,
      data: transformedArticles,
      total: totalResults,
      currentPage: parseInt(page) || 1,
      totalPages: totalPages,
      pageSize: pageSize,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    });
  } catch (error) {
    console.error("News API error:", error.response?.data || error.message);

    // Fallback to NewsAPI if Guardian fails
    try {
      console.log("Trying fallback NewsAPI...");
      const fallbackResponse = await axios.get(
        "https://newsapi.org/v2/top-headlines",
        {
          params: {
            country: "us",
            pageSize: 9,
            page: parseInt(page) || 1,
            apiKey: "demo", // Using demo key
          },
        }
      );

      const fallbackArticles = fallbackResponse.data.articles.map(
        (article) => ({
          id: article.url,
          title: article.title,
          description: article.description || "No description available",
          url: article.url,
          image: article.urlToImage || "/placeholder-image.jpg",
          category: "General",
          date: new Date(article.publishedAt).toLocaleDateString(),
          time: new Date(article.publishedAt).toLocaleTimeString(),
          source: article.source.name,
        })
      );

      const totalResults = fallbackResponse.data.totalResults;
      const pageSize = 9;
      const totalPages = Math.ceil(totalResults / pageSize);

      res.json({
        success: true,
        data: fallbackArticles,
        total: totalResults,
        currentPage: parseInt(page) || 1,
        totalPages: totalPages,
        pageSize: pageSize,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        note: "Using fallback API",
      });
    } catch (fallbackError) {
      console.error("Fallback API also failed:", fallbackError.message);

      res.status(500).json({
        success: false,
        message: "Failed to fetch news data from available sources",
      });
    }
  }
});

// Get news categories
app.get("/api/categories", authMiddleware, (req, res) => {
  const categories = [
    { id: "general", name: "General News" },
    { id: "technology", name: "Technology" },
    { id: "sports", name: "Sports" },
    { id: "business", name: "Business" },
    { id: "entertainment", name: "Entertainment" },
    { id: "health", name: "Health" },
    { id: "science", name: "Science" },
  ];

  res.json({
    success: true,
    data: categories,
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "News API Service is running",
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});