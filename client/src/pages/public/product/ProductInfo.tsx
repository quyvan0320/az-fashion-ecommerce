import { ROUTES } from "@/config/constants";
import { useAddToCart } from "@/services/queries/useCart";
import { useAuth } from "@/store/authContext";
import { formatCurrency } from "@/utils/formatters";
import { useEffect, useState } from "react";
import StarDisplay from "./StarDisplay";
import { Minus, Plus } from "lucide-react";
import Button from "@/components/common/Button";

const ProductInfo = ({ product, ...props }: { product: any }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const variants = product?.variants || [];
  const availableSizes = [
    ...new Set(variants.map((v: any) => v.size).filter(Boolean)),
  ] as string[];
  const availableColors = [
    ...new Set(variants.map((v: any) => v.color).filter(Boolean)),
  ] as string[];

  const selectedVariant = variants.find(
    (v: any) =>
      (selectedSize ? v.size === selectedSize : true) &&
      (selectedColor ? v.color === selectedColor : true),
  );

  const effectiveStock = selectedVariant
    ? selectedVariant.stock
    : product?.stock || 0;
  const effectivePrice =
    selectedVariant?.price ||
    (product?.salePrice && product.salePrice > 0
      ? product.salePrice
      : product?.price) ||
    0;

  const hasDiscount = product && product.salePrice > 0;

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const firstAvailable = product.variants.find((v: any) => v.stock > 0);

      if (firstAvailable) {
        setSelectedSize(firstAvailable.size);
        setSelectedColor(firstAvailable.color);
      } else {
        setSelectedSize(product.variants[0].size);
        setSelectedColor(product.variants[0].color);
      }
    }
  }, [product]);

  const isColorDisabled = (color: string) => {
    if (selectedSize) {
      const variant = variants.find(
        (v: any) => v.color === color && v.size === selectedSize,
      );
      return !variant || variant.stock <= 0;
    }
    return !variants.some((v: any) => v.color === color && v.stock > 0);
  };

  const isSizeDisabled = (size: string) => {
    if (selectedColor) {
      const variant = variants.find(
        (v: any) => v.size === size && v.color === selectedColor,
      );
      return !variant || variant.stock <= 0;
    }
    return !variants.some((v: any) => v.size === size && v.stock > 0);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = ROUTES.LOGIN;
      return;
    }

    if (!product) return;

    if (variants.length > 0 && !selectedVariant) {
      alert("Vui lòng chọn Size và Màu sắc khacs");
      return;
    }

    if (effectiveStock <= 0) {
      alert("Sản phẩm này hiện đã hết hàng");
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id || "",
      quantity,
    });
  };
  return (
    <div className="space-y-5 col-span-2 md:mt-8 lg:mt-0">
      {/* name */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-sm text-brand-dark">
          Mã sản phẩm:{" "}
          <span className="font-semibold text-brand-dark">
            {product.sku || "Đang cập nhật"}
          </span>
          <span className="mx-2">|</span> Tình trạng:{" "}
          <span className=" font-semibold text-brand-dark">
            {effectiveStock > 0 ? "Còn hàng" : "Hết hàng"}
          </span>
          <span className="mx-2">|</span> Thương hiệu:{" "}
          <span className=" text-brand-dark font-semibold">
            {product.brand || "Đang cập nhật"}
          </span>
        </p>
      </div>

      {/* price */}
      <div className="bg-brand-grey p-4  rounded-sm">
        <div className="flex items-center">
          <span className="text-sm font-bold text-brand-black w-36 hidden md:block">Giá:</span>
          <div className="flex items-center gap-4 ">
            <span className="text-lg font-bold text-brand-red">
              {formatCurrency(effectivePrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  {formatCurrency(product.price)}
                </span>
                <span className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-full">
                  -
                  {Math.round(
                    ((product.price - product.salePrice) / product.price) * 100,
                  )}
                  %
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* reviews */}
      <div className="px-0 md:px-4  rounded-sm">
        <div className="flex items-center">
          <span className="text-sm hidden md:block font-bold text-brand-black w-36">
            Đánh giá:
          </span>
          <div className="flex  items-center gap-4 text-brand-dark font-semibold">
            <div className="flex items-center gap-2">
              <StarDisplay rating={product.averageRating || 0} />
              {product.averageRating?.toFixed(1)}
            </div>
            <span className=" text-gray-500">
              ({product?.reviews === 0 ? "0" : product.reviews.length} Lượt)
            </span>
          </div>
        </div>
      </div>

      {/* color */}
      {availableColors.length > 0 && (
        <div className="px-0 md:px-4 rounded-sm">
          <div className=" flex flex-col gap-4 md:gap-0 md:flex-row  md:items-center ">
            <div className="flex flex-col md:w-36 ">
              <span className="text-sm font-bold text-brand-black">
                Màu sắc:
              </span>
              <span className="text-emerald-600 text-xs font-semibold">
                {selectedColor || ""}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((color) => {
                const disabled = isColorDisabled(color);
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`min-w-[80px] font-semibold px-3 py-1.5 border rounded-sm text-xs uppercase transition-all ${
                      selectedColor === color
                        ? "border-brand-red ring-1 ring-brand-red text-brand-red"
                        : "border-brand-dark text-brand-dark"
                    } ${disabled ? "opacity-20 cursor-not-allowed bg-gray-100 border-gray-300" : "hover:border-brand-black"}`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* size */}
      {availableSizes.length > 0 && (
        <div className="px-0 md:px-4 rounded-sm">
              <div className=" flex flex-col gap-4 md:gap-0 md:flex-row  md:items-center ">
            <div className="flex flex-col md:w-36 ">
              <span className="text-sm font-bold text-brand-black">Size:</span>
              <span className="text-emerald-600 text-xs font-semibold">
                {selectedSize || ""}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map((size) => {
                const disabled = isSizeDisabled(size);
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[80px] font-semibold px-3 py-1.5 border rounded-sm text-xs uppercase transition-all ${
                      selectedSize === size
                        ? "border-brand-red ring-1 ring-brand-red text-brand-red"
                        : "border-brand-dark text-brand-dark"
                    } ${disabled ? "opacity-20 cursor-not-allowed bg-gray-100 border-gray-300" : "hover:border-brand-black"}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* quantity */}
      <div className="px-0 md:px-4 rounded-sm">
        <div className="flex items-center ">
          <span className="text-sm font-bold text-brand-black w-36">
            Số lượng:
          </span>
          <div className="flex items-center border-brand-grey border">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center bg-brand-grey  transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-10 h-8 flex items-center justify-center text-sm font-bold border-x border-brand-grey bg-brand-light">
              {quantity}
            </span>
            <button
              className="w-8 h-8 flex items-center justify-center bg-brand-grey  transition-colors disabled:opacity-50"
              onClick={() =>
                setQuantity((q) => Math.min(effectiveStock, q + 1))
              }
              disabled={quantity >= effectiveStock || effectiveStock === 0}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* add to cart */}
      <Button
        onClick={handleAddToCart}
        disabled={addingToCart || effectiveStock === 0}
        size="lg"
        className={`w-full md:w-1/3 lg:w-1/3 font-bold uppercase transition-all ${
          effectiveStock === 0
            ? "bg-gray-400 border-gray-400 text-white cursor-not-allowed"
            : "text-brand-red border-brand-red hover:bg-brand-red hover:text-white"
        }`}
      >
        {effectiveStock === 0
          ? "Hết hàng"
          : addingToCart
            ? "Đang thêm..."
            : "Thêm vào giỏ"}
      </Button>
    </div>
  );
};

export default ProductInfo;
