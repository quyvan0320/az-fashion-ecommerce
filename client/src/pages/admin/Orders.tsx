import StatusBadge, {
  ORDER_STATUSES,
} from "@/components/admin/Orders/StatusBadge";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import { useAdminOrders } from "@/services/queries/useOders";
import { OrderDetail } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Eye } from "lucide-react";
import { useState } from "react";
import OrderDetailContent from "@/components/admin/Orders/OrderDetailContent";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const { data: res, isLoading } = useAdminOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
  });

  const orders = res?.data || [];
  const pagination = res?.pagination;
  return (
    <>
      <div className="space-y-4 w-full">
        <h1 className="text-xl font-semibold">
          Đơn hàng ({pagination?.total || 0})
        </h1>

        {/* status filter*/}
        <div className="flex gap-2 flex-wrap">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setStatusFilter(s.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors 
              ${statusFilter === s.value ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* table */}
        <div className="bg-white shadow-sm rounded-xl border overflow-hidden">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Mã đơn
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Khách hàng
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Tổng tiền
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Ngày tạo
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        #{order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <p>
                          {order.user.lastName} {order.user.firstName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.user.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 ">
                        {
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded"
                          >
                            <Eye size={14} />
                          </button>
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Trang {pagination.page} / {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          title={`Chi tiết đơn hàng #${selectedOrder.orderNumber}`}
        >
          <OrderDetailContent order={selectedOrder} />
        </Modal>
      )}
    </>
  );
};

export default Orders;
