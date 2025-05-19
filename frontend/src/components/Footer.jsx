// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Thông Tin Công Ty</h3>
            <p className="text-sm">Địa chỉ công ty, thông tin liên hệ, mô tả về công ty hoặc thông tin khác.</p>
            <div className="mt-4">
              <a href="#" className="text-sm hover:text-orange-500">Liên hệ với chúng tôi</a><br/>
              <a href="#" className="text-sm hover:text-orange-500">Câu hỏi thường gặp</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Dịch Vụ</h3>
            <ul>
              <li><a href="#" className="text-sm hover:text-orange-500">Mua Vé Online</a></li>
              <li><a href="#" className="text-sm hover:text-orange-500">Lịch Chiếu Phim</a></li>
              <li><a href="#" className="text-sm hover:text-orange-500">Giới Thiệu Phim</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Kết Nối Với Chúng Tôi</h3>
            <p className="text-sm">Theo dõi chúng tôi qua các kênh mạng xã hội</p>
            <div className="mt-4">
              <a href="#" className="text-sm hover:text-orange-500">Facebook</a><br/>
              <a href="#" className="text-sm hover:text-orange-500">Instagram</a><br/>
              <a href="#" className="text-sm hover:text-orange-500">Twitter</a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Galaxy Cinema. All Rights Reserved.
      </div>
    </footer>
  );
}
