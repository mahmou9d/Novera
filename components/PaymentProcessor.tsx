/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PaymentProcessor.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCapturePayPalOrder } from "@/hooks/usePayment";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentProcessor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const capturePayPalOrderMutation = useCapturePayPalOrder();

  useEffect(() => {
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    // ✅ لو في بيانات PayPal في الـ URL
    if (token && payerId) {
      setIsProcessing(true);

      const django_order_id = localStorage.getItem("order_id");
      const orderID = localStorage.getItem("token");
      // const django_order_id = localStorage.getItem("order_id");
      if (!orderID) {
        setStatus("error");
        setErrorMessage("Order information not found");
        return;
      }

      // عمل Capture
      capturePayPalOrderMutation.mutate(
        {
          orderID: orderID,
          django_order_id: django_order_id as string,
        },
        {
          onSuccess: (data) => {
            setStatus("success");

            // تنظيف
            localStorage.removeItem("paypal_order_id");
            localStorage.removeItem("order_id");
            window.history.replaceState({}, "", "/");

            // Redirect
            setTimeout(() => {
              router.push(`/payment-success`);
            }, 2000);
          },
          onError: (error: any) => {
            setStatus("error");
            setErrorMessage(
              error?.response?.data?.message || "Payment verification failed",
            );
            window.history.replaceState({}, "", "/");
          },
        },
      );
    }
  }, [searchParams]);

  if (!isProcessing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          {(status === "processing" || status === "success") && (
            <>
              <Loader2 className="w-16 h-16 text-[#fca481] mx-auto mb-4 animate-spin" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Payment...
              </h3>
              <p className="text-gray-600">Verifying your PayPal payment</p>
              <div className="mt-4 flex justify-center gap-1">
                <div
                  className="w-2 h-2 bg-[#fca481] rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#fca481] rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#fca481] rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </>
          )}

          {/* {status === "success" && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="relative inline-block">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 w-20 h-20 mx-auto bg-green-500 rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                Your order has been confirmed
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to your order...</span>
              </div>
            </motion.div>
          )} */}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsProcessing(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => router.push("/support")}
                  className="flex-1 bg-[#fca481] hover:bg-[#fb8c5f] text-white px-6 py-3 rounded-xl font-bold"
                >
                  Get Help
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
