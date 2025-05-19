// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Import hình ảnh từ src/assets/
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

const slides = [slide1, slide2, slide3];

const tabs = [
  { key: "now", label: "Đang chiếu" },
  { key: "soon", label: "Sắp chiếu" },
  { key: "imax", label: "Phim IMAX" },
  { key: "nation", label: "Toàn quốc" },
];

const promotions = [
  {
    image: "https://www.galaxycine.vn/media/2025/4/18/1135_1744965700799.jpg",
    title: "Ưu đãi Galaxy Cinema",
    description: "Ưu đãi hấp dẫn cho thành viên! Xem phim rẻ hơn, nhận quà mỗi tuần.",
  },
  {
    image: "https://www.galaxycine.vn/media/2025/4/18/1135_1744960764165.jpg",
    title: "Mega Ưu Đãi Galaxy Cine+",
    description: "Chỉ 69K, có ngay vé xem phim kèm nước + bắp tại rạp toàn quốc.",
  },
  {
    image: "https://www.galaxycine.vn/media/2025/3/31/1135_1743392552365.jpg",
    title: "Khuyến mãi cuối tuần",
    description: "Thứ 6, Thứ 7, Chủ nhật, giảm 20% giá vé cho mọi suất chiếu!",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const promotionRef = useRef();
  const [current, setCurrent] = useState(0);
  const [activeTab, setActiveTab] = useState("now");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách phim từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.post("http://localhost:5000/Admin/list-movies", {
          limit: 8,
        });

        if (response.data?.movies?.status === 200) {
          const movieList = response.data.movies.message.map((movie) => ({
            id: movie.movie_id,
            title: movie.movie_name,
            poster: movie.movie_poster || "/img/default-movie.jpg",
            description: movie.movie_description,
            category: movie.category || "now",
          }));
          setMovies(movieList);
        } else {
          setError("Không thể tải danh sách phim");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Tự động chuyển slide cho Carousel
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [current]);

  // Tự động cuộn khuyến mãi
  useEffect(() => {
    const container = promotionRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const interval = setInterval(() => {
      scrollAmount += 300;
      if (scrollAmount >= container.scrollWidth - container.clientWidth) {
        scrollAmount = 0;
      }
      container.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Lọc phim theo tab
  const filtered = movies.filter((m) => m.category === activeTab);

  // Xử lý đặt vé nhanh
  const handleQuickBooking = (movieTitle, movieId) => {
    navigate("/booking", {
      state: {
        movieId,
        movie: movieTitle,
        cinema: "Galaxy Nguyễn Du",
        date: new Date().toLocaleDateString("en-GB").split("/").reverse().join("/"),
        time: "10:00",
      },
    });
  };

  // Trạng thái tải và lỗi
  if (loading) {
    return <div className="text-center py-10">Đang tải phim...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="space-y-10 px-4">
      {/* Carousel */}
      <div className="relative w-full overflow-hidden rounded-xl shadow aspect-[16/9] min-h-[250px]">
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((src, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full h-full bg-gray-100"
            >
              <img
                src={src}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-gray-400"}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-6 border-b pb-2">
        <span className="font-semibold">PHIM</span>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-1 text-sm ${
              activeTab === tab.key ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200"
          >
            <div className="relative bg-gray-100">
              <img
                src={m.poster}
                alt={m.title}
                className="w-full h-auto object-contain"
                style={{ maxHeight: "300px" }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/img/default-movie.jpg";
                }}
              />
            </div>
            <div className="p-3 flex flex-col justify-between gap-2">
              <h3 className="text-sm font-semibold truncate">{m.title}</h3>
              <button
                onClick={() => handleQuickBooking(m.title, m.id)}
                className="bg-orange-500 text-white text-sm py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Mua vé ngay
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Xem thêm */}
      <div className="text-center">
        <Link
          to={`/movies/${activeTab}`}
          className="inline-block px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition"
        >
          Xem thêm
        </Link>
      </div>

      {/* Promotions */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-orange-500">Tin Khuyến Mãi</h2>
        <div
          ref={promotionRef}
          className="overflow-x-auto whitespace-nowrap scroll-smooth px-1 space-x-4 flex no-scrollbar"
        >
          {promotions.map((promo, index) => (
            <div
              key={index}
              className="inline-block bg-white rounded-xl shadow-lg w-80 flex-shrink-0"
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="rounded-t-xl w-full h-44 object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/img/default-promo.jpg";
                }}
              />
              <div className="p-4">
                <h3 className="text-base font-semibold text-orange-500 truncate">{promo.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Đặt Vé Nhanh */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-orange-500 mb-4 text-center">Đặt Vé Nhanh</h2>
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto flex justify-center gap-4">
          <button
            onClick={() => handleQuickBooking(movies[0]?.title, movies[0]?.id)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded"
            disabled={!movies[0]}
          >
            Đặt Vé
          </button>
        </div>
      </div>
    </div>
  );
}