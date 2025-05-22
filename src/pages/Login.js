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
  const navigate = useNavigate();

  // Fungsi login pengguna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login({ username, password });

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
            username: response.user.username,
            role: response.user.role,
          })
        );

        navigate("/dashboard");
      } else {
        throw new Error("Struktur response tidak valid");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "username atau password salah");
    }
  };

  // Konten pada halaman login
  return (
    <div className="container vh-100">
      <div className="align-center p-5" style={{ height: "100%" }}>
        <div className="row h-100 border border-2 border-secondary shadow rounded">
          {/* Kolom Logo */}
          <div
            className="col-md-5 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#7E3AF2" }}
          >
            <div className="text-center text-white">
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: "200px" }}
              />
              <h1
                className="mt-3"
                style={{ fontSize: "3rem", fontWeight: "bold" }}
              >
                Stock<span class="text-dark">Flow</span>
              </h1>
              <h2 className="mt-2">Sistem Inventori Barang</h2>
            </div>
          </div>

          {/* Kolom Form Login */}
          <div className="col-md-7 d-flex align-items-center justify-content-center">
            <div
              className="card border-0"
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <h1
                className="card-title mb-5"
                style={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                MASUK
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="form-label"
                    style={{ fontSize: "1.5rem" }}
                  >
                    Nama Pengguna
                  </label>
                  <input
                    type="username"
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
                    style={{ fontSize: "1.5rem" }}
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
                    className="btn text-white font-weight-bold"
                    style={{
                      backgroundColor: "#7E3AF2",
                      fontSize: "1.5rem",
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
    </div>
  );
}

export default Login;
