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
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.15, 0.1],
      }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute top-20 left-10 w-72 h-72 bg-[#B4182D] rounded-full blur-3xl"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.15, 0.1],
      }}
      transition={{ duration: 7, repeat: Infinity, delay: 1 }}
      className="absolute bottom-20 right-10 w-96 h-96 bg-[#FDA481] rounded-full blur-3xl"
    />
  </>
);

// Form Header Component
const FormHeader = () => (
  <div className="text-center mb-8">
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
      className="relative inline-block mb-4"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-2xl blur-2xl bg-[#B4182D]"
      />
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B]"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <KeyRound className="w-8 h-8 text-white" />
        </motion.div>
      </motion.div>
    </motion.div>
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-4xl font-black mb-2 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent"
    >
      Reset Password
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-lg text-[#242E49]"
    >
      Enter your new password
    </motion.p>
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
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="input-group"
    >
      <label className="block text-sm font-semibold mb-2 text-[#242E49]">
        {label}
      </label>
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C]"
        >
          <Lock size={20} />
        </motion.div>
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
        <motion.button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#37415C] hover:text-[#B4182D]"
          whileHover={{ scale: 1.2, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </motion.button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[#B4182D] text-sm mt-2 flex items-center gap-1"
          >
            <AlertCircle size={16} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Submit Button Component
const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
    className="input-group"
  >
    <motion.button
      type="submit"
      disabled={isLoading}
      className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] disabled:opacity-60 disabled:cursor-not-allowed group"
      whileHover={
        !isLoading
          ? {
              y: -3,
              boxShadow: "0 25px 50px rgba(180, 24, 45, 0.4)",
            }
          : {}
      }
      whileTap={!isLoading ? { scale: 0.98 } : {}}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
          Resetting Password...
        </>
      ) : (
        <>
          Reset Password
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </>
      )}
    </motion.button>
  </motion.div>
);

// Invalid Token Message
const InvalidTokenMessage = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
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
        <motion.a
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B4182D] hover:text-[#54162B] transition-all"
          whileHover={{ x: 5 }}
        >
          Request New Link
          <ArrowRight size={16} />
        </motion.a>
      </div>
    </div>
  </motion.div>
);

// Password Requirements Info
const PasswordRequirements = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
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
  </motion.div>
);

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br relative overflow-hidden flex items-center justify-center py-12 px-4">
    <BackgroundBlobs />
    <div className="w-full max-w-md relative">
      <div className="glass-dark rounded-3xl p-8 shadow-2xl">
        <FormHeader />
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
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
      <AnimatePresence>
        {notification && <NotificationToast notification={notification} />}
      </AnimatePresence>

      {/* Reset Password Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
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
      </motion.div>
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
