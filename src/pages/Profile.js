import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    nama: "",
    nama_lengkap: "",
    username: "",
    email: "",
    role: "",
    foto_profil: "",
    previewFoto: "",
  });
  const [originalData, setOriginalData] = useState(null); // Store original data
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { foto_profil, ...restData } = response.data;
      const profileData = {
        ...restData,
        foto_profil,
        previewFoto: foto_profil
          ? foto_profil.startsWith("http")
            ? foto_profil
            : `http://localhost:5000${foto_profil.startsWith("/") ? "" : "/"
            }${foto_profil}`
          : "",
      };

      setUserData(profileData);
      setOriginalData(profileData); // Store original data for reference
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Gagal memuat data profil");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setError("Hanya file gambar yang diperbolehkan");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setError("Ukuran file maksimal 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          foto_profil: file,
          previewFoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setError(null); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all fields
      formData.append("nama", userData.nama);
      formData.append("nama_lengkap", userData.nama_lengkap);
      formData.append("username", userData.username);
      formData.append("email", userData.email);

      // Only append photo if it's a new file
      if (userData.foto_profil instanceof File) {
        formData.append("foto_profil", userData.foto_profil);
      } else if (userData.foto_profil === "") {
        // If photo was removed
        formData.append("remove_photo", "true");
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update with new data from server
      const { foto_profil } = response.data.user;
      const updatedData = {
        ...response.data.user,
        previewFoto: foto_profil
          ? foto_profil.startsWith("http")
            ? foto_profil
            : `http://localhost:5000${foto_profil.startsWith("/") ? "" : "/"
            }${foto_profil}`
          : "",
      };

      setUserData(updatedData);
      setOriginalData(updatedData);
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (originalData) {
      setUserData(originalData);
    }
    setIsEditing(false);
    setError(null);
  };

  const handleRemovePhoto = () => {
    setUserData((prev) => ({
      ...prev,
      foto_profil: "",
      previewFoto: "",
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <div className="col-md-10 p-4">
            <Navbar />
            <div className="alert alert-danger mt-3">
              {error}
              <button
                className="btn btn-link"
                onClick={() => {
                  setError(null);
                  fetchProfile();
                }}
              >
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />
          <div className="card p-3 mt-3 bg-light vh-auto border-0">
            <h2 className="mb-4">PROFIL</h2>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card shadow">
                  <div className="card-header bg-light text-dark">
                    <h3 className="card-title mb-0">Informasi Profil</h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="text-center mb-4">
                        <div className="position-relative d-inline-block">
                          <div
                            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                            style={{ width: "100px", height: "100px" }}
                          >
                            {userData.previewFoto ? (
                              <img
                                src={userData.previewFoto}
                                alt="Profile"
                                className="rounded-circle w-100 h-100 object-fit-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "http://localhost:5000/uploads/profile/default.png";
                                }}
                              />
                            ) : (
                              <span className="fs-1 text-primary">
                                {userData.nama?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          {isEditing && (
                            <>
                              <div className="position-absolute bottom-0 end-0">
                                <label className="btn btn-sm btn-primary rounded-circle">
                                  <i className="bi bi-camera"></i>
                                  <input
                                    type="file"
                                    className="d-none"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                  />
                                </label>
                              </div>
                              {userData.previewFoto && (
                                <div className="position-absolute bottom-0 start-0">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger rounded-circle"
                                    onClick={handleRemovePhoto}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {isEditing && (
                          <small className="text-muted d-block mt-2">
                            Unggah foto baru atau kosongkan untuk mempertahankan
                            foto saat ini
                          </small>
                        )}
                      </div>
                      <h4 className="text-center fw-semibold me-1">
                        {userData.nama || "User"}
                      </h4>
                      <hr></hr>

                      <div className="mb-3">
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label fw-bold">Nama</label>
                          </div>
                          <div className="col-md-8">
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control"
                                name="nama"
                                value={userData.nama}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <div className="form-control-plaintext">
                                {userData.nama}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label fw-bold">
                              Nama Lengkap
                            </label>
                          </div>
                          <div className="col-md-8">
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control"
                                name="nama_lengkap"
                                value={userData.nama_lengkap}
                                onChange={handleChange}
                              />
                            ) : (
                              <div className="form-control-plaintext">
                                {userData.nama_lengkap || "-"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label fw-bold">
                              Username
                            </label>
                          </div>
                          <div className="col-md-8">
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <div className="form-control-plaintext">
                                {userData.username || "-"}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label fw-bold">Email</label>
                          </div>
                          <div className="col-md-8">
                            {isEditing ? (
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                              />
                            ) : (
                              <div className="form-control-plaintext">
                                {userData.email}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label fw-bold">Role</label>
                          </div>
                          <div className="col-md-8">
                            <div className="form-control-plaintext text-capitalize">
                              {userData.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        {!isEditing ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary me-md-2"
                              onClick={() => setIsEditing(true)}
                            >
                              Edit Profil
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handleLogout}
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <>                            <button
                            type="button"
                            className="btn btn-danger me-md-2"
                            onClick={handleCancel}
                            disabled={isLoading}
                          >
                            Batal
                          </button><button
                            type="submit"
                            className="btn btn-success"
                            disabled={isLoading}
                          >
                              {isLoading ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                  ></span>
                                  Menyimpan...
                                </>
                              ) : (
                                "Simpan Perubahan"
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
