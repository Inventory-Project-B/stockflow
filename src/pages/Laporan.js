import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";

// Base64 logo (bisa diganti dengan path image juga kalau lokal)
const logoBase64 = "data:image/png;base64,..."; // Ganti dengan logo base64 kamu

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Komponen cetak PDF untuk Barang Masuk
const PDFBarangMasuk = ({ data, filter }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Kop Surat dengan Logo */}
      <View style={styles.companyHeader}>
        <Image style={styles.logo} src="/Logo.png" />
        <View style={styles.companyText}>
          <Text style={styles.companyName}>STOCKFLOW</Text>
          <Text style={styles.companyAddress}>
            Alamat: Jl. Perintis Kemerdekaan No.277 Karsamenak, Kode Pos 46182
          </Text>
          <Text style={styles.companyContact}>
            Telp: 0821-2345-6789 | Website: https://stockflow.com
          </Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>LAPORAN BARANG MASUK</Text>
        <Text style={styles.subtitle}>
          Periode: {filter.startDate || ""} sampai {filter.endDate || ""}
        </Text>
      </View>

      {/* Tabel Data */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>No</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Tanggal</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Nama Barang</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Jumlah</Text>
          </View>
        </View>

        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.nama_barang}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.jumlah}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Tanda Tangan */}
      <View style={styles.footer}>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>Diketahui,</Text>
          <Text style={styles.signatureRole}>Pemilik</Text>
          <View style={styles.signatureSpace} />
          <Text style={styles.signatureLine}>(__________________________)</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureDate}>
            Tasikmalaya, {new Date().toLocaleDateString("id-ID")}
          </Text>
          <Text style={styles.signatureRole}>Admin Gudang</Text>
          <View style={styles.signatureSpace} />
          <Text style={styles.signatureLine}>(__________________________)</Text>
        </View>
      </View>

      {/* Nomor Halaman */}
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Halaman ${pageNumber} dari ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

// Komponen cetak PDF untuk Barang Keluar
const PDFBarangKeluar = ({ data, filter }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Kop Surat dengan Logo */}
      <View style={styles.companyHeader}>
        <Image style={styles.logo} src="/Logo.png" />
        <View style={styles.companyText}>
          <Text style={styles.companyName}>STOCKFLOW</Text>
          <Text style={styles.companyAddress}>
            Alamat: Jl. Perintis Kemerdekaan No.277 Karsamenak, Kode Pos 46182
          </Text>
          <Text style={styles.companyContact}>
            Telp: 0821-2345-6789 | Website: https://stockflow.com
          </Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>LAPORAN BARANG KELUAR</Text>
        <Text style={styles.subtitle}>
          Periode: {filter.startDate || ""} sampai {filter.endDate || ""}
        </Text>
      </View>

      {/* Tabel Data */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>No</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Tanggal</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Nama Barang</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Harga</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Jumlah</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.textHeader}>Jumlah Harga</Text>
          </View>
        </View>

        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.nama_barang}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{formatCurrency(item.harga)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.jumlah}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>
                {formatCurrency(item.jumlah * item.harga)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Tanda Tangan */}
      <View style={styles.footer}>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>Diketahui,</Text>
          <Text style={styles.signatureRole}>Pemilik</Text>
          <View style={styles.signatureSpace} />
          <Text style={styles.signatureLine}>(__________________________)</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text style={styles.signatureDate}>
            Tasikmalaya, {new Date().toLocaleDateString("id-ID")}
          </Text>
          <Text style={styles.signatureRole}>Admin Gudang</Text>
          <View style={styles.signatureSpace} />
          <Text style={styles.signatureLine}>(__________________________)</Text>
        </View>
      </View>

      {/* Nomor Halaman */}
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Halaman ${pageNumber} dari ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

