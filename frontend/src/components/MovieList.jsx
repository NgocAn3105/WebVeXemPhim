// src/components/MovieList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const movies = [
  {
    title: "Avengers: Endgame",
    description: "Biệt đội Avengers chiến đấu để cứu vũ trụ khỏi Thanos.",
    image: "https://image.tmdb.org/t/p/w500/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg",
  },
  {
    title: "Spider-Man: No Way Home",
    description: "Peter Parker đối mặt với đa vũ trụ đầy nguy hiểm.",
    image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    title: "The Batman",
    description: "Bruce Wayne chống lại tội phạm ở thành phố Gotham.",
    image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  },
];

const MovieList = () => {
  const navigate = useNavigate();

  const handleBuyTicket = (movie) => {
    navigate("/booking", { state: { movie } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {movies.map((movie) => (
        <div key={movie.title} className="border rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
          <img src={movie.image} alt={movie.title} className="w-full h-64 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{movie.description}</p>
            <button
              onClick={() => handleBuyTicket(movie)}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              Mua Vé
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
