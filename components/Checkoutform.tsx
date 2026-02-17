"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Lock,
  MapPin,
  User,
  Phone,
  Globe,
  FileText,
  RefreshCw,
} from "lucide-react";
import { CheckoutFormProps } from "@/type/type";
import { checkoutSchema } from "@/utils/validation";

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutForm = ({
  onClose,
  onSubmit,
  isSubmitting = false,
  totalAmount,
}: CheckoutFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      country: "",
      full_address: "",
      order_notes: "",
    },
  });

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
      hasError
        ? "border-red-300 focus:border-red-500"
        : "border-gray-200 focus:border-[#fca481]"
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Complete Your Order
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Total Amount: ${totalAmount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <User size={16} className="text-[#fca481]" />
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("full_name")}
              className={inputClass(!!errors.full_name)}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Phone size={16} className="text-[#fca481]" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phone_number")}
              className={inputClass(!!errors.phone_number)}
              placeholder="+1 234 567 8900"
              disabled={isSubmitting}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Globe size={16} className="text-[#fca481]" />
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("country")}
              className={inputClass(!!errors.country)}
              placeholder="United States, Canada, UK..."
              disabled={isSubmitting}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Full Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <MapPin size={16} className="text-[#fca481]" />
              Full Address <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("full_address")}
              rows={3}
              className={`${inputClass(!!errors.full_address)} resize-none`}
              placeholder="Street, City, Postal Code..."
              disabled={isSubmitting}
            />
            {errors.full_address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.full_address.message}
              </p>
            )}
          </div>

          {/* Order Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <FileText size={16} className="text-[#fca481]" />
              Order Notes (Optional)
            </label>
            <textarea
              {...register("order_notes")}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#fca481] outline-none transition-colors resize-none"
              placeholder="Any special delivery instructions..."
              disabled={isSubmitting}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#fca481] hover:bg-[#fb8c5f] text-white py-4 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Pay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
