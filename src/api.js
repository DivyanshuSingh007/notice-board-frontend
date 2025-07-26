import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://web-production-0a9c.up.railway.app",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true, // Include credentials in requests
});

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
    // Unauthorized - clear token and redirect to login
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return Promise.reject(error);
});

export default API;
