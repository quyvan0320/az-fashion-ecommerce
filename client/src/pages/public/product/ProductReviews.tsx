import {
  useCanReview,
  useCreateReview,
  useProductReviews,
} from "@/services/queries/useReviews";
import { useState } from "react";
import StarDisplay from "./StarDisplay";
import { Star } from "lucide-react";
import Textarea from "@/components/common/Textarea";
import StarInput from "./StarInput";
import Button from "@/components/common/Button";
import { formatDate } from "@/utils/formatters";
import { Pagination } from "@/components/common/Pagination";
import { useAuth } from "@/store/authContext";

const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const { isAuthenticated } = useAuth();
  const [reviewPage, setReviewPage] = useState(1);
  const { data: reviewsRes } = useProductReviews(productId || "", {
    page: reviewPage,
    limit: 5,
  });
  const { data: canReviewRes } = useCanReview(productId || "");
  const { mutate: createReview, isPending: submittingReview } =
    useCreateReview();
  const reviews = reviewsRes?.data || [];
  const reviewSummary = reviewsRes?.summary;
  const reviewPagination = reviewsRes?.pagination;
  const canReview = canReviewRes?.data?.canReview;

  const handleSubmitReview = () => {
    createReview(
      {
        productId: productId,
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
  return (
    <div className="space-y-8">
      {/* Review Summary Box */}
      {reviewSummary && reviewSummary.totalReviews > 0 && (
        <div className="flex flex-col md:flex-row items-center gap-12 bg-brand-grey rounded-md p-8">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-brand-black">
              {reviewSummary.averageRating.toFixed(1)}
            </p>
            <div className="my-2">
              <StarDisplay rating={reviewSummary.averageRating} size={18} />
            </div>
            <p className="text-sm text-gray-400">
              {reviewSummary.totalReviews} nhận xét
            </p>
          </div>

          <div className="flex-1 w-full space-y-2">
            {reviewSummary.ratingDistribution
              .sort((a, b) => b.rating - a.rating)
              .map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-4 text-sm">
                  <span className="w-3 font-medium">{rating}</span>
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 rounded-full bg-gray-200 h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(count / reviewSummary.totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-400 w-8">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Write Review Form */}
      {isAuthenticated && canReview && (
        <div className="bg-white border rounded-md p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-brand-black">
            Nhận xét sản phẩm
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-brand-dark text-sm font-bold">Đánh giá:</span>
            <StarInput value={reviewRating} onChange={setReviewRating} />
          </div>
          <Textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Sản phẩm này thế nào? Chia sẻ cho mọi người cùng biết nhé..."
            rows={4}
            className="rounded-md"
          />
          <Button onClick={handleSubmitReview} disabled={submittingReview}>
            {submittingReview ? "Đang gửi..." : "Gửi đánh giá ngay"}
          </Button>
        </div>
      )}

      {/* Review List */}
      <div className="divide-y border-t pt-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 italic">
              Hiện tại chưa có đánh giá nào cho sản phẩm này.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="py-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-grey uppercase flex items-center justify-center text-sm font-bold text-brand-dark">
                    {review.user.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-black">
                      {review.user.lastName} {review.user.firstName}
                    </p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-tighter">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarDisplay rating={review.rating} size={12} />
              </div>
              <p className="text-sm text-gray-600 pl-13 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>

      <Pagination
        pagination={reviewPagination}
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
  );
};

export default ProductReviews;
