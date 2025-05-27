import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BarangKeluar = () => {
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [formData, setFormData] = useState({
    barang_id: "",
    tanggal: "",
    jumlah: "",
    harga: "",
    jumlahHarga: "",

  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Inisialisasi data dummy
  useEffect(() => {
    const dummyBarang = [
      { id: 1, nama_barang: "Gamis Shanum" },
      { id: 2, nama_barang: "Midi Dress Maura" },
      { id: 3, nama_barang: "Daster Ashanty" },
      { id: 4, nama_barang: "Gamis Raya" },
    ];
    const dummyBarangKeluar = [
      { id: 1, barang_id: 1, nama_barang: "Gamis Shanum", jumlah: 7, harga: 275000, jumlahHarga: 1925000, tanggal: "2025-05-25" },
      { id: 2, barang_id: 2, nama_barang: "Midi Dress Maura", jumlah: 4, harga: 165000, jumlahHarga: 660000, tanggal: "2025-05-26" },
      { id: 3, barang_id: 3, nama_barang: "Daster Ashanty", jumlah: 2, harga: 95000, jumlahHarga: 190000, tanggal: "2025-05-27" },
      { id: 4, barang_id: 4, nama_barang: "Gamis Raya", jumlah: 1, harga: 180000, jumlahHarga: 180000, tanggal: "2025-05-28" },
    ];
    setBarangList(dummyBarang);
    setBarangKeluar(dummyBarangKeluar);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const barang = barangList.find((b) => b.id === parseInt(formData.barang_id));
    const newItem = {
      id: barangKeluar.length + 1,
      barang_id: parseInt(formData.barang_id),
      nama_barang: barang.nama_barang,
      jumlah: parseInt(formData.jumlah),
      tanggal: formData.tanggal,
    };
    setBarangKeluar([...barangKeluar, newItem]);
    setFormData({ barang_id: "", jumlah: "", tanggal: "" });
    document.getElementById("closeModal").click();
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      barang_id: item.barang_id,
      jumlah: item.jumlah,
      tanggal: item.tanggal,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const barang = barangList.find((b) => b.id === parseInt(formData.barang_id));
    const updatedList = barangKeluar.map((item) =>
      item.id === editId
        ? {
            ...item,
            barang_id: parseInt(formData.barang_id),
            nama_barang: barang.nama_barang,
            jumlah: parseInt(formData.jumlah),
            tanggal: formData.tanggal,
          }
        : item
    );
    setBarangKeluar(updatedList);
    setFormData({ barang_id: "", jumlah: "", tanggal: "" });
    setEditId(null);
    document.getElementById("closeEditModal").click();
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setBarangKeluar(barangKeluar.filter((item) => item.id !== id));
    }
  };

  const filteredItems = barangKeluar.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, itemsPerPage]);

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
                    {[5, 10, 25, 50, 100].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
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
                      <th>Jumlah Harga</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-center">{indexOfFirstItem + index + 1}</td>
                          <td>
                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td>{item.nama_barang}</td>
                          <td>Rp. {item.harga}</td>
                          <td>{item.jumlah}</td>
                          <td>Rp. {item.jumlahHarga}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-warning me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#modalEditBarangKeluar"
                              onClick={() => handleEditClick(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
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
                  </span>
                  <div>
                    <button
                      className="btn btn-outline-primary me-3"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      &laquo; Previous
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next &raquo;
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
                    min="1"
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Tambah
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
                    min="1"
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangKeluar;
