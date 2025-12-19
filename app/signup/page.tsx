"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Router } from "next/router";
import { useRouter } from "next/navigation";

// Types
interface Notification {
  message: string;
  type: "success" | "error";
}

interface Particle {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
}

interface SignupFormData {
  full_name: string;
  email: string;
  password1: string;
  password2: string;
  acceptTerms: boolean;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [signup, { isLoading, isSuccess }] = useSignupMutation();
  const [login] = useLoginMutation();
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    defaultValues: {
      full_name: "",
      email: "",
      password1: "",
      password2: "",
      acceptTerms: false,
    },
  });

  // Watch password1 to validate password2
  const password1 = watch("password1");

  // Generate particles once using useState with initializer function
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 6,
      animationDuration: 4 + Math.random() * 4,
    }))
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
      showNotification("Signup failed. Please try again.", "error");
    }
  };

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ): void => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50 relative overflow-hidden flex items-center justify-center py-12 px-4">
      <style jsx>{`
        :root {
          --color-navy: #1a1f3a;
          --color-slate: #3d4c63;
          --color-steel: #8b95a5;
          --color-peach: #fdb4a8;
          --color-crimson: #d93a49;
          --color-burgundy: #8b1e3f;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--color-peach);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
          opacity: 0.4;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 149, 165, 0.15);
        }

        .cyber-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .cyber-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }

        .cyber-button:hover::before {
          left: 100%;
        }

        .cyber-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-up {
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .input-group {
          opacity: 0;
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .input-group:nth-child(1) {
          animation-delay: 0.1s;
        }
        .input-group:nth-child(2) {
          animation-delay: 0.2s;
        }
        .input-group:nth-child(3) {
          animation-delay: 0.3s;
        }
        .input-group:nth-child(4) {
          animation-delay: 0.4s;
        }
        .input-group:nth-child(5) {
          animation-delay: 0.5s;
        }
        .input-group:nth-child(6) {
          animation-delay: 0.6s;
        }

        .error-message {
          color: var(--color-crimson);
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .input-error {
          border-color: var(--color-crimson) !important;
        }
      `}</style>

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div
            className={`glass-effect px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              notification.type === "error"
                ? "border-red-200"
                : "border-green-200"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle
                style={{ color: "var(--color-crimson)" }}
                size={24}
              />
            ) : (
              <Check className="text-green-600" size={24} />
            )}
            <p className="font-semibold" style={{ color: "var(--color-navy)" }}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Signup Card */}
      <div className="w-full max-w-md relative animate-scale-in">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-20 animate-pulse"
                style={{ background: "var(--color-crimson)" }}
              ></div>
              <div
                className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy))",
                }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1
              className="text-4xl font-black mb-2"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy), var(--color-navy))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Create Account
            </h1>
            <p className="text-lg" style={{ color: "var(--color-slate)" }}>
              Join us today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Input */}
            <div className="input-group">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  size={20}
                  style={{ color: "var(--color-steel)" }}
                />
                <input
                  type="text"
                  {...register("full_name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${
                    errors.full_name ? "input-error" : ""
                  }`}
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: errors.full_name
                      ? "var(--color-crimson)"
                      : "rgba(139, 149, 165, 0.2)",
                    color: "var(--color-navy)",
                  }}
                  onFocus={(e) => {
                    if (!errors.full_name) {
                      e.target.style.borderColor = "var(--color-peach)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(253, 180, 168, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.full_name) {
                      e.target.style.borderColor = "rgba(139, 149, 165, 0.2)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
              </div>
              {errors.full_name && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="input-group">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  size={20}
                  style={{ color: "var(--color-steel)" }}
                />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none ${
                    errors.email ? "input-error" : ""
                  }`}
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: errors.email
                      ? "var(--color-crimson)"
                      : "rgba(139, 149, 165, 0.2)",
                    color: "var(--color-navy)",
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "var(--color-peach)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(253, 180, 168, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "rgba(139, 149, 165, 0.2)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
              </div>
              {errors.email && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  size={20}
                  style={{ color: "var(--color-steel)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password1", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                  placeholder="Create a password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all outline-none ${
                    errors.password1 ? "input-error" : ""
                  }`}
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: errors.password1
                      ? "var(--color-crimson)"
                      : "rgba(139, 149, 165, 0.2)",
                    color: "var(--color-navy)",
                  }}
                  onFocus={(e) => {
                    if (!errors.password1) {
                      e.target.style.borderColor = "var(--color-peach)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(253, 180, 168, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password1) {
                      e.target.style.borderColor = "rgba(139, 149, 165, 0.2)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--color-steel)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-crimson)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-steel)")
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password1 && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.password1.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="input-group">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--color-slate)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  size={20}
                  style={{ color: "var(--color-steel)" }}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("password2", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password1 || "Passwords do not match",
                  })}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all outline-none ${
                    errors.password2 ? "input-error" : ""
                  }`}
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: errors.password2
                      ? "var(--color-crimson)"
                      : "rgba(139, 149, 165, 0.2)",
                    color: "var(--color-navy)",
                  }}
                  onFocus={(e) => {
                    if (!errors.password2) {
                      e.target.style.borderColor = "var(--color-peach)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(253, 180, 168, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password2) {
                      e.target.style.borderColor = "rgba(139, 149, 165, 0.2)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--color-steel)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-crimson)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-steel)")
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.password2 && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.password2.message}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="input-group">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptTerms", {
                    required: "You must accept the terms and conditions",
                  })}
                  className="w-4 h-4 mt-1 rounded accent-crimson"
                  style={{ accentColor: "var(--color-crimson)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-slate)" }}
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold transition-colors"
                    style={{ color: "var(--color-crimson)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-burgundy)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-crimson)")
                    }
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold transition-colors"
                    style={{ color: "var(--color-crimson)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-burgundy)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-crimson)")
                    }
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="error-message">
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
                className="cyber-button w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-crimson), var(--color-burgundy), var(--color-navy))",
                  boxShadow: "0 10px 30px rgba(217, 58, 73, 0.3)",
                }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(139, 149, 165, 0.2)" }}
            ></div>
            <span className="text-sm" style={{ color: "var(--color-steel)" }}>
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(139, 149, 165, 0.2)" }}
            ></div>
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 rounded-xl font-semibold transition-all border-2 flex items-center justify-center gap-3 hover:scale-[1.02]"
              style={{
                borderColor: "rgba(139, 149, 165, 0.2)",
                color: "var(--color-navy)",
                background: "rgba(255, 255, 255, 0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-peach)";
                e.currentTarget.style.background = "rgba(253, 180, 168, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(139, 149, 165, 0.2)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
              }}
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

          {/* Login Link */}
          <p
            className="text-center mt-6 text-sm"
            style={{ color: "var(--color-slate)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold transition-colors"
              style={{ color: "var(--color-crimson)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-burgundy)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-crimson)")
              }
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
