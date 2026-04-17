import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { uploadService } from "@/services/api/upload";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/services/queries/useCategories";

import { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ImagePlus, Save, X } from "lucide-react"; // Thêm AlertCircle, Save
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
}

const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được trống"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const [existingImage, setExistingImage] = useState(category?.image);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isPending = isCreating || isUpdating || isUploading;

  const getPublicIdFromUrl = (url: string) => {
    try {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1];
      return fileName.split(".")[0];
    } catch (error) {
      return null;
    }
  };

  const removeImage = async () => {
    if (existingImage && !previewUrl) {
      const pId = getPublicIdFromUrl(existingImage);
      if (pId) {
        try {
          setIsUploading(true);
          await uploadService.deleteImage(pId);
          toast.success("Đã xóa ảnh trên server");
        } catch (error) {
          console.error("Lỗi xóa ảnh:", error);
        } finally {
          setIsUploading(false);
        }
      }
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setNewFile(null);
    setPreviewUrl(null);
    setExistingImage(undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setNewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExistingImage(undefined);
    }

    e.target.value = "";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { name: category.name, description: category.description || "" }
      : { name: "", description: "" },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsUploading(true);
      let imageUrl = existingImage;

      if (newFile) {
        const res = await uploadService.uploadSingle(newFile);
        imageUrl = res.data.url;
      }

      const payload = {
        ...data,
        image: imageUrl || null,
      };

      if (category) {
        updateCategory({ id: category.id, data: payload }, { onSuccess });
      } else {
        createCategory(payload, { onSuccess });
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto px-1"
    >
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 ml-1">
            Ảnh đại diện danh mục
          </label>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50">
            <div
              className="flex items-center gap-4"
              key={previewUrl || existingImage || "empty"}
            >
              {existingImage || previewUrl ? (
                <div className="relative w-32 h-32 border rounded-xl overflow-hidden group shadow-sm bg-brand-litext-brand-light">
                  <img
                    src={`${previewUrl || existingImage}${
                      previewUrl ? "" : `?t=${Date.now()}`
                    }`}
                    alt="category"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-brand-litext-brand-light text-red-500 rounded-full p-1.5 shadow-md hover:bg-red-50 transition-colors z-10"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                  {previewUrl && (
                    <div className="absolute top-1 left-1 bg-brand-red text-brand-light text-[8px] px-1.5 py-0.5 rounded uppercase font-bold">
                      New
                    </div>
                  )}
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-brand-red/20 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-red-50/30 text-brand-red hover:bg-red-50 transition-all group">
                  <ImagePlus
                    className="text-brand-red/60 group-hover:scale-110 transition-transform"
                    size={28}
                  />
                  <span className="text-[10px] font-bold mt-2">Chọn ảnh</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                    value=""
                  />
                </label>
              )}

              <div className="flex-1">
                <p className="text-[11px] text-gray-400 flex items-start gap-1 leading-relaxed">
                  <AlertCircle size={12} className="mt-0.5 shrink-0" />
                  Ảnh sẽ hiển thị ở trang chủ và danh sách lọc. Định dạng: JPG,
                  PNG, WEBP.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            {...register("name")}
            label="Tên danh mục"
            placeholder="Áo khoác"
            error={errors.name?.message}
            className="focus:ring-brand-red"
          />
          <Input
            {...register("description")}
            label="Mô tả danh mục"
            placeholder="Nhập mô tả ngắn cho danh mục này..."
            error={errors.description?.message}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 py-4 border-t sticky bottom-0 bg-brand-litext-brand-light mt-auto">
        <Button
          onClick={onSuccess}
          variant="primary"
          size="md"
          type="button"
          className="flex-1 sm:flex-none "
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          variant="primary"
          className="rounded-2xl border-none bg-brand-red text-brand-light font-bold"
        >
          {isPending
            ? "Đang xử lý..."
            : category
              ? "Cập nhật danh mục"
              : "Tạo danh mục ngay"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
