import { ROUTES } from "@/config/constants";
import { useProductBySlug } from "@/services/queries/useProducts";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProductGallery from "./ProductGallery";
import "react-quill/dist/quill.snow.css";
import Breadcrumb from "@/components/common/Breadcrumb";
import RelatedProducts from "./RelatedProducts";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";
import { Helmet } from "react-helmet-async";
const TABS = ["Mô tả sản phẩm", "Đánh Giá - Nhận Xét Từ Khách Hàng"];

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [activeTab, setActiveTab] = useState(0);

  const { data: productRes, isLoading } = useProductBySlug(slug || "");

  const product = productRes?.data;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-pulse">
          <div className="bg-gray-200 col-span-1 aspect-square rounded-md"></div>
          <div className="space-y-8 col-span-2">
            <div className="h-16 bg-gray-200 rounded " />
            <div className="h-16 bg-gray-200 rounded " />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded " />
            <div className="h-10 bg-gray-200 rounded " />
          </div>
        </div>
        <div className="bg-gray-100 w-full aspect-square rounded-md mt-20"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-400 mb-4">Không tìm thấy sản phẩm</p>
        <Link to={ROUTES.PRODUCTS} className="text-sm underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb
        key={product.id}
        displayName={product.category?.name || "Danh mục"}
        linkName={`${ROUTES.PRODUCTS}?categorySlug=${product.category?.slug}`}
        displayNameChild={product.name}
      />
      {/* product info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-12">
        {/* images */}
        <div className="col-span-1">
          <ProductGallery key={product.id} product={product} />
        </div>

        {/* info */}
        <ProductInfo product={product} />
      </div>

      <div id="product-tabs" className="mt-16 border-t">
        {/* Tab Headers */}
        <div className="flex gap-8 border-b overflow-x-auto no-scrollbar whitespace-nowrap">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                activeTab === index
                  ? "text-brand-red after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-red"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="py-8 ">
          {activeTab === 0 ? (
            <ProductDescription description={product.description} />
          ) : (
            <ProductReviews productId={product.id} />
          )}
        </div>
      </div>
      <RelatedProducts
        categorySlug={product.category?.slug || ""}
        currentProductId={product.id}
      />
    </div>
  );
};

export default ProductDetail;
