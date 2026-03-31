import { reviewKeys } from "@/config/query-keys";
import { GetReviewsParams } from "@/types/review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../api/reviews";
import toast from "react-hot-toast";

export const useProductReviews = (
  productId: string,
  params?: GetReviewsParams,
) => {
  return useQuery({
    queryKey: reviewKeys.product(productId, params || {}),
    queryFn: () => reviewService.getProductReviews(productId, params),
    enabled: !!productId,
  });
};

export const useCanReview = (productId: string) => {
  return useQuery({
    queryKey: reviewKeys.canReview(productId),
    queryFn: () => reviewService.canReviews(productId),
    enabled: !!productId,
  });
};

export const useMyReviews = (params?: GetReviewsParams) => {
  return useQuery({
    queryKey: reviewKeys.my(params),
    queryFn: () => reviewService.getMyReviews(params),
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: { rating: number; comment?: string };
    }) => reviewService.create(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.canReview(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "my"],
      });
      toast.success("Đánh giá thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đánh giá thất bại");
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { rating?: number; comment?: string };
    }) => reviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Cập nhật đánh giá thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Xóa đánh giá thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    },
  });
};
