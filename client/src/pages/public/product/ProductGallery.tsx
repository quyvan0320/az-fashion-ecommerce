import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, EffectFade } from "swiper/modules";

// Import CSS bắt buộc của Swiper
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  product: {
    images: string[];
    name?: string;
  };
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full flex flex-col gap-4 max-w-2xl mx-auto">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-brand-light group shadow-sm">
        <Swiper
          spaceBetween={0}
          effect={"fade"}
          fadeEffect={{ crossFade: true }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs, EffectFade]}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full"
        >
          {product.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-full w-full items-center justify-center p-4">
                <img
                  src={img}
                  alt={product.name || `Product ${index}`}
                  className="max-h-full max-w-full object-contain select-none"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="relative px-10 w-full group/nav">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          navigation={{
            nextEl: ".btn-next-gallery",
            prevEl: ".btn-prev-gallery",
          }}
          className="h-24 w-full cursor-pointer py-1"
        >
          {product.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className={`h-full w-full overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  activeIndex === index
                    ? "border-brand-red scale-95 shadow-md"
                    : "border-gray-100 opacity-50 hover:opacity-100 hover:border-gray-300"
                }`}
              >
                <img src={img} className="h-full w-full object-cover" alt="" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="btn-prev-gallery absolute left-0 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-lg hover:bg-black hover:text-white transition-all disabled:opacity-0">
          <ChevronLeft size={24} />
        </button>

        <button className="btn-next-gallery absolute right-0 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-lg hover:bg-black hover:text-white transition-all disabled:opacity-0">
          <ChevronRight size={24} />
        </button>
      </div>

      <style>{`
        .swiper-button-lock { display: none !important; }
        .swiper-button-next, .swiper-button-prev { display: none !important; }
      `}</style>
    </div>
  );
};

export default ProductGallery;
