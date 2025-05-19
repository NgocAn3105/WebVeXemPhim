// src/components/Showtimes.jsx
import React, { useState } from "react";

const Showtimes = ({ showtimes, onSelect }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  if (!showtimes || showtimes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Hiện chưa có suất chiếu cho phim này.
      </div>
    );
  }

  const handleSelect = (time) => {
    setSelectedTime(time);
    onSelect(time);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Chọn Suất Chiếu
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {showtimes.map((time, index) => (
          <button
            key={index}
            onClick={() => handleSelect(time)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium
              ${
                selectedTime === time
                  ? "bg-orange-500 text-white border-orange-600 shadow-md scale-105"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-orange-100 hover:border-orange-400"
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Showtimes;
