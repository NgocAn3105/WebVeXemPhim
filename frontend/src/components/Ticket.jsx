// src/components/Ticket.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, selectedSeats, totalPrice, area, cinema, movie, time } = location.state || {};

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Vé của bạn</h2>
      <p><strong>Khách hàng:</strong> {name}</p>
      <p><strong>Khu vực:</strong> {area}</p>
      <p><strong>Rạp:</strong> {cinema}</p>
      <p><strong>Phim:</strong> {movie?.title}</p>
      <p><strong>Suất chiếu:</strong> {time}</p>
      <p><strong>Ghế:</strong> {selectedSeats.join(", ")}</p>
      <p className="text-lg mt-4"><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()}₫</p>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Ticket;
