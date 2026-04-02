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
  Icon,
  MapPin,
  Pencil,
  Plus,
  ShoppingBag,
  Space,
  Star,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AddressForm from "./AddressForm";

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

  const { data: ordersRes, isLoading: ordersLoading } = useMyOrders({
    page: orderPage,
    limit: 5,
  });
  const { data: reviewsRes } = useMyReviews({ limit: 10 });

  const addresses = addressesRes?.data || [];
  const orders = ordersRes?.data || [];
  const orderPagination = ordersRes?.pagination;
  const reviews = reviewsRes?.data || [];

  const setTab = (tab: string) => setSearchParams({ tab });

  return (
    <div className="max-w-6xl mx-auto px-6 p-8">
      <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>

      {/* tabs */}
      <div className="flex gap-1 border-b mb-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === key
                ? "border-black  text-black"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* info tab */}
      {activeTab === "info" && user && (
        <div className="bg-white border rounded-xl p-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold mb-4">
            {user.firstName?.charAt(0).toLocaleUpperCase()}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Họ</p>
              <p className="font-medium mt-0.5">{user.lastName}</p>
            </div>
            <div>
              <p className="text-gray-400">Tên</p>
              <p className="font-medium mt-0.5">{user.firstName}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-medium mt-0.5">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Role</p>
              <p className="font-medium mt-0.5">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* order tab */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {ordersLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-12 text-gray-400">
              Bạn chưa có đơn hàng nào
            </p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs  font-medium ${STATUS_STYLES[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  {order.items.slice(0, 3).map((item) => (
                    <img
                      key={item.id}
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      className="w-10 h-10 rounded object-cover bg-gray-100"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{order.items.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {order.items.length} sản phẩm
                  </p>
                  <p className="font-semibold">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))
          )}

          {orderPagination && orderPagination.totalPages > 1 && (
            <div className="flex gap-2 justify-center pt-2">
              <Button
                onClick={() => setOrderPage((p) => p - 1)}
                disabled={!orderPagination.hasPrev}
              >
                Trước
              </Button>
              <span className="px-3 py-1.5 text-sm">
                {orderPagination.page} / {orderPagination.totalPages}
              </span>
              <Button
                onClick={() => setOrderPage((p) => p + 1)}
                disabled={!orderPagination.hasNext}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      )}

      {/* address tab */}
      {activeTab === "addresses" && (
        <div className="space-y-3">
          {addresses &&
            Array.isArray(addresses) &&
            addresses.map((addr: Address) => (
              <div
                key={addr.id}
                className="bg-white border rounded-xl p-4 flex items-center justify-between"
              >
                <div className="text-sm">
                  <p>{addr.street}</p>
                  <p className="text-gray-500">
                    {addr.city}, {addr.state}, {addr.country}
                  </p>
                  <p className="text-gray-40">{addr.postalCode}</p>
                  {addr.isDefault && (
                    <span className="inline-block mt-1 text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {!addr.isDefault && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setDefault(addr.id)}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddressModal(addr)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Xóa địa chỉ này"))
                        deleteAddress(addr.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => setAddressModal(null)}
          >
            Thêm địa chỉ mới
          </Button>
        </div>
      )}

      {/* review tab */}
      {activeTab === "reviews" && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-center py-12 text-gray-400">
              Bạn chưa có đánh giá nào
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={review.product?.images?.[0]}
                    alt={review.product?.name}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {review.product?.name}
                    </p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={
                            s <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

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
