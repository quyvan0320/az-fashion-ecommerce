import { addressKeys } from "@/config/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../api/addresses";
import { CreateAddressData } from "@/types/address";
import toast from "react-hot-toast";

export const useAddresses = () => {
  return useQuery({
    queryKey: addressKeys.all,
    queryFn: () => addressService.getAll(),
  });
};

export const useDefaultAddress = () => {
  return useQuery({
    queryKey: addressKeys.default,
    queryFn: () => addressService.getDefault(),
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAddressData) => addressService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.default });
      toast.success("Thêm địa chỉ thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.massage || "Thêm địa chỉ thất bại");
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateAddressData>;
    }) => addressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Cập nhật địa chỉ thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.massage || "Cập nhật địa chỉ thất bại");
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.default });
      toast.success("Xóa địa chỉ thành công");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.massage || "Xóa địa chỉ thất bại");
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({ queryKey: addressKeys.default });
      toast.success("Đã địa chỉ mặc định");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.massage || "Cập nhậtf thất bại");
    },
  });
};
