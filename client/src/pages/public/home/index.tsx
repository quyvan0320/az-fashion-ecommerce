import Button from "@/components/common/Button";
import { ROUTES } from "@/config/constants";
import { useCategories } from "@/services/queries/useCategories";
import { useFeaturedProducts } from "@/services/queries/useProducts";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const Home = () => {
  const { data: featuredRes, isLoading: featuredLoading } =
    useFeaturedProducts();
  const { data: categoriesRes } = useCategories({ limit: 8 });
  const navigate = useNavigate();
  const featuredProducts = featuredRes?.data || [];
  const categories = categoriesRes?.data || [];
  return (
    <div className="min-h-screen">
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">AZ Fashion</h1>
          <p className="text-gray-400 text-lg mb-8">
            Thời trang nam cao cấp — Phong cách, lịch lãm, hiện đại
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Mua sắm ngay <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Danh mục</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`${ROUTES.PRODUCTS}?categoryId=${cat.id}`}
                className="group bg-gray-50 rounded-xl p-5 hover:bg-black hover:text-white transition-colors"
              >
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-gray-500 group-hover:text-gray-300 mt-1">
                  {cat._count?.products || 0} sản phẩm
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* featured products */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
          <Link
            to={ROUTES.PRODUCTS}
            className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
          >
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-xl mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
