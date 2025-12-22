/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useLoginMutation } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Zod Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

// Types
type LoginFormData = z.infer<typeof loginSchema>;

interface Notification {
  message: string;
  type: "success" | "error";
}

const Login: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  // React Hook Form with Zod
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

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      console.log(data);
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      showNotification("Login successful!", "success");
      router.push("/");
    } catch (err: any) {
      showNotification(`Login failed. Please try again.${err}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div
            className={`glass px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-700 ease-out ${
              notification.type === "error"
                ? "border-[#B4182D]/30"
                : "border-green-500/30"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle
                className="text-[#B4182D] transition-transform duration-500"
                size={24}
              />
            ) : (
              <Check
                className="text-green-600 transition-transform duration-500"
                size={24}
              />
            )}
            <p className="font-semibold text-[#181A2F]">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="w-full max-w-md relative animate-scale-in">
        <div className="glass-dark rounded-3xl p-8 shadow-2xl transition-all duration-700 ease-out">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-pulse bg-[#B4182D] transition-all duration-1000" />
              <div className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B] transition-transform duration-700 ease-out hover:scale-110">
                <Lock className="w-8 h-8 text-white transition-transform duration-500" />
              </div>
            </div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-lg text-[#242E49]">Login to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div className="input-group">
              <label className="block text-sm font-semibold mb-2 text-[#242E49]">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C] transition-colors duration-500"
                  size={20}
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
                    errors.email
                      ? "border-[#B4182D]"
                      : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1 transition-all duration-500">
                  <AlertCircle size={16} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label className="block text-sm font-semibold mb-2 text-[#242E49]">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C] transition-colors duration-500"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
                    errors.password
                      ? "border-[#B4182D]"
                      : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
                  }`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37415C] hover:text-[#B4182D] transition-all duration-500 ease-out"
                  whileHover={{
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
              {errors.password && (
                <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1 transition-all duration-500">
                  <AlertCircle size={16} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="input-group flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded accent-[#B4182D] transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm font-medium text-[#242E49] transition-colors duration-300">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#B4182D] hover:text-[#54162B] transition-all duration-500 ease-out hover:scale-105 inline-block"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="input-group">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="cyber-button w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl transition-all duration-700 ease-out flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] disabled:opacity-60 disabled:cursor-not-allowed  glow-crimson group"
                whileHover={{
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight
                      size={20}
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#37415C]/20" />
            <span className="text-sm text-[#37415C]">OR</span>
            <div className="flex-1 h-px bg-[#37415C]/20" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <motion.button
              type="button"
              className="w-full py-3 rounded-xl font-semibold transition-all duration-700 ease-out border-2 border-[#37415C]/20 flex items-center justify-center gap-3 bg-white/50 text-[#181A2F] hover:border-[#FDA481] hover:bg-[#FDA481]/10"
              whileHover={{
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5 transition-transform duration-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </motion.button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-sm text-[#242E49]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#B4182D] hover:text-[#54162B] transition-all duration-500 ease-out hover:scale-105 inline-block"
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
