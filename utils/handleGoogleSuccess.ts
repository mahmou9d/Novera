"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useLoginGoogle } from "@/hooks/useAuth";
import { ErrorResponse, GoogleLoginData } from "@/type/type";

export const useHandleGoogleSuccess = (
  showNotification: (message: string, type: "success" | "error") => void,
) => {
  const { mutate: loginWithGoogle } = useLoginGoogle();
  const router = useRouter();

  const handleGoogleSuccess = useCallback(
    (credential: string) => {
      loginWithGoogle(
        { credential },
        {
          onSuccess: (data: GoogleLoginData) => {
            try {
              if (data.access) localStorage.setItem("access", data.access);
              if (data.refresh) localStorage.setItem("refresh", data.refresh);

              const savedToken = localStorage.getItem("access");

              if (savedToken) {
                showNotification("Login successful!", "success");

                setTimeout(() => {
                  router.push("/");
                  router.refresh();
                }, 1500);
              } else {
                showNotification("Failed to save login session", "error");
              }
            } catch {
              showNotification("Failed to save login session", "error");
            }
          },
          onError: (error: AxiosError<ErrorResponse>) => {
            showNotification(
              error?.response?.data?.message ||
                error?.response?.data?.detail ||
                error?.message ||
                "Google login failed. Please try again.",
              "error",
            );
          },
        },
      );
    },
    [loginWithGoogle, router, showNotification],
  );

  return handleGoogleSuccess;
};
