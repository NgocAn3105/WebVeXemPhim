// src/pages/MoviesNow.jsx
import React, { useEffect, useState } from "react";

const MoviesNow = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Tạm thời hardcode danh sách phim, bạn có thể thay bằng API sau
    setMovies([
      {
        id: 1,
        title: "GODZILLA X KONG: ĐẾ CHẾ MỚI",
        poster: "/public/img/gxk.jpg",
        description: "Cuộc chiến huyền thoại giữa hai biểu tượng điện ảnh tiếp tục!"
      },
      {
        id: 2,
        title: "ĐẤT RỪNG PHƯƠNG NAM",
        poster: "/public/img/dat-rung.jpg",
        description: "Một hành trình đầy xúc cảm qua rừng già Nam Bộ."
      },
      {
        id: 3,
        title: "DORAEMON: NOBITA VÀ THẾ GIỚI KHÔNG TRỌNG LỰC",
        poster: "/public/img/doraemon.jpg",
        description: "Câu chuyện mới với hành trình ngoài không gian!"
      }
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Phim Đang Chiếu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="rounded overflow-hidden shadow hover:shadow-xl transition">
            <img src={movie.poster} alt={movie.title} className="w-full h-80 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-600">{movie.description}</p>
              <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                Mua Vé
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesNow;
