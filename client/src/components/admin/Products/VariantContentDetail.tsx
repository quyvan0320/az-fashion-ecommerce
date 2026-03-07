import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Spinner from "@/components/common/Spinner";
import {
  useCreateVariant,
  useDeleteVariant,
  useProductVariants,
  useUpdateVariant,
  useUpdateVariantStock,
} from "@/services/queries/useProducts";
import { Product, Variant } from "@/types/product";
import { formatCurrency } from "@/utils/formatters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z, { size } from "zod";

interface VariantContentDetailProps {
  product?: Product;
  onSuccess: () => void;
}

const variantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Tồn kho không được âm"),
});

type VariantFormDate = z.infer<typeof variantSchema>;

const VariantContentDetail = ({
  product,
  onSuccess,
}: VariantContentDetailProps) => {
  const [editingVariant, setEditingVariant] = useState<
    Variant | null | undefined
  >(undefined);
  const { data: variantRes, isLoading } = useProductVariants(product?.id || "");
  const { mutate: createVariant, isPending: isCreating } = useCreateVariant();
  const { mutate: updateVariant, isPending: isUpdating } = useUpdateVariant();
  const { mutate: deleteVariant } = useDeleteVariant();
  const { mutate: updateStock } = useUpdateVariantStock();

  const variantsData = variantRes?.data;
  const variants = variantsData?.variants || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VariantFormDate>({
    resolver: zodResolver(variantSchema) as any,
    defaultValues: editingVariant
      ? {
          size: editingVariant.size || "",
          color: editingVariant.color || "",
          price: editingVariant.price || undefined,
          stock: editingVariant.stock,
        }
      : { stock: 0 },
  });

  const openCreate = () => {
    reset({ size: "", color: "", price: undefined, stock: 0 });
    setEditingVariant(null);
  };

  const openEdit = (variant: Variant) => {
    reset({
      size: variant.size || "",
      color: variant.color || "",
      price: variant.price || undefined,
      stock: variant.stock,
    });
    setEditingVariant(variant);
  };

  const onSubmit = (data: VariantFormDate) => {
    if (!product) return;

    const payload = {
      size: data.size || undefined,
      color: data.color || undefined,
      price: data.price || undefined,
      stock: data.stock,
    };

    if (editingVariant) {
      updateVariant(
        { id: editingVariant.id, data: payload },
        {
          onSuccess: () => {
            onSuccess();
            reset();
          },
        },
      );
    } else {
      createVariant(
        { productId: product.id, data: payload },
        {
          onSuccess: () => {
            onSuccess();
            reset();
          },
        },
      );
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Xóa biến thể này")) deleteVariant(id);
  };

  const handleUpdateStock = (id: string) => {
    const newStock = prompt("Nhập số lượng tồn kho mới");
    if (newStock !== null && !isNaN(Number(newStock))) {
      updateStock({ id, stock: Number(newStock) });
    }
  };

  return (
    <div className="space-y-4">
      {variantsData && (
        <div className="flex gap-4 text-sm bg-gray-50 rounded-lg p-3">
          <span>
            Tổng biến thể: <strong>{variantsData.totalVariants}</strong>
          </span>
          <span>
            Tổng tồn kho: <strong>{variantsData.totalStock}</strong>
          </span>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-2">
          {variants.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Chưa có biến thể nào
            </p>
          ) : (
            variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center gap-1 p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                  <div className="text-xs text-gray-400 col-span-full ">
                    {variant.sku}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Size</p>
                    <p className="font-medium">{variant.size || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Màu</p>
                    <p className="font-medium">{variant.color || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Giá riêng</p>
                    <p className="font-medium">
                      {variant.price
                        ? formatCurrency(variant.price)
                        : "Theo SP"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tồn kho</p>
                    <p
                      className={`font-medium ${variant.stock <= 5 ? "text-red-500" : ""}`}
                    >
                      {variant.stock}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStock(variant.id)}
                  >
                    Kho
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEdit(variant)}
                  >
                    <Pencil size={13} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(variant.id)}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {editingVariant !== undefined ? (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <h3 className="font-medium text-sm">
            {editingVariant ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                {...register("size")}
                placeholder="S, M, L, XL..."
                label="Size"
              />
              <Input
                {...register("color")}
                placeholder="Đỏ, Xanh navy..."
                label="Màu sắc"
              />
              <Input
                {...register("price")}
                type="number"
                placeholder="199,000đ"
                label="Giá riêng (để trống = giá SP)"
              />
              <Input
                {...register("stock")}
                type="number"
                error={errors.stock?.message}
                label="Tồn kho"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                variant="secondary"
              >
                {isCreating || isUpdating
                  ? "Đang lưu"
                  : editingVariant
                    ? "Cập nhật"
                    : "Tạo Biến thể"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setEditingVariant(undefined);
                  reset();
                }}
                variant="danger"
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={openCreate}
          className="w-full border-2 border-dashed rounded-lg py-3 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Thêm biến thể mới
        </button>
      )}
    </div>
  );
};

export default VariantContentDetail;
