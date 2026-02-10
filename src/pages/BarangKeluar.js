import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BarangKeluar = () => {
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [formData, setFormData] = useState({
    barang_id: "",
    jumlah: "",
    tanggal: "",
    harga: "",
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBarangKeluar();
    fetchBarangList();
  }, []);

  const fetchBarangKeluar = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/barang-keluar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBarangKeluar(data);
    } catch (err) {
      console.error("Gagal mengambil data barang keluar", err);
    }
  };

  const fetchBarangList = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/barang", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBarangList(data);
    } catch (err) {
      console.error("Gagal mengambil daftar barang", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update harga when barang is selected
  const handleBarangChange = (e) => {
    const selectedBarangId = e.target.value;
    const selectedBarang = barangList.find(
      (barang) => barang.id == selectedBarangId
    );

    setFormData({
      ...formData,
      barang_id: selectedBarangId,
      harga: selectedBarang ? selectedBarang.harga : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/barang-keluar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          barang_id: formData.barang_id,
          jumlah: parseInt(formData.jumlah, 10),
          tanggal: formData.tanggal,
          // harga: parseInt(formData.harga, 10),
        }),
      });

      if (response.ok) {
        await fetchBarangKeluar();
        setFormData({ barang_id: "", jumlah: "", tanggal: "", harga: "" });
        document.getElementById("closeModal").click();
      } else {
        console.error("Gagal menambah barang keluar");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      barang_id: item.barang_id,
      jumlah: item.jumlah,
      tanggal: item.tanggal.split("T")[0],
      harga: item.harga,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/barang-keluar/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            barang_id: formData.barang_id,
            jumlah: parseInt(formData.jumlah, 10),
            tanggal: formData.tanggal,
            harga: parseInt(formData.harga, 10),
          }),
        }
      );

      if (response.ok) {
        await fetchBarangKeluar();
        setFormData({ barang_id: "", jumlah: "", tanggal: "", harga: "" });
        setEditId(null);
        document.getElementById("closeEditModal").click();
      } else {
        console.error("Gagal mengupdate barang keluar");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/barang-keluar/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          await fetchBarangKeluar();
        } else {
          console.error("Gagal menghapus barang keluar");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  // Functions for delete confirmation modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/barang-keluar/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchBarangKeluar();
        closeDeleteModal();
      } else {
        console.error("Gagal menghapus barang keluar");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const filteredItems = barangKeluar.filter((item) => {
    const searchMatch = item.nama_barang
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    return searchMatch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, itemsPerPage]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />

          <div className="card p-3 mt-3 bg-light vh-auto border-0">
            <h2 className="mb-4">BARANG KELUAR</h2>

            <button
              className="btn mb-3 w-25"
              style={{ backgroundColor: "#7E3AF2", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#modalTambahBarangKeluar"
            >
              <i className="bi bi-plus-lg"></i> Tambah Barang Keluar
            </button>

            <div className="card mt-3 bg-light">
              <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                <div>
                  <label className="m-3">Tampilkan:</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div className="d-flex align-items-center w-25 me-3">
                  <label className="me-2 fw-semibold">Search:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama barang..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>No</th>
                      <th>Tanggal Barang Keluar</th>
                      <th>Nama Barang</th>
                      <th>Harga</th>
                      <th>Jumlah Keluar</th>
                      <th>Total Harga</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length > 0 ? (
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
                          <td>{formatCurrency(item.harga)}</td>
                          <td>{item.jumlah}</td>
                          <td>{formatCurrency(item.jumlah * item.harga)}</td>                          <td className="text-center">
                            <button
                              className="btn btn-sm me-2"
                              style={{ backgroundColor: "#4CAF50", color: "white" }}
                              data-bs-toggle="modal"
                              data-bs-target="#modalEditBarangKeluar"
                              onClick={() => handleEditClick(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
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
                        <td colSpan="7" className="text-center">
                          {searchKeyword
                            ? "Tidak ditemukan barang dengan nama tersebut"
                            : "Tidak ada data barang keluar"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredItems.length > 0 && (
                <div className="d-flex justify-content-between align-items-center m-3">
                  <span>
                    Menampilkan {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, filteredItems.length)} dari{" "}
                    {filteredItems.length} item
                  </span>                  <div className="d-flex">
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
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Barang Keluar */}
      <div className="modal fade" id="modalTambahBarangKeluar" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Barang Keluar</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeModal"
              />
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
                    onChange={handleBarangChange}
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
                  <label className="form-label">Harga Satuan</label>
                  <input
                    type="number"
                    className="form-control"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    required
                    min="1"
                  />
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
                    min="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Harga</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatCurrency(formData.jumlah * formData.harga)}
                    readOnly
                  />
                </div>                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
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

      {/* Modal Edit Barang Keluar */}
      <div className="modal fade" id="modalEditBarangKeluar" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Barang Keluar</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeEditModal"
              />
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
                    onChange={handleBarangChange}
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
                  <label className="form-label">Harga Satuan</label>
                  <input
                    type="number"
                    className="form-control"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    required
                    min="1"
                  />
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
                    min="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Harga</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatCurrency(formData.jumlah * formData.harga)}
                    readOnly
                  />
                </div>                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
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
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
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

export default BarangKeluar;
