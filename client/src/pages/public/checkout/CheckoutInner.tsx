import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, CreditCard, Truck } from "lucide-react";
import z from "zod";
import { ROUTES } from "@/config/constants";
import {
  useAddresses,
  useCreateAddress,
} from "@/services/queries/useAddresses";
import { useCartSummary } from "@/services/queries/useCart";
import { useCreateOrder } from "@/services/queries/useOders";
import { formatCurrency } from "@/utils/formatters";
import type { Address } from "@/types/address";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import StripeModal from "./StripeModal";

const PAYMENT_METHODS = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)", icon: Truck },
  {
    value: "STRIPE",
    label: "Thẻ tín dụng / Visa / Mastercard",
    icon: CreditCard,
  },
];

const addressSchema = z.object({
  street: z.string().min(1, "Vui lòng nhập địa chỉ"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  state: z.string().min(1, "Vui lòng nhập tỉnh/thành"),
  postalCode: z.string().min(1, "Vui lòng nhập mã bưu điện"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
});
type AddressFormData = z.infer<typeof addressSchema>;

const CheckoutInner = () => {
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  const { data: summaryRes, isLoading: summaryLoading } = useCartSummary();
  const { data: addressesRes } = useAddresses();
  const { mutate: createAddress, isPending: creatingAddress } =
    useCreateAddress();
  const { mutate: createOrder, isPending: creatingOrder } = useCreateOrder();
  const summary = summaryRes?.data;
  const addresses = (addressesRes?.data || []) as Address[];

  if (addresses.length > 0 && !selectedAddressId) {
    const def = addresses.find((a: any) => a.isDefault) || addresses[0];
    setSelectedAddressId(def.id);
  }
  console.log(addresses);
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
      { ...data, isDefault: addresses.length === 0 },
      {
        onSuccess: (res: any) => {
          setSelectedAddressId(res.data.id);
          setShowAddressForm(false);
          reset();
        },
      },
    );
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ!");
      return;
    }

    if (paymentMethod === "COD") {
      createOrder(
        {
          addressId: selectedAddressId,
          paymentMethod,
          notes: notes || undefined,
        },
        { onSuccess: () => navigate(`${ROUTES.PROFILE}?tab=orders`) },
      );
    } else {
      setShowStripeModal(true);
    }
  };

  if (summaryLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb
        displayName="Giỏ hàng"
        linkName={ROUTES.CART}
        displayNameChild="Thanh toán"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-3 text-lg text-brand-dark">
              Thông tin giao hàng
            </h2>
            <div className="space-y-2">
              {addresses.map((addr: any) => (
                <label
                  key={addr.id}
                  className={`flex items-center gap-3 p-4 rounded-md cursor-pointer transition border border-brand-grey ${
                    selectedAddressId === addr.id
                      ? "border-black bg-gray-50"
                      : ""
                  }`}
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
                  variant="secondary"
                  noHover
                  size="sm"
                  leftIcon={Plus}
                  onClick={() => setShowAddressForm(true)}
                >
                  Thêm địa chỉ mới
                </Button>
              ) : (
                <div className="border rounded-xl p-4 space-y-2 text-brand-dark">
                  <p className="font-semibold text-sm">Địa chỉ mới</p>
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
                        noHover
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

          <div>
            <h2 className="font-semibold mb-3 text-brand-dark">
              Phương thức thanh toán
            </h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-4 rounded-md cursor-pointer transition border border-brand-grey ${
                    paymentMethod === value
                      ? "border-brand-black bg-gray-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                  />
                  <Icon size={16} className="text-gray-400" />
                  <span className="text-sm text-brand-dark font-semibold">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-brand-grey rounded-md px-4 py-2">
            <h2 className="font-semibold text-sm mb-3 text-brand-dark">
              Ghi chú
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú cho đơn hàng (tùy chọn)..."
              className="!rounded-md"
              rows={3}
            />
          </div>
        </div>

        <div>
          <div className="bg-brand-soft border p-5 sticky top-4">
            <h2 className="font-semibold mb-4">Đơn hàng của bạn</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {summary?.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 text-brand-dark"
                >
                  <img
                    src={item.product.images?.[0] || "/placeholder.png"}
                    alt={item.product.name}
                    className="h-16 w-16 object-cover bg-brand-grey rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs">
                      {item?.variant?.color} / {item?.variant?.size}
                    </p>
                    <p className="text-xs font-semibold text-gray-400">
                      x{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 space-y-2 text-sm text-brand-dark">
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

            <div className="border-t my-3 pt-3 flex justify-between font-semibold">
              <span>Tổng cộng</span>
              <span>{formatCurrency(summary?.total || 0)}</span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={creatingOrder || !selectedAddressId}
              fullWidth
              noHover
              size="md"
              className="bg-brand-red text-white font-bold text-sm"
            >
              {creatingOrder
                ? "Đang tạo đơn..."
                : paymentMethod === "COD"
                  ? "Đặt hàng"
                  : "Đặt hàng & Thanh toán"}
            </Button>
          </div>
        </div>
      </div>

      {showStripeModal && (
        <StripeModal
          addressId={selectedAddressId}
          notes={notes || undefined}
          total={summary?.total || 0}
          onSuccess={() => navigate(`${ROUTES.PROFILE}?tab=orders`)}
          onClose={() => setShowStripeModal(false)}
        />
      )}
    </div>
  );
};

export default CheckoutInner;
