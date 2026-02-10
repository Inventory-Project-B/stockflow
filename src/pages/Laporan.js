import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";

// Base logo comment removed - using direct image path instead

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Komponen cetak PDF untuk Stok Barang
const PDFStokBarang = ({ data, filter }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Kop Surat dengan Logo */}      <View style={styles.companyHeader}>
        <View style={styles.headerRow}>
          <Image style={styles.logo} src="/Logo.png" />
          <View style={styles.companyText}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ ...styles.companyName, color: '#7E3AF2', fontWeight: '600' }}>Stock</Text>
              <Text style={{ ...styles.companyName, color: '#212529' }}>Flow</Text>
            </View>
            <Text style={styles.companyAddress}>
              Alamat: Jl. Perintis Kemerdekaan No.277 Karsamenak, Kode Pos 46182
            </Text>
            <Text style={styles.companyContact}>
              Telp: 0821-2345-6789 | Website: https://stockflow.com
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>LAPORAN STOK BARANG</Text>
        <Text style={styles.subtitle}>
          Tanggal: {new Date().toLocaleDateString("id-ID")}
        </Text>
      </View>

      {/* Tabel Data */}      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: "10%" }}>
            <Text style={styles.textHeader}>No</Text>
          </View>
          <View style={{ ...styles.tableColHeader, width: "35%" }}>
            <Text style={styles.textHeader}>Nama Barang</Text>
          </View>
          <View style={{ ...styles.tableColHeader, width: "20%" }}>
            <Text style={styles.textHeader}>Kategori</Text>
          </View>
          <View style={{ ...styles.tableColHeader, width: "15%" }}>
            <Text style={styles.textHeader}>Harga</Text>
          </View>
          <View style={{ ...styles.tableColHeader, width: "20%" }}>
            <Text style={styles.textHeader}>Stok</Text>
          </View>
        </View>

        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>{index + 1}</Text>
            </View>            <View style={{ ...styles.tableCol, width: "35%" }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>{item.nama_barang || item.nama}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.text}>{item.kategori}</Text>
            </View>            <View style={{ ...styles.tableCol, width: "15%" }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>{formatCurrency(item.harga)}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={{ ...styles.text, textAlign: "center" }}>{item.stok || 0}</Text>
            </View>
          </View>
        ))}
        {/* Total Row */}        <View style={styles.tableRow}>          <View style={{ ...styles.tableCol, width: "80%", backgroundColor: "#f0f0f0" }}>
          <Text style={{ ...styles.text, textAlign: "center", fontWeight: "bold" }}>Total Stok</Text>
        </View>
          <View style={{ ...styles.tableCol, width: "20%", backgroundColor: "#f0f0f0" }}>
            <Text style={{ ...styles.text, textAlign: "center", fontWeight: "bold" }}>
              {data.reduce((sum, item) => sum + (item.stok || 0), 0)}
            </Text>
          </View>
        </View>
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

