"use client";

import { CreditCard, DollarSign, X } from "lucide-react";

interface PaymentMethodModalProps {
  onClose: () => void;
  onSelectPayPal: () => void;
  onSelectStripe: () => void;
}

const PaymentMethodModal = ({
  onClose,
  onSelectPayPal,
  onSelectStripe,
}: PaymentMethodModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Choose Payment Method
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select how you&apos;d like to pay
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Payment Options */}
        <div className="p-6 space-y-4">
          {/* PayPal Option */}
          <button
            onClick={onSelectPayPal}
            className="w-full group bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 transition-all duration-200 flex items-center gap-4"
          >
            <div className="bg-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-gray-900">PayPal</h3>
              <p className="text-sm text-gray-500">
                Pay securely with your PayPal account
              </p>
            </div>
            <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </button>

          {/* Stripe Option */}
          <button
            onClick={onSelectStripe}
            className="w-full group bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl p-6 transition-all duration-200 flex items-center gap-4"
          >
            <div className="bg-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-gray-900">Stripe</h3>
              <p className="text-sm text-gray-500">
                Pay with credit or debit card
              </p>
            </div>
            <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <p className="text-xs text-gray-500 text-center">
            All transactions are secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
