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
import {
  LayoutGrid,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"; // Thêm LayoutGrid
import { useState } from "react";
import { Helmet } from "react-helmet-async";

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

  return (
    <>
      <div className="space-y-6 pb-10">
         <Helmet>
                              <title>Az Fashion - Quản lý danh mục</title>
                            </Helmet>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
              <LayoutGrid className="text-brand-red" />
              Danh mục
              <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {categories.length}
              </span>
            </h1>
          </div>
          <Button
            onClick={() => setSelectedCategory(null)}
            noHover
            className="border-none rounded-2xl text-brand-light bg-brand-red"
            leftIcon={Plus}
          >
            Thêm danh mục
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Tổng danh mục",
                value: stats.totalCategories,
                color: "text-gray-900",
              },
              {
                label: "Có sản phẩm",
                value: stats.categoriesWithProducts,
                color: "text-green-600",
              },
              {
                label: "Trống",
                value: stats.emptyCategories,
                color: "text-orange-500",
              },
              {
                label: "Top 1",
                value: stats.topCategories?.[0]?.name || "N/A",
                color: "text-black",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-brand-light rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {s.label}
                </p>
                <p className={`text-xl font-black mt-1 truncate ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex  gap-2 bg-brtext-brand-light rounded-2xl p-2  border shadow-sm items-cente">
          <div className="relative flex-1">
            <Input
              leftIcon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm danh mục theo tên ..."
            />
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="py-20">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-brand-light rounded-2xl border border-dashed">
                <LayoutGrid size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium">
                  Chưa có danh mục nào
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-brand-light rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-black/10 transition-all group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-gray-900 truncate group-hover:text-black">
                          {category.name}
                        </h3>
                        <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                          /{category.slug}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => setSelectedCategory(category)}
                          size="sm"
                          variant="primary"
                          className="h-8 w-8 p-0 rounded-lg border border-brand-dark hover:bg-gray-100 text-brand-dark"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(category.id)}
                          size="sm"
                          variant="primary"
                          className="h-8 w-8 p-0 rounded-lg border border-brand-dark hover:bg-gray-100 text-brand-dark"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1 italic">
                      {category.description ||
                        "Không có mô tả cho danh mục này"}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
                        <Package size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">
                          {category._count?.products || 0} sản phẩm
                        </span>
                      </div>
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
              : "Cập nhật danh mục"
          }
          isOpen={true}
          onClose={() => setSelectedCategory(undefined)}
        >
          <CategoryForm
            category={selectedCategory}
            onSuccess={() => setSelectedCategory(undefined)}
          />
        </Modal>
      )}
    </>
  );
};

export default Categories;
