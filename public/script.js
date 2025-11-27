console.log("News App Script loaded - starting app");

class NewsApp {
  constructor() {
    console.log("NewsApp constructor called");
    this.token = null;
    this.currentUser = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.currentSearch = "";
    this.currentCategory = "general";
    this.init();
  }

  init() {
    console.log("Initializing News App...");
    this.bindEvents();
    this.checkExistingAuth();
  }

  bindEvents() {
    console.log("Binding events...");
    document
      .getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));
    document
      .getElementById("newsForm")
      .addEventListener("submit", (e) => this.handleNewsSearch(e));
    document
      .getElementById("logoutBtn")
      .addEventListener("click", () => this.handleLogout());

    console.log("Events bound successfully");
  }

  checkExistingAuth() {
    const token = localStorage.getItem("weatherToken");
    console.log("Checking existing auth, token found:", !!token);
    if (token) {
      this.token = token;
      this.showNewsSection();
      this.loadNews(1); // Load first page automatically
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    console.log("Login form submitted");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log("Attempting login with:", { username, password });

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);

      if (data.success) {
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem("weatherToken", this.token);
        this.showNewsSection();
        this.updateUserInfo(data.user);
        this.loadNews(1); // Load first page after login
        this.showMessage("Login successful! Welcome to News Hub!", "success");
      } else {
        this.showMessage(data.message, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showMessage("Login failed. Please try again.", "error");
    }
  }

  async handleNewsSearch(e) {
    e.preventDefault();
    console.log("News search submitted");

    this.currentPage = 1; // Reset to first page on new search
    this.loadNews(1);
  }

  async loadNews(page = 1) {
    console.log("Loading news, page:", page);

    const search = document.getElementById("search").value;
    const category = document.getElementById("category").value;

    // Update current search parameters
    this.currentSearch = search;
    this.currentCategory = category;
    this.currentPage = page;

    this.showLoading(true);
    this.hideError();

    try {
      const params = new URLSearchParams({
        category: category,
        page: page.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/news?${params}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      console.log("News response status:", response.status);
      const data = await response.json();
      console.log("News response data:", data);

      if (data.success) {
        this.displayNews(data.data);
        this.updatePagination(data);
      } else {
        this.showError(data.message);
      }
    } catch (error) {
      console.error("News fetch error:", error);
      this.showError("Failed to fetch news data. Please try again.");
    } finally {
      this.showLoading(false);
    }
  }

  displayNews(articles) {
    console.log("Displaying news articles:", articles.length);
    const newsResults = document.getElementById("newsResults");

    if (articles.length === 0) {
      newsResults.innerHTML = `
        <div class="no-articles" style="text-align: center; padding: 40px; color: #666;">
          <h3>No articles found</h3>
          <p>Try adjusting your search criteria or select a different category.</p>
        </div>
      `;
      return;
    }

    newsResults.innerHTML = articles
      .map(
        (article) => `
          <div class="news-article">
            <div class="article-image" style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);">
              ${
                article.image && article.image !== "/placeholder-image.jpg"
                  ? `<img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                  : `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 14px;">News Image</div>`
              }
            </div>
            <div class="article-content">
              <div class="article-header">
                <span class="article-category">${article.category}</span>
                <span class="article-date">${article.date}</span>
              </div>
              <h3 class="article-title">${article.title}</h3>
              <p class="article-description">${article.description}</p>
              <div class="article-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                <span class="article-source" style="color: #667eea; font-weight: 600;">${
                  article.source
                }</span>
                <a href="${
                  article.url
                }" target="_blank" class="read-more" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                  Read Full Article
                </a>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }

  updatePagination(data) {
    const pagination = document.getElementById("pagination");

    this.totalPages = data.totalPages || 1;

    // Calculate hasPrevPage and hasNextPage locally
    const hasPrevPage = this.currentPage > 1;
    const hasNextPage = this.currentPage < this.totalPages;

    if (this.totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let paginationHTML = "";

    // Previous button
    if (hasPrevPage) {
      paginationHTML += `
        <button class="page-btn prev-btn" data-page="${this.currentPage - 1}">
          ← Previous
        </button>
      `;
    } else {
      paginationHTML += `
        <button class="page-btn disabled" disabled>
          ← Previous
        </button>
      `;
    }

    // Page numbers - show limited pages around current page
    const startPage = Math.max(1, this.currentPage - 1);
    const endPage = Math.min(this.totalPages, this.currentPage + 1);

    // First page
    if (startPage > 1) {
      paginationHTML += `<button class="page-btn num-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="page-dots">...</span>`;
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i === this.currentPage) {
        paginationHTML += `<button class="page-btn num-btn active" disabled>${i}</button>`;
      } else {
        paginationHTML += `<button class="page-btn num-btn" data-page="${i}">${i}</button>`;
      }
    }

    // Last page
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        paginationHTML += `<span class="page-dots">...</span>`;
      }
      paginationHTML += `<button class="page-btn num-btn" data-page="${this.totalPages}">${this.totalPages}</button>`;
    }

    // Next button
    if (hasNextPage) {
      paginationHTML += `
        <button class="page-btn next-btn" data-page="${this.currentPage + 1}">
          Next →
        </button>
      `;
    } else {
      paginationHTML += `
        <button class="page-btn disabled" disabled>
          Next →
        </button>
      `;
    }

    // Page info
    paginationHTML += `
      <div class="page-info">
        Page ${this.currentPage} of ${this.totalPages} ${
      data.total ? `(${data.total} total articles)` : ""
    }
      </div>
    `;

    pagination.innerHTML = paginationHTML;

    // Add event listeners to pagination buttons
    this.bindPaginationEvents();
  }

  bindPaginationEvents() {
    const pagination = document.getElementById("pagination");

    // Remove any existing event listeners by cloning
    const newPagination = pagination.cloneNode(true);
    pagination.parentNode.replaceChild(newPagination, pagination);

    // Add event listener to the new pagination container
    document.getElementById("pagination").addEventListener("click", (e) => {
      if (
        e.target.classList.contains("page-btn") &&
        !e.target.classList.contains("disabled") &&
        !e.target.disabled
      ) {
        const page = e.target.getAttribute("data-page");
        if (page) {
          this.loadNews(parseInt(page));
        }
      }
    });
  }

  showNewsSection() {
    console.log("Showing news section");
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("newsSection").classList.remove("hidden");
  }

  showLoginSection() {
    console.log("Showing login section");
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("newsSection").classList.add("hidden");
  }

  updateUserInfo(user) {
    document.getElementById("currentUser").textContent = user.username;
  }

  handleLogout() {
    console.log("Logging out");
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("weatherToken");
    this.showLoginSection();
    this.showMessage("Logged out successfully!", "success");
  }

  showLoading(show) {
    const loadingElement = document.getElementById("loadingSpinner");
    loadingElement.classList.toggle("hidden", !show);
  }

  showError(message) {
    console.error("Showing error:", message);
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
  }

  hideError() {
    document.getElementById("errorMessage").classList.add("hidden");
  }

  showMessage(message, type) {
    console.log(`${type}: ${message}`);
    // Only show messages for login/logout, not for news loading
    if (type === "success" && message.includes("Login successful")) {
      alert(message);
    }
  }
}

// Initialize the application
console.log("Starting app initialization...");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded - creating NewsApp instance");
  window.newsApp = new NewsApp();
});
