import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/ws_api";

const api = axios.create({
  baseURL: API_URL, // это твой nginx-прокси к API
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
