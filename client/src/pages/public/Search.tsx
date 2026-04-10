import { useProducts } from "@/services/queries/useProducts";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./product/ProductCard";
import SkeletonProduct from "@/components/common/SkeletonProduct";
import { Pagination } from "@/components/common/Pagination";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };
  console.log("Search term:", search);
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ search: searchInput, page: "1" });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: res, isLoading } = useProducts(
    {
      page,
      limit: 10,
      search: search || undefined,
    },
    { enabled: search.trim().length > 0 },
  );

  const products = res?.data?.products || [];
  const pagination = res?.data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 pb-2 border-b-4 border-brand-dark">
          Tìm kiếm
        </h1>
        <p
          className={`${products.length > 0 ? "mt-2 mb-6" : ""} text-sm  text-brand-dark`}
        >
          {search && products.length > 0 && (
            <>
              Có <strong>{pagination?.total || 0} sản phẩm</strong> cho tìm kiếm
            </>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <input
            placeholder="Tìm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded bg-brand-grey focus:outline-none px-4 py-4  text-sm"
          />
        </div>
      </div>

      {!search.trim() ? (
        <div className="text-center py-10 ">
          <div className="bg-brand-grey w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="opacity-50" />
          </div>
          <p className="text-xl font-bold text-brand-dark">
            Bắt đầu tìm kiếm sản phẩm bạn yêu thích
          </p>
          <p className="text-sm font-normal text-brand-dark">
            Nhập tên sản phẩm vào ô tìm kiếm phía trên nhé!
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 ">
          <p className="text-xl font-bold text-brand-dark">
            Không tìm thấy nội dung bạn yêu cầu
          </p>
          <p className="text-sm font-normal text-brand-dark">
            Không tìm thấy "<strong>{search}</strong>. Vui lòng kiểm tra chính
            tả, sử dụng các từ tổng quát hơn và thử lại!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        pagination={pagination}
        handleParams={updateParams}
        page={page}
      />
    </div>
  );
};

export default Search;
