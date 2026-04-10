import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSlide = () => {
  const img_slide_1 = "slide_1_img.jpg";
  const img_slide_2 = "slide_2_img.jpg";
  const img_slide_3 = "slide_3_img.jpg";
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      effect="fade"
      spaceBetween={0}
      slidesPerView={1} 
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      className="w-full h-[130px] md:h-[300px] lg:h-[500px] [--swiper-theme-color:#ff0000] 
      [--swiper-navigation-color:#ff0000] [--swiper-pagination-color:#ff0000]
      [&_.swiper-button-next]:hidden [&_.swiper-button-prev]:hidden
    md:[&_.swiper-button-next]:hidden md:[&_.swiper-button-prev]:hidden
    lg:[&_.swiper-button-next]:flex lg:[&_.swiper-button-prev]:flex"
    >
      <SwiperSlide>
        <div className="w-full h-full  ">
          <img src={img_slide_1} alt="banner" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="w-full h-full  ">
          <img src={img_slide_2} alt="banner" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="w-full h-full  ">
          <img src={img_slide_3} alt="banner" />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroSlide;
