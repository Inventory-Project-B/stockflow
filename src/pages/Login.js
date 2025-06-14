import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import logo from "../assets/Logo.png";
import "../assets/style.css"; // Pastikan untuk menyesuaikan path ini sesuai dengan struktur folder Anda

// Variabel pada halaman login
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Fungsi login pengguna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Verifikasi data sebelum dikirim
    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    console.log("Attempting login with:", { username, password });

    try {
      // Coba kirim dalam format yang berbeda untuk memastikan backend menerimanya
      const credentials = {
        username: username,
        password: password,
        // Kirim juga sebagai email untuk jaga-jaga
        email: username
      };

      console.log("Sending credentials:", credentials);
      const response = await login(credentials);

      // Debug log untuk memeriksa struktur response
      console.log("Login response:", response);

      // Pastikan response memiliki struktur yang benar
      if (response && response.token && response.user) {
        localStorage.setItem("token", response.token);

        // Simpan seluruh data user atau hanya properti yang diperlukan
        localStorage.setItem(
          "userData",
          JSON.stringify({
            nama: response.user.nama,
            email: response.user.email,
            role: response.user.role,
          })
        );

        navigate("/dashboard");
      } else {
        throw new Error("Struktur response tidak valid");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Logging untuk debugging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      setError(error.response?.data?.message || "Username atau password salah");
    }
  };

  // Konten pada halaman login
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="row w-100 shadow rounded overflow-hidden"
        style={{ maxWidth: "900px", minHeight: "500px" }}
      >
        {/* Kolom Logo */}
        <div
          className="col-md-5 d-none d-md-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#7E3AF2" }}
        >
          <div className="text-center text-white p-4">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid mb-3"
              style={{ maxWidth: "150px" }}
            />
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              Stock<span className="text-dark">Flow</span>
            </h1>
            <h4>Sistem Inventori Barang</h4>
          </div>
        </div>

        {/* Kolom Form Login */}
        <div className="col-md-7 col-12 d-flex align-items-center justify-content-center bg-white">
          <div className="p-4 w-100" style={{ maxWidth: "400px" }}>
            <h1
              className="mb-4 text-center"
              style={{ fontSize: "2rem", fontWeight: "bold" }}
            >
              MASUK
            </h1>
            <form onSubmit={handleSubmit}>              <div className="mb-3">
              <label
                htmlFor="username"
                className="form-label"
                style={{ fontSize: "1.2rem" }}
              >
                Nama Pengguna
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ fontSize: "1.2rem" }}
                >
                  Kata Sandi
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn text-white"
                  style={{
                    backgroundColor: "#7E3AF2",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
