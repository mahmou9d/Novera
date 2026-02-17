"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignup, useLogin } from "@/hooks/useAuth";
import Notification from "@/components/Notification";
import { GoogleLogin } from "@react-oauth/google";
import { signupSchema } from "@/utils/validation";
import * as z from "zod";
import {
  ErrorResponse,
  NotificationState,
} from "@/type/type";
import { AxiosError } from "axios";
import { useShowNotification } from "@/utils/showNotification";
import { renderField } from "@/utils/renderField";
import { useHandleGoogleSuccess } from "@/utils/handleGoogleSuccess";

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const signupMutation = useSignup();
  const loginMutation = useLogin();

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

  const showNotification = useShowNotification(setNotification);
const handleGoogleSuccess = useHandleGoogleSuccess(showNotification);

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    signupMutation.mutate(
      {
        full_name: data.full_name,
        email: data.email,
        password1: data.password1,
        password2: data.password2,
      },
      {
        onSuccess: () => {
          loginMutation.mutate(
            { email: data.email, password: data.password1 },
            {
              onSuccess: () => {
                showNotification("Account created successfully!", "success");
                setTimeout(() => router.push("/"), 1000);
              },
              onError: (error: AxiosError<ErrorResponse>) => {
                showNotification(
                  error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    error?.message ||
                    "Auto-login failed. Please login manually.",
                  "error",
                );
                setTimeout(() => router.push("/login"), 2000);
              },
            },
          );
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.message ||
              "Signup failed. Please try again.",
            "error",
          );
        },
      },
    );
  };

  const isLoading = signupMutation.isPending || loginMutation.isPending;


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
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-lg text-[#242E49]">Join us today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {renderField({
              label: "Full Name",
              placeholder: "Enter your full name",
              register: register("full_name"),
              error: errors.full_name,
              icon: <User size={20} />,
            })}

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
              type: showPassword1 ? "text" : "password",
              placeholder: "Create a password",
              register: register("password1"),
              error: errors.password1,
              icon: <Lock size={20} />,
              endAdornment: (
                <button
                  type="button"
                  onClick={() => setShowPassword1((prev) => !prev)}
                  className="text-[#37415C] hover:text-[#B4182D]"
                >
                  {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              ),
            })}

            {renderField({
              label: "Confirm Password",
              type: showPassword2 ? "text" : "password",
              placeholder: "Confirm your password",
              register: register("password2"),
              error: errors.password2,
              icon: <Lock size={20} />,
              endAdornment: (
                <button
                  type="button"
                  onClick={() => setShowPassword2((prev) => !prev)}
                  className="text-[#37415C] hover:text-[#B4182D]"
                >
                  {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              ),
            })}

            {/* Terms Checkbox */}
            <div className="input-group">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="w-4 h-4 mt-1 rounded accent-[#B4182D]"
                />
                <span className="text-sm text-[#242E49]">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-[#B4182D] hover:text-[#54162B] hover:scale-105 inline-block"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-[#B4182D] hover:text-[#54162B] hover:scale-105 inline-block"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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

          {/* Google Signup */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleSuccess(credentialResponse.credential);
              }
            }}
            onError={() => {
              showNotification(
                "Google signup failed. Please try again.",
                "error",
              );
            }}
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width="100%"
          />

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-[#242E49]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#B4182D] hover:text-[#54162B] hover:scale-105 inline-block"
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
