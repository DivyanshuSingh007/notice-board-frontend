import axios from "axios";

export function clearLocationCache() {
  localStorage.removeItem("locationAllowed");
}

// Debug: Log the environment variable
console.log("VITE_API_URL from env:", import.meta.env.VITE_API_URL);
console.log("Fallback URL:", "https://notice-board-backend-7z2k.onrender.com");

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://notice-board-backend-7z2k.onrender.com",
  headers: {
    "Accept": "application/json",
  },
  withCredentials: true, // Include credentials in requests
});

// Debug: Log the final baseURL
console.log("Final API baseURL:", API.defaults.baseURL);

// Request interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
API.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error("API Error:", error);
  if (error.response?.status === 401) {
    // Unauthorized - clear token and redirect to login if not already there
    localStorage.removeItem("token");
    clearLocationCache();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
  // For other errors, do not reload or redirect
  return Promise.reject(error);
});

export default API;
