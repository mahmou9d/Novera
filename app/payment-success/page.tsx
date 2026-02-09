/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCapturePayPalOrder } from "@/hooks/usePayment"; // adjust path
import { PayPalCaptureResponse } from "@/api/paymentApi";

const PaymentSuccess = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentData, setPaymentData] = useState<PayPalCaptureResponse>({
    message: "",
    data: { id: "", status: "" },});

  const { mutate: captureOrder, isPending } = useCapturePayPalOrder();

  useEffect(() => {
    // Get token and order_id from localStorage
    const orderID = localStorage.getItem("token");
    const django_order_id = localStorage.getItem("order_id");

    // If token exists, execute capture
    if (orderID && django_order_id) {
      captureOrder(
        {
          orderID,
          django_order_id, // django_order_id
        },
        {
          onSuccess: (data) => {
            setPaymentData(data);
            setIsProcessing(false);
            // Clean up localStorage after successful payment
            localStorage.removeItem("token");
            localStorage.removeItem("order_id");
          },
          onError: () => {
            setIsProcessing(false);
            // Redirect to payment page on failure
            router.push("/payment");
          },
        },
      );
    } else {
      // If no token, show page normally
      setIsProcessing(false);
    }
  }, [captureOrder, router]);

  // Loading screen while processing payment
  if (isProcessing || isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDA481]/10 via-white to-[#B4182D]/10 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-[#fca481]" size={20} />
          <p className="text-xl font-bold text-[#181A2F]">
            Processing payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDA481]/10 via-white to-[#B4182D]/10 relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#B4182D] rounded-full  opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FDA481] rounded-full  opacity-20" />

      {/* Success Card */}
      <div
        className="w-full max-w-md relative"
      >
        <div className="glass-dark rounded-3xl p-8 shadow-2xl">
          {/* Success Icon */}
          <div className="text-center">
            <div
              className="relative inline-block mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-[#B4182D] opacity-20 animate-pulse" />
              <div className="relative w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-[#B4182D] to-[#54162B]">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>

            {/* Header */}
            <div

              className="mb-8"
            >
              <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] bg-clip-text text-transparent">
                Payment Successful!
              </h1>
              <p className="text-lg text-[#242E49]">
                Your transaction has been completed successfully
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div
            className="bg-white/30 rounded-2xl p-6 mb-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#37415C]">
                Transaction ID
              </span>
              <span className="text-sm font-bold text-[#181A2F]">
                {paymentData?.data.id || "#TXN123456789"}
              </span>
            </div>

            <div className="h-px bg-[#37415C]/20" />
            
            <div className="h-px bg-[#37415C]/20" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#37415C]">Date</span>
              <span className="text-sm font-bold text-[#181A2F]">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="space-y-4"
          >
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-[#B4182D] via-[#54162B] to-[#181A2F] hover:shadow-[#B4182D]/50 group"
            >
              Go to Dashboard
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 "
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
