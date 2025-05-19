// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Đường dẫn đến file logo

export default function Header({ onLoginClick, onRegisterClick }) {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/">
          <img 
            src={logo} 
            alt="Galaxy Logo" 
            className="h-10" 
          />
        </Link>
        <span className="text-sm text-gray-600">{new Date().getFullYear()}</span>
      </div>

      <nav className="space-x-6">
        <Link to="/movies/now" className="hover:text-orange-500">Phim Đang Chiếu</Link>
        <Link to="/movies/soon" className="hover:text-orange-500">Phim Sắp Chiếu</Link>
        <Link to="/cinemas" className="hover:text-orange-500">Rạp</Link>
        <Link to="/news" className="hover:text-orange-500">Tin Tức</Link>
      </nav>

      <div className="space-x-4">
        <button
          onClick={onLoginClick}
          className="text-sm hover:text-orange-500"
        >
          Đăng Nhập
        </button>
        <button
          onClick={onRegisterClick}
          className="text-sm px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Đăng Ký
        </button>
      </div>
    </header>
  );
}
