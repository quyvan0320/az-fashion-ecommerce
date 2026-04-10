import SkeletonProduct from "@/components/common/SkeletonProduct";
import { useProducts } from "@/services/queries/useProducts";
import { useState } from "react";
import ProductCard from "../product/ProductCard";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button";

const TABS = [
  { name: "Áo polo", slug: "ao-polo" },
  { name: "Quần jeans", slug: "quan-jeans" },
  { name: "Áo sơ mi", slug: "ao-so-mi" },
  { name: "Áo khoác", slug: "ao-khoac" },
  { name: "Quần âu", slug: "quan-au" },
];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].slug);

  const { data: res, isLoading } = useProducts({
    categorySlug: activeTab,
    limit: 10,
  });
  const products = res?.data?.products || [];
  console.log(products);
  const currentTabName = TABS.find((tab) => tab.slug === activeTab)?.name;
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Tab Headers */}
      <div className="flex lg:justify-center gap-4 md:gap-8 mb-10 border-b border-gray-100 overflow-x-auto no-scrollbar whitespace-nowrap px-4 -mx-6">
        {TABS.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            className={`pb-4 text-lg md:text-2xl font-medium transition-all relative inline-block ${
              activeTab === tab.slug
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <div className="flex items-center justify-center mt-10">
        <Link to={`/products?categorySlug=${activeTab}`}>
          <Button className="font-semibold text-brand-dark">
            Xem tất cả <strong>{currentTabName}</strong>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductTabs;
