import Button from "@/components/common/Button";
import { paymentService } from "@/services/api/payment";
import { formatCurrency } from "@/utils/formatters";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { useState } from "react";

interface StripePaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}

const StripePaymentForm = ({ orderId, amount, onSuccess }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setError(null);
    try {
      const res = await paymentService.createPaymentIntent(orderId);
      const { clientSecret } = res.data;

      const { error: stripeError, paymentIntent } =
        await stripe?.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement)! },
        });

      if (stripeError) {
        setError(stripeError.message || "Thanh toán thất bại");
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="border rounded-xl p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                color: "#1a1a1a",
                "::placeholder": { color: "#9ca3af" },
              },
            },
          }}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">{error}</p>
      )}

      {/* card hind */}
      <p className="text-xs text-gray-400">
        Test: dùng thẻ{" "}
        <code className="bg-gray-100 px-1 rounded">4242 4242 4242 4242</code> ·
        bất kỳ ngày · bất kỳ CVC
      </p>

      <Button
        onClick={handlePay}
        disabled={!stripe || isProcessing}
        leftIcon={CreditCard}
      >
        {isProcessing ? "Đang xử lý..." : `Thanh toán ${formatCurrency(amount)}`}
      </Button>
    </div>
  );
};

export default StripePaymentForm;
