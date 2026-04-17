import { paymentService } from "@/services/api/payment";
import { formatCurrency } from "@/utils/formatters";
import { useCancelOrder, useCreateOrder } from "@/services/queries/useOders";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CreditCard, Lock, X } from "lucide-react";
import { useState } from "react";

interface StripeModalProps {
  addressId: string;
  notes?: string;
  total: number;
  onSuccess: () => void;
  onClose: () => void;
}

const StripeModal = ({ addressId, notes, total, onSuccess, onClose }: StripeModalProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: cancelOrder } = useCancelOrder();
 
  const handlePay = async () => {
  if (!stripe || !elements || isProcessing) return; 
  const cardElement = elements.getElement(CardElement);
  if (!cardElement) return;

  setIsProcessing(true);
  setError(null);

  let createdOrderId: string | null = null;

  try {
    const { error: cardError, paymentMethod: validatedPM } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (cardError) {
      setError(cardError.message || "Thông tin thẻ không hợp lệ");
      setIsProcessing(false); 
      return; 
    }

    const orderRes = await createOrder({
      addressId,
      paymentMethod: "STRIPE",
      notes,
    });
    createdOrderId = orderRes.data.id;

    const intentRes = await paymentService.createPaymentIntent(createdOrderId);
    const { clientSecret } = intentRes.data;

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: validatedPM.id,
    });

    if (stripeError) {
      await cancelOrder(createdOrderId).catch(() => {});
      setError(stripeError.message || "Thanh toán thất bại");
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(); 
    }
  } catch (err: any) {
    if (createdOrderId) {
      await cancelOrder(createdOrderId).catch(() => {});
    }
    setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
  } finally {
    setIsProcessing(false);
  }
};
 
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-green-500" />
            <h2 className="font-semibold">Thanh toán an toàn</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>
 
        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Số tiền thanh toán</span>
            <span className="text-lg font-bold">{formatCurrency(total)}</span>
          </div>
 
          <div>
            <label className="text-sm font-medium block mb-2">Thông tin thẻ</label>
            <div className="border rounded-xl p-4 focus-within:border-black transition-colors">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "15px",
                      color: "#1a1a1a",
                      fontFamily: "inherit",
                      "::placeholder": { color: "#9ca3af" },
                    },
                    invalid: { color: "#ef4444" },
                  },
                }}
              />
            </div>
          </div>
 
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-600 space-y-0.5">
            <p className="font-medium">Thẻ test:</p>
            <p>
              <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code>
              {" "}· bất kỳ ngày tương lai · bất kỳ CVC
            </p>
          </div>
 
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              ⚠ {error}
            </div>
          )}
        </div>
 
        {/* Footer */}
        <div className="p-5 pt-0 space-y-2">
          <button
            onClick={handlePay}
            disabled={!stripe || isProcessing}
            className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <CreditCard size={16} />
            {isProcessing ? "Đang xử lý..." : `Thanh toán ${formatCurrency(total)}`}
          </button>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 disabled:opacity-40"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default StripeModal;