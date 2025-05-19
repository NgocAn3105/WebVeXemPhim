import React, { useState } from "react";

const LoginModal = ({ isOpen, onClose, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo đăng nhập giả (có thể thay bằng API sau)
    if (email === "admin@example.com" && password === "123456") {
      localStorage.setItem("user", JSON.stringify({ email }));
      setError("");
      onClose(); // Đóng modal sau khi đăng nhập thành công
      window.location.reload(); // Reload để cập nhật UI nếu cần
    } else {
      setError("Sai email hoặc mật khẩu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" id="login-modal">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg animate-fadeIn relative">
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-500">Đăng Nhập</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm">Email:</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Mật khẩu:</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Đăng Nhập
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          Chưa có tài khoản?{" "}
          <button onClick={onSwitch} className="text-orange-500 hover:underline">
            Đăng ký
          </button>
        </div>
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-xl">
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
