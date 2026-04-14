import axios from "axios";
import { storage } from "../utils/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL: BASE_URL, timeout: 30000 });

api.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) storage.removeToken();
    return Promise.reject(err);
  }
);
