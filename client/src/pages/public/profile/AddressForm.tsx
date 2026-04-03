import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import {
  useCreateAddress,
  useUpdateAddress,
} from "@/services/queries/useAddresses";
import { Address } from "@/types/address";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface AddressFormProps {
  address?: Address | null;
  onSuccess: () => void;
}

const addressSchema = z.object({
  street: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  city: z.string().min(1, 'Vui lòng nhập thành phố'),
  state: z.string().min(1, 'Vui lòng nhập tỉnh/thành'),
  postalCode: z.string().min(1, 'Vui lòng nhập mã bưu điện'),
  country: z.string().min(1, 'Vui lòng nhập quốc gia'),
});

type AddressFormData = z.infer<typeof addressSchema>;

const AddressForm = ({
  address,
  onSuccess,
}: AddressFormProps) => {
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode,
        }
      : { country: "Việt Nam" },
  });

  const onSubmit = (data: AddressFormData) => {
    if (address) {
      updateAddress({ id: address.id, data }, { onSuccess });
    } else {
      createAddress(data, { onSuccess });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        label="Địa chỉ"
        {...register("street")}
        placeholder="05 Nguyễn Thị Minh Khai..."
        error={errors.street?.message}
      />
      <Input
        label="Thành phố"
        {...register("city")}
        placeholder="Đà Nẵng..."
        error={errors.city?.message}
      />
      <Input
        label="Tỉnh/Thành"
        {...register("state")}
        placeholder="Đà Nẵng..."
        error={errors.state?.message}
      />
      <Input
        label="Mã bưu điện"
        {...register("postalCode")}
        placeholder="55000..."
        error={errors.postalCode?.message}
      />
      <Input
        label="Quốc gia"
        {...register("country")}
        placeholder="Việt Nam..."
        error={errors.country?.message}
      />
      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          variant="secondary"
          size="md"
        >
          {isCreating || isUpdating
            ? "Đang lưu..."
            : address
              ? "Cập nhật"
              : "Thêm địa chỉ"}
        </Button>

        <Button
          type="button"
          onClick={onSuccess}
          variant="danger"
          size="md"
        >
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
