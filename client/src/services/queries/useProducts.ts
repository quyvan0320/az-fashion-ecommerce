import { productKeys } from "@/config/query-keys";
import {
  CreateVariantData,
  GetProductsParams,
  ProductListResponse,
  UpdateVariantData,
} from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService, variantService } from "../api/products";
import toast from "react-hot-toast";

export const useProducts = (params?: GetProductsParams, options?: any) => {
  return useQuery<ProductListResponse>({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getAll(params),
    ...options
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.featured,
    queryFn: () => productService.getFeatured(),
  });
};

export const useRelatedProducts = (id: string) => {
  return useQuery({
    queryKey: productKeys.related(id),
    queryFn: () => productService.getRelated(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => productService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Tạo sản phẩm thành công");
    },
    onError: (erorr: any) => {
      toast.error(erorr.response?.data?.message || "Tạo sản phẩm thất bại");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      productService.update(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      toast.success("Cập nhật sản phẩm thành công");
    },
    onError: (erorr: any) => {
      toast.error(erorr.response?.data?.message || "Cập nhật thất bại");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Xóa sản phẩm thành công");
    },
    onError: (erorr: any) => {
      toast.error(erorr.response?.data?.message || "Xóa thất bại");
    },
  });
};

export const useToggleActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });
};

// variants
export const useProductVariants = (productId: string) => {
  return useQuery({
    queryKey: productKeys.variants(productId),
    queryFn: () => variantService.getByProduct(productId),
    enabled: !!productId,
  });
};

export const useCreateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: CreateVariantData;
    }) => variantService.create(productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.variants(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Tạo biến thể thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Tạo biến thể thất bại");
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVariantData }) =>
      variantService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Cập nhật biến thể thành công");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Cập nhật biến thể thất bại",
      );
    },
  });
};

export const useUpdateVariantStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      variantService.updateStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Cập nhật tồn kho thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật tồn kho thất bại");
    },
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => variantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Xóa biến thể thành công");
    },
    onError: (erorr: any) => {
      toast.error(erorr.response?.data?.message || "Xóa thất bại");
    },
  });
};
