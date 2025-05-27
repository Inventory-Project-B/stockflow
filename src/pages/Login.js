import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/Logo.png";
import "../assets/style.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const dummyUser = {
      username: "admin",
      password: "admin123",
      nama: "Admin",
      role: "admin",
    };

    if (username === dummyUser.username && password === dummyUser.password) {
      localStorage.setItem("token", "dummy-token-123456");
      localStorage.setItem(
        "userData",
        JSON.stringify({
          nama: dummyUser.nama,
          username: dummyUser.username,
          role: dummyUser.role,
        })
      );
      navigate("/dashboard");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="row shadow rounded-2 overflow-hidden" style={{ width: "800px", height: "470px" }}>

        {/* Kolom Logo */}
        <div
          className="col-md-5 d-flex flex-column align-items-center justify-content-center"
          style={{ backgroundColor: "#7E3AF2" }}
        >
          <img
            src={logo}
            alt="Logo"
            className="img-fluid mb-3"
            style={{ maxWidth: "120px", marginTop: "-10px", paddingBottom: "10px" }}
          />
          <h1 style={{ fontSize: "1.7rem", fontWeight: "bold", color: "#fff", marginBottom: "5px" }}>
            Stock<span className="text-dark">Flow</span>
          </h1>
          <h2 style={{ fontSize: "0.95rem", color: "#fff", marginBottom: "10px" }}>
            Sistem Inventori Barang
          </h2>
        </div>

        {/* Kolom Form Login */}
        <div className="col-md-7 d-flex align-items-center justify-content-center">
          <div className="card border-0 px-4" style={{ width: "100%", maxWidth: "350px" }}>
            <h1
              className="card-title mb-3"
              style={{ fontSize: "1.5rem", fontWeight: "600", marginTop: "-5px", paddingBottom: "30px" }}
            >
              Masuk
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label" style={{ fontSize: "1rem" }}>
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  id="username"
                  style={{ height: "36px", fontSize: "0.9rem" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label" style={{ fontSize: "1rem" }}>
                  Kata Sandi
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control custom-input"
                  id="password"
                  style={{
                    height: "36px",
                    fontSize: "0.9rem",
                    paddingRight: "40px"
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "38px",
                    cursor: "pointer",
                    color: "#000",
                    fontSize: "1rem",
                  }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {/* Alert error */}
              <div style={{ minHeight: "40px", marginBottom: "10px" }}>
                {error && (
                  <div className="alert alert-danger p-2 text-center m-0" style={{ fontSize: "0.9rem" }}>
                    {error}
                  </div>
                )}
              </div>

              <div className="d-grid mt-3">
                <button
                  type="submit"
                  className="btn text-white font-weight-bold"
                  style={{
                    backgroundColor: "#7E3AF2",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    padding: "10px",
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
