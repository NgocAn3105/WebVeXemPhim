// src/components/HeroCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const slides = [
  {
    title: "Avengers: Endgame",
    image: "https://i.imgur.com/MK3eW3As.jpg", // thay bằng poster thật nếu có
    description: "Trận chiến cuối cùng của các siêu anh hùng.",
  },
  {
    title: "Spiderman: No Way Home",
    image: "https://i.imgur.com/wvxPV9S.jpeg",
    description: "Cuộc hội ngộ 3 Người Nhện!",
  },
  {
    title: "The Batman",
    image: "https://i.imgur.com/DL5sR3q.jpeg",
    description: "Hiệp sĩ bóng đêm trở lại.",
  },
];

const HeroCarousel = () => (
  <Swiper loop autoplay={{ delay: 3000 }}>
    {slides.map((slide, index) => (
      <SwiperSlide key={index}>
        <div
          className="h-[400px] bg-cover bg-center flex items-end"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="bg-black bg-opacity-50 text-white p-6 w-full">
            <h2 className="text-2xl font-bold">{slide.title}</h2>
            <p className="text-sm">{slide.description}</p>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default HeroCarousel;
