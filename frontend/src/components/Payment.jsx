// src/components/Payment.jsx
import React from "react";
import { useLocation } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const { area, cinema, time, selectedSeats } = location.state || {};

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Thông tin đặt vé</h1>
      <p><strong>Khu vực:</strong> {area}</p>
      <p><strong>Rạp:</strong> {cinema}</p>
      <p><strong>Thời gian:</strong> {time}</p>
      <p><strong>Ghế đã chọn:</strong> {selectedSeats.join(", ")}</p>
      <div className="mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Thanh toán
        </button>
      </div>
    </div>
  );
}