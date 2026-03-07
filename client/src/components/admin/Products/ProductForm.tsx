import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { uploadService } from "@/services/api/upload";
import { useCategories } from "@/services/queries/useCategories";
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/services/queries/useProducts";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface ProductFormProps {
  product?: Product | null | undefined;
  onSuccess: () => void;
}

const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().optional(),
  price: z.coerce.number().min(1000, "Giá tối thiểu 1,000đ"),
  salePrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0, "Tồn kho không được âm"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images || [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { data: categoriesRes } = useCategories({ limit: 100 });

  const categories = categoriesRes?.data || [];
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          price: product.price,
          salePrice: product.salePrice || undefined,
          stock: product.stock,
          categoryId: product.categoryId,
          isActive: product.isActive,
        }
      : { isActive: true, stock: 0 },
  });

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (existingImages.length === 0 && newFiles.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh sản phẩm");
      return;
    }

    try {
      setIsUploading(true);
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        const res = await uploadService.uploadMutiple(newFiles);
        uploadedUrls = res.data.map((img) => img.url);
      }
      setIsUploading(false);

      const finalImages = [...existingImages, ...uploadedUrls];

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      finalImages.forEach((url) => formData.append("images", url));
      if (product) {
        updateProduct({ id: product.id, formData }, { onSuccess });
      } else {
        createProduct(formData, { onSuccess });
      }
    } catch (error) {
      setIsUploading(false);
      alert("Upload ảnh thất bại, hãy thử lại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* name */}
      <Input
        {...register("name")}
        label="Tên sản phẩm"
        placeholder="Quần jeans..."
        error={errors.name?.message}
      />

      {/* description */}
      <Textarea
        {...register("description")}
        label="Mô tả"
        placeholder="Đây là sản phẩm..."
        error={errors.description?.message}
      />
      {/* price and sale price */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register("price")}
          label="Giá gốc"
          placeholder="199,000đ"
          error={errors.price?.message}
        />

        <Input
          {...register("salePrice")}
          label="Giá sale"
          placeholder="99,000đ"

          error={errors.salePrice?.message}
        />
      </div>

      {/* stock and categories */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register("stock")}
          label="Tồn kho"
          error={errors.stock?.message}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Danh mục
          </label>
          <select
            {...register("categoryId")}
            className="w-full bg-gray-50 border transition-all duration-200 rounded-xl py-2.5 px-4 text-sm outline-none placeholder:text-gray-400"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>
      </div>
      {/* images */}
      <div className="space-y-1.5">
        {/* has image edit mode can delete single */}
        {existingImages.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {existingImages.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  className="w-16 h-16 rounded object-cover border"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeExistingImage(url)}
                  className="absolute -top-1 -right-1"
                >
                  <X size={10} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* preview images */}
        {newFiles.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {newFiles.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  className="w-16 h-16 rounded object-cover border"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeNewFile(i)}
                  className="absolute -top-1 -right-1"
                >
                  <X size={10} />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Input
          type="file"
          accept="image/*"
          label="Hình ảnh"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
            }
          }}
        ></Input>
         <p className="text-xs text-gray-400 mt-1">
              {existingImages.length + newFiles.length} ảnh 
              {isUploading && <span className="text-blue-500 ml-1">• Đang upload...</span>}
            </p>
      </div>

      {/* active */}
      <div className="flex items-center  gap-2 space-y-1.5">
        <input
          {...register("isActive")}
          type="checkbox"
          id="isActive"
          className="w-4 h-4"
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          Hiển thị sản phẩm
        </label>
      </div>

      <div className="flex gap-3">
        <Button disabled={isPending} variant="secondary">
          {isPending ? "Đang lưu" : product ? "Cập nhật" : "Tạo sản phẩm"}
        </Button>
        <Button onClick={onSuccess} variant="danger">
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
