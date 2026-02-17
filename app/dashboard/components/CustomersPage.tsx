"use client";

import React, { useState } from "react";
import { Mail, Send, UserPlus, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useMakeAdmin } from "@/hooks/useDashboard";

export const CustomersPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const makeAdminMutation = useMakeAdmin();

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add Admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    makeAdminMutation.mutate(email, {
      onSuccess: (data) => {
        setEmail("");
        console.log(data.message);
      },
      onError: (err) => {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to add admin. Please try again.";
        setError(errorMessage);
      },
    });
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Add New Admin</h1>
        <p className="text-gray-400 text-base">
          Send an invitation to add a new admin user
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Main Card */}
        <div
          className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-[#fda481]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Admin Invitation
                </h2>
                <p className="text-sm text-gray-400">
                  Enter the email address of the new admin
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAddAdmin} className="p-8">
            <div className="mb-8">
              <label className="block text-sm font-bold text-white mb-3">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="admin@example.com"
                  disabled={makeAdminMutation.isPending}
                  className="w-full pl-12 pr-4 py-4 bg-[#0f1117] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#fda481]/50 focus:ring-2 focus:ring-[#fda481]/20  disabled:opacity-50 disabled:cursor-not-allowed"
                  autoFocus
                />
              </div>

              {/* Error Message */}
                {(error || makeAdminMutation.isError) && (
                  <div
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-400 font-medium">
                      {error || "Failed to add admin"}
                    </span>
                  </div>
                )}

              {/* Success Message */}
                {makeAdminMutation.isSuccess && (
                  <div
                    className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-emerald-400 font-medium">
                      {makeAdminMutation.data?.message ||
                        "Invitation sent successfully!"}
                    </span>
                  </div>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={makeAdminMutation.isPending}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#fda481]/25 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed "
            >
              {makeAdminMutation.isPending ? (
                <>
                  <RefreshCw
                    className="animate-spin text-[#fca481]"
                    size={25}
                  />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Send Invitation
                </>
              )}
            </button>
          </form>
        </div>

        {/* Optional: Hint */}
        <div
          className="mt-6 p-6 bg-[#1a1d29]/50 border border-white/5 rounded-xl"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">
              Make sure the email address is correct. The invitation can only be
              used once.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
