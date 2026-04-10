import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import SkeletonProduct from "@/components/common/SkeletonProduct";

const CategorySlide = ({
  categories,
  isLoading,
}: {
  categories: any;
  isLoading: any;
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2 md:mb-6">
        <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight">
          Danh mục sản phẩm
        </h2>

        <div className="flex gap-2">
          <button className="p-2  transition-all prev-btn disabled:opacity-30 disabled:cursor-not-allowed">
            <ArrowLeft size={24} />
          </button>
          <button className="p-2  transition-all next-btn disabled:opacity-30 disabled:cursor-not-allowed">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {categories.map((cat: any) => (
            <SwiperSlide key={cat.id}>
              <div className="group relative overflow-hidden rounded-sm cursor-pointer">
                <img
                  src={cat.image}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute bottom-0 left-0 right-0 z-10 p-4  bg-brand-light/40 flex items-center justify-between ">
                  <span className="font-medium text-lg z-50 text-brand-black">
                    {cat.name}
                  </span>
                  <div className="w-10 h-10 duration-100  rounded-full z-50 bg-brand-light hover:bg-brand-black hover:text-brand-light transition-all  flex items-center justify-center">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CategorySlide;
