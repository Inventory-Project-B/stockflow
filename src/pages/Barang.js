import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      nama_barang: "Gamis Shanum",
      kategori: "Gamis",
      harga: 275000,
      stok: 20,
      foto_barang: "/Barang/image 1.png"
    },
    {
      id: 2,
      nama_barang: "Midi Dress Maura",
      kategori: "Dress",
      harga: 165000,
      stok: 40,
      foto_barang: "/Barang/image 2.png"
    },
    {
      id: 3,
      nama_barang: "Daster Ashanty",
      kategori: "Daster",
      harga: 95000,
      stok: 30,
      foto_barang: "/Barang/image 3.png"
    },
    {
      id: 4,
      nama_barang: "Gamis Raya",
      kategori: "Gamis",
      harga: 180000,
      stok: 40,
      foto_barang: "/Barang/image 4.png"
    },
    {
      id: 5,
      nama_barang: "Daster Sultan",
      kategori: "Daster",
      harga: 200000,
      stok: 30,
      foto_barang: "/Barang/image 5.png"
    },
    {
      id: 6,
      nama_barang: "Daster Bordir",
      kategori: "Daster",
      harga: 170000,
      stok: 50,
      foto_barang: "/Barang/image 6.png"
    },
    {
      id: 7,
      nama_barang: "Daster Sultan",
      kategori: "Daster",
      harga: 195000,
      stok: 20,
      foto_barang: "/Barang/image 7.png"
    },
    {
      id: 8,
      nama_barang: "Daster Sultan",
      kategori: "Daster",
      harga: 200000,
      stok: 30,
      foto_barang: "/Barang/image 8.png"
    }
  ]);

  const [formData, setFormData] = useState({
    nama_barang: "",
    kategori: "",
    harga: "",
    stok: "",
    foto_barang: ""
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    modal.classList.remove("d-block");
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";

    // Hapus backdrop manual (jika ada)
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }

    // Hapus scroll lock dari body
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  // Reset error atau state lain jika perlu
  setError(null);
};


  // Fungsi untuk menangani perubahan form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fungsi untuk menambahkan barang
  const handleAdd = (e) => {
    e.preventDefault();
    try {
      // Validasi data
      if (!formData.nama_barang || !formData.harga || !formData.stok) {
        throw new Error("Semua field harus diisi");
      }

      const newItem = {
        id: Math.max(...inventory.map(item => item.id), 0) + 1,
        ...formData,
        harga: Number(formData.harga),
        stok: Number(formData.stok)
      };

      setInventory(prev => [...prev, newItem]);
      setFormData({
        nama_barang: "",
        kategori: "",
        harga: "",
        stok: "",
        foto_barang: ""
      });
      closeModal("modalTambahBarang");
    } catch (err) {
      setError(err.message);
    }
  };

  // Fungsi untuk mengedit barang
  const handleEdit = (e) => {
    e.preventDefault();
    try {
      if (!formData.id) {
        throw new Error("Item tidak valid");
      }

      setInventory(prev =>
        prev.map(item =>
          item.id === formData.id ? { ...item, ...formData } : item
        )
      );
      closeModal("modalEditBarang");
    } catch (err) {
      setError(err.message);
    }
  };

  // Fungsi untuk menghapus barang
  const handleDelete = () => {
    try {
      if (!selectedItem?.id) {
        throw new Error("Item tidak valid");
      }

      setInventory(prev => prev.filter(item => item.id !== selectedItem.id));
      closeModal("modalHapusBarang");
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter dan pagination
  const filteredItems = inventory.filter(item =>
    item.nama_barang.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Reset ke halaman 1 ketika filter atau itemsPerPage berubah
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
            <h2 className="mb-4">DATA BARANG</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button
              className="btn mb-3 w-25"
              style={{ backgroundColor: "#7E3AF2", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#modalTambahBarang"
              onClick={() => setFormData({
                nama_barang: "",
                kategori: "",
                harga: "",
                stok: "",
                foto_barang: ""
              })}
            >
              <i className="bi bi-plus-lg"></i> Tambah Barang
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
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>No</th>
                      <th>Foto Barang</th>
                      <th>Nama Barang</th>
                      <th>Kategori</th>
                      <th>Harga</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id}>
                          <td class="text-center">{startIndex + index + 1}</td>
                          <td className="text-center">
                            <img
                              src={item.foto_barang || "https://via.placeholder.com/80?text=No+Image"}
                              alt={item.nama_barang}
                              width="80"
                              className="img-thumbnail"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/80?text=No+Image";
                              }}
                            />
                          </td>
                          <td>{item.nama_barang}</td>
                          <td>{item.kategori}</td>
                          <td>Rp {item.harga.toLocaleString()}</td>
                          <td className="text-center">{item.stok}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-success me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#modalEditBarang"
                              onClick={() => setFormData(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#modalHapusBarang"
                              onClick={() => setSelectedItem(item)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center m-3">
                <span>
                  Halaman {currentPage} dari {totalPages} (Total: {filteredItems.length} barang)
                </span>
                <div>
                  <button
                    className="btn btn-outline-primary me-3"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &laquo; Previous
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next &raquo;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Barang */}
      <div className="modal fade" id="modalTambahBarang" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Barang</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("modalTambahBarang")}
              ></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Kategori</label>
                  <input
                    type="text"
                    className="form-control"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Foto Barang (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="foto_barang"
                    value={formData.foto_barang}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Barang */}
      <div className="modal fade" id="modalEditBarang" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Barang</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("modalEditBarang")}
              ></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Kategori</label>
                  <input
                    type="text"
                    className="form-control"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Foto Barang (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="foto_barang"
                    value={formData.foto_barang}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hapus Barang */}
      <div className="modal fade" id="modalHapusBarang" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Konfirmasi Hapus</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("modalHapusBarang")}
              ></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <p>
                Apakah Anda yakin ingin menghapus{" "}
                <b>{selectedItem?.nama_barang}</b>?
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => closeModal("modalHapusBarang")}
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
    </div>
  );
}

export default Dashboard;