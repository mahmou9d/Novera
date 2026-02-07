/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios, { AxiosError } from "axios";
// import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BASE_URL is not defined!");
  throw new Error("API Base URL is not configured");
}

console.log("✅ API Base URL:", BASE_URL);
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (originalRequest?.url?.includes("/auth/token/refresh/")) {
      isRefreshing = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        if (window.location.pathname !== "/login") {
          // toast.error("انتهت جلستك، يرجى تسجيل الدخول مرة أخرى");
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

      if (!refreshToken) {
        processQueue(error, null);
        isRefreshing = false;

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          // toast.error("يرجى تسجيل الدخول");
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("access", data.access);
          if (data.refresh) {
            localStorage.setItem("refresh", data.refresh);
          }
        }

        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        processQueue(null, data.access);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");

          if (window.location.pathname !== "/login") {
            // toast.error("انتهت جلستك، يرجى تسجيل الدخول مرة أخرى");
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      }
    }

    // معالجة أخطاء أخرى
    if (error.response?.status === 403) {
      // toast.error("ليس لديك صلاحية للوصول");
    } else if (error.response?.status === 404) {
      // toast.error("المورد غير موجود");
    } else if (error.response?.status === 500) {
      // toast.error("خطأ في الخادم، يرجى المحاولة لاحقاً");
    }

    return Promise.reject(error);
  },
);
