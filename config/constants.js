// Free weather APIs that don't require signup
export const WEATHER_APIS = {
  // Open-Meteo (Free weather API - no API key needed)
  OPEN_METEO: {
    name: "Open-Meteo",
    baseUrl: "https://api.open-meteo.com/v1",
    endpoints: {
      current: "/forecast",
      geocoding: "/search",
    },
  },

  // WeatherAPI (Alternative free API)
  WEATHER_API: {
    name: "WeatherAPI",
    baseUrl: "https://api.weatherapi.com/v1",
    endpoints: {
      current: "/current.json",
      search: "/search.json",
    },
  },
};

// JWT Configuration
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || "weather-app-secret-key-2024",
  EXPIRES_IN: "24h",
};

// Server Configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
};
