import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js";
import { AuthManager } from "./auth.js";

export class WeatherService {
  constructor() {
    this.authManager = new AuthManager();
  }

  async getWeather(city) {
    try {
      const response = await axios.get(
        `/api/weather?city=${encodeURIComponent(city)}`,
        {
          headers: this.authManager.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Weather service error:", error);

      if (error.response?.status === 401) {
        this.authManager.logout();
        window.location.reload();
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
      }

      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch weather data",
      };
    }
  }
}
