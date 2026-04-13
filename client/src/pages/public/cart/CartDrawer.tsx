import { ROUTES } from "@/config/constants";
import {
  useCart,
  useCartSummary,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/services/queries/useCart";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatters";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Truck, X } from "lucide-react";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { isCartOpen, closeCart } = useCartStore();
  const { data: carRes, isLoading } = useCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { data: summaryRes, isLoading: summaryLoading } = useCartSummary();
  const { mutate: removeItem } = useRemoveCartItem();
  const cartBanner = "cart_banner_image.jpg";
  const items = carRes?.data?.items || [];
  const summary = summaryRes?.data;
  const total = summary?.subtotal || 0;
  const limit = 500000;
  const progress = Math.min((total / limit) * 100, 100);
  const isFreeShipping = total >= limit;
  console.log(summaryRes);
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-brand-dark/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-light z-[101] shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center  p-4">
              <h2 className="text-xl font-bold">Giỏ hàng</h2>
              <button onClick={closeCart} className="p-2 cursor-pointer">
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col min-h-[60vh] items-center justify-center gap-4">
                <img src={cartBanner} alt="" />
                <span className="text-lg">
                  Chưa có sản phẩm nào trong giỏ hàng...
                </span>
                <Link
                  to={ROUTES.HOME}
                  className="text-blue-400 underline text-sm"
                >
                  Trở về trang sản phẩm
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 p-4 bg-brand-light">
                  <p className="text-sm transition-all duration-500 ">
                    {isFreeShipping ? (
                      <span className="text-brand-dark font-bold">
                        Bạn đã được{" "}
                        <strong className="text-green-600">
                          MIỄN PHÍ VẬN CHUYỂN
                        </strong>
                      </span>
                    ) : (
                      <>
                        Bạn cần mua thêm{" "}
                        <strong className="text-red-600 text-base">
                          {(limit - total).toLocaleString()}₫
                        </strong>{" "}
                        để được <strong>MIỄN PHÍ VẬN CHUYỂN</strong>
                      </>
                    )}
                  </p>

                  <div className="relative h-1.5 w-full bg-gray-200 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 20,
                      }}
                      className={`h-full rounded-full ${isFreeShipping ? "bg-green-500" : "bg-orange-500"}`}
                    />

                    <motion.div
                      initial={{ left: 0 }}
                      animate={{ left: `${progress}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 20,
                      }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                    >
                      <div className="relative">
                        <Truck
                          size={22}
                          className={`${isFreeShipping ? "text-green-600" : "text-orange-600"} bg-white rounded-full p-0.5 shadow-md border`}
                        />

                        {!isFreeShipping && total > 0 && (
                          <div className="absolute -left-1 top-1/2 w-1 h-1 bg-gray-300 rounded-full animate-ping" />
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="flex-1 mt-4 gap-4 border p-4 space-y-5  overflow-y-auto custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex items-start gap-6 border-b-2 border-brand-grey last:border-0 pb-4"
                    >
                      <Link to={`/products/${item.product.slug}`}>
                        <img
                          src={item.product.images?.[0]}
                          alt={item.product.name}
                          className="w-24 h-24 rounded object-cover bg-brand-light border"
                        />
                      </Link>
                      <div className="flex-1 items-center flex-col">
                        <div className="">
                          <p className="text-sm font-bold mr-5">
                            {item.product.name}
                          </p>
                          <div className="text-xs ">
                            {item.variant === null ? (
                              <p>Không biến thể</p>
                            ) : (
                              <p>
                                {item?.variant?.color} / {item?.variant?.size}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex items-start justify-between">
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
                            <div className="flex flex-col gap-2 text-sm font-bold">
                              {item.product.salePrice > 0 && (
                                <p className="">
                                  {formatCurrency(item.product.salePrice)}
                                </p>
                              )}
                              <p
                                className={`${item.product.salePrice > 0 ? "line-through font-normal" : ""}`}
                              >
                                {formatCurrency(item.product.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute w-4 h-4 right-0 top-0 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3  bg-brand-light">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium uppercase text-brand-dark">
                      Tổng tiền:
                    </p>
                    <p className="text-lg font-bold text-brand-red">
                      {formatCurrency(total)}
                    </p>
                  </div>
                  <Link to={ROUTES.CHECKOUT}>
                    <button className="py-2 bg-brand-red text-brand-light cursor-pointer text-center text-sm font-bold rounded w-full ">
                      THANH TOÁN
                    </button>
                  </Link>
                  <Link
                    className="text-blue-500 underline text-sm mt-2 cursor-pointer"
                    to={ROUTES.CART}
                  >
                    Xem giỏ hàng
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
