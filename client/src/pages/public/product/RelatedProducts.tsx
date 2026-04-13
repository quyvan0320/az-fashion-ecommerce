import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper/modules";
import { useProducts } from "@/services/queries/useProducts";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string;
}

const RelatedProducts = ({
  categorySlug,
  currentProductId,
}: RelatedProductsProps) => {
  const { data: productsRes, isLoading } = useProducts({
    categorySlug,
    limit: 11, 
  });

  const products: any = productsRes?.data?.products || [];

  const relatedProducts = products.filter(
    (p: any) => p.id !== currentProductId,
  );

  if (isLoading)
    return (
      <div className="h-40 flex items-center justify-center text-gray-400 italic">
        Đang tải sản phẩm liên quan...
      </div>
    );

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-20">
      <h2 className="text-xl font-bold uppercase mb-8 border-l-4 border-brand-red pl-4 text-brand-black">
        Sản phẩm liên quan
      </h2>

      <Swiper
        modules={[Navigation, SwiperPagination]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 3, spaceBetween: 15 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 20 },
        }}
        className="pb-12 related-swiper"
      >
        {relatedProducts.map((product: any) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedProducts;
