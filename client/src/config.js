import axios from "axios";

// Base API URL configuration
export const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post("/auth/login", credentials),
    register: (userData) => apiClient.post("/auth/register", userData),
    validate: () => apiClient.get("/auth/validate"),
    logout: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
    },
  },

  // Projects endpoints
  projects: {
    getAll: () => apiClient.get("/projects"),
    getById: (id) => apiClient.get(`/projects/${id}`),
    create: (data) => apiClient.post("/projects", data),
    update: (id, data) => apiClient.put(`/projects/${id}`, data),
    delete: (id) => apiClient.delete(`/projects/${id}`),
    toggleFeatured: (id) => apiClient.patch(`/projects/${id}/toggle-featured`),
  },

  // Skills endpoints
  skills: {
    getAll: () => apiClient.get("/skills"),
    getById: (id) => apiClient.get(`/skills/${id}`),
    create: (data) => apiClient.post("/skills", data),
    update: (id, data) => apiClient.put(`/skills/${id}`, data),
    delete: (id) => apiClient.delete(`/skills/${id}`),
  },

  // Generic request methods
  get: (endpoint) => apiClient.get(endpoint),
  post: (endpoint, data) => apiClient.post(endpoint, data),
  put: (endpoint, data) => apiClient.put(endpoint, data),
  patch: (endpoint, data) => apiClient.patch(endpoint, data),
  delete: (endpoint) => apiClient.delete(endpoint),
};

export default api;
