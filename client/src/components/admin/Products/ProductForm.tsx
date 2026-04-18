import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { uploadService } from "@/services/api/upload";
import { useCategories } from "@/services/queries/useCategories";
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/services/queries/useProducts";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/utils/cn";

interface ProductFormProps {
  product?: Product | null | undefined;
  onSuccess: () => void;
}

const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().optional(),
  brand: z.string().optional(),
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
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          brand: product.brand || "",
          price: product.price,
          salePrice: product.salePrice || undefined,
          stock: product.stock,
          categoryId: product.categoryId,
          isActive: product.isActive,
        }
      : { isActive: true, stock: 0 },
  });



  useEffect(() => {
    if (product) {
      reset({
        ...product,
        categoryId: String(product.categoryId),
      });
    }
  }, [product, reset]);

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    const totalImages = existingImages.length + newFiles.length;
    if (totalImages === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh sản phẩm");
      return;
    }
    if (totalImages > 10) {
      alert("Chỉ được phép tối đa 10 ảnh");
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

      const payload = {
        ...data,
        images: finalImages,
      };

      console.log("Dữ liệu sắp gửi đi:", payload);
      if (product) {
        updateProduct({ id: product.id, data: payload }, { onSuccess });
      } else {
        // createProduct nhận payload
        createProduct(payload, { onSuccess });
      }
    } catch (error) {
      setIsUploading(false);
      alert("Có lỗi xảy ra, hãy thử lại");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-1"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-brand-light p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">
              Thông tin chung
            </h3>
            <Input
              {...register("name")}
              label="Tên sản phẩm"
              placeholder="Quần jeans ..."
              error={errors.name?.message}
            />
            <Input
              {...register("brand")}
              label="Thương hiệu"
              placeholder="Az Fashion..."
              error={errors.brand?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register("price")}
                type="number"
                placeholder="0đ"
                label="Giá gốc (đ)"
                error={errors.price?.message}
              />
              <Input
                {...register("salePrice")}
                type="number"
                placeholder="0đ"
                label="Giá sale (đ)"
                error={errors.salePrice?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register("stock")}
                type="number"
                label="Kho biến thể"
                disabled
                className="cursor-not-allowed"
                error={errors.stock?.message}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Danh mục
                </label>
                <select
                  {...register("categoryId")}
                  className={cn(
                    "w-full bg-brand-grey border text-brand-dark transition-all duration-200 rounded py-2.5 px-4 text-sm outline-none placeholder:text-brand-dark/50",
                    errors.categoryId && "border-red-500 bg-red-50",
                  )}
                >
                  <option value="">-- Chọn --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-brand-light p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3 h-full">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">
              Hình ảnh
            </h3>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Existing Images */}
                {existingImages.map((url, i) => (
                  <div
                    key={`old-${i}`}
                    className="relative aspect-square group"
                  >
                    <img
                      src={url}
                      className="w-full h-full rounded-xl object-cover border bg-brand-light"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setExistingImages((prev) =>
                          prev.filter((img) => img !== url),
                        )
                      }
                      className="absolute -top-1 -right-1 bg-brand-light text-red-500 rounded-full p-1 shadow-md"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}

                {/* New Files */}
                {newFiles.map((file, i) => (
                  <div key={`new-${i}`} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-full rounded-xl object-cover border border-brand-red/30 bg-brand-light"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(i)}
                      className="absolute -top-1 -right-1 bg-brand-light text-red-500 rounded-full p-1 shadow-md"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                ))}

                {/* Trigger */}
                {existingImages.length + newFiles.length < 10 && (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-brand-red/20 bg-red-50/30 text-brand-red cursor-pointer hover:bg-red-50 transition-colors">
                    <Upload size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files)
                          setNewFiles((prev) => [
                            ...prev,
                            ...Array.from(e.target.files!),
                          ]);
                      }}
                    />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-gray-400 text-center">
                Tối đa 10 ảnh (JPG, PNG, WEBP)
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">
            Mô tả chi tiết
          </label>
          <div className=" overflow-hidden border border-gray-200 shadow-sm bg-brand-light">
            <style>{`
              .ql-container {
                min-height: 150px;
                max-height: 300px; 
                overflow-y: auto;
              }
              .ql-editor {
                min-height: 150px;
              }
            `}</style>
            <ReactQuill
              theme="snow"
              value={watch("description")}
              onChange={(val) => setValue("description", val)}
              className="bg-brand-light"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions (Sticky) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t sticky bottom-0 bg-brand-light mt-4 z-10">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              {...register("isActive")}
              type="checkbox"
              id="isActive"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-brand-red after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-brand-light after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </div>
          <label
            htmlFor="isActive"
            className="cursor-pointer text-sm font-bold text-gray-700"
          >
            Hiển thị công khai
          </label>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isUploading && (
            <p className="text-[11px] text-brand-red font-bold animate-pulse">
              Đang tải {newFiles.length} ảnh lên máy chủ...
            </p>
          )}
          <div className="flex gap-2">
            <Button
              onClick={onSuccess}
              variant="primary"
              size="md"
              type="button"
              noHover
              className="rounded-2xl border-none bg-brand-red text-brand-light font-bold"
            >
              Hủy bỏ
            </Button>
            <Button
              disabled={isPending || isUploading}
              variant="primary"
              className="rounded-2xl border-none bg-brand-red text-brand-light font-bold"
            >
              {isPending
                ? "Đang xử lý..."
                : product
                  ? "Cập nhật ngay"
                  : "Tạo sản phẩm"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
