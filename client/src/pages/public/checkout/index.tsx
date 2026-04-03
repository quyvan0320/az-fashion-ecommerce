import { ROUTES } from "@/config/constants";
import {
  useAddresses,
  useCreateAddress,
} from "@/services/queries/useAddresses";
import { useCartSummary } from "@/services/queries/useCart";
import { useCreateOrder } from "@/services/queries/useOders";
import { stripePromise } from "@/utils/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { Elements } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import StripePaymentForm from "./StripePaymentForm";
import Button from "@/components/common/Button";
import { CreditCard, Icon, MapPin, Plus, Truck } from "lucide-react";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { formatCurrency } from "@/utils/formatters";

const addressSchema = z.object({
  street: z.string().min(1, "Vui lòng nhập địa chỉ"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  state: z.string().min(1, "Vui lòng nhập tỉnh/thành"),
  postalCode: z.string().min(1, "Vui lòng nhập mã bưu điện"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const PAYMENT_METHODS = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)", icon: Truck },
  {
    value: "STRIPE",
    label: "Thẻ tín dụng / Visa / Mastercard",
    icon: CreditCard,
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const { data: summaryRes, isLoading: summaryLoading } = useCartSummary();
  const { data: addressesRes } = useAddresses();
  const { mutate: createAddress, isPending: creatingAddress } =
    useCreateAddress();
  const { mutate: createOrder, isPending: creatingOrder } = useCreateOrder();

  const summary = summaryRes?.data;
  const addresses = addressesRes?.data || [];

  if (Array.isArray(addresses) && addresses.length > 0 && !selectedAddressId) {
    const def = (addresses as any[]).find((a) => a.isDefault) || addresses[0];
    setSelectedAddressId(def.id);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "Việt Nam" },
  });

  const handleAddAddress = (data: AddressFormData) => {
    createAddress(
      {
        ...data,
        isDefault: Array.isArray(addresses) && addresses.length === 0,
      },
      {
        onSuccess: (res) => {
          setSelectedAddressId(res.data.id);
          setShowAddressForm(false);
          reset();
        },
      },
    );
  };

  const handleCreateOrder = () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ");
      return;
    }

    createOrder(
      {
        addressId: selectedAddressId,
        paymentMethod,
        notes: notes || undefined,
      },
      {
        onSuccess: (res) => {
          if (paymentMethod === "COD") {
            navigate(`${ROUTES.PROFILE}?tab=orders`);
          } else {
            setCreatedOrderId(res.data.id);
          }
        },
      },
    );
  };

  if (summaryLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (createdOrderId && paymentMethod === "STRIPE") {
    // Console log ở đây để debug
    console.log("Stripe Promise hiện tại:", stripePromise);

    return (
      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Thanh toán</h1>
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              orderId={createdOrderId!}
              amount={summary?.total || 0}
              onSuccess={() => navigate(`${ROUTES.PROFILE}?tab=orders`)}
            />
          </Elements>
        ) : (
          <div>Đang tải phương thức thanh toán...</div>
        )}
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* left */}
        <div className="space-y-6">
          {/* address */}
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin size={16} /> Địa chỉ giao hàng
            </h2>
            <div className="space-y-2">
              {Array.isArray(addresses) &&
                addresses.map((addr: any) => (
                  <label
                    key={addr.id}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition 
                  ${selectedAddressId === addr.id ? "border-black bg-gray-50" : "hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-0.5"
                    />
                    <div className="text-sm">
                      <p>{addr.street}</p>
                      <p className="text-gray-500">
                        {addr.city}, {addr.state}, {addr.country}
                      </p>
                      {addr.isDefault && (
                        <span className="text-xs text-blue-500 font-medium">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </label>
                ))}

              {!showAddressForm ? (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Plus}
                  onClick={() => setShowAddressForm(true)}
                >
                  Thêm địa chỉ mới
                </Button>
              ) : (
                <div className="border rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium">Thêm địa chỉ mới</p>
                  <form
                    onSubmit={handleSubmit(handleAddAddress)}
                    className="space-y-2"
                  >
                    <Input
                      label="Địa chỉ"
                      {...register("street")}
                      placeholder="05 Nguyễn Thị Minh Khai..."
                      error={errors.street?.message}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Thành phố"
                        {...register("city")}
                        placeholder="Đà Nẵng..."
                        error={errors.city?.message}
                      />
                      <Input
                        label="Tỉnh/Thành"
                        {...register("state")}
                        placeholder="Đà Nẵng..."
                        error={errors.state?.message}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Mã bưu điện"
                        {...register("postalCode")}
                        placeholder="55000..."
                        error={errors.postalCode?.message}
                      />
                      <Input
                        label="Quốc gia"
                        {...register("country")}
                        placeholder="Việt Nam..."
                        error={errors.country?.message}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="submit"
                        disabled={creatingAddress}
                        variant="secondary"
                        size="md"
                      >
                        {creatingAddress ? "Đang lưu..." : "Lưu"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          reset();
                        }}
                        variant="danger"
                        size="md"
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* payment method */}
          <div>
            <h2 className="font-semibold mb-3">Phương thức thanh toán</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer 
                    ${paymentMethod === value ? "border-black bg-gray-50" : "hover:border-gray-300"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                  />
                  <Icon size={16} className="text-gray-400" />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* note */}
          <div>
            <h2 className="font-semibold mb-2">Ghi chú</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú cho đơn hàng (tùy chọn)..."
              rows={3}
            />
          </div>
        </div>

        {/* right */}
        <div>
          <div className="bg-white border rounded-xl p-5 sticky top-4">
            <h2 className="font-semibold mb-4">Đơn hàng của bạn</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {summary?.items?.map((item) => (
                <div className="flex items-center gap-3" key={item.id}>
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="h-12 w-12 object-cover bg-gray-100 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatCurrency(summary?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>
                  {summary?.shippingCost === 0
                    ? "Miễn phí"
                    : formatCurrency(summary?.shippingCost || 0)}
                </span>
              </div>
              {(summary?.tax || 0) > 0 && (
                <div className="flex justify-between">
                  <span>Thuế</span>
                  <span>{formatCurrency(summary?.tax || 0)}</span>
                </div>
              )}
            </div>

            <div className="border-t my-3 pt-3  flex justify-between font-semibold">
              <span>Tổng cộng</span>
              <span>{formatCurrency(summary?.total || 0)}</span>
            </div>

            <Button
              onClick={handleCreateOrder}
              disabled={creatingOrder || !selectedAddressId}
              size="md"
              fullWidth
            >
              {creatingOrder
                ? "Đang xử lý..."
                : paymentMethod === "COD"
                  ? "Đặt hàng"
                  : "Tiếp tục thanh toán →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
