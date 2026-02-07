/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  ArrowRight,
  Check,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePasswordReset } from "@/hooks/useAuth";

// ========================================
// TYPES & SCHEMA
// ========================================

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

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
}) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
  >
    <div
      className={`glass px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
        notification.type === "error"
          ? "border-[#B4182D]/30"
          : "border-green-500/30"
      }`}
    >
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 0.6 }}
      >
        {notification.type === "error" ? (
          <AlertCircle className="text-[#B4182D]" size={24} />
        ) : (
          <Check className="text-green-600" size={24} />
        )}
      </motion.div>
      <p className="font-semibold text-[#181A2F]">{notification.message}</p>
    </div>
  </motion.div>
);

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
      Forgot Password?
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-lg text-[#242E49]"
    >
      Don&apos;t worry, we&apos;ll send you reset instructions
    </motion.p>
  </div>
);

// Email Input Component
const EmailInput = ({ register, error }: { register: any; error?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    className="input-group"
  >
    <label className="block text-sm font-semibold mb-2 text-[#242E49]">
      Email Address
    </label>
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C]"
      >
        <Mail size={20} />
      </motion.div>
      <input
        type="email"
        {...register}
        placeholder="Enter your email"
        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-500 ease-out outline-none bg-white/50 text-[#181A2F] ${
          error
            ? "border-[#B4182D]"
            : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
        }`}
      />
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

// Submit Button Component
const SubmitButton = ({
  isLoading,
  emailSent,
}: {
  isLoading: boolean;
  emailSent: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="input-group"
  >
    <motion.button
      type="submit"
      disabled={isLoading || emailSent}
      className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] disabled:opacity-60 disabled:cursor-not-allowed group"
      whileHover={
        !isLoading && !emailSent
          ? {
              y: -3,
              boxShadow: "0 25px 50px rgba(180, 24, 45, 0.4)",
            }
          : {}
      }
      whileTap={!isLoading && !emailSent ? { scale: 0.98 } : {}}
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
          Sending...
        </>
      ) : emailSent ? (
        <>
          <Check size={20} />
          Email Sent!
        </>
      ) : (
        <>
          Send Reset Link
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

// Success Message Component
const SuccessMessage = ({ email }: { email: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2 }}
    className="glass rounded-2xl p-6 mb-6"
  >
    <div className="flex items-start gap-4">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
      >
        <Check className="text-green-600" size={24} />
      </motion.div>
      <div>
        <h3 className="font-bold text-[#181A2F] mb-1">Check your email</h3>
        <p className="text-sm text-[#242E49]">
          We&apos;ve sent password reset instructions to{" "}
          <span className="font-semibold text-[#B4182D]">{email}</span>
        </p>
        <p className="text-xs text-[#37415C] mt-2">
          Didn&apos;t receive the email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  </motion.div>
);

// Back to Login Link
const BackToLoginLink = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.7 }}
    className="text-center mt-6"
  >
    <Link
      href="/login"
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#B4182D] hover:text-[#54162B] transition-all duration-500 ease-out hover:scale-105"
    >
      <ArrowLeft size={16} />
      Back to Login
    </Link>
  </motion.div>
);

// ========================================
// MAIN COMPONENT
// ========================================

const ForgotPassword = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const resetPasswordMutation = usePasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const showNotification = useCallback(
    (message: string, type: "success" | "error" = "success"): void => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    resetPasswordMutation.mutate(data.email, {
      onSuccess: (response) => {
        setEmailSent(true);
        setSubmittedEmail(data.email);
        showNotification(
          response.message || "Reset link sent successfully!",
          "success",
        );
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset link. Please try again.";
        showNotification(errorMessage, "error");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <BackgroundBlobs />

      {/* Notification */}
      <AnimatePresence>
        {notification && <NotificationToast notification={notification} />}
      </AnimatePresence>

      {/* Forgot Password Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-md relative"
      >
        <div className="glass-dark rounded-3xl p-8 shadow-2xl">
          <FormHeader />

          {/* Success Message */}
          {emailSent && <SuccessMessage email={submittedEmail} />}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <EmailInput
              register={register("email")}
              error={errors.email?.message}
            />

            <SubmitButton
              isLoading={resetPasswordMutation.isPending}
              emailSent={emailSent}
            />
          </form>

          <BackToLoginLink />
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
