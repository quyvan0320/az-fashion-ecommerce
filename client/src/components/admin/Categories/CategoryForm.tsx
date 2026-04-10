import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { uploadService } from "@/services/api/upload";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/services/queries/useCategories";

import { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ảnh danh mục
        </label>

        {/* Dùng key dựa trên link ảnh để ép React render lại hoàn toàn khi xóa/đổi */}
        <div
          className="flex items-center gap-4"
          key={previewUrl || existingImage || "empty"}
        >
          {existingImage || previewUrl ? (
            <div className="relative w-32 h-32 border rounded-lg overflow-hidden group">
              <img
                // Thêm timestamp ?t= để trình duyệt không lấy ảnh cũ từ cache
                src={`${previewUrl || existingImage}${previewUrl ? "" : `?t=${Date.now()}`}`}
                alt="category"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <ImagePlus className="text-gray-400" size={28} />
              <span className="text-xs text-gray-500 mt-2">Chọn ảnh</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
                value="" // Luôn để trống để không giữ vết file cũ
              />
            </label>
          )}
        </div>
      </div>

      {/* Phần Input Name và Description giữ nguyên */}
      <Input
        {...register("name")}
        label="Tên danh mục"
        error={errors.name?.message}
      />
      <Input
        {...register("description")}
        label="Mô tả"
        error={errors.description?.message}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          variant="secondary"
        >
          {category ? "Cập nhật" : "Tạo danh mục"}
        </Button>
        <Button type="button" onClick={onSuccess} variant="danger">
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
