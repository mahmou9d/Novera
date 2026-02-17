"use client";

import { XCircle, ArrowRight, RefreshCw, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentCancel = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDA481]/10 via-white to-[#B4182D]/10 relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#B4182D] rounded-full opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FDA481] rounded-full opacity-20" />

      {/* Cancel Card */}
      <div className="w-full max-w-md relative">
        <div
          className="glass-dark rounded-3xl p-8 shadow-2xl"
        >
          {/* Cancel Icon */}
          <div className="text-center">
            <div
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-[#B4182D] opacity-20" />
              <div className="relative w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B]">
                <XCircle className="w-14 h-14 text-white" />
              </div>
            </div>

            {/* Header */}
            <div
              className="mb-8"
            >
              <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
                Payment Cancelled
              </h1>
              <p className="text-lg text-[#242E49]">
                Your transaction has been cancelled
              </p>
            </div>
          </div>

          {/* Cancellation Details */}
          <div
            className="bg-white/30 rounded-2xl p-6 mb-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B4182D]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <HelpCircle className="w-5 h-5 text-[#B4182D]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#181A2F] mb-2">
                  What happened?
                </h3>
                <p className="text-sm text-[#37415C] leading-relaxed">
                  Your payment was cancelled and no charges were made to your
                  account. You can try again or choose a different payment
                  method.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#37415C]/20" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#37415C]">
                Order ID
              </span>
              <span className="text-sm font-bold text-[#181A2F]">
                #ORD123456789
              </span>
            </div>
            <div className="h-px bg-[#37415C]/20" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#37415C]">
                Cancelled At
              </span>
              <span className="text-sm font-bold text-[#181A2F]">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="space-y-4"
          >
            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] hover:shadow-[#B4182D]/50 group"
            >
              <RefreshCw
                size={20}
                className="group-hover:rotate-180 duration-500"
              />
              Try Again
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl font-semibold border-2 border-[#37415C]/20 flex items-center justify-center gap-2 bg-white/50 text-[#181A2F] hover:bg-white/70 duration-300 group"
            >
              Go to Dashboard
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
