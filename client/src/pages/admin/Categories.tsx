import CategoryForm from "@/components/admin/Categories/CategoryForm";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Spinner from "@/components/common/Spinner";
import {
  useCategories,
  useCategoryStats,
  useDeleteCategory,
} from "@/services/queries/useCategories";
import { Category } from "@/types/category";
import { Package, Pencil, Plus, Search, Trash, Trash2 } from "lucide-react";
import { useState } from "react";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    Category | null | undefined
  >(undefined);

  const { data: res, isLoading } = useCategories({
    search: search || undefined,
    limit: 50,
  });
  const { data: statsRes } = useCategoryStats();
  const { mutate: deleteCategory } = useDeleteCategory();

  const categories = res?.data || [];
  const stats = statsRes?.data;

  const handleDelete = (id: string) => {
    if (
      window.confirm("Xóa danh mục này các sản phẩm liên quan sẽ bị ảnh hưởng")
    ) {
      deleteCategory(id);
    }
  };
  console.log(categories)
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Danh mục ({categories.length})
          </h1>
          <Button
            onClick={() => setSelectedCategory(null)}
            variant="primary"
            leftIcon={Plus}
          >
            Thêm danh mục
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Tổng danh mục", value: stats.totalCategories },
              { label: "Có sản phẩm", value: stats.categoriesWithProducts },
              { label: "Trống", value: stats.emptyCategories },
              { label: "Top 1", value: stats.topCategories?.[0]?.name || "" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl p-4 shadow-sm border"
              >
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold mt-1 ">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex-1">
          <Input
            leftIcon={Search}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Tìm danh mục..."
          />
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Chưa có danh mục nào
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className=" font-semibold truncate">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {category.description || "không có mô tả"}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Package size={12} />
                        <span>{category._count?.products || 0} sản phẩm</span>
                      </div>
                      <p className="text-xs mt-1 text-gray-400">
                        /{category.slug}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-1 shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {selectedCategory !== undefined && (
        <Modal
          title={
            selectedCategory === null
              ? "Thêm danh mục mới"
              : "Câp nhật danh mục"
          }
          isOpen={true}
          onClose={() => setSelectedCategory(undefined)}
        >
          <CategoryForm category={selectedCategory} onSuccess={() => setSelectedCategory(undefined)} />
        </Modal>
      )}
    </>
  );
};

export default Categories;
