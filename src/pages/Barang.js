import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getInventory } from "../api"; // Pastikan path ke getInventory sudah benar

// Import Bootstrap CSS dan Icons jika belum diimpor secara global di src/index.js atau App.js
// Jika Anda belum mengimpornya secara global, tambahkan di sini atau di App.js:
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

// Dashboard Component
function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    id: null, // Menggunakan null untuk id baru
    nama_barang: "",
    stok: "",
    harga: "",
    kategori: "", // Menambahkan state untuk kategori
    foto: null, // Menambahkan state untuk objek File foto
    foto_preview: null, // Untuk menampilkan preview gambar yang dipilih atau URL gambar dari API
  });
  const [selectedItem, setSelectedItem] = useState(null);

  // State untuk mengontrol visibilitas modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = localStorage.getItem("token");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  // Fungsi untuk menampilkan data barang
  const fetchInventory = async () => {
    try {
      const data = await getInventory(token);
      setInventory(data);
    } catch (error) {
      console.error("Gagal mengambil data inventaris:", error);
      alert("Gagal memuat data inventaris. Silakan coba lagi.");
    }
  };

  // Fungsi untuk membuka modal
  const openModal = (modalType, item = null) => {
    if (modalType === "add") {
      setFormData({
        id: null,
        nama_barang: "",
        stok: "",
        harga: "",
        kategori: "", // Reset kategori
        foto: null,
        foto_preview: null,
      }); // Reset form untuk tambah
      setShowAddModal(true);
    } else if (modalType === "edit" && item) {
      setFormData({
        ...item,
        foto: null, // Jangan isi foto file saat edit, hanya preview
        foto_preview: item.foto_url || null, // Asumsi API mengembalikan 'foto_url'
      }); // Isi form dengan data item yang dipilih
      setShowEditModal(true);
    } else if (modalType === "delete" && item) {
      setSelectedItem(item);
      setShowDeleteModal(true);
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = (modalType) => {
    if (modalType === "add") {
      setShowAddModal(false);
    } else if (modalType === "edit") {
      setShowEditModal(false);
    } else if (modalType === "delete") {
      setShowDeleteModal(false);
      setSelectedItem(null); // Reset selected item
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk menangani perubahan input file (foto)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto: file,
        foto_preview: URL.createObjectURL(file), // Membuat URL objek untuk preview
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        foto: null,
        foto_preview: null,
      }));
    }
  };

  // Fungsi untuk menambahkan barang menggunakan API
  const handleAdd = async (e) => {
    e.preventDefault();
    const data = new FormData(); // Gunakan FormData untuk mengirim file
    data.append("nama_barang", formData.nama_barang);
    data.append("stok", parseInt(formData.stok)); // Pastikan stok adalah integer
    data.append("harga", parseFloat(formData.harga)); // Pastikan harga adalah float
    data.append("kategori", formData.kategori); // Menambahkan kategori
    if (formData.foto) {
      data.append("foto", formData.foto); // Menambahkan file foto jika ada
    }

    try {
      const response = await fetch("http://localhost:5000/api/barang", {
        method: "POST",
        // Hapus 'Content-Type': 'application/json' karena kita mengirim FormData
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data, // Menggunakan FormData
      });

      if (response.ok) {
        alert("Barang berhasil ditambahkan!");
        fetchInventory();
        closeModal("add");
      } else {
        const errorData = await response.json();
        console.error("Gagal menambahkan barang:", errorData.message);
        alert(
          `Gagal menambahkan barang: ${errorData.message || "Terjadi kesalahan."
          }`
        );
      }
    } catch (error) {
      console.error("Error menambahkan barang:", error);
      alert("Terjadi kesalahan jaringan saat menambahkan barang.");
    }
  };

  // Fungsi untuk edit barang menggunakan API
  const handleEdit = async (e) => {
    e.preventDefault();
    const data = new FormData(); // Gunakan FormData untuk mengirim file
    data.append("nama_barang", formData.nama_barang);
    data.append("stok", parseInt(formData.stok));
    data.append("harga", parseFloat(formData.harga));
    data.append("kategori", formData.kategori); // Menambahkan kategori
    if (formData.foto) {
      data.append("foto", formData.foto); // Hanya tambahkan foto jika ada file baru yang dipilih
    }
    // Jika tidak ada foto baru yang dipilih, dan sebelumnya ada foto, kita tidak perlu mengirim field 'foto'
    // Jika Anda ingin memungkinkan penghapusan foto, Anda bisa menambahkan field khusus seperti 'clear_foto'
    // data.append("clear_foto", formData.foto_preview === null && formData.foto === null ? "true" : "false");

    try {
      const response = await fetch(
        `http://localhost:5000/api/barang/${formData.id}`,
        {
          method: "PUT",
          // Hapus 'Content-Type': 'application/json' karena kita mengirim FormData
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data, // Menggunakan FormData
        }
      );

      if (response.ok) {
        alert("Barang berhasil diperbarui!");
        fetchInventory();
        closeModal("edit");
      } else {
        const errorData = await response.json();
        console.error("Gagal memperbarui barang:", errorData.message);
        alert(
          `Gagal memperbarui barang: ${errorData.message || "Terjadi kesalahan."
          }`
        );
      }
    } catch (error) {
      console.error("Error memperbarui barang:", error);
      alert("Terjadi kesalahan jaringan saat memperbarui barang.");
    }
  };

  // Fungsi untuk menghapus data barang
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/barang/${selectedItem.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Barang berhasil dihapus!");
        fetchInventory();
        closeModal("delete");
      } else {
        const errorData = await response.json();
        console.error("Gagal menghapus barang:", errorData.message);
        alert(
          `Gagal menghapus barang: ${errorData.message || "Terjadi kesalahan."}`
        );
      }
    } catch (error) {
      console.error("Error menghapus barang:", error);
      alert("Terjadi kesalahan jaringan saat menghapus barang.");
    }
  };

  // Fungsi paginasi tabel barang
  const filteredItems = inventory.filter(
    (item) =>
      item.nama_barang.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.kategori &&
        item.kategori.toLowerCase().includes(searchKeyword.toLowerCase())) // Filter juga berdasarkan kategori
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />

          <div className="card p-3 mt-3 bg-light vh-auto border-0">
            <h2 className="mb-4">DATA BARANG</h2>

            {/* <button
              className="btn mb-3 w-25"
              style={{ backgroundColor: "#7E3AF2", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#modalTambahBarangMasuk"
            >
              <i className="bi bi-plus-lg"></i> Tambah Barang
            </button> */}

            <button
              className="btn mb-3 w-25"
              style={{ backgroundColor: "#7E3AF2", color: "white" }}
              onClick={() => openModal("add")}
            >
              <i className="bi bi-plus-lg me-2"></i>Tambah Barang
            </button>

            <div className="card mt-3 bg-light">
              <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                <div>
                  <label className="m-3">Tampilkan:</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div className="d-flex align-items-center w-25 me-3">
                  <label className="me-2 mb-0 fw-semibold">Search:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama barang..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>No</th>
                      <th>Foto</th> {/* Menambahkan kolom foto */}
                      <th>Nama Barang</th>
                      <th>Kategori</th> {/* Menambahkan kolom kategori */}
                      <th>Harga</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-center">
                            {startIndex + index + 1}
                          </td>
                          <td className="text-center">
                            {item.foto ? ( // Asumsi API mengembalikan 'foto_url'
                              <img
                                src={`${item.foto}`} // Sesuaikan dengan path server Anda
                                alt={item.nama_barang}
                                style={{
                                  width: "200px",
                                  // height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "5px",
                                }}
                                className="img-thumbnail"
                              />
                            ) : (
                              <i
                                className="bi bi-image-alt text-muted"
                                style={{ fontSize: "2rem" }}
                              ></i> // Icon placeholder
                            )}
                          </td>
                          <td>{item.nama_barang}</td>
                          <td>{item.kategori}</td> {/* Menampilkan kategori */}
                          <td className="text-end">
                            Rp. {item.harga.toLocaleString("id-ID")}
                          </td>
                          <td className="text-center">{item.stok}</td>                          <td className="text-center">
                            <button
                              className="btn btn-sm me-2"
                              style={{ backgroundColor: "#4CAF50", color: "white" }}
                              onClick={() => openModal("edit", item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => openModal("delete", item)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          {" "}
                          {/* Sesuaikan colspan */}
                          Tidak ada data barang yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>              <div className="d-flex justify-content-between align-items-center m-3">
                <span>
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="d-flex">
                  <button
                    className="btn btn-outline-primary me-1"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>

                  {[...Array(totalPages).keys()].slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  ).map(i => (
                    <button
                      key={i + 1}
                      className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="btn btn-outline-primary ms-1"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Barang */}
      <div
        className={`modal fade ${showAddModal ? "show" : ""}`}
        style={{ display: showAddModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="modalTambahBarangLabel"
        aria-hidden={!showAddModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTambahBarangLabel">
                Tambah Barang
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("add")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label htmlFor="nama_barang_add" className="form-label">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nama_barang_add"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="kategori_add" className="form-label">
                    Kategori
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="kategori_add"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="harga_add" className="form-label">
                    Harga
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="harga_add"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="stok_add" className="form-label">
                    Stok
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stok_add"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="foto_add" className="form-label">
                    Foto Barang
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="foto_add"
                    name="foto"
                    accept="image/*" // Hanya menerima gambar
                    onChange={handleFileChange}
                  />
                  {formData.foto_preview && (
                    <div className="mt-2 text-center">
                      <img
                        src={formData.foto_preview}
                        alt="Preview Foto"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-danger" onClick={() => closeModal("add")}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Barang */}
      <div
        className={`modal fade ${showEditModal ? "show" : ""}`}
        style={{ display: showEditModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="modalEditBarangLabel"
        aria-hidden={!showEditModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEditBarangLabel">
                Edit Barang
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("edit")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label htmlFor="nama_barang_edit" className="form-label">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nama_barang_edit"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="kategori_edit" className="form-label">
                    Kategori
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="kategori_edit"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="harga_edit" className="form-label">
                    Harga
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="harga_edit"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="stok_edit" className="form-label">
                    Stok
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stok_edit"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="foto_edit" className="form-label">
                    Foto Barang
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="foto_edit"
                    name="foto"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {formData.foto_preview && (
                    <div className="mt-2 text-center">
                      <p className="mb-1 text-muted">Foto saat ini:</p>
                      <img
                        src={
                          formData.foto_preview.startsWith("blob:")
                            ? formData.foto_preview
                            : `http://localhost:5000${formData.foto_preview}`
                        }
                        alt="Preview Foto"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                        className="img-thumbnail"
                      />
                      <small className="d-block mt-1 text-muted">
                        Pilih file baru untuk mengubah foto.
                      </small>
                    </div>
                  )}
                </div>                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-danger" onClick={() => closeModal("edit")}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hapus Barang */}
      <div
        className={`modal fade ${showDeleteModal ? "show" : ""}`}
        style={{ display: showDeleteModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="modalHapusBarangLabel"
        aria-hidden={!showDeleteModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalHapusBarangLabel">
                Konfirmasi Hapus
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("delete")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Apakah Anda yakin ingin menghapus barang{" "}
                <b>{selectedItem?.nama_barang}</b>?
              </p>              <p className="mb-4 text-center fs-5">
                Apakah Anda yakin ingin menghapus data ini?
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => closeModal("delete")}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Manual Modal Backdrop for React-controlled Modals */}
      {(showAddModal || showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default Dashboard;
