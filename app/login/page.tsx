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
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Notification from "@/components/Notification";
import IsLoading from "@/components/IsLoading";
// ========================================
// TYPES & SCHEMA
// ========================================

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

type Notification = {
  message: string;
  type: "success" | "error";
};

// ========================================
// SUB-COMPONENTS
// ========================================

// Notification Toast Component
const NotificationToast = ({
  notification,
}: {
  notification: { message: string; type: "success" | "error" };
}) => <Notification type={notification.type} message={notification.message} />;

// Background Blobs Component
const BackgroundBlobs = () => (
  <>
    <div className="absolute top-20 left-10 w-72 h-72 bg-[#B4182D] rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FDA481] rounded-full blur-3xl" />
  </>
);

// Form Header Component
const FormHeader = () => (
  <div className="text-center mb-8">
    <div className="relative inline-block mb-4">
      <div className="absolute inset-0 rounded-2xl blur-2xl bg-[#B4182D]" />
      <div className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B]">
        <div>
          <Lock className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
      Welcome Back
    </h1>
    <p className="text-lg text-[#242E49]">Login to your account</p>
  </div>
);

// Text Input Component
const TextInput = ({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  register,
  error,
  delay = 0,
}: {
  label: string;
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  register: any;
  error?: string;
  delay?: number;
}) => (
  <div className="input-group">
    <label className="block text-sm font-semibold mb-2 text-[#242E49]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C]">
        <Icon size={20} />
      </div>
      <input
        type={type}
        {...register}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
          error
            ? "border-[#B4182D]"
            : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
        }`}
      />
    </div>
    <AnimatePresence>
      {error && (
        <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
    </AnimatePresence>
  </div>
);

// Password Input Component
const PasswordInput = ({
  label,
  placeholder,
  register,
  error,
  delay = 0,
}: {
  label: string;
  placeholder: string;
  register: any;
  error?: string;
  delay?: number;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group">
      <label className="block text-sm font-semibold mb-2 text-[#242E49]">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C]">
          <Lock size={20} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          {...register}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
            error
              ? "border-[#B4182D]"
              : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37415C] hover:text-[#B4182D]"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1">
            <AlertCircle size={16} />
            {error}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Remember Me & Forgot Password Component
const RememberMeSection = ({ register }: { register: any }) => (
  <div className="input-group flex items-center justify-between">
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        {...register}
        className="w-4 h-4 rounded accent-[#B4182D]"
      />
      <span className="text-sm font-medium text-[#242E49]">Remember me</span>
    </label>
    <div>
      <Link
        href="/forgot-password"
        className="text-sm font-semibold text-[#B4182D] hover:text-[#54162B] inline-block"
      >
        Forgot Password?
      </Link>
    </div>
  </div>
);

// Submit Button Component
const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <div className="input-group">
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] disabled:opacity-60 disabled:cursor-not-allowed group"
    >
      {isLoading ? (
        <>
          <span>Loading...</span>
        </>
      ) : (
        <>
          Login
          <div>
            <ArrowRight size={20} />
          </div>
        </>
      )}
    </button>
  </div>
);

// Social Login Component
const SocialLogin = () => (
  <>
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-[#37415C]/20" />
      <span className="text-sm text-[#37415C]">OR</span>
      <div className="flex-1 h-px bg-[#37415C]/20" />
    </div>

    <div className="space-y-3">
      <button
        type="button"
        className="w-full py-3 rounded-xl font-semibold border-2 border-[#37415C]/20 flex items-center justify-center gap-3 bg-white/50 text-[#181A2F]"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
      </button>
    </div>
  </>
);

// Sign Up Link Component
const SignUpLink = () => (
  <p className="text-center mt-6 text-sm text-[#242E49]">
    Don&apos;t have an account?{" "}
    <Link
      href="/signup"
      className="font-bold text-[#B4182D] hover:text-[#54162B] transition-all duration-500 ease-out hover:scale-105 inline-block"
    >
      Sign Up
    </Link>
  </p>
);

// ========================================
// MAIN COMPONENT
// ========================================

const Login = () => {
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);

  // استخدم useAuth بدل useLoginMutation
  const { login, isLoginPending } = useAuth();

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
    [],
  );

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    login(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          showNotification("Login successful!", "success");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Login failed. Please try again.";
          showNotification(errorMessage, "error");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <BackgroundBlobs />

      {/* Notification */}
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      {/* Login Card */}
      <div className="w-full max-w-md relative">
        <div className="glass-dark rounded-3xl p-8 shadow-2xl">
          <FormHeader />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <TextInput
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="Enter your email"
              register={register("email")}
              error={errors.email?.message}
              delay={0.5}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              register={register("password")}
              error={errors.password?.message}
              delay={0.6}
            />

            <RememberMeSection register={register("rememberMe")} />

            <SubmitButton isLoading={isLoginPending} />
          </form>

          <SocialLogin />
          <SignUpLink />
        </div>
      </div>
    </div>
  );
};

export default Login;
