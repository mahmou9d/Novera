"use client";

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://web-production-1ab2d.up.railway.app/api/";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor - Attach token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const isCartRequest = config.url?.startsWith("/cart");
      if (isCartRequest) {
        const deviceId = localStorage.getItem("X-Device-ID");
        if (deviceId) {
          config.headers["x-Device-ID"] = deviceId;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

      if (!refreshToken) return Promise.reject(error);

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import axios, { AxiosError } from "axios";

// // Use environment variable with fallback
// const BASE_URL =
//   process.env.NEXT_PUBLIC_BASE_URL ||
//   "https://web-production-1ab2d.up.railway.app/api/";

// console.log("🚀 apiClient initialized");
// console.log("🚀 BASE_URL:", BASE_URL);

// export const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
// });

// // Request Interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
//     console.log("📤 Full URL:", `${config.baseURL}${config.url}`);

//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("access");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     console.error("❌ Request Error:", error);
//     return Promise.reject(error);
//   },
// );

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // Response Interceptor
// apiClient.interceptors.response.use(
//   (response) => {
//     console.log("✅ API Response:", response.config.url, response.status);
//     return response;
//   },
//   async (error: AxiosError) => {
//     console.error("❌ API Error:", error.config?.url, error.response?.status);

//     const originalRequest: any = error.config;

//     if (originalRequest?.url?.includes("/auth/token/refresh/")) {
//       isRefreshing = false;

//       if (typeof window !== "undefined") {
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");

//         if (window.location.pathname !== "/login") {
//           window.location.href = "/login";
//         }
//       }

//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return apiClient(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken =
//         typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

//       if (!refreshToken) {
//         processQueue(error, null);
//         isRefreshing = false;

//         if (
//           typeof window !== "undefined" &&
//           window.location.pathname !== "/login"
//         ) {
//           window.location.href = "/login";
//         }

//         return Promise.reject(error);
//       }

//       try {
//         const { data } = await axios.post(`${BASE_URL}auth/token/refresh/`, {
//           refresh: refreshToken,
//         });

//         if (typeof window !== "undefined") {
//           localStorage.setItem("access", data.access);
//           if (data.refresh) {
//             localStorage.setItem("refresh", data.refresh);
//           }
//         }

//         apiClient.defaults.headers.common["Authorization"] =
//           `Bearer ${data.access}`;
//         originalRequest.headers.Authorization = `Bearer ${data.access}`;

//         processQueue(null, data.access);
//         isRefreshing = false;

//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         isRefreshing = false;

//         if (typeof window !== "undefined") {
//           localStorage.removeItem("access");
//           localStorage.removeItem("refresh");

//           if (window.location.pathname !== "/login") {
//             window.location.href = "/login";
//           }
//         }

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );
