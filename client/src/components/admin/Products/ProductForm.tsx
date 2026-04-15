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
import { AlertCircle, Save, Upload, X } from "lucide-react";
import { useState } from "react";
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
  const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
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

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto px-1">
      {/* Grid chính: 1 cột trên mobile, 2 cột trên md */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <Input
            {...register("name")}
            label="Tên sản phẩm"
            placeholder="Ví dụ: Áo Hoodie Unisex"
            error={errors.name?.message}
            className="focus:ring-brand-red"
          />
          <Input
            {...register("brand")}
            label="Thương hiệu"
            placeholder="Az Fashion"
            error={errors.brand?.message}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("price")}
              type="number"
              label="Giá gốc (đ)"
              placeholder="0"
              error={errors.price?.message}
            />
            <Input
              {...register("salePrice")}
              type="number"
              label="Giá sale (đ)"
              placeholder="0"
              error={errors.salePrice?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("stock")}
              type="number"
              label="Tồn kho"
              error={errors.stock?.message}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">Danh mục</label>
              <select
                {...register("categoryId")}
                className={cn(
                  "w-full bg-gray-50 border border-gray-200 transition-all rounded-xl py-2.5 px-4 text-sm outline-none focus:border-brand-red focus:bg-white",
                  errors.categoryId && "border-red-500 bg-red-50"
                )}
              >
                <option value="">-- Chọn --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-[11px] font-medium text-red-500 ml-1 mt-1">{errors.categoryId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 ml-1">Hình ảnh sản phẩm</label>
          
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {/* Existing Images */}
              {existingImages.map((url, i) => (
                <div key={`old-${i}`} className="relative aspect-square group">
                  <img src={url} className="w-full h-full rounded-xl object-cover border bg-white" />
                  <button
                    type="button"
                    onClick={() => setExistingImages(prev => prev.filter(img => img !== url))}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}

              {/* New Files Preview */}
              {newFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative aspect-square group">
                  <img src={URL.createObjectURL(file)} className="w-full h-full rounded-xl object-cover border border-brand-red/30 bg-white" />
                  <div className="absolute top-1 left-1 bg-brand-red text-white text-[8px] px-1 rounded uppercase font-bold">New</div>
                  <button
                    type="button"
                    onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}

              {/* Upload Trigger Button */}
              {existingImages.length + newFiles.length < 10 && (
                <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-brand-red/20 bg-red-50/30 text-brand-red cursor-pointer hover:bg-red-50 transition-colors">
                  <Upload size={20} />
                  <span className="text-[10px] font-bold mt-1">Thêm</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                      }
                    }}
                  />
                </label>
              )}
            </div>
            
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <AlertCircle size={12} /> Tối đa 10 ảnh. Định dạng: JPG, PNG, WEBP.
            </p>
          </div>
        </div>

        {/* Description: Full width on all screens */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Mô tả chi tiết</label>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <ReactQuill
              theme="snow"
              value={watch("description")}
              onChange={(val) => setValue("description", val)}
              className="bg-white min-h-[200px]"
            />
          </div>
        </div>
      </div>

      {/* Settings & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t sticky bottom-0 bg-white mt-auto">
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              {...register("isActive")}
              type="checkbox"
              id="isActive"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
          </div>
          <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Hiển thị công khai</label>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onSuccess} 
            variant="ghost" 
            type="button" 
            className="flex-1 sm:flex-none border border-gray-200"
          >
            Hủy bỏ
          </Button>
          <Button 
            disabled={isPending || isUploading} 
            variant="primary" 
            className="flex-1 sm:flex-none bg-brand-red hover:bg-red-700 min-w-[140px] shadow-lg shadow-red-100"
            leftIcon={isPending ? undefined : Save}
          >
            {isPending ? "Đang xử lý..." : product ? "Cập nhật ngay" : "Tạo sản phẩm"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
