import axios from "axios";

const RAW_API_URL = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = RAW_API_URL
  ? `${RAW_API_URL.replace(/\/$/, "")}/api`
  : "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const admin = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
});

admin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api, admin };
