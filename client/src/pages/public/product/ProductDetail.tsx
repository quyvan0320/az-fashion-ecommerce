import { ROUTES } from "@/config/constants";
import { useAddToCart } from "@/services/queries/useCart";
import { useProductBySlug } from "@/services/queries/useProducts";
import {
  useCanReview,
  useCreateReview,
  useProductReviews,
} from "@/services/queries/useReviews";
import { useAuth } from "@/store/authContext";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Space,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarDisplay from "./StarDisplay";
import { formatCurrency, formatDate } from "@/utils/formatters";
import Button from "@/components/common/Button";
import StarInput from "./StarInput";
import Textarea from "@/components/common/Textarea";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPage, setReviewPage] = useState(1);

  const { data: productRes, isLoading } = useProductBySlug(slug || "");
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { data: reviewsRes } = useProductReviews(productRes?.data?.id || "", {
    page: reviewPage,
    limit: 5,
  });
  const { data: canReviewRes } = useCanReview(productRes?.data?.id || "");
  const { mutate: createReview, isPending: submittingReview } =
    useCreateReview();

  const product = productRes?.data;
  const reviews = reviewsRes?.data || [];
  const reviewSummary = reviewsRes?.summary;
  const reviewPagination = reviewsRes?.pagination;
  const canReview = canReviewRes?.data?.canReview;

  const variants = product?.variants || [];
  const availableSizes = [
    ...new Set(variants.map((v) => v.size).filter(Boolean)),
  ] as string[];
  const availableColors = [
    ...new Set(variants.map((v) => v.color).filter(Boolean)),
  ] as string[];

  const selectedVariant = variants.find(
    (v) =>
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = ROUTES.LOGIN;
      return;
    }
    if (!product) return;
    addToCart({ productId: product.id, quantity });
  };

  const handleSubmitReview = () => {
    if (!product) return;
    createReview(
      {
        productId: product.id,
        data: { rating: reviewRating, comment: reviewComment },
      },
      {
        onSuccess: () => {
          setReviewComment("");
          setReviewRating(5);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-2xl">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-400 mb-4">Không tìm thấy sản phẩm</p>
        <Link to={ROUTES.PRODUCTS} className="text-sm underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Link
        to={ROUTES.PRODUCTS}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-6"
      >
        <ChevronLeft size={16} /> Quay lại
      </Link>
      {/* product info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
            <img
              src={product.images?.[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === i ? "border-black" : "border-transparent"}`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              {product.category?.name}
            </p>
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>

          {/* rating */}
          {(product.averageRating || 0) > 0 && (
            <div className="flex items-center gap-2">
              <StarDisplay rating={product.averageRating || 0} />
              <span className="text-sm text-gray-500">
                {product.averageRating?.toFixed(1)} ({product.reviewCount}đánh
                giá)
              </span>
            </div>
          )}

          {/* price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              {formatCurrency(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 line-through text-lg">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* description */}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* sizes */}
          {availableSizes.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? null : size)
                    }
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${selectedSize === size ? "bg-black text-white border-black" : "hover:border-gray-400"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* colors */}
          {availableColors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Màu sắc</p>
              <div className="flex gap-2 flex-wrap">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setSelectedSize(selectedSize === color ? null : color)
                    }
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${selectedSize === color ? "bg-black text-white border-black" : "hover:border-gray-400"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* quantity */}
          <div>
            <p className="text-sm font-medium mb-2">
              Số lượng{" "}
              <span
                className={`ml-2 text-xl font-normal ${effectiveStock <= 5 ? "text-red-500" : "text-gray-400"}`}
              >
                (còn {effectiveStock})
              </span>
            </p>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                onClick={() =>
                  setQuantity((q) => Math.min(effectiveStock, q + 1))
                }
                disabled={quantity >= effectiveStock}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          {/* add to cart */}
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart || effectiveStock === 0}
            leftIcon={ShoppingBag}
          >
            {effectiveStock === 0
              ? "Hết hàng"
              : addingToCart
                ? "Đang thêm..."
                : "Thêm vào giỏ hàng"}
          </Button>
        </div>
      </div>

      {/* review */}
      <div>
        <h2 className="text-xl font-bold mb-6">Đánh giá sản phẩm</h2>

        {/* summary */}
        {reviewSummary && reviewSummary.totalReviews > 0 && (
          <div className="flex items-center gap-8 bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {reviewSummary.averageRating.toFixed(1)}
              </p>
              <StarDisplay rating={reviewSummary.averageRating} size={16} />
              <p className="text-sm text-gray-400 mt-1">
                {reviewSummary.totalReviews} đánh giá
              </p>
            </div>

            <div className="flex-1 space-y-1.5">
              {reviewSummary.ratingDistribution
                .sort((a, b) => b.rating - a.rating)
                .map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{rating}</span>
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <div className="flex-1 rounded-full bg-gray-200 h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full "
                        style={{
                          width: `${reviewSummary.totalReviews > 0 ? (count / reviewSummary.totalReviews) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-400 w-4">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* write review */}
        {isAuthenticated && canReview && (
          <div className="border rounded-xl p-5 mb-6 space-y-3">
            <h3 className="font-medium mb-3">Viết đánh giá của bạn</h3>
            <StarInput value={reviewRating} onChange={setReviewRating} />
            <Textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẽ trải nghiệm của bạn..."
              rows={3}
            />
            <Button onClick={handleSubmitReview} disabled={submittingReview}>
              {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        )}

        {/* review list */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mb-8">
              Chưa có đánh giá nào
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                      {review.user.firstName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">
                      {review.user.lastName} {review.user.firstName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <StarDisplay rating={review.rating} size={13} />
                {review.comment && (
                  <p className="text-sm text-gray-500 mt-1.5">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* review pagination */}
        {reviewPagination && reviewPagination.totalPages > 1 && (
          <div className="flex gap-2 mt-4 justify-center">
            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => setReviewPage((p) => p - 1)}
                disabled={!reviewPagination.hasPrev}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Trước
              </button>
              <span className="px-3 py-1.5 text-sm">
                {reviewPagination.page} / {reviewPagination.totalPages}
              </span>
              <button
                onClick={() => setReviewPage((p) => p + 1)}
                disabled={!reviewPagination.hasNext}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
