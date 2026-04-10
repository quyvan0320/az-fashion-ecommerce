import Button from "@/components/common/Button";
import { ROUTES } from "@/config/constants";
import { useAddToCart } from "@/services/queries/useCart";
import { useAuth } from "@/store/authContext";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatters";
import { Eye, ShoppingBag } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
  const { isAuthenticated } = useAuth();
  const { mutate: AddToCart, isPending } = useAddToCart();

  const displayPrice =
    product.salePrice > 0 ? product.salePrice : product.price;
  const hadDiscount = product.salePrice > 0;
  const discountPecent = hadDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const variants = product.variants || [];

  const availableSizes = [...new Set(variants.map((v) => v.size))].filter(
    Boolean,
  );

  const availableColors = [...new Set(variants.map((v) => v.color))].filter(
    Boolean,
  );
  const totalVariantsStock = variants.reduce(
    (sum, v) => sum + (v.stock || 0),
    0,
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = ROUTES.LOGIN;
      return;
    }

    const firstAvailableVariant =
      product.variants?.find((v) => v.stock > 0) || product.variants?.[0];

    if (!firstAvailableVariant) {
      return;
    }

    AddToCart({
      productId: product.id,
      variantId: firstAvailableVariant.id,
      quantity: 1,
    });
  };

  return (
    <Link
      to={`${ROUTES.PRODUCTS}/${product.slug}`}
      className="group block w-full"
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] md:aspect-[3/4]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className={`  w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 
        ${product.images?.[1] ? "group-hover:opacity-0" : ""}`}
        />

        {product.images?.[1] && (
          <img
            src={product.images?.[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 
          group-hover:opacity-100 transition-all duration-700"
          />
        )}

        {hadDiscount && (
          <span className="absolute top-3 left-3 bg-brand-red rounded-full text-brand-light text-[10px] px-2 py-1 uppercase tracking-widest font-bold z-10">
            -{discountPecent}%
          </span>
        )}

        {totalVariantsStock === 0 ? (
          <div className="absolute inset-0 bg-brantext-brand-light/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="text-brand-light text-xs font-bold uppercase tracking-widest border-b-2 border-brand-light">
              Hết hàng
            </span>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 z-60 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-3">
            <div className="flex items-center justify-center">
              <Button
                onClick={handleAddToCart}
                leftIcon={ShoppingBag}
                disabled={isPending}
                className="hover:text-white"
              >
                {isPending ? "Đang xử lý..." : "Thêm nhanh"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm bên dưới */}
      <div className="space-y-1.5 p-2 bg-brand-light">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter text-gray-500 font-medium">
          <span>{availableColors.length} Màu sắc</span>
          <span>{availableSizes.length} Kích thước</span>
        </div>

        <h3 className="text-sm font-semibold text-brand-dark line-clamp-3 md:line-clamp-2 min-h-[50px] md:min-h-[40px] leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center gap-3 pt-1">
          <span className="font-bold text-sm text-brand-red">
            {formatCurrency(displayPrice)}
          </span>
          {hadDiscount && (
            <span className="text-xs text-gray-400 line-through decoration-1">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
