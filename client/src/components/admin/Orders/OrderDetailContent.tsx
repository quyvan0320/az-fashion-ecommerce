import Spinner from "@/components/common/Spinner";
import {
  userOrderDetail,
  useUpdateOrderStatus,
} from "@/services/queries/useOders";
import { formatCurrency } from "@/utils/formatters";
import StatusBadge, { ORDER_STATUSES } from "./StatusBadge";
import { useState } from "react";
import { OrderDetail } from "@/types/order";

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
  return (
    <div className="space-y-6">
      {/* customer info */}
      <div>
        <p className="text-sm font-semibold uppercase mb-1 text-gray-400">
          Khách hàng
        </p>
        <p className="font-medium">
          {order.user.lastName} {order.user.firstName}
        </p>
        <p className="text-sm text-gray-500">{order.user.email}</p>
      </div>

      {/* address */}
      <div>
        <p className="text-sm font-semibold uppercase mb-1 text-gray-400">
          Địa chỉ giao hàng
        </p>
        <p className="text-sm">
          {order.address.street}, {order.address.city}, {order.address.state},{" "}
          {order.address.country}
        </p>
      </div>

      {/* products */}
      <div>
        <p className="text-sm font-semibold uppercase mb-1 text-gray-400">
          Sản phẩm
        </p>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.product.images?.[0] || "..."}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-xs text-gray-500">{item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* totals */}
      <div className="border-t pt-3 space-y-1">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Tạm tính</span>
          <span>{formatCurrency(order.subTotal)}</span>
        </div>

        {order.tax > 0 && (
          <div className="flex justify-between text-sm text-gray-500">
            <span>Thuế</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Tổng cộng</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* payment info */}
      <div className="flex gap-4 text-sm">
        <div>
          <div className="text-gray-400">Thanh toán: </div>
          <div className="font-medium">{order.paymentMethod || "N/A"}</div>
        </div>
        <div>
          <div className="text-gray-400">Trạng thái TT: </div>
          <div className="font-medium">{order.paymentStatus || "N/A"}</div>
        </div>
      </div>
      {/* //   status update */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Cập nhật trạng thái
        </p>
        <div className="flex items-center gap-3">
          <StatusBadge status={currentStatus} />
          {NEXT_STATUSES[currentStatus]?.length > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleStatusChange(e.target.value);
                }
              }}
              defaultValue={""}
              disabled={isPending}
              className="border rounded-lg px-3 py-1.5 text-sm flex-1"
            >
              <option value={""} disabled>
                -- Chuyển sang --
              </option>
              {NEXT_STATUSES[currentStatus].map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUSES.find((os) => os.value === s)?.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailContent;
