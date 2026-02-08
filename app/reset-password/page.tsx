/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePasswordResetConfirm } from "@/hooks/useAuth";
import Notification from "@/components/Notification";

// ========================================
// TYPES & SCHEMA
// ========================================

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface Notification {
  message: string;
  type: "success" | "error";
}

// ========================================
// SUB-COMPONENTS
// ========================================

// Notification Component
const NotificationToast = ({
  notification,
}: {
  notification: Notification;
}) => <Notification type={notification.type} message={notification.message} />;

// Background Blobs Component
const BackgroundBlobs = () => (
  <>
    <div
      className="absolute top-20 left-10 w-72 h-72 bg-[#B4182D] rounded-full"
    />
    <div
      className="absolute bottom-20 right-10 w-96 h-96 bg-[#FDA481] rounded-full"
    />
  </>
);

// Form Header Component
const FormHeader = () => (
  <div className="text-center mb-8">
    <div
      className="relative inline-block mb-4"
    >
      <div

        className="absolute inset-0 rounded-2xl bg-[#B4182D]"
      />
      <div
        className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B]"
      >
        <div
        >
          <KeyRound className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
    <h1

      className="text-4xl font-black mb-2 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent"
    >
      Reset Password
    </h1>
    <p

      className="text-lg text-[#242E49]"
    >
      Enter your new password
    </p>
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
    <div
      className="input-group"
    >
      <label className="block text-sm font-semibold mb-2 text-[#242E49]">
        {label}
      </label>
      <div className="relative">
        <div
          
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C]"
        >
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
      
        {error && (
          <p
            className="text-[#B4182D] text-sm mt-2 flex items-center gap-1"
          >
            <AlertCircle size={16} />
            {error}
          </p>
        )}
      
    </div>
  );
};

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
          <RefreshCw className="animate-spin text-[#fca481]" size={25} />
          Resetting Password...
        </>
      ) : (
        <>
          Reset Password
          <div
          >
            <ArrowRight size={20} />
          </div>
        </>
      )}
    </button>
  </div>
);

// Invalid Token Message
const InvalidTokenMessage = () => (
  <div
    className="glass rounded-2xl p-6 mb-6 border-2 border-[#B4182D]/30"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="text-[#B4182D]" size={24} />
      </div>
      <div>
        <h3 className="font-bold text-[#181A2F] mb-1">
          Invalid or Expired Link
        </h3>
        <p className="text-sm text-[#242E49] mb-3">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <a
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B4182D] hover:text-[#54162B] transition-all"
        >
          Request New Link
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  </div>
);

// Password Requirements Info
const PasswordRequirements = () => (
  <div
    className="glass rounded-xl p-4 mb-4"
  >
    <p className="text-xs font-semibold text-[#242E49] mb-2">
      Password must contain:
    </p>
    <ul className="text-xs text-[#37415C] space-y-1">
      <li className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#B4182D]" />
        At least 8 characters
      </li>
      <li className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#B4182D]" />
        One uppercase letter
      </li>
      <li className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#B4182D]" />
        One lowercase letter
      </li>
      <li className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-[#B4182D]" />
        One number
      </li>
    </ul>
  </div>
);

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br relative overflow-hidden flex items-center justify-center py-12 px-4">
    <BackgroundBlobs />
    <div className="w-full max-w-md relative">
      <div className="glass-dark rounded-3xl p-8 shadow-2xl">
        <FormHeader />
        <div className="flex items-center justify-center py-12">
          <div
            className="w-8 h-8 border-2 border-[#B4182D] border-t-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
);

// ========================================
// MAIN COMPONENT (with useSearchParams)
// ========================================

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<Notification | null>(null);
  const token = searchParams.get("token");
  const resetConfirmMutation = usePasswordResetConfirm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    if (!token) {
      showNotification("Invalid reset token", "error");
      return;
    }

    resetConfirmMutation.mutate(
      {
        token,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          showNotification(
            response.message || "Password reset successfully!",
            "success",
          );
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to reset password. Please try again.";
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
      
        {notification && <NotificationToast notification={notification} />}
      

      {/* Reset Password Card */}
      <div
        className="w-full max-w-md relative"
      >
        <div className="glass-dark rounded-3xl p-8 shadow-2xl">
          <FormHeader />

          {/* Show error if no token */}
          {!token && <InvalidTokenMessage />}

          {/* Form - only show if token exists */}
          {token && (
            <>
              <PasswordRequirements />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  register={register("password")}
                  error={errors.password?.message}
                  delay={0.5}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  register={register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  delay={0.6}
                />

                <SubmitButton isLoading={resetConfirmMutation.isPending} />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ========================================
// WRAPPER WITH SUSPENSE BOUNDARY
// ========================================

const ResetPassword = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;
