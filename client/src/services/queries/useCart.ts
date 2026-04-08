import { cartKeys } from "@/config/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cartService } from "../api/cart";
import { STORAGE_KEYS } from "@/config/constants";

export const useCart = () => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return useQuery({
    queryKey: cartKeys.cart,
    queryFn: () => cartService.getCart(),
    enabled: !!token,
    retry: false,
  });
};

export const useCartSummary = () => {
  return useQuery({
    queryKey: cartKeys.summary,
    queryFn: () => cartService.getSummary(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      quantity,
    }: {
      productId: string;
      variantId: string;
      quantity: number;
    }) => cartService.addItem(productId, variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary });
      toast.success("Đã thêm vào giỏ hàng");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Thêm vào giỏ hàng thất bại",
      );
    },
  });
};

export const useUpdateCartItem = () => {
  {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        cartItemId,
        quantity,
      }: {
        cartItemId: string;
        quantity: number;
      }) => cartService.updateQuantity(cartItemId, quantity),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: cartKeys.cart });
        queryClient.invalidateQueries({ queryKey: cartKeys.summary });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Cập nhật thất bại");
      },
    });
  }
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: string) => cartService.removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary });
      toast.success("Đã xóa khỏi giỏ hàng");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.cart });
      queryClient.invalidateQueries({ queryKey: cartKeys.summary });
    },
  });
};
