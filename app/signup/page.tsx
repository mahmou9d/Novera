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
  User,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useLoginMutation, useSignupMutation } from "@/store/authSlice";
import { useRouter } from "next/navigation";

// Zod Schema
const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password1: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    password2: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

// Types
type SignupFormData = z.infer<typeof signupSchema>;

interface Notification {
  message: string;
  type: "success" | "error";
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [signup, { isLoading }] = useSignupMutation();
  const [login] = useLoginMutation();

  // React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password1: "",
      password2: "",
      acceptTerms: false,
    },
  });

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      await signup({
        full_name: data.full_name,
        email: data.email,
        password1: data.password1,
        password2: data.password2,
      }).unwrap();

      await login({
        email: data.email,
        password: data.password1,
      }).unwrap();

      showNotification("Account created successfully!", "success");
      router.push("/");
    } catch (err) {
      showNotification(`Signup failed. Please try again.${err}`, "error");
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

      {/* Signup Card */}
      <div className="w-full max-w-md relative animate-scale-in">
        <div className="glass-dark rounded-3xl p-8 shadow-2xl transition-all duration-700 ease-out">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-pulse bg-[#B4182D] transition-all duration-1000" />
              <div className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B] transition-transform duration-700 ease-out hover:scale-110">
                <User className="w-8 h-8 text-white transition-transform duration-500" />
              </div>
            </div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-lg text-[#242E49]">Join us today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Input */}
            <div className="input-group">
              <label className="block text-sm font-semibold mb-2 text-[#242E49]">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C] transition-colors duration-500"
                  size={20}
                />
                <input
                  type="text"
                  {...register("full_name")}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
                    errors.full_name
                      ? "border-[#B4182D]"
                      : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
                  }`}
                />
              </div>
              {errors.full_name && (
                <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1 transition-all duration-500">
                  <AlertCircle size={16} />
                  {errors.full_name.message}
                </p>
              )}
            </div>

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
                  {...register("password1")}
                  placeholder="Create a password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
                    errors.password1
                      ? "border-[#B4182D]"
                      : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37415C] hover:text-[#B4182D] transition-all duration-500 ease-out hover:scale-110"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password1 && (
                <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1 transition-all duration-500">
                  <AlertCircle size={16} />
                  {errors.password1.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="input-group">
              <label className="block text-sm font-semibold mb-2 text-[#242E49]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C] transition-colors duration-500"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("password2")}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
                    errors.password2
                      ? "border-[#B4182D]"
                      : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37415C] hover:text-[#B4182D] transition-all duration-500 ease-out hover:scale-110"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.password2 && (
                <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1 transition-all duration-500">
                  <AlertCircle size={16} />
                  {errors.password2.message}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="input-group">
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="w-4 h-4 mt-1 rounded accent-[#B4182D] transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm text-[#242E49]">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-[#B4182D] hover:text-[#54162B] transition-all duration-500 ease-out hover:scale-105 inline-block"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-[#B4182D] hover:text-[#54162B] transition-all duration-500 ease-out hover:scale-105 inline-block"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1 transition-all duration-500">
                  <AlertCircle size={16} />
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="input-group">
              <button
                type="submit"
                disabled={isLoading}
                className="cyber-button w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl hover:scale-[1.02] transition-all duration-700 ease-out flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 glow-crimson group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={20}
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#37415C]/20" />
            <span className="text-sm text-[#37415C]">OR</span>
            <div className="flex-1 h-px bg-[#37415C]/20" />
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 rounded-xl font-semibold transition-all duration-700 ease-out border-2 border-[#37415C]/20 flex items-center justify-center gap-3 hover:scale-[1.02] bg-white/50 text-[#181A2F] hover:border-[#FDA481] hover:bg-[#FDA481]/10"
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
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-[#242E49]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#B4182D] hover:text-[#54162B] transition-all duration-500 ease-out hover:scale-105 inline-block"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
