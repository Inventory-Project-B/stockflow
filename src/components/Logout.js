import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  // Fungsi logout menggunakan API
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Hapus token dari localStorage
        navigate("/login"); // Arahkan ke halaman login
      } else {
        console.error("Logout gagal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  // Konten logout hanya berupa tombol
  return (
    <button onClick={handleLogout} className="border-0 bg-transparent text-danger">
      <i className="bi bi-box-arrow-right fs-4"></i>
    </button>
  );
};

export default LogoutButton;
