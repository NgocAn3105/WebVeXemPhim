import React from "react";

const SeatSelection = ({ selectedSeats, setSelectedSeats, onNext }) => {
  const totalSeats = 40;

  const handleSeatToggle = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Chọn ghế</h2>
      <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
        {Array.from({ length: totalSeats }, (_, i) => (
          <button
            key={i}
            className={`p-2 border rounded w-10 h-10 text-sm font-medium transition
              ${selectedSeats.includes(i) ? "bg-green-500 text-white" : "hover:bg-gray-200"}`}
            onClick={() => handleSeatToggle(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          onClick={onNext}
          disabled={selectedSeats.length === 0}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition disabled:opacity-50"
        >
          Tiếp tục thanh toán
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
