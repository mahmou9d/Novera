"use Client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

let isRefreshing = false;

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL
,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
if (typeof args !== "string" && !(args.body instanceof FormData)) {
  args.headers = {
    ...(args.headers as Record<string, string>),
    "Content-Type": "application/json",
  };
}

  let result = await baseQuery(args, api, extraOptions);

  const isRefreshRequest =
    typeof args !== "string" && args.url === "/auth/token/refresh/";

  if (result.error?.status === 401 && !isRefreshRequest && !isRefreshing) {
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      isRefreshing = false;
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/token/refresh/",
        method: "POST",
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    isRefreshing = false;

    if (refreshResult.data) {
      const { access, refresh } = refreshResult.data as any;

      if (access) localStorage.setItem("access", access);
      if (refresh) localStorage.setItem("refresh", refresh);

      // 🔁 أعد الطلب الأصلي بعد التحديث
      result = await baseQuery(args, api, extraOptions);
    } else {
      // ❌ فشل refresh = Logout
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  }

  return result;
};

// import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
// export const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_BASE_URL

//   prepareHeaders: (headers, { type }) => {
//     const token = localStorage.getItem("access");
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     if (type === "query") {
//       headers.set("Content-Type", "application/json");
//     }
//     return headers;
//   },
// });

// // 🔹 Base Query مع Refresh Token
// export const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error && result.error.status === 401) {
//     const refreshToken = localStorage.getItem("refresh");

//     if (refreshToken) {
//       const refreshResult = await baseQuery(
//         {
//           url: "/auth/token/refresh/",
//           method: "POST",
//           body: { refresh: refreshToken },
//         },
//         api,
//         extraOptions
//       );

//       if (refreshResult.data) {
//         const newToken = (refreshResult.data as any).access;
//         localStorage.setItem("access", newToken);
//         if ((refreshResult.data as any).refresh) {
//           localStorage.setItem("refresh", (refreshResult.data as any).refresh);
//         }
//         result = await baseQuery(args, api, extraOptions);
//       } else {
//         return {
//           error: {
//             status: 401,
//             data: "Session expired, please login again.",
//           } as FetchBaseQueryError,
//         };
//       }
//     }
//   }

//   return result;
// };
