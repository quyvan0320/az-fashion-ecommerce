import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/services/queries/useCategories";
import { Category } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { name: category.name, description: category.description || "" }
      : {},
  });

  const onSubmit = (data: CategoryFormData) => {
    if (category) {
      updateCategory({ id: category.id, data }, { onSuccess });
    } else {
      createCategory(data, { onSuccess });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* name */}
      <Input
        {...register("name")}
        label="Tên danh mục"
        placeholder="Áo sơ mi..."
        error={errors.name?.message}
      />

      {/* description */}
      <Input
        {...register("description")}
        label="Mô tả"
        placeholder="mô tả ngắn..."
        error={errors.description?.message}
      />

      <div className="flex gap-3">
        <Button
          disabled={isPending}
          isLoading={isSubmitting}
          variant="secondary"
        >
          {isPending ? "Đang lưu" : category ? "Cập nhật" : "Tạo danh mục"}
        </Button>
        <Button onClick={onSuccess} variant="danger">
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
