import { useCategories } from "@/services/queries/useCategories";
import { useProducts } from "@/services/queries/useProducts";
import { Plus, Minus, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Pagination } from "@/components/common/Pagination";
import SkeletonProduct from "@/components/common/SkeletonProduct";
import { Helmet } from "react-helmet-async";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Mới nhất" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
  { value: "createdAt_asc", label: "Cũ Nhất" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const COLOR_OPTIONS = [
  { name: "Đỏ", hex: "#FF0000" },
  { name: "Xanh", hex: "#0000FF" },
  { name: "Vàng", hex: "#FFFF00" },
  { name: "Đen", hex: "#000000" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Hồng", hex: "#FFC0CB" },
  { name: "Xám", hex: "#808080" },
  { name: "Nâu", hex: "#733414" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openFilters, setOpenFilters] = useState({
    categories: true,
    price: true,
    size: true,
    color: true,
  });

  // URL Params
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const categorySlug = searchParams.get("categorySlug") || "";
  const sizeParam = searchParams.get("size") || "";
  const colorParam = searchParams.get("color") || "";
  const sortParam = searchParams.get("sort") || "createdAt_desc";
  const [sortBy, order] = sortParam.split("_") as [string, "asc" | "desc"];
  const isSaleParam = searchParams.get("isSale") === "true";
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;

  const { data: res, isLoading } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    categorySlug: categorySlug || undefined,
    size: sizeParam || undefined,
    color: colorParam || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    isActive: true,
    isSale: isSaleParam || undefined,
    sortBy,
    order,
  });

  const { data: categoriesRes } = useCategories({ limit: 50 });
  const products = res?.data?.products || [];
  const pagination = res?.data;
  const categories = categoriesRes?.data || [];

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") newParams.delete(key);
      else newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  const toggleFilter = (key: keyof typeof openFilters) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePriceChange = (value: number) => {
    if (value >= 3000000) {
      updateParams({ maxPrice: null });
    } else {
      updateParams({ maxPrice: value.toString(), page: "1" });
    }
  };

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  const displayName = isSaleParam
    ? "Sản phẩm khuyến mãi"
    : currentCategory
      ? currentCategory.name
      : "Sản phẩm";

  return (
    <div className="max-w-7xl mx-auto px-4  py-6">
      <Helmet>
        <title>Az Fashion - {displayName}</title>
      </Helmet>
      <Breadcrumb displayName={displayName} />

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 flex-shrink-0">
          {(categorySlug ||
            sizeParam ||
            colorParam ||
            isSaleParam ||
            searchParams.get("maxPrice")) && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider ">
                Bạn đang xem
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {categorySlug && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-xs rounded-full">
                    Danh mục:{" "}
                    {categories.find((c) => c.slug === categorySlug)?.name}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => updateParams({ categorySlug: null })}
                    />
                  </span>
                )}
                {sizeParam && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-xs rounded-full">
                    Size: {sizeParam}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => updateParams({ size: null })}
                    />
                  </span>
                )}
                {isSaleParam && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                    Đang giảm giá
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => updateParams({ isSale: null })}
                    />
                  </span>
                )}
                {colorParam && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-xs rounded-full uppercase">
                    Màu: {colorParam}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => updateParams({ color: null })}
                    />
                  </span>
                )}
                {searchParams.get("maxPrice") && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-xs rounded-full">
                    Dưới {Number(searchParams.get("maxPrice")).toLocaleString()}
                    đ
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => updateParams({ maxPrice: null })}
                    />
                  </span>
                )}
              </div>
              <button
                onClick={() => setSearchParams({})}
                className="text-xs text-red-500 underline underline-offset-4"
              >
                Xóa hết
              </button>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 uppercase">Bộ lọc</h2>

          <div className="border-t py-4">
            <button
              onClick={() => toggleFilter("categories")}
              className="flex justify-between items-center w-full font-bold text-sm uppercase mb-4"
            >
              Danh mục sản phẩm
              {openFilters.categories ? (
                <Minus size={16} />
              ) : (
                <Plus size={16} />
              )}
            </button>
            {openFilters.categories && (
              <div className="space-y-3 pl-1">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={categorySlug === cat.slug}
                      onChange={() =>
                        updateParams({ categorySlug: cat.slug, page: "1" })
                      }
                      className="w-4 h-4 accent-black"
                    />
                    <span
                      className={`text-sm ${categorySlug === cat.slug ? "font-bold" : "text-gray-600 group-hover:text-black"}`}
                    >
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border-t py-4">
            <button
              onClick={() => toggleFilter("price")}
              className="flex justify-between items-center w-full font-bold text-sm uppercase mb-4"
            >
              Khoảng giá
              {openFilters.price ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            {openFilters.price && (
              <div className="px-2">
                <input
                  type="range"
                  className="w-full accent-black mb-2"
                  min="0"
                  max="3000000"
                  step="100000"
                  value={searchParams.get("maxPrice") || "3000000"}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                  <span>0đ</span>
                  <span className="text-black">
                    Dưới{" "}
                    {Number(
                      searchParams.get("maxPrice") || 3000000,
                    ).toLocaleString()}
                    đ
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t py-4">
            <button
              onClick={() => toggleFilter("color")}
              className="flex justify-between items-center w-full font-bold text-sm uppercase mb-4"
            >
              Màu sắc
              {openFilters.color ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            {openFilters.color && (
              <div className="flex flex-wrap gap-3 px-1">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() =>
                      updateParams({
                        color: color.name === colorParam ? null : color.name,
                        page: "1",
                      })
                    }
                    className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                      colorParam === color.name
                        ? "border-black scale-110 ring-2 ring-offset-1 ring-gray-300"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {colorParam === color.name && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          color.name === "Trắng" || color.name === "Vàng"
                            ? "bg-black"
                            : "bg-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t py-4">
            <button
              onClick={() => toggleFilter("size")}
              className="flex justify-between items-center w-full font-bold text-sm uppercase mb-4"
            >
              Size
              {openFilters.size ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            {openFilters.size && (
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      updateParams({ size: s === sizeParam ? null : s })
                    }
                    className={`h-10 border text-xs flex items-center justify-center hover:border-black transition-all
                      ${sizeParam === s ? "bg-black text-white border-black" : "text-gray-600"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold uppercase">{displayName}</h1>
              <span className="text-gray-400 text-sm">
                {pagination?.total || 0} sản phẩm
              </span>
            </div>

            <div className="flex items-center gap-3 self-end">
              <span className="text-sm text-gray-500">Sắp xếp theo</span>
              <select
                value={sortParam}
                onChange={(e) =>
                  updateParams({ sort: e.target.value, page: "1" })
                }
                className="border rounded-none px-4 py-2 text-sm font-medium focus:ring-0 outline-none min-w-[200px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonProduct key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400 border rounded-xl">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p>Không tìm thấy sản phẩm nào khớp với bộ lọc</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            pagination={pagination}
            handleParams={updateParams}
            page={page}
          />
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
