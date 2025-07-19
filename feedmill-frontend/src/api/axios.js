// src/api/axios.js
import axios from "axios";

const api = axios.create({
  //baseURL: import.meta.env.VITE_BACKEND_URL,
  baseURL: "/api",
  withCredentials: true, // مهم جدًا لتسجيل الدخول // مهم جداً لحفظ الـ session cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
