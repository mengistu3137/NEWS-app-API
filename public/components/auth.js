import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js";

export class AuthManager {
  constructor() {
    this.token = null;
    this.currentUser = null;
  }

  async login(username, password) {
    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      if (response.data.success) {
        this.token = response.data.token;
        this.currentUser = response.data.user;
        this.storeToken(this.token);
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Auth error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  }

  storeToken(token) {
    localStorage.setItem("weatherToken", token);
  }

  getStoredToken() {
    return localStorage.getItem("weatherToken");
  }

  getAuthHeaders() {
    const token = this.token || this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("weatherToken");
  }

  isAuthenticated() {
    return !!(this.token || this.getStoredToken());
  }
}
