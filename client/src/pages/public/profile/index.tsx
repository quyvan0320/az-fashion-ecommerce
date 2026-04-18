import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/services/queries/useAddresses";
import { useMyOrders } from "@/services/queries/useOders";
import { useMyReviews } from "@/services/queries/useReviews";
import { useAuth } from "@/store/authContext";
import { Address } from "@/types/address";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";
import {
  MapPin,
  Pencil,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AddressForm from "./AddressForm";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Pagination } from "@/components/common/Pagination";
import { Helmet } from "react-helmet-async";

const TABS = [
  { key: "info", label: "Thông tin", icon: User },
  { key: "orders", label: "Đơn hàng", icon: ShoppingBag },
  { key: "addresses", label: "Địa chỉ", icon: MapPin },
  { key: "reviews", label: "Đánh giá", icon: Star },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELED: "Đã hủy",
};

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "info";
  const [addressModal, setAddressModal] = useState<Address | null | undefined>(
    undefined,
  );
  const [orderPage, setOrderPage] = useState(1);

  const { user } = useAuth();
  const { data: addressesRes } = useAddresses();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: setDefault } = useSetDefaultAddress();
  const [reviewPage, setReviewPage] = useState(1);
  const { data: ordersRes, isLoading: ordersLoading } = useMyOrders({
    page: orderPage,
    limit: 5,
  });
  const { data: reviewsRes } = useMyReviews({ limit: 10, page: reviewPage });

  const addresses = (addressesRes?.data || []) as Address[];
  const orders = ordersRes?.data || [];
  const orderPagination = ordersRes?.pagination;
  const reviews = reviewsRes?.data || [];

  const setTab = (tab: string) => setSearchParams({ tab });
  console.log(orders);
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Helmet>
        <title>Az Fashion - Hồ sơ</title>
      </Helmet>
      <Breadcrumb displayName="Hồ sơ" />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt tài khoản</h1>
        <p className="text-gray-500 mt-1">
          Quản lý thông tin cá nhân và theo dõi đơn hàng của bạn.
        </p>
      </header>

      {/* Tabs  */}
      <div className="flex gap-1 border-b mb-8 overflow-x-auto no-scrollbar scroll-smooth">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
              activeTab === key
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      <main className="min-h-[400px]">
        {/* Info Tab */}
        {activeTab === "info" && user && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 shadow-inner">
                {user.firstName?.charAt(0).toLocaleUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold">
                  {user.lastName} {user.firstName}
                </h2>
                <p className="text-gray-500">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Họ và tên đệm
                </p>
                <p className="text-gray-900 font-medium">{user.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Tên</p>
                <p className="text-gray-900 font-medium">{user.firstName}</p>
              </div>
              <div className="space-y-1 ">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Địa chỉ Email
                </p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div className="space-y-1 ">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Số điện thoại
                </p>
                <p className="text-gray-900 font-medium">
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div id="orders" className="space-y-4">
            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-50 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed">
                <ShoppingBag className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        #{order.orderNumber}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-tight">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${STATUS_STYLES[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                      >
                        <img
                          src={item.product.images?.[0]}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {/* variant */}
                            {item?.variant && (
                              <span className="text-[11px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                {item?.variant?.color} / {item?.variant?.size}
                              </span>
                            )}
                            <span className="text-[11px] font-bold text-brand-dark">
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* notes */}
                  {order.notes && (
                    <div className="mb-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                      <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">
                        Ghi chú từ bạn:
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        "{order.notes}"
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-gray-400 font-medium">
                        Phương thức:{" "}
                        <span className="text-gray-600 font-bold">
                          {order.paymentMethod}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Trạng thái thanh toán:{" "}
                        <span
                          className={`font-bold ${order.paymentStatus === "PAID" ? "text-green-400" : order.paymentStatus === "REFUNDED" ? "text-brand-red" : "text-orange-400"}`}
                        >
                          {order.paymentStatus === "PAID"
                            ? "HOÀN THÀNH"
                            : order.paymentStatus === "REFUNDED"
                              ? "THẤT BẠI"
                              : "CHỜ XỬ LÝ"}
                        </span>
                      </p>

                      <p className="text-[10px] text-gray-400 font-medium">
                        Phí giao hàng:{" "}
                        <span
                          className={`font-bold ${order?.shippingCost === 0 ? "text-green-400" : "text-gray-600"}`}
                        >
                          {order?.shippingCost === 0
                            ? "MIỄN PHÍ"
                            : formatCurrency(order?.shippingCost || 0)}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Thuế:{" "}
                        <span className="text-gray-600 font-bold">
                          {formatCurrency(order.tax)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        Tổng thanh toán
                      </p>
                      <p className="text-xl font-black text-brand-red">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <Pagination
              pagination={orderPagination}
              page={orderPage}
              handleParams={(updates) => {
                if (updates.page) {
                  setOrderPage(Number(updates.page));
                  document
                    .getElementById("orders")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr: Address) => (
              <div
                key={addr.id}
                className={`relative p-5 rounded-2xl border transition-all ${addr.isDefault ? "border-black ring-1 ring-black" : "border-gray-100 bg-white"}`}
              >
                {addr.isDefault && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded uppercase">
                    Mặc định
                  </span>
                )}
                <div className="mb-6">
                  <p className="font-bold text-gray-900">{addr.street}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {addr.city}, {addr.state}, {addr.country}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Zip: {addr.postalCode}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <Button
                      variant="secondary"
                      size="sm"
                      noHover
                      className="text-[11px] h-8"
                      onClick={() => setDefault(addr.id)}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => setAddressModal(addr)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setAddressModal(null)}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-500"
            >
              <Plus size={24} />
              <span className="text-sm font-semibold">Thêm địa chỉ mới</span>
            </button>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 gap-4">
            {/* Review */}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex gap-4">
                  <img
                    src={review.product?.images?.[0]}
                    className="w-16 h-16 rounded-xl object-cover"
                    alt=""
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold">
                        {review.product?.name}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-0.5 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={10}
                          className={
                            s <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 italic">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <Pagination
              pagination={reviewsRes}
              page={reviewPage}
              handleParams={(updates) => {
                if (updates.page) {
                  setReviewPage(Number(updates.page));
                  document
                    .getElementById("product-tabs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          </div>
        )}
      </main>

      {/* address modal */}

      {addressModal !== undefined && (
        <Modal
          isOpen={true}
          title={
            addressModal === null ? "Thêm địa chỉ mới" : "Câp nhật địa chỉ"
          }
          onClose={() => setAddressModal(undefined)}
        >
          <AddressForm
            address={addressModal}
            onSuccess={() => setAddressModal(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Profile;
