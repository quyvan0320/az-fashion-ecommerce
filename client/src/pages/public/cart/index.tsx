import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import { ROUTES } from "@/config/constants";
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/services/queries/useCart";
import { formatCurrency } from "@/utils/formatters";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { data: carRes, isLoading } = useCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: clearCart } = useClearCart();

  const items = carRes?.data?.items || [];
  const summary = carRes?.data?.summary;
  const total = summary?.total || 0;
  const limit = 500000;
  const progress = Math.min((total / limit) * 100, 100);
  const isFreeShipping = total >= limit;
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
        <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-6">
          Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
        </p>
        <Link
          to={ROUTES.PRODUCTS}
          className="w-full mt-4  py-3 rounded-md text-sm font-bold text-brand-light flex items-center justify-center gap-2  bg-brand-red"
        >
          Mua sắm ngay <ArrowRight size={16} />
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4  py-6">
      <Breadcrumb displayName={`Giỏ hàng (${summary?.totalQuantity || 0})`} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            if (window.confirm("Xóa tất cả sản phẩm khỏi giỏ")) clearCart();
          }}
        >
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* cart items */}

        <div className="lg:col-span-2 space-y-3">
          <div className="mb-8 bg-white border rounded-md p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <p className="text-sm">
                {isFreeShipping ? (
                  <span className="text-brand-dark font-bold  flex items-center gap-2">
                    <Truck size={18} className="text-green-600" />
                    Đơn hàng của bạn đã được{" "}
                    <strong className="text-green-600 uppercase">
                      Miễn phí vận chuyển
                    </strong>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 font-medium">
                    <Truck size={18} className="text-orange-500" />
                    Mua thêm{" "}
                    <strong className="text-red-600 text-base">
                      {formatCurrency(limit - total)}
                    </strong>{" "}
                    để được MIỄN PHÍ VẬN CHUYỂN
                  </span>
                )}
              </p>
              {!isFreeShipping && (
                <Link
                  to={ROUTES.PRODUCTS}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Tiếp tục mua thêm &rarr;
                </Link>
              )}
            </div>

            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isFreeShipping ? "bg-green-500" : "bg-orange-500"}`}
              />
            </div>
          </div>
          {items.map((item) => {
            const displayPrice =
              item.product.salePrice > 0
                ? item.product.salePrice
                : item.product.price;
            return (
              <div
                key={item.id}
                className="flex gap-4 bg-white border rounded-md p-4"
              >
                <Link to={`/products/${item.product.slug}`}>
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-24 h-28 rounded-md object-cover bg-gray-100"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="font-medium text-sm hover:underline truncate block"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-xs ">
                    {item.variant === null ? (
                      <p>Không biến thể</p>
                    ) : (
                      <p>
                        {item?.variant?.color} / {item?.variant?.size}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 ">
                    {/* quantity controls */}
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateItem({
                                cartItemId: item.id,
                                quantity: item.quantity - 1,
                              })
                            : updateItem({
                                cartItemId: item.id,
                                quantity: 1,
                              })
                        }
                        className="w-8 h-8 flex items-center justify-center bg-brand-grey  transition-colors disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-bold border-x border-brand-grey bg-brand-light">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItem({
                            cartItemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        disabled={
                          item.quantity >=
                          (item.variant?.stock ?? item.product.stock)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-brand-grey  transition-colors disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(item.subtotal)}
                        </p>
                        {item.product.salePrice > 0 && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* order summary */}

        <div className="lg:col-span-1">
          <div className="bg-brand-light border rounded-md p-5 sticky top-4">
            <h3 className="font-semibold mb-4 text-2xl">Thông tin đơn hàng</h3>
            <div className="space-y-2 text-sm text-brand-dark">
              <div className="flex justify-between">
                <span>{summary?.itemCount} sản phẩm</span>
                <span>{formatCurrency(summary?.total || 0)}</span>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span className="font-bold text-lg text-brand-dark">
                Tổng tiền:
              </span>
              <span className="font-bold text-xl text-brand-red">
                {formatCurrency(summary?.total || 0)}
              </span>
            </div>
            <Link
              to={ROUTES.CHECKOUT}
              className="w-full mt-4  py-3 rounded-md text-sm font-bold text-brand-light flex items-center justify-center gap-2  bg-brand-red"
            >
              Tiến hành đặt hàng <ArrowRight size={18} />
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="w-full mt-2 font-semibold hover:text-brand-black text-center text-sm text-brand-dark block"
            >
              Tiến tục mua sắm
            </Link>
          </div>

          <div className="bg-blue-50 border border-teal-50 text-brand-dark rounded-md mt-4 p-5 space-y-2">
            <span className="text-sm font-bold ">Chính sách mua hàng:</span>
            <p className="text-sm">
              Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối
              thiểu <strong>0₫</strong> trở lên.
            </p>
            <p className="text-sm">
              Phí vận chuyển sẽ được tính ở trang thanh toán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
