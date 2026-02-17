"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Notification from "@/components/Notification";
import { GoogleLogin } from "@react-oauth/google";
import { useShowNotification } from "@/utils/showNotification";
import { AxiosError } from "axios";
import { ErrorResponse, NotificationState } from "@/type/type";
import { loginSchema } from "@/utils/validation";
import { renderField } from "@/utils/renderField";
import { useHandleGoogleSuccess } from "@/utils/handleGoogleSuccess";
import { useCartMerge } from "@/hooks/useCart";

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoginPending } = useAuth();
  const mergeCart = useCartMerge();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const showNotification = useShowNotification(setNotification);

  const handleGoogleSuccess = useHandleGoogleSuccess(showNotification);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          const deviceId = localStorage.getItem("X-Device-ID");
          if (deviceId) {
            mergeCart.mutate(deviceId);
          }
          showNotification("Login successful!", "success");
          setTimeout(() => router.push("/"), 1000);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.message ||
              "Login failed. Please try again.",
            "error",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#B4182D] rounded-full" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FDA481] rounded-full" />

      {/* Notification */}
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      <div className="w-full max-w-md relative">
        <div className="glass-dark rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-2xl bg-[#B4182D]" />
              <div className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B]">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-lg text-[#242E49]">Login to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {renderField({
              label: "Email Address",
              type: "email",
              placeholder: "Enter your email",
              register: register("email"),
              error: errors.email,
              icon: <Mail size={20} />,
            })}

            {renderField({
              label: "Password",
              type: showPassword ? "text" : "password",
              placeholder: "Enter your password",
              register: register("password"),
              error: errors.password,
              icon: <Lock size={20} />,
              endAdornment: (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[#37415C] hover:text-[#B4182D]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              ),
            })}

            {/* Remember Me & Forgot Password */}
            <div className="input-group flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded accent-[#B4182D]"
                />
                <span className="text-sm font-medium text-[#242E49]">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#B4182D] hover:text-[#54162B] inline-block"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoginPending}
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoginPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#37415C]/20" />
            <span className="text-sm text-[#37415C]">OR</span>
            <div className="flex-1 h-px bg-[#37415C]/20" />
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleSuccess(credentialResponse.credential);
              }
            }}
            onError={() => {
              showNotification(
                "Google login failed. Please try again.",
                "error",
              );
            }}
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width="100%"
          />

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-sm text-[#242E49]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#B4182D] hover:text-[#54162B] hover:scale-105 inline-block"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
