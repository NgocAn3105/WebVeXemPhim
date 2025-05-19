// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";

import Home from "./pages/Home";
import Cinemas from "./pages/Cinemas";
import MoviesNow from "./pages/MoviesNow";
import MoviesSoon from "./pages/MoviesSoon";
import News from "./pages/News";

import BookingFlow from "./components/BookingFlow";
import Payment from "./components/Payment";
import Ticket from "./components/Ticket";





export default function App() {
  // State quản lý modal
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };
  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };
  const closeModals = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  return (
    <Router>
      {/* Header nhận props để mở modal */}
      <Header onLoginClick={openLogin} onRegisterClick={openRegister} />

      {/* 2 modal luôn nằm ngoài <Routes> để sẵn sàng bật lên */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeModals}
        onSwitch={openRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeModals}
        onSwitch={openLogin}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingFlow />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/cinemas" element={<Cinemas />} />
          <Route path="/movies/now" element={<MoviesNow />} />
          <Route path="/movies/soon" element={<MoviesSoon />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}
