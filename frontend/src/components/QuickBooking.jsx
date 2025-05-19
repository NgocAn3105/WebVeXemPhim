import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cinemas = ["Galaxy Nguyễn Du", "Galaxy Quang Trung", "Galaxy Tân Bình"];
const movies = ["Địa Đạo", "Phụ Hồ", "Minecraft"];
const dates = ["09/04/2025", "10/04/2025", "11/04/2025"];
const times = ["10:00", "13:00", "18:30"];

// Giả định sơ bộ danh sách ghế còn trống
const availableSeats = [
  "A1", "A2", "A3", "B1", "B3", "C2", "C4", "D1", "D5", "E3", "F2"
];

export default function QuickBooking() {
  const [cinema, setCinema] = useState(cinemas[0]);
  const [movie, setMovie] = useState(movies[0]);
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState(times[0]);
  const navigate = useNavigate();

  const handleGacha = () => {
    const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
    const bookingData = {
      cinema,
      movie,
      date,
      time,
      seat: randomSeat,
    };
    navigate("/booking", { state: bookingData });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 items-end mt-10">
      <div>
        <label className="text-sm text-gray-600 block mb-1">Rạp</label>
        <select className="w-full border border-gray-300 rounded px-2 py-1" value={cinema} onChange={e => setCinema(e.target.value)}>
          {cinemas.map((c, idx) => <option key={idx}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Phim</label>
        <select className="w-full border border-gray-300 rounded px-2 py-1" value={movie} onChange={e => setMovie(e.target.value)}>
          {movies.map((m, idx) => <option key={idx}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Ngày</label>
        <select className="w-full border border-gray-300 rounded px-2 py-1" value={date} onChange={e => setDate(e.target.value)}>
          {dates.map((d, idx) => <option key={idx}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Suất</label>
        <select className="w-full border border-gray-300 rounded px-2 py-1" value={time} onChange={e => setTime(e.target.value)}>
          {times.map((t, idx) => <option key={idx}>{t}</option>)}
        </select>
      </div>
      <div>
        <button onClick={handleGacha} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded">
          🎲 Gacha Ghế
        </button>
      </div>
    </div>
  );
}
