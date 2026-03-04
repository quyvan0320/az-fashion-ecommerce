import { categoryKeys } from "@/config/query-keys";
import { CreateCategoryData, GetCategoriesParams } from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categorySevice } from "../api/categories";
import toast from "react-hot-toast";

export const useCategories = (params?: GetCategoriesParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categorySevice.getAll(params),
  });
};

export const useCategoryStats = () => {
  return useQuery({
    queryKey: categoryKeys.stats,
    queryFn: () => categorySevice.getStats(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryData) => categorySevice.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Tạo danh mục thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Tạo danh mục thất bại");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryData }) =>
      categorySevice.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Cập nhật danh mục thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categorySevice.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Xóa danh mục thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    },
  });
};
