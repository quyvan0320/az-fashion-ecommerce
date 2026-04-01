import Button from "@/components/common/Button";
import { ROUTES } from "@/config/constants";
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/services/queries/useCart";
import { formatCurrency } from "@/utils/formatters";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { data: carRes, isLoading } = useCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: clearCart } = useClearCart();

  const items = carRes?.data?.items || [];
  const summary = carRes?.data?.summary;

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
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-gray-200" />
        <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-6">
          Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
        </p>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800"
        >
          Mua sắm ngay <ArrowRight size={16} />
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Giỏ hàng ({summary?.totalQuantity || 0})
        </h1>
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
          {items.map((item) => {
            const displayPrice =
              item.product.salePrice > 0
                ? item.product.salePrice
                : item.product.price;
            return (
              <div
                key={item.id}
                className="flex gap-4 bg-white border rounded-xl p-4"
              >
                <Link to={`/products/${item.product.slug}`}>
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="font-medium text-sm hover:underline truncate block"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.product.category?.name}
                  </p>
                  <div className="flex items-center justify-between mt-3 ">
                    {/* quantity controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() =>
                          item.quantity > 1
                            ? updateItem({
                                cartItemId: item.id,
                                quantity: item.quantity - 1,
                              })
                            : removeItem(item.id)
                        }
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() =>
                          updateItem({
                            cartItemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        size="sm"
                        variant="outline"
                        disabled={
                          isUpdating || item.quantity >= item.product.stock
                        }
                      >
                        <Plus size={12} />
                      </Button>
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
          <div className="bg-white border rounded-xl p-5 sticky top-4">
            <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>{summary?.itemCount} sản phẩm</span>
                <span>{formatCurrency(summary?.total || 0)}</span>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Tổng cộng</span>
              <span>{formatCurrency(summary?.total || 0)}</span>
            </div>
            <Link
              to={ROUTES.CHECKOUT}
              className="w-full mt-4 bg-black text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition"
            >
              Tiến hành đặt hàng <ArrowRight size={18} />
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="w-full mt-2 hover:text-black text-center text-sm text-gray-400 block"
            >
              Tiến tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