// Update styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: 1,
    borderColor: "#000",
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  companyText: {
    alignContent: "center",
    textAlign: "center",
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  companyAddress: {
    fontSize: 10,
    marginBottom: 2,
  },
  companyContact: {
    fontSize: 10,
  },
  header: {
    marginBottom: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  textHeader: {
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    textAlign: "start",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBox: {
    width: "40%",
    textAlign: "center",
  },
  signatureSpace: {
    height: 40,
  },
  invisibleText: {
    color: "white", // Untuk menyembunyikan teks tapi tetap mempertahankan spacing
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
});

// Variabel pada halaman laporan
const LaporanPage = () => {
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  // State untuk pagination dan search barang masuk
  const [paginationMasuk, setPaginationMasuk] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchKeyword: "",
  });

  // State untuk pagination dan search barang keluar
  const [paginationKeluar, setPaginationKeluar] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchKeyword: "",
  });

  // Filter data berdasarkan keyword pencarian untuk barang masuk
  const filteredBarangMasuk = barangMasuk.filter((item) =>
    item.nama_barang
      .toLowerCase()
      .includes(paginationMasuk.searchKeyword.toLowerCase())
  );

  // Paginasi barang masuk
  const totalPagesMasuk = Math.ceil(
    filteredBarangMasuk.length / paginationMasuk.itemsPerPage
  );
  const startIndexMasuk =
    (paginationMasuk.currentPage - 1) * paginationMasuk.itemsPerPage;
  const endIndexMasuk = startIndexMasuk + paginationMasuk.itemsPerPage;
  const currentBarangMasuk = filteredBarangMasuk.slice(
    startIndexMasuk,
    endIndexMasuk
  );

  // Filter data berdasarkan keyword pencarian untuk barang keluar
  const filteredBarangKeluar = barangKeluar.filter((item) =>
    item.nama_barang
      .toLowerCase()
      .includes(paginationKeluar.searchKeyword.toLowerCase())
  );

  // Handler untuk search barang masuk
  const handleSearchMasuk = (e) => {
    setPaginationMasuk((prev) => ({
      ...prev,
      searchKeyword: e.target.value,
      currentPage: 1,
    }));
  };

  // Handler untuk search barang keluar
  const handleSearchKeluar = (e) => {
    setPaginationKeluar((prev) => ({
      ...prev,
      searchKeyword: e.target.value,
      currentPage: 1,
    }));
  };

  // Handler untuk items per page barang masuk
  const handleItemsPerPageMasuk = (e) => {
    setPaginationMasuk((prev) => ({
      ...prev,
      itemsPerPage: Number(e.target.value),
      currentPage: 1,
    }));
  };

  // Handler untuk items per page barang keluar
  const handleItemsPerPageKeluar = (e) => {
    setPaginationKeluar((prev) => ({
      ...prev,
      itemsPerPage: Number(e.target.value),
      currentPage: 1,
    }));
  };

  // Handler untuk page change barang masuk
  const handlePageChangeMasuk = (page) => {
    setPaginationMasuk((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Handler untuk page change barang keluar
  const handlePageChangeKeluar = (page) => {
    setPaginationKeluar((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Paginasi barang keluar
  const totalPagesKeluar = Math.ceil(
    filteredBarangKeluar.length / paginationKeluar.itemsPerPage
  );
  const startIndexKeluar =
    (paginationKeluar.currentPage - 1) * paginationKeluar.itemsPerPage;
  const endIndexKeluar = startIndexKeluar + paginationKeluar.itemsPerPage;
  const currentBarangKeluar = filteredBarangKeluar.slice(
    startIndexKeluar,
    endIndexKeluar
  );

  const [filterMasuk, setFilterMasuk] = useState({
    startDate: "",
    endDate: "",
    applied: false,
  });
  const [filterKeluar, setFilterKeluar] = useState({
    startDate: "",
    endDate: "",
    applied: false,
  });
  const [loading, setLoading] = useState({
    masuk: false,
    keluar: false,
  });
  const [pdfPreview, setPdfPreview] = useState({
    show: false,
    type: "",
    url: "",
  });
  const token = localStorage.getItem("token");

  // Format tanggal untuk tampilan
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Terapkan filter untuk barang masuk
  const applyFilterMasuk = () => {
    fetchBarangMasuk(true);
  };

  // Reset filter barang masuk
  const resetFilterMasuk = () => {
    setFilterMasuk({
      startDate: "",
      endDate: "",
      applied: false,
    });
    fetchBarangMasuk(false);
  };

  // Terapkan filter untuk barang keluar
  const applyFilterKeluar = () => {
    fetchBarangKeluar(true);
  };

  // Reset filter barang keluar
  const resetFilterKeluar = () => {
    setFilterKeluar({
      startDate: "",
      endDate: "",
      applied: false,
    });
    fetchBarangKeluar(false);
  };

  // Mengambil data barang masuk menggunakan API
  const fetchBarangMasuk = async (applyFilter = false) => {
    try {
      setLoading((prev) => ({ ...prev, masuk: true }));

      let url = "http://localhost:5000/api/barang-masuk";
      const params = new URLSearchParams();

      if (applyFilter) {
        if (filterMasuk.startDate)
          params.append("start", filterMasuk.startDate);
        if (filterMasuk.endDate) params.append("end", filterMasuk.endDate);
        setFilterMasuk((prev) => ({ ...prev, applied: true }));
      }

      const res = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBarangMasuk(data);
    } catch (error) {
      console.error("Error fetching barang masuk:", error);
    } finally {
      setLoading((prev) => ({ ...prev, masuk: false }));
    }
  };

  // Mengambil data barang keluar menggunakan API
  const fetchBarangKeluar = async (applyFilter = false) => {
    try {
      setLoading((prev) => ({ ...prev, keluar: true }));

      let url = "http://localhost:5000/api/barang-keluar";
      const params = new URLSearchParams();

      if (applyFilter) {
        if (filterKeluar.startDate)
          params.append("start", filterKeluar.startDate);
        if (filterKeluar.endDate) params.append("end", filterKeluar.endDate);
        setFilterKeluar((prev) => ({ ...prev, applied: true }));
      }

      const res = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBarangKeluar(data);
    } catch (error) {
      console.error("Error fetching barang keluar:", error);
    } finally {
      setLoading((prev) => ({ ...prev, keluar: false }));
    }
  };

  // Handler untuk perubahan filter barang masuk
  const handleFilterMasuk = (e) => {
    const { name, value } = e.target;
    setFilterMasuk((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk perubahan filter barang keluar
  const handleFilterKeluar = (e) => {
    const { name, value } = e.target;
    setFilterKeluar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate dan preview PDF
  const previewPDF = async (type) => {
    try {
      let pdfDoc;

      if (type === "masuk") {
        pdfDoc = (
          <PDFBarangMasuk
            data={barangMasuk}
            filter={{
              startDate: filterMasuk.applied
                ? formatDate(filterMasuk.startDate)
                : "Semua",
              endDate: filterMasuk.applied
                ? formatDate(filterMasuk.endDate)
                : "Semua",
            }}
          />
        );
      } else {
        pdfDoc = (
          <PDFBarangKeluar
            data={barangKeluar}
            filter={{
              startDate: filterKeluar.applied
                ? formatDate(filterKeluar.startDate)
                : "Semua",
              endDate: filterKeluar.applied
                ? formatDate(filterKeluar.endDate)
                : "Semua",
            }}
          />
        );
      }

      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);

      setPdfPreview({
        show: true,
        type,
        url,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Close preview
  const closePreview = () => {
    setPdfPreview({
      show: false,
      type: "",
      url: "",
    });
  };

  // Download PDF
  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfPreview.url;
    link.download = `laporan-barang-${pdfPreview.type}.pdf`;
    link.click();
    closePreview();
  };

  // Load data awal saat komponen mount
  useEffect(() => {
    fetchBarangMasuk();
    fetchBarangKeluar();
  }, []);

  // Filter data berdasarkan keyword pencarian
  const filteredItems = barangKeluar.filter((item) => {
    const searchMatch = item.nama_barang
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    return searchMatch;
  });

  // Paginasi
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Konten utama pada halaman laporan
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />

          <div className="card p-3 mt-3 bg-light vh-auto border-0 rounded-0">
            <h2 className="mb-3">LAPORAN INVENTORI</h2>

            <hr></hr>
            <h5 className="mb-3">Laporan Barang Masuk</h5>

            {/* Filter dan Cetak Barang Masuk */}
            <div className="row g-3 mb-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Dari Tanggal</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={filterMasuk.startDate}
                  onChange={handleFilterMasuk}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Sampai Tanggal</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={filterMasuk.endDate}
                  onChange={handleFilterMasuk}
                />
              </div>
              <div className="col-md-6 d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={applyFilterMasuk}
                  disabled={
                    loading.masuk ||
                    (!filterMasuk.startDate && !filterMasuk.endDate)
                  }
                >
                  {loading.masuk ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-funnel me-2"></i>Terapkan Filter
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={resetFilterMasuk}
                  disabled={loading.masuk || !filterMasuk.applied}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                </button>
                <button
                  className="btn btn-success ms-auto"
                  onClick={() => previewPDF("masuk")}
                  disabled={loading.masuk || barangMasuk.length === 0}
                >
                  <i className="bi bi-printer me-2"></i>Cetak PDF
                </button>
              </div>
            </div>

            {/* Info Filter yang Aktif */}
            {filterMasuk.applied && (
              <div className="alert alert-info mt-3 py-2">
                <small>
                  Filter aktif: Dari{" "}
                  <strong>
                    {formatDate(filterMasuk.startDate) || "Semua"}
                  </strong>{" "}
                  sampai{" "}
                  <strong>{formatDate(filterMasuk.endDate) || "Semua"}</strong>
                </small>
              </div>
            )}

            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                  <div>
                    <label className="m-3">Tampilkan:</label>
                    <select
                      className="form-select d-inline-block w-auto"
                      value={paginationMasuk.itemsPerPage}
                      onChange={handleItemsPerPageMasuk}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>

                  {/* <span className="fw-semibold me-5">Total Data: {inventory.length}</span> */}
                  <div className="d-flex align-items-center w-25 me-3">
                    <label className="me-2 mb-0 fw-semibold">Search:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari nama barang..."
                      value={paginationMasuk.searchKeyword}
                      onChange={handleSearchMasuk}
                    />
                  </div>
                </div>
                {/* Tabel Barang Masuk */}
                <div className="mt-3 table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-primary">
                      <tr>
                        <th className="text-center">No</th>
                        <th className="text-center">Tanggal</th>
                        <th className="text-center">Nama Barang</th>
                        <th className="text-center">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading.masuk ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : currentBarangMasuk.length > 0 ? (
                        currentBarangMasuk.map((item, index) => (
                          <tr key={`masuk-${item.id}`}>
                            <td className="text-center">
                              {startIndexMasuk + index + 1}
                            </td>
                            <td>{formatDate(item.tanggal)}</td>
                            <td>{item.nama_barang}</td>
                            <td className="text-center">{item.jumlah}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            {paginationMasuk.searchKeyword
                              ? "Tidak ditemukan barang dengan nama tersebut"
                              : "Tidak ada data"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {/* Pagination Barang Masuk */}
                  {filteredBarangMasuk.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center m-3">
                      <span>
                        Menampilkan {startIndexMasuk + 1}-
                        {Math.min(endIndexMasuk, filteredBarangMasuk.length)}{" "}
                        dari {filteredBarangMasuk.length} item
                      </span>
                      <div>
                        <button
                          className="btn btn-outline-primary me-3"
                          onClick={() =>
                            handlePageChangeMasuk(
                              paginationMasuk.currentPage - 1
                            )
                          }
                          disabled={paginationMasuk.currentPage === 1}
                        >
                          &laquo; Previous
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            handlePageChangeMasuk(
                              paginationMasuk.currentPage + 1
                            )
                          }
                          disabled={
                            paginationMasuk.currentPage === totalPagesMasuk ||
                            totalPagesMasuk === 0
                          }
                        >
                          Next &raquo;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr></hr>

            <h5 className="mb-3">Laporan Barang Keluar</h5>

            <div className="row g-3 mb-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Dari Tanggal</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={filterKeluar.startDate}
                  onChange={handleFilterKeluar}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Sampai Tanggal</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={filterKeluar.endDate}
                  onChange={handleFilterKeluar}
                />
              </div>
              <div className="col-md-6 d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={applyFilterKeluar}
                  disabled={
                    loading.keluar ||
                    (!filterKeluar.startDate && !filterKeluar.endDate)
                  }
                >
                  {loading.keluar ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-funnel me-2"></i>Terapkan Filter
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={resetFilterKeluar}
                  disabled={loading.keluar || !filterKeluar.applied}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                </button>
                <button
                  className="btn btn-success ms-auto"
                  onClick={() => previewPDF("keluar")}
                  disabled={loading.keluar || barangKeluar.length === 0}
                >
                  <i className="bi bi-printer me-2"></i>Cetak PDF
                </button>
              </div>
            </div>

            {/* Info Filter yang Aktif */}
            {filterKeluar.applied && (
              <div className="alert alert-info mt-3 py-2">
                <small>
                  Filter aktif: Dari{" "}
                  <strong>
                    {formatDate(filterKeluar.startDate) || "Semua"}
                  </strong>{" "}
                  sampai{" "}
                  <strong>{formatDate(filterKeluar.endDate) || "Semua"}</strong>
                </small>
              </div>
            )}

            {/* Filter dan Cetak Barang Keluar */}
            <div className="card">
              <div className="card-body">
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
                  {/* <span className="fw-semibold me-5">Total Data: {inventory.length}</span> */}
                  <div className="d-flex align-items-center w-25 me-3">
                    <label className="me-2 mb-0 fw-semibold">Search:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari nama barang..."
                      value={paginationKeluar.searchKeyword}
                      onChange={handleSearchKeluar}
                    />
                  </div>
                </div>

                {/* Tabel Barang Keluar */}
                <div className="mt-3 table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-warning">
                      <tr>
                        <th className="text-center">No</th>
                        <th className="text-center">Tanggal</th>
                        <th className="text-center">Nama Barang</th>
                        <th>Harga</th>
                        <th>Jumlah Keluar</th>
                        <th>Total Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading.keluar ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : currentBarangKeluar.length > 0 ? (
                        currentBarangKeluar.map((item, index) => (
                          <tr key={`keluar-${item.id}`}>
                            <td className="text-center">
                              {startIndexKeluar + index + 1}
                            </td>
                            <td>{formatDate(item.tanggal)}</td>
                            <td>{item.nama_barang}</td>
                            <td>{formatCurrency(item.harga)}</td>
                            <td>{item.jumlah}</td>
                            <td>{formatCurrency(item.jumlah * item.harga)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            {paginationKeluar.searchKeyword
                              ? "Tidak ditemukan barang dengan nama tersebut"
                              : "Tidak ada data"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Barang Keluar */}
                {filteredBarangKeluar.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center m-3">
                    <span>
                      Menampilkan {startIndexKeluar + 1}-
                      {Math.min(endIndexKeluar, filteredBarangKeluar.length)}{" "}
                      dari {filteredBarangKeluar.length} item
                    </span>
                    <div>
                      <button
                        className="btn btn-outline-primary me-3"
                        onClick={() =>
                          handlePageChangeKeluar(
                            paginationKeluar.currentPage - 1
                          )
                        }
                        disabled={paginationKeluar.currentPage === 1}
                      >
                        &laquo; Previous
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                          handlePageChangeKeluar(
                            paginationKeluar.currentPage + 1
                          )
                        }
                        disabled={
                          paginationKeluar.currentPage === totalPagesKeluar ||
                          totalPagesKeluar === 0
                        }
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
      </div>

      {/* Modal Preview PDF */}
      {pdfPreview.show && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog modal-xl"
            style={{ maxWidth: "90%", height: "90vh" }}
          >
            <div className="modal-content" style={{ height: "100%" }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  Preview Laporan Barang{" "}
                  {pdfPreview.type === "masuk" ? "Masuk" : "Keluar"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closePreview}
                ></button>
              </div>
              <div
                className="modal-body p-0"
                style={{ height: "calc(100% - 60px)", overflow: "hidden" }}
              >
                <iframe
                  src={pdfPreview.url}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="PDF Preview"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closePreview}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={downloadPDF}
                >
                  <i className="bi bi-download me-2"></i>Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaporanPage;
