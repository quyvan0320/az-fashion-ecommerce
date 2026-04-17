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
import {
  AlertTriangle,
  Box,
  BoxesIcon,
  Database,
  Pencil,
  Plus,
  Save,
  Trash2,
  UploadCloudIcon,
  X,
} from "lucide-react";
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
    <div className="space-y-5">
      {variantsData && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600">
            <Box size={16} />
            <span>Biến thể: {variantsData.totalVariants}</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-2 rounded-xl text-sm font-semibold text-brand-red">
            <Database size={16} />
            <span>Tổng kho: {variantsData.totalStock}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {variants.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-2xl bg-gray-50/50">
              <p className="text-sm text-gray-400">
                Chưa có biến thể nào được tạo.
              </p>
            </div>
          ) : (
            variants.map((variant) => (
              <div
                key={variant.id}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-2xl bg-brltext-brand-light hover:border-brand-red/30 hover:shadow-sm transition-all"
              >
                {/* Variant Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">
                      {variant.sku || "No-SKU"}
                    </span>
                    {variant.stock <= 5 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded animate-pulse">
                        <AlertTriangle size={10} /> Sắp hết
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium uppercase">
                        Size
                      </p>
                      <p className="font-bold text-gray-800">
                        {variant.size || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium uppercase">
                        Màu
                      </p>
                      <p className="font-bold text-gray-800">
                        {variant.color || "—"}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <p className="text-[11px] text-gray-400 font-medium uppercase">
                        Giá / Kho
                      </p>
                      <p className="font-bold text-brand-red flex items-center gap-1 flex-wrap">
                        {variant.price
                          ? formatCurrency(variant.price)
                          : "Mặc định"}
                        <span className="text-gray-200 font-normal">|</span>
                        <span
                          className={
                            variant.stock <= 5
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          {variant.stock}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions: Responsive Buttons */}
                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStock(variant.id)}
                    className="h-8 w-8 bg-brand-red p-0 rounded-lg border-none  hover:bg-gray-100 text-brand-light"
                  >
                    <BoxesIcon/>
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => openEdit(variant)}
                    className="h-8 w-8 p-0 rounded-lg border border-brand-dark hover:bg-gray-100 text-brand-dark"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleDelete(variant.id)}
                    className="h-8 w-8 p-0 rounded-lg border border-brand-dark hover:bg-gray-100 text-brand-dark"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Editor Section: Form Design */}
      {editingVariant !== undefined ? (
        <div className="border-2 border-brand-red/10 rounded-2xl p-4 sm:p-6 bg-red-50/20 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-5 bg-brand-red rounded-full" />
              {editingVariant ? "Cập nhật biến thể" : "Tạo biến thể mới"}
            </h3>
            <button
              onClick={() => {
                setEditingVariant(undefined);
                reset();
              }}
              className="p-1 text-gray-400 hover:bg-brltext-brand-light rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                {...register("size")}
                label="Kích cỡ (Size)"
                placeholder="M, L, XL, 42..."
              />
              <Input
                {...register("color")}
                label="Màu sắc"
                placeholder="Đỏ, Xanh Navy..."
              />
              <Input
                {...register("price")}
                type="number"
                label="Giá riêng (đ)"
                placeholder="Để trống dùng giá gốc"
              />
              <Input
                {...register("stock")}
                type="number"
                error={errors.stock?.message}
                label="Số lượng tồn kho"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                variant="secondary"
                className="flex-1 font-bold h-11 bg-brand-red hover:bg-red-700 text-brand-light shadow-lg shadow-red-100"
                leftIcon={Save}
              >
                {isCreating || isUpdating
                  ? "Đang lưu..."
                  : editingVariant
                    ? "Cập nhật ngay"
                    : "Tạo biến thể"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setEditingVariant(undefined);
                  reset();
                }}
                variant="primary"
                noHover
                 className="rounded-2xl border-none bg-brand-red text-brand-light font-bold"
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={openCreate}
          className="group w-full border-2 border-dashed border-gray-200 rounded-2xl py-6 text-sm font-bold text-gray-400 hover:border-brand-red/50 hover:text-brand-red hover:bg-red-50/30 transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-brand-red group-hover:text-brand-light transition-all">
            <Plus size={20} />
          </div>
          Thêm biến thể sản phẩm mới
        </button>
      )}
    </div>
  );
};

export default VariantContentDetail;
