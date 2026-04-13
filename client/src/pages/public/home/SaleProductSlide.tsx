import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowRight, ArrowLeft } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import SkeletonProduct from "@/components/common/SkeletonProduct";
import ProductCard from "../product/ProductCard";
import Button from "@/components/common/Button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/constants";

const SaleProductSlide = ({
  products,
  isLoading,
}: {
  products: any;
  isLoading: any;
}) => {
  return (
    <div className="bg-brand-soft">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2 lg:mb-6">
          <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight">
            SẢN PHẨM KHUYẾN MÃI
          </h2>

          <div className="flex gap-2">
            <button className="p-2  transition-all sale-prev-btn disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft size={24} />
            </button>
            <button className="p-2  transition-all sale-next-btn disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 md:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonProduct key={i} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            navigation={{
              nextEl: ".sale-next-btn",
              prevEl: ".sale-prev-btn",
            }}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 5 },
            }}
          >
            {products.map((product: any) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="flex items-center justify-center mt-6">
          <Link to={`${ROUTES.PRODUCTS}?isSale=true`}>
            <Button className="font-semibold text-brand-dark">
              Xem tất cả<strong>SẢN PHẨM KHUYẾN MÃI</strong>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SaleProductSlide;
