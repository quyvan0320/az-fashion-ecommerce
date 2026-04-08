import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useCategories } from "@/services/queries/useCategories";
import { useProducts } from "@/services/queries/useProducts";
import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../home/ProductCard";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Mới nhất" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
  { value: "averageRating_desc", label: "Đánh giá cao nhất" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  // read params from url

const page = Number(searchParams.get("page") || 1);
const search = searchParams.get("search") || "";
const categorySlug = searchParams.get("categorySlug") || "";
const sortParam = searchParams.get("sort") || "createdAt_desc";


const [sortBy, order] = sortParam.split("_") as [string, "asc" | "desc"];

  // Search input local state để debounce
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ search: searchInput, page: "1" });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: res, isLoading } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    categorySlug: categorySlug || undefined,
    sortBy,
    order,
    // isActive: true,
  });

  const { data: categoriesRes } = useCategories({ limit: 50 });

  const products = res?.data?.products || [];
  const pagination = res?.data;
  const categories = categoriesRes?.data || [];
  console.log(products)
  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Sản phẩm</h1>

      {/* ===== TOOLBAR ===== */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Tìm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm"
          />
        </div>

        {/* Sort */}
        <select
          value={sortParam}
          onChange={(e) => updateParams({ sort: e.target.value, page: "1" })}
          className="border rounded-lg px-3 py-2.5 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm ${showFilter ? "bg-black text-white" : "hover:bg-gray-50"}`}
        >
          <SlidersHorizontal size={15} />
          Lọc {categorySlug && "•"}
        </button>
      </div>

      {/* ===== FILTER PANEL ===== */}
      {showFilter && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium mb-3">Danh mục</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => updateParams({ categorySlug: "", page: "1" })}
              className={`px-3 py-1.5 rounded-lg text-sm border ${!categorySlug ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"}`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParams({ categorySlug: cat.slug, page: "1" })}
                className={`px-3 py-1.5 rounded-lg text-sm border ${categorySlug === cat.slug ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"}`}
              >
                {cat.name} ({cat._count?.products || 0})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== RESULTS ===== */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {pagination?.total || 0} sản phẩm
          {search && (
            <span>
              {" "}
              cho "<strong>{search}</strong>"
            </span>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}


      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Trước
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === pagination.totalPages ||
                Math.abs(p - page) <= 1,
            )
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => updateParams({ page: String(p) })}
                  className={`w-9 h-9 rounded-lg text-sm border ${page === p ? "bg-black text-white border-black" : "hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ),
            )}

          <button
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
