import Button from "@/components/common/Button";
import { ROUTES } from "@/config/constants";
import { useAddToCart } from "@/services/queries/useCart";
import { useAuth } from "@/store/authContext";
import { Product } from "@/types/product";
import { formatCurrency } from "@/utils/formatters";
import { ShoppingBag } from "lucide-react";
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
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = ROUTES.LOGIN;
      return;
    } else {
      AddToCart({ productId: product.id, quantity: 1 });
    }
  };
  return (
    <Link to={`${ROUTES.PRODUCTS}/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square mb-3">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 
        transition-transform duration-300"
        />
        {hadDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            -{discountPecent}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Hết hàng</span>
          </span>
        )}
        {product.stock > 0 && (
          <Button
            onClick={handleAddToCart}
            disabled={isPending}
            className="absolute rounded-none bottom-0 left-0 right-0 z-50"
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag size={14} />{" "}
              {isPending ? "Đang thêm..." : "Thêm vào giỏ"}
            </div>
          </Button>
        )}
      </div>
      <div>
        <p className="text-sm font-medium truncate ">{product.name}</p>
        <p className="text-xs text-gray-400  mb-1 ">{product.category?.name}</p>
        <div className="flex items-center gap-2">
            <span className="font-semibold">{formatCurrency(displayPrice)}</span>
            {hadDiscount && (
                <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>
            )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
