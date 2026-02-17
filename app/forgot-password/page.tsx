"use client";

import  { useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
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
import { motion } from "framer-motion";
import { usePasswordReset } from "@/hooks/useAuth";
import { forgotPasswordSchema } from "@/utils/validation";
import { ErrorResponse, NotificationState } from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import Notification from "@/components/Notification";
import { AxiosError } from "axios";


type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;




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
        className="absolute inset-0 rounded-2xl  bg-[#B4182D]"
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
      Forgot Password?
    </h1>
    <p
      className="text-lg text-[#242E49]"
    >
      Don&apos;t worry, we&apos;ll send you reset instructions
    </p>
  </div>
);

// Email Input Component
const EmailInput = ({
  register,
  error,
}: {
  register: UseFormRegisterReturn;
  error?: string;
}) => (
  <div className="input-group">
    <label className="block text-sm font-semibold mb-2 text-[#242E49]">
      Email Address
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#37415C]">
        <Mail size={20} />
      </div>
      <input
        type="email"
        {...register}
        placeholder="Enter your email"
        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2  ease-out outline-none bg-white/50 text-[#181A2F] ${
          error
            ? "border-[#B4182D]"
            : "border-[#37415C]/20 focus:border-[#FDA481] focus:shadow-[0_0_0_3px_rgba(253,164,129,0.1)]"
        }`}
      />
    </div>

    {error && (
      <p className="text-[#B4182D] text-sm mt-2 flex items-center gap-1">
        <AlertCircle size={16} />
        {error}
      </p>
    )}
  </div>
);

// Submit Button Component
const SubmitButton = ({
  isLoading,
  emailSent,
}: {
  isLoading: boolean;
  emailSent: boolean;
}) => (
  <div
    
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
          <div
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
          <div
          >
            <ArrowRight size={20} />
          </div>
        </>
      )}
    </motion.button>
  </div>
);

// Success Message Component
const SuccessMessage = ({ email }: { email: string }) => (
  <div
    className="glass rounded-2xl p-6 mb-6"
  >
    <div className="flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
      >
        <Check className="text-green-600" size={24} />
      </div>
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
  </div>
);

// Back to Login Link
const BackToLoginLink = () => (
  <div
    className="text-center mt-6"
  >
    <Link
      href="/login"
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#B4182D] hover:text-[#54162B] hover:scale-105"
    >
      <ArrowLeft size={16} />
      Back to Login
    </Link>
  </div>
);

// ========================================
// MAIN COMPONENT
// ========================================

const ForgotPassword = () => {
  const [notification, setNotification] = useState<NotificationState | null>(null);
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

const showNotification = useShowNotification(setNotification);

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    resetPasswordMutation.mutate(data.email, {
      onSuccess: (response) => {
        setEmailSent(true);
        setSubmittedEmail(data.email);
        showNotification(
          response.status || "Reset link sent successfully!",
          "success",
        );
      },
      onError: (error: AxiosError<ErrorResponse>) => {
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

      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      {/* Forgot Password Card */}
      <div className="w-full max-w-md relative">
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
      </div>
    </div>
  );
};

export default ForgotPassword;