// Komponen cetak PDF untuk Barang Masuk
const PDFBarangMasuk = ({ data, filter }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Kop Surat dengan Logo */}      <View style={styles.companyHeader}>
        <View style={styles.headerRow}>
          <Image style={styles.logo} src="/Logo.png" />
          <View style={styles.companyText}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ ...styles.companyName, color: '#7E3AF2', fontWeight: '600' }}>Stock</Text>
              <Text style={{ ...styles.companyName, color: '#212529' }}>Flow</Text>
            </View>
            <Text style={styles.companyAddress}>
              Alamat: Jl. Perintis Kemerdekaan No.277 Karsamenak, Kode Pos 46182
            </Text>
            <Text style={styles.companyContact}>
              Telp: 0821-2345-6789 | Website: https://stockflow.com
            </Text>
          </View>
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
              <Text style={{ ...styles.text, textAlign: "center" }}>{index + 1}</Text>
            </View>            <View style={styles.tableCol}>
              <Text style={{ ...styles.text, textAlign: "center" }}>
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={{ ...styles.text, textAlign: "center" }}>{item.nama_barang}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={{ ...styles.text, textAlign: "center" }}>{item.jumlah}</Text>
            </View>          </View>
        ))}

        {/* Total Row */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "75%", backgroundColor: "#f0f0f0" }}>
            <Text style={{ ...styles.text, textAlign: "center", fontWeight: "bold" }}>
              Total Barang Masuk Dari Supplier
            </Text>
          </View>
          <View style={{ ...styles.tableCol, width: "25%", backgroundColor: "#f0f0f0" }}>
            <Text style={{ ...styles.text, textAlign: "center", fontWeight: "bold" }}>
              {data.reduce((sum, item) => sum + (parseInt(item.jumlah) || 0), 0)}
            </Text>
          </View>
        </View>
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
      {/* Kop Surat dengan Logo */}      <View style={styles.companyHeader}>
        <View style={styles.headerRow}>
          <Image style={styles.logo} src="/Logo.png" />
          <View style={styles.companyText}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ ...styles.companyName, color: '#7E3AF2', fontWeight: '600' }}>Stock</Text>
              <Text style={{ ...styles.companyName, color: '#212529' }}>Flow</Text>
            </View>
            <Text style={styles.companyAddress}>
              Alamat: Jl. Perintis Kemerdekaan No.277 Karsamenak, Kode Pos 46182
            </Text>
            <Text style={styles.companyContact}>
              Telp: 0821-2345-6789 | Website: https://stockflow.com
            </Text>
          </View>
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
            </View>            <View style={styles.tableCol}>
              <Text style={{ ...styles.text, textAlign: 'center' }}>
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={{ ...styles.text, textAlign: 'center' }}>{item.nama_barang}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{formatCurrency(item.harga)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>{item.jumlah}</Text>
            </View>            <View style={styles.tableCol}>
              <Text style={styles.text}>
                {formatCurrency(item.jumlah * item.harga)}
              </Text>
            </View>
          </View>
        ))}

        {/* Total Row */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: "83.33%", backgroundColor: "#f0f0f0" }}>
            <Text style={{ ...styles.text, textAlign: "center", fontWeight: "bold" }}>
              Total Harga Barang Yang Terjual
            </Text>
          </View>
          <View style={{ ...styles.tableCol, width: "16.67%", backgroundColor: "#f0f0f0" }}>
            <Text style={{ ...styles.text, textAlign: "center", fontWeight: "bold" }}>
              {formatCurrency(data.reduce((sum, item) => sum + (item.jumlah * item.harga), 0))}
            </Text>
          </View>
        </View>
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
  }, companyHeader: {
    marginBottom: 20,
    borderBottom: 1,
    borderColor: "#000",
    paddingBottom: 10,
  }, headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Mengubah dari center menjadi flex-start agar lebih ke kiri
    paddingLeft: 0, // Menghapus padding kiri untuk memposisikan ke paling kiri
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
    marginLeft: -80, // Menggeser teks perusahaan lebih ke kiri lagi
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
  const [inventory, setInventory] = useState([]);  // No longer need these states as we've moved to per-report pagination
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [searchKeyword, setSearchKeyword] = useState("");

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
  // State untuk pagination dan search inventory
  const [paginationInventory, setPaginationInventory] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchKeyword: "",
  });

  // Filter state declarations need to be before any filters that use them
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

  // State for custom confirmation modal
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: "", // "masuk" or "keluar"
  });

  const [loading, setLoading] = useState({
    masuk: false,
    keluar: false,
    inventory: false
  });
  const [pdfPreview, setPdfPreview] = useState({
    show: false,
    type: "",
    url: "",
  });
  const token = localStorage.getItem("token");

  // Filter data berdasarkan keyword pencarian untuk inventory
  const filteredInventory = inventory.filter((item) =>
    (item.nama_barang || item.nama || '')
      .toLowerCase()
      .includes(paginationInventory.searchKeyword.toLowerCase())
  );

  // Paginasi inventory
  const totalPagesInventory = Math.ceil(
    filteredInventory.length / paginationInventory.itemsPerPage
  );
  const startIndexInventory =
    (paginationInventory.currentPage - 1) * paginationInventory.itemsPerPage;
  const endIndexInventory = startIndexInventory + paginationInventory.itemsPerPage;
  const currentInventory = filteredInventory.slice(
    startIndexInventory,
    endIndexInventory
  );  // Filter data berdasarkan keyword pencarian dan tanggal untuk barang masuk
  const filteredBarangMasuk = barangMasuk.filter((item) => {
    // Filter by search keyword
    const keywordMatch = (item.nama_barang || '')
      .toLowerCase()
      .includes(paginationMasuk.searchKeyword.toLowerCase());

    // Filter by date range if applied
    let dateMatch = true;
    if (filterMasuk.applied && (filterMasuk.startDate || filterMasuk.endDate)) {
      if (!item.tanggal) {
        // If item doesn't have a date, it doesn't match date filters
        return false;
      }

      // Normalize the item date to start of day for consistent comparison
      const itemDate = new Date(item.tanggal);
      itemDate.setHours(0, 0, 0, 0);

      if (filterMasuk.startDate && filterMasuk.endDate) {
        // Create dates at start of day for start date
        const startDate = new Date(filterMasuk.startDate);
        startDate.setHours(0, 0, 0, 0);

        // Create date at end of day for end date
        const endDate = new Date(filterMasuk.endDate);
        endDate.setHours(23, 59, 59, 999);

        dateMatch = itemDate >= startDate && itemDate <= endDate;
      } else if (filterMasuk.startDate) {
        const startDate = new Date(filterMasuk.startDate);
        startDate.setHours(0, 0, 0, 0);
        dateMatch = itemDate >= startDate;
      } else if (filterMasuk.endDate) {
        const endDate = new Date(filterMasuk.endDate);
        endDate.setHours(23, 59, 59, 999);
        dateMatch = itemDate <= endDate;
      }
    }

    return keywordMatch && dateMatch;
  });

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
  );  // Filter data berdasarkan keyword pencarian dan tanggal untuk barang keluar
  const filteredBarangKeluar = barangKeluar.filter((item) => {
    // Filter by search keyword
    const keywordMatch = (item.nama_barang || '')
      .toLowerCase()
      .includes(paginationKeluar.searchKeyword.toLowerCase());

    // Filter by date range if applied
    let dateMatch = true;
    if (filterKeluar.applied && (filterKeluar.startDate || filterKeluar.endDate)) {
      if (!item.tanggal) {
        // If item doesn't have a date, it doesn't match date filters
        return false;
      }

      // Normalize the item date to start of day for consistent comparison
      const itemDate = new Date(item.tanggal);
      itemDate.setHours(0, 0, 0, 0);

      if (filterKeluar.startDate && filterKeluar.endDate) {
        // Create dates at start of day for start date
        const startDate = new Date(filterKeluar.startDate);
        startDate.setHours(0, 0, 0, 0);

        // Create date at end of day for end date
        const endDate = new Date(filterKeluar.endDate);
        endDate.setHours(23, 59, 59, 999);

        dateMatch = itemDate >= startDate && itemDate <= endDate;
      } else if (filterKeluar.startDate) {
        const startDate = new Date(filterKeluar.startDate);
        startDate.setHours(0, 0, 0, 0);
        dateMatch = itemDate >= startDate;
      } else if (filterKeluar.endDate) {
        const endDate = new Date(filterKeluar.endDate);
        endDate.setHours(23, 59, 59, 999);
        dateMatch = itemDate <= endDate;
      }
    }

    return keywordMatch && dateMatch;
  });
  // Handler untuk search inventory
  const handleSearchInventory = (e) => {
    setPaginationInventory((prev) => ({
      ...prev,
      searchKeyword: e.target.value,
      currentPage: 1,
    }));
  };

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
  // Handler untuk items per page inventory
  const handleItemsPerPageInventory = (e) => {
    setPaginationInventory((prev) => ({
      ...prev,
      itemsPerPage: Number(e.target.value),
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

  // Handler untuk page change inventory
  const handlePageChangeInventory = (page) => {
    setPaginationInventory((prev) => ({
      ...prev,
      currentPage: page,
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
  // Format tanggal untuk tampilan
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "";
      }

      const options = { day: "2-digit", month: "long", year: "numeric" };
      return date.toLocaleDateString("id-ID", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };
  // Terapkan filter untuk barang masuk
  const applyFilterMasuk = () => {
    // Validate dates before applying filter
    if (filterMasuk.startDate && filterMasuk.endDate) {
      const startDate = new Date(filterMasuk.startDate);
      const endDate = new Date(filterMasuk.endDate);

      if (endDate < startDate) {
        alert("Tanggal akhir tidak boleh lebih awal dari tanggal mulai");
        return;
      }
    }

    fetchBarangMasuk(true);
  };

  // Reset filter barang masuk
  const resetFilterMasuk = () => {
    // First update the state
    setFilterMasuk({
      startDate: "",
      endDate: "",
      applied: false,
    });

    // Then fetch data without filters
    fetchBarangMasuk(false);
  };
  // Terapkan filter untuk barang keluar
  const applyFilterKeluar = () => {
    // Validate dates before applying filter
    if (filterKeluar.startDate && filterKeluar.endDate) {
      const startDate = new Date(filterKeluar.startDate);
      const endDate = new Date(filterKeluar.endDate);

      if (endDate < startDate) {
        alert("Tanggal akhir tidak boleh lebih awal dari tanggal mulai");
        return;
      }
    }

    fetchBarangKeluar(true);
  };

  // Reset filter barang keluar
  const resetFilterKeluar = () => {
    // First update the state
    setFilterKeluar({
      startDate: "",
      endDate: "",
      applied: false,
    });

    // Then fetch data without filters
    fetchBarangKeluar(false);
  };// Mengambil data barang masuk menggunakan API
  const fetchBarangMasuk = async (applyFilter = false) => {
    try {
      setLoading((prev) => ({ ...prev, masuk: true }));

      let url = "http://localhost:5000/api/barang-masuk";
      const params = new URLSearchParams();

      if (applyFilter) {
        if (filterMasuk.startDate) {
          params.append("startDate", filterMasuk.startDate);
          console.log("Adding startDate filter:", filterMasuk.startDate);
        }
        if (filterMasuk.endDate) {
          params.append("endDate", filterMasuk.endDate);
          console.log("Adding endDate filter:", filterMasuk.endDate);
        }
        setFilterMasuk((prev) => ({ ...prev, applied: true }));
      } else {
        // Reset the filter state when not applying filter
        if (filterMasuk.applied) {
          setFilterMasuk((prev) => ({ ...prev, applied: false }));
        }
      }

      const fullUrl = `${url}?${params.toString()}`;
      console.log("Fetching barang masuk with URL:", fullUrl);

      const res = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}, URL: ${fullUrl}`);
      }

      const data = await res.json();
      console.log(`Received ${data.length} barang masuk records`);

      setBarangMasuk(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching barang masuk:", error);
      alert("Terjadi kesalahan saat mengambil data barang masuk");
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
        if (filterKeluar.startDate) {
          params.append("startDate", filterKeluar.startDate);
          console.log("Adding startDate filter:", filterKeluar.startDate);
        }
        if (filterKeluar.endDate) {
          params.append("endDate", filterKeluar.endDate);
          console.log("Adding endDate filter:", filterKeluar.endDate);
        }
        setFilterKeluar((prev) => ({ ...prev, applied: true }));
      } else {
        // Reset the filter state when not applying filter
        if (filterKeluar.applied) {
          setFilterKeluar((prev) => ({ ...prev, applied: false }));
        }
      }

      const fullUrl = `${url}?${params.toString()}`;
      console.log("Fetching barang keluar with URL:", fullUrl);

      const res = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}, URL: ${fullUrl}`);
      }

      const data = await res.json();
      console.log(`Received ${data.length} barang keluar records`);

      setBarangKeluar(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching barang keluar:", error);
      alert("Terjadi kesalahan saat mengambil data barang keluar");
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
  };  // Generate dan preview PDF
  const previewPDF = async (type) => {
    try {
      // Cek apakah filter diterapkan saat mencetak laporan
      const isFiltered = type === "inventory" ? true : // Inventaris tidak memerlukan filter
        type === "masuk" ? filterMasuk.applied :
          type === "keluar" ? filterKeluar.applied : false;

      // Show custom confirmation modal if no filter is applied (except for inventory)
      if (!isFiltered && type !== "inventory") {
        setConfirmModal({
          show: true,
          type: type
        });
        return; // Wait for user response in the modal
      }

      // Continue with PDF creation
      await generatePDF(type);

    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Separate function to generate PDF after confirmation
  const generatePDF = async (type) => {
    try {
      let pdfDoc;

      if (type === "inventory") {
        pdfDoc = (
          <PDFStokBarang
            data={inventory}
            filter={{}}
          />
        );
      } else if (type === "masuk") {
        // Gunakan data yang sudah difilter untuk PDF barang masuk
        pdfDoc = (
          <PDFBarangMasuk
            data={filterMasuk.applied ? filteredBarangMasuk : barangMasuk}
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
            data={filterKeluar.applied ? filteredBarangKeluar : barangKeluar}
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
      alert("Terjadi kesalahan saat membuat PDF. Silahkan coba lagi.");
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

    let filename = 'laporan';
    if (pdfPreview.type === 'inventory') {
      filename = `laporan-stok-barang-${new Date().toLocaleDateString('id-ID')}.pdf`;
    } else {
      const type = pdfPreview.type === 'masuk' ? 'masuk' : 'keluar';
      filename = `laporan-barang-${type}-${new Date().toLocaleDateString('id-ID')}.pdf`;
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Mengambil data inventory menggunakan API
  const fetchInventory = async () => {
    try {
      setLoading((prev) => ({ ...prev, inventory: true }));

      const res = await fetch("http://localhost:5000/api/barang", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading((prev) => ({ ...prev, inventory: false }));
    }
  };
  // Load data awal saat komponen mount
  useEffect(() => {
    const loadInitialData = async () => {
      // Menggunakan Promise.all untuk memuat semua data secara paralel
      await Promise.all([
        fetchBarangMasuk(),
        fetchBarangKeluar(),
        fetchInventory()
      ]);
    };

    loadInitialData();
    // Using empty dependency array since we only want to load once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page to 1 when filter is applied for Barang Masuk
  useEffect(() => {
    if (filterMasuk.applied) {
      setPaginationMasuk(prev => ({
        ...prev,
        currentPage: 1
      }));
    }
  }, [filterMasuk.applied, filterMasuk.startDate, filterMasuk.endDate]);

  // Reset page to 1 when filter is applied for Barang Keluar
  useEffect(() => {
    if (filterKeluar.applied) {
      setPaginationKeluar(prev => ({
        ...prev,
        currentPage: 1
      }));
    }
  }, [filterKeluar.applied, filterKeluar.startDate, filterKeluar.endDate]);

  // We're now using dedicated pagination for each report type, so this old code is removed
  // const filteredItems = barangKeluar.filter((item) => {
  //   const searchMatch = item.nama_barang
  //     .toLowerCase()
  //     .includes(searchKeyword.toLowerCase());
  //   return searchMatch;
  // });

  // const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

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
                </button>                <button
                  className="btn btn-success ms-auto"
                  onClick={() => previewPDF("masuk")}
                  disabled={loading.masuk || barangMasuk.length === 0}
                >
                  <i className="bi bi-printer me-2"></i>Cetak
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
                    <thead className="table-info">
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
                              <span className="visually-hidden">Loading...</span>
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
                      </span>                      <div className="d-flex">
                        <button
                          className="btn btn-outline-primary me-1"
                          onClick={() =>
                            handlePageChangeMasuk(
                              paginationMasuk.currentPage - 1
                            )
                          }
                          disabled={paginationMasuk.currentPage === 1}
                        >
                          &lt;
                        </button>

                        {[...Array(totalPagesMasuk).keys()].slice(
                          Math.max(0, paginationMasuk.currentPage - 3),
                          Math.min(totalPagesMasuk, paginationMasuk.currentPage + 2)
                        ).map(i => (
                          <button
                            key={i + 1}
                            className={`btn ${paginationMasuk.currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                            onClick={() => handlePageChangeMasuk(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          className="btn btn-outline-primary ms-1"
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
                          &gt;
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
                </button>                <button
                  className="btn btn-success ms-auto"
                  onClick={() => previewPDF("keluar")}
                  disabled={loading.keluar || barangKeluar.length === 0}
                >
                  <i className="bi bi-printer me-2"></i>Cetak
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

            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                  <div>
                    <label className="m-3">Tampilkan:</label>
                    <select
                      className="form-select d-inline-block w-auto"
                      value={paginationKeluar.itemsPerPage}
                      onChange={handleItemsPerPageKeluar}
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
                      value={paginationKeluar.searchKeyword}
                      onChange={handleSearchKeluar}
                    />
                  </div>
                </div>

                {/* Tabel Barang Keluar */}
                <div className="mt-3 table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-info">
                      <tr>
                        <th className="text-center">No</th>
                        <th className="text-center">Tanggal</th>
                        <th className="text-center">Nama Barang</th>
                        <th className="text-center">Harga</th>
                        <th className="text-center">Jumlah</th>
                        <th className="text-center">Total Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading.keluar ? (
                        <tr>
                          <td colSpan="6" className="text-center">
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
                          <td colSpan="6" className="text-center">
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
                    </span>                    <div className="d-flex">
                      <button
                        className="btn btn-outline-primary me-1"
                        onClick={() =>
                          handlePageChangeKeluar(
                            paginationKeluar.currentPage - 1
                          )
                        }
                        disabled={paginationKeluar.currentPage === 1}
                      >
                        &lt;
                      </button>

                      {[...Array(totalPagesKeluar).keys()].slice(
                        Math.max(0, paginationKeluar.currentPage - 3),
                        Math.min(totalPagesKeluar, paginationKeluar.currentPage + 2)
                      ).map(i => (
                        <button
                          key={i + 1}
                          className={`btn ${paginationKeluar.currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                          onClick={() => handlePageChangeKeluar(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        className="btn btn-outline-primary ms-1"
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
                        &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr></hr>            <h5 className="mb-3">Laporan Stok Barang</h5>

            {/* Button for Inventory Report */}
            <div className="row g-3 mb-3">
              <div className="col-md-12">                <button
                className="btn btn-success"
                onClick={() => previewPDF("inventory")}
                disabled={loading.inventory || inventory.length === 0}
              >
                <i className="bi bi-printer me-2"></i>Cetak
              </button>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                  <div>
                    <label className="m-3">Tampilkan:</label>
                    <select
                      className="form-select d-inline-block w-auto"
                      value={paginationInventory.itemsPerPage}
                      onChange={handleItemsPerPageInventory}
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
                      value={paginationInventory.searchKeyword}
                      onChange={handleSearchInventory}
                    />
                  </div>
                </div>
                {/* Tabel Inventory */}
                <div className="mt-3 table-responsive">
                  <table className="table table-bordered">                    <thead className="table-info">
                    <tr>
                      <th className="text-center">No</th>
                      <th className="text-center">Nama Barang</th>
                      <th className="text-center">Kategori</th>
                      <th className="text-center">Harga</th>
                      <th className="text-center">Stok</th>
                    </tr>
                  </thead>
                    <tbody>
                      {loading.inventory ? (
                        <tr>
                          <td colSpan="5" className="text-center">
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
                      ) : currentInventory.length > 0 ? (
                        currentInventory.map((item, index) => (
                          <tr key={`inventory-${item.id}`}>
                            <td className="text-center">
                              {startIndexInventory + index + 1}
                            </td>                            <td>{item.nama_barang || item.nama}</td>
                            <td>{item.kategori}</td>
                            <td className="text-end">{formatCurrency(item.harga)}</td>
                            <td className="text-center">{item.stok || 0}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            {paginationInventory.searchKeyword
                              ? "Tidak ditemukan barang dengan nama tersebut"
                              : "Tidak ada data"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {/* Pagination Inventory */}
                  {filteredInventory.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center m-3">
                      <span>
                        Menampilkan {startIndexInventory + 1}-
                        {Math.min(endIndexInventory, filteredInventory.length)}{" "}
                        dari {filteredInventory.length} item
                      </span>                      <div className="d-flex">
                        <button
                          className="btn btn-outline-primary me-1"
                          onClick={() =>
                            handlePageChangeInventory(
                              paginationInventory.currentPage - 1
                            )
                          }
                          disabled={paginationInventory.currentPage === 1}
                        >
                          &lt;
                        </button>

                        {[...Array(totalPagesInventory).keys()].slice(
                          Math.max(0, paginationInventory.currentPage - 3),
                          Math.min(totalPagesInventory, paginationInventory.currentPage + 2)
                        ).map(i => (
                          <button
                            key={i + 1}
                            className={`btn ${paginationInventory.currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                            onClick={() => handlePageChangeInventory(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          className="btn btn-outline-primary ms-1"
                          onClick={() =>
                            handlePageChangeInventory(
                              paginationInventory.currentPage + 1
                            )
                          }
                          disabled={
                            paginationInventory.currentPage === totalPagesInventory ||
                            totalPagesInventory === 0
                          }
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
                  {pdfPreview.type === "inventory"
                    ? "Preview Laporan Stok Barang"
                    : `Preview Laporan Barang ${pdfPreview.type === "masuk" ? "Masuk" : "Keluar"}`}
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

      {/* Modal Konfirmasi */}
      {confirmModal.show && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Cetak</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmModal({ show: false, type: "" })}
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin mencetak semua data?</p>
                <p className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Data yang dicetak akan menampilkan seluruh data tanpa filter.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setConfirmModal({ show: false, type: "" });
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    const type = confirmModal.type;
                    setConfirmModal({ show: false, type: "" });
                    generatePDF(type);
                  }}
                >
                  Cetak
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
