import StatusBadge, {
  ORDER_STATUSES,
} from "@/components/admin/Orders/StatusBadge";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import { useAdminOrders } from "@/services/queries/useOders";
import { OrderDetail } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  Eye,
  ShoppingBag,
  Filter,
  Calendar,
  XCircle,
  Search,
  ChevronDown,
  Trash2,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import OrderDetailContent from "@/components/admin/Orders/OrderDetailContent";
import { Pagination } from "@/components/common/Pagination";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Helmet } from "react-helmet-async";

const Orders = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [searchType, setSearchType] = useState("orderNumber");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const { data: res, isLoading } = useAdminOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
    search: searchParam || undefined,
    searchType: searchType,
  });

  const orders = res?.data || [];
  const pagination = res?.pagination;

  const handleParams = (updates: Record<string, string>) => {
    if (updates.page) setPage(Number(updates.page));

    if (updates.status !== undefined) {
      setStatusFilter(updates.status);
      setPage(1);
    }

    if (updates.search !== undefined) {
      setSearchParam(updates.search);
      setPage(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    handleParams({ search: inputValue });
  };

  const handleReset = () => {
    setInputValue("");
    setSearchParam("");
    setStatusFilter("");
    setPage(1);
  };

  useEffect(() => {
    if (inputValue) {
      handleSearch();
    }
  }, [searchType]);

  return (
    <>
      <div className="space-y-6 pb-10">
        <Helmet>
          <title>Az Fashion - Quản lý đơn hàng</title>
        </Helmet>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
            <ShoppingBag className="text-brand-red" />
            Đơn hàng
            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {pagination?.total || 0}
            </span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-2 bg-brtext-brand-light rounded-2xl p-2  border shadow-sm items-center">
          <div className="flex flex-1 items-stretch w-full">
            <div className="relative group min-w-[140px] border-r border-gray-100 flex items-center">
              {/* Select Type */}
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full pl-4 pr-8 py-2 bg-transparent text-sm font-bold text-brand-dark appearance-none cursor-pointer outline-none"
              >
                <option value="orderNumber">Mã đơn hàng</option>
                <option value="customerName">Tên khách hàng</option>
                <option value="email">Email</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative flex-1">
              <Input
                leftIcon={Search}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchType === "orderNumber"
                    ? "Nhập mã đơn hàng ..."
                    : "Nhập thông tin tìm kiếm..."
                }
              />
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0">
            {(searchParam || statusFilter) && (
              <Button
                variant="primary"
                className="bg-brand-red text-brand-light border-none"
                onClick={handleReset}
                noHover
                size="md"
              >
                <Trash2 size={18} />
              </Button>
            )}
            <Button
              onClick={handleSearch}
              variant="primary"
              noHover
              className="bg-brand-red font-bold border-none text-brand-light"
              size="md"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap bg-brand-light p-2 border border-brand-soft rounded-2xl">
          <div className="p-2 text-brand-dark font-bold flex items-center gap-2">
            <Filter size={16} /> Lọc nhanh
          </div>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => handleParams({ status: s.value })}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all
                ${
                  statusFilter === s.value
                    ? "bg-brand-red text-branlbg-brand-light shadow-md"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="bg-brand-light shadow-sm rounded-2xl border border-gray-100 overflow-hidden relative">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-xs font-bold text-gray-400 animate-pulse uppercase tracking-widest">
                Đang tải đơn hàng...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">
                Không tìm thấy đơn hàng nào
              </p>
              {searchParam && (
                <button
                  onClick={handleReset}
                  className="mt-2 text-brand-red text-xs font-bold underline"
                >
                  Xóa bộ lọc và quay lại
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-600">
                        Mã đơn
                      </th>
                      <th className="px-6 py-4 font-bold text-gray-600">
                        Khách hàng
                      </th>
                      <th className="px-6 py-4 font-bold text-gray-600">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-4 font-bold text-gray-600">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 font-bold text-gray-600">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">
                            #{order.orderNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              {order.user.lastName} {order.user.firstName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {order.user.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors inline-flex items-center gap-2 font-bold text-gray-600"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                          #{order.orderNumber}
                        </p>
                        <p className="font-bold text-gray-900">
                          {order.user.lastName} {order.user.firstName}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-dashed">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {formatDateTime(order.createdAt)}
                        </span>
                        <span className="text-lg font-black text-gray-900">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-gray-100 p-2.5 rounded-xl text-gray-900 hover:bg-black hover:text-branlbg-brand-light transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination đồng bộ */}
        <Pagination
          pagination={pagination}
          handleParams={handleParams}
          page={page}
        />
      </div>

      {/* Modal Detail */}
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
