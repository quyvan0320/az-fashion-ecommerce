import Spinner from "@/components/common/Spinner";
import { useUpdateOrderStatus } from "@/services/queries/useOders";
import { formatCurrency } from "@/utils/formatters";
import StatusBadge, { ORDER_STATUSES } from "./StatusBadge";
import { useState } from "react";
import { OrderDetail } from "@/types/order";
import {
  User,
  MapPin,
  Package,
  CreditCard,
  ChevronRight,
  Notebook,
} from "lucide-react";

const NEXT_STATUSES: Record<string, string[]> = {
  PENDING: ["PROCESSING", "CANCELED"],
  PROCESSING: ["SHIPPED", "CANCELED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELED: [],
};

interface OrderDetailContentProps {
  order: OrderDetail;
}

const OrderDetailContent = ({ order }: OrderDetailContentProps) => {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleStatusChange = (status: string) => {
    updateStatus(
      { id: order.id, status },
      {
        onSuccess: () => {
          setCurrentStatus(status as OrderDetail["status"]);
        },
      },
    );
  };
  console.log({ order });
  return (
    <div className="relative space-y-6 pr-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <User size={12} /> Khách hàng
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none">
              {order.user.lastName} {order.user.firstName}
            </p>
            <p className="text-xs text-gray-500 mt-1 italic">
              {order.user.email}
            </p>
            <p className="text-xs text-gray-500 mt-1 italic">
              {order.user?.phone || "N/A"}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <MapPin size={12} /> Địa chỉ giao hàng
          </div>
          <p className="text-xs font-bold text-gray-600 leading-relaxed">
            {order.address.street}, {order.address.city}, {order.address.state},{" "}
            {order.address.country}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
          <Package size={12} /> Danh sách sản phẩm
        </div>
        <div className="bg-brand-light rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-3 flex items-center gap-4 hover:bg-gray-50/30 transition-colors"
              >
                <img
                  src={item.product.images?.[0] || ""}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-xl bg-gray-100 border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] font-black text-gray-400">
                    SỐ LƯỢNG: {item.quantity}
                  </p>
                  <p className="text-[11px] font-black text-gray-400">
                    {item?.variant?.color} / {item?.variant?.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {formatCurrency(item.price)}/sp
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
          <p className="text-[10px] font-bold text-orange-600 uppercase mb-1 flex gap-2">
            <Notebook size={12} /> Ghi chú
          </p>
          <p className="text-xs text-gray-600 italic">"{order.notes}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
              <CreditCard size={12} /> Thanh toán
            </div>
            <div className="flex gap-3">
              <div className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                  Phương thức
                </p>
                <p className="text-xs font-bold text-gray-700">
                  {order.paymentMethod || "N/A"}
                </p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                  Trạng thái
                </p>
                <p
                  className={`text-xs font-bold ${order.paymentStatus === "PAID" ? "text-green-400" : order.paymentStatus === "REFUNDED" ? "text-brand-red" : "text-orange-400"}  uppercase`}
                >
                  {order.paymentStatus === "PAID"
                    ? "HOÀN THÀNH"
                    : order.paymentStatus === "REFUNDED"
                      ? "THẤT BẠI"
                      : "CHỜ XỬ LÝ"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Trạng thái đơn hàng
            </p>
            <div className="flex items-center gap-3 bg-brand-light p-2 rounded-2xl border border-gray-100 shadow-sm">
              <StatusBadge status={currentStatus} />

              {NEXT_STATUSES[currentStatus]?.length > 0 && (
                <>
                  <ChevronRight size={14} className="text-gray-300" />
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleStatusChange(e.target.value);
                    }}
                    disabled={isPending}
                    className="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-black/5 flex-1 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Chuyển tiếp --
                    </option>
                    {NEXT_STATUSES[currentStatus].map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUSES.find((os) => os.value === s)?.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-brand-soft rounded-2xl h-full p-5 text-brand-dark  space-y-3 shadow-xl shadow-gray-200 ">
          <div className="flex justify-between text-xs font-medium ">
            <span>Phí giao hàng</span>
            <span>
              {order?.shippingCost === 0
                ? "Miễn phí"
                : formatCurrency(order?.shippingCost || 0)}
            </span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between text-xs font-medium ">
              <span>Thuế</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
          )}
          <div className="border-t border-branlbg-brand-light/10 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold uppercase tracking-wider">
              Tổng cộng
            </span>
            <span className="text-2xl font-black text-brand-red">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {isPending && (
        <div className="absolute inset-0 bg-brand-light/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default OrderDetailContent;
