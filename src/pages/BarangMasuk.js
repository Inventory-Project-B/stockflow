import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BarangMasuk = () => {
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [formData, setFormData] = useState({
    barang_id: "",
    jumlah: "",
    tanggal: "",
  });
  const [editId, setEditId] = useState(null); // To track which item is being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBarangMasuk();
    fetchBarangList();
  }, []);

  // Mengambil data barang masuk dari API
  const fetchBarangMasuk = () => {
    fetch("http://localhost:5000/api/barang-masuk", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBarangMasuk(data))
      .catch((err) => console.error("Gagal mengambil data barang masuk", err));
  };

  // Mengambil daftar barang dari API
  const fetchBarangList = () => {
    fetch("http://localhost:5000/api/barang", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBarangList(data))
      .catch((err) => console.error("Gagal mengambil daftar barang", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Tambah barang masuk menggunakan API
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/barang-masuk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        barang_id: formData.barang_id,
        jumlah: parseInt(formData.jumlah, 10),
        tanggal: formData.tanggal,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBarangMasuk();
        setFormData({ barang_id: "", jumlah: "", tanggal: "" });
        document.getElementById("closeModal").click();
      })
      .catch((err) => console.error("Gagal menambah barang masuk", err));
  };

  // Edit barang masuk menggunakan API
  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      barang_id: item.barang_id,
      jumlah: item.jumlah,
      tanggal: item.tanggal.split("T")[0], // Format date for input
    });
  };

  // Edit barang masuk menggunakan API
  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/barang-masuk/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        barang_id: formData.barang_id,
        jumlah: parseInt(formData.jumlah, 10),
        tanggal: formData.tanggal,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBarangMasuk();
        setFormData({ barang_id: "", jumlah: "", tanggal: "" });
        setEditId(null);
        document.getElementById("closeEditModal").click();
      })
      .catch((err) => console.error("Gagal mengupdate barang masuk", err));
  };
  // State untuk modal konfirmasi hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Menampilkan modal konfirmasi hapus
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  // Tutup modal konfirmasi hapus
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Hapus barang masuk menggunakan API
  const handleDelete = () => {
    fetch(`http://localhost:5000/api/barang-masuk/${deleteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        fetchBarangMasuk();
        closeDeleteModal();
      })
      .catch((err) => console.error("Gagal menghapus barang masuk", err));
  };

  // Paginasi
  const filteredItems = barangMasuk.filter((item) => {
    const searchMatch = item.nama_barang
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    return searchMatch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Konten utama
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />

          <div className="card p-3 mt-3 bg-light vh-auto border-0">
            <h2 className="mb-4">BARANG MASUK</h2>

            <button
              className="btn mb-3 w-25"
              style={{ backgroundColor: "#7E3AF2", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#modalTambahBarangMasuk"
            >
              <i className="bi bi-plus-lg"></i> Tambah Barang Masuk
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
                      <th>Tanggal Barang Masuk</th>
                      <th>Nama Barang</th>
                      <th>Jumlah Masuk</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-center">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td>
                            {new Date(item.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>{item.nama_barang}</td>
                          <td>{item.jumlah}</td>                          <td className="text-center">
                            <button
                              className="btn btn-sm me-2"
                              style={{ backgroundColor: "#4CAF50", color: "white" }}
                              data-bs-toggle="modal"
                              data-bs-target="#modalEditBarangMasuk"
                              onClick={() => handleEditClick(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => confirmDelete(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center m-3">
                <span>
                  Halaman {currentPage} dari {totalPages}
                </span>                <div className="d-flex">
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

      {/* Modal Tambah Barang Masuk */}
      <div className="modal fade" id="modalTambahBarangMasuk">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Barang Masuk</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <select
                    className="form-control"
                    name="barang_id"
                    value={formData.barang_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Barang</option>
                    {barangList.map((barang) => (
                      <option key={barang.id} value={barang.id}>
                        {barang.nama_barang}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Jumlah</label>
                  <input
                    type="number"
                    className="form-control"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    required
                  />                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
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

      {/* Modal Edit Barang Masuk */}
      <div className="modal fade" id="modalEditBarangMasuk">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Barang Masuk</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeEditModal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <select
                    className="form-control"
                    name="barang_id"
                    value={formData.barang_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Barang</option>
                    {barangList.map((barang) => (
                      <option key={barang.id} value={barang.id}>
                        {barang.nama_barang}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Jumlah</label>
                  <input
                    type="number"
                    className="form-control"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    required
                  />                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
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

      {/* Modal Konfirmasi Hapus */}
      <div className={`modal fade ${showDeleteModal ? "show" : ""}`}
        style={{ display: showDeleteModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Konfirmasi Hapus</h5>
              <button type="button" className="btn-close" onClick={closeDeleteModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="mb-4 text-center fs-5">
                Apakah Anda yakin ingin menghapus data ini?
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-success" onClick={closeDeleteModal}>
                  Batal
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangMasuk;
