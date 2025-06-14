import React, { useEffect, useState } from "react";
import { getInventory, getBarangMasuk, getBarangKeluar } from "../api";
import BarangChart from "../components/BarangChart";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chartDataMasuk, setChartDataMasuk] = useState([]);
  const [chartDataKeluar, setChartDataKeluar] = useState([]);

  // Dropdown states
  const [selectedKeluarFilter, setSelectedKeluarFilter] = useState("");
  const [selectedMonthMasuk, setSelectedMonthMasuk] = useState("");
  const [selectedMonthKeluar, setSelectedMonthKeluar] = useState("");

  const token = localStorage.getItem("token");

  // Nama bulan dalam bahasa Indonesia
  const namabulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Fungsi untuk mengelompokkan data per bulan
  const groupDataByMonth = (data) => {
    const groupedData = {};
    if (!Array.isArray(data)) {
      console.warn("Data is not an array in groupDataByMonth:", data);
      return groupedData;
    }

    data.forEach((item) => {
      if (!item || !item.tanggal) return;
      try {
        const date = new Date(item.tanggal);
        if (isNaN(date.getTime())) return; // Skip invalid dates

        const month = date.getMonth(); // 0-11 (Jan-Des)
        const monthName = namabulan[month];

        if (!groupedData[monthName]) groupedData[monthName] = 0;
        groupedData[monthName] += item.jumlah || 0;
      } catch (err) {
        console.error("Error processing item in groupDataByMonth:", err, item);
      }
    });
    return groupedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataInventory = await getInventory(token);
        const dataBarangMasuk = await getBarangMasuk(token);
        const dataBarangKeluar = await getBarangKeluar(token);

        console.log("Fetched data:", {
          inventory: dataInventory,
          barangMasuk: dataBarangMasuk,
          barangKeluar: dataBarangKeluar
        });

        // Ensure we have array data before setting state
        setInventory(Array.isArray(dataInventory) ? dataInventory : []);
        setBarangMasuk(Array.isArray(dataBarangMasuk) ? dataBarangMasuk : []);
        setBarangKeluar(Array.isArray(dataBarangKeluar) ? dataBarangKeluar : []);

        // Ambil kategori unik dari inventory
        const uniqueCategories = [
          ...new Set(dataInventory.map((item) => item.kategori)),
        ];
        setCategories(uniqueCategories);

        // Kelompokkan data per bulan
        const groupedDataMasuk = groupDataByMonth(dataBarangMasuk);
        const groupedDataKeluar = groupDataByMonth(dataBarangKeluar);

        // Format data untuk chart barang masuk
        const chartDataMasukFormatted = Object.keys(groupedDataMasuk).map(
          (month) => ({
            tanggal: month,
            jumlah: groupedDataMasuk[month],
          })
        );

        // Format data untuk chart barang keluar
        const chartDataKeluarFormatted = Object.keys(groupedDataKeluar).map(
          (month) => ({
            tanggal: month,
            jumlah: groupedDataKeluar[month],
          })
        );

        setChartDataMasuk(chartDataMasukFormatted);
        setChartDataKeluar(chartDataKeluarFormatted);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Filter data sesuai dropdown
  const filteredKeluar = selectedKeluarFilter && Array.isArray(barangKeluar)
    ? barangKeluar.filter((item) => item && item.tujuan === selectedKeluarFilter)
    : Array.isArray(barangKeluar) ? barangKeluar : [];

  // Filter data based on selected month
  const filterDataByMonth = (data, selectedMonth) => {
    if (!selectedMonth || !Array.isArray(data)) return data;
    return data.filter(item => {
      try {
        if (!item || !item.tanggal) return false;
        const date = new Date(item.tanggal);
        const monthName = namabulan[date.getMonth()];
        return monthName === selectedMonth;
      } catch (err) {
        console.error("Error filtering by month:", err);
        return false;
      }
    });
  };

  // Format data untuk chart setelah filter dan group by bulan
  const prepareChartData = (data, selectedMonth) => {
    if (!Array.isArray(data)) {
      console.warn("Data is not an array in prepareChartData:", data);
      return [];
    }

    // Jika bulan tertentu dipilih, tampilkan data per tanggal dalam bulan tersebut
    if (selectedMonth) {
      // Kelompokkan data per tanggal di bulan yang dipilih
      const groupedByDate = {};

      data.forEach(item => {
        if (!item || !item.tanggal) return;
        try {
          const date = new Date(item.tanggal);
          if (isNaN(date.getTime())) return; // Skip invalid dates

          // Format tanggal sebagai "Jun-9", "Jun-10", dsb
          const monthShort = date.toLocaleString('id-ID', { month: 'short' });
          const day = date.getDate();
          const dateKey = `${monthShort}-${day}`;

          if (!groupedByDate[dateKey]) groupedByDate[dateKey] = 0;
          groupedByDate[dateKey] += item.jumlah || 0;
        } catch (err) {
          console.error("Error processing item in prepareChartData:", err, item);
        }
      });

      // Urutkan tanggal
      const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
        // Mengekstrak angka hari dari format "Jun-9"
        const dayA = parseInt(a.split('-')[1]);
        const dayB = parseInt(b.split('-')[1]);
        return dayA - dayB;
      });

      return sortedDates.map(date => ({
        tanggal: date,
        jumlah: groupedByDate[date]
      }));
    } else {
      // Jika tidak ada bulan yang dipilih, tampilkan data per bulan (seperti sebelumnya)
      const grouped = groupDataByMonth(data);

      // Pastikan semua bulan ada dengan nilai 0 jika tidak ada data
      const result = [];
      namabulan.forEach(bulan => {
        result.push({
          tanggal: bulan,
          jumlah: grouped[bulan] || 0
        });
      });

      return result;
    }
  };

  // Hitung total barang, barang masuk, dan barang keluar
  const totalBarang = Array.isArray(inventory) ? inventory.length : 0;
  const totalBarangMasuk = Array.isArray(barangMasuk)
    ? barangMasuk.reduce((total, item) => total + (item.jumlah || 0), 0)
    : 0;
  const totalBarangKeluar = Array.isArray(barangKeluar)
    ? barangKeluar.reduce((total, item) => total + (item.jumlah || 0), 0)
    : 0;

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />
          <div className="card p-3 mt-3 bg-light vh-auto border-0">
            <h2 className="mb-4">DASHBOARD</h2>

            {/* Card Informasi */}
            <div className="row">
              {/* Card Total Barang */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img
                      className="me-3"
                      src="/DB.png"
                      alt="Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="ms-3">
                      <h6 className="card-title text-uppercase fw-bold">
                        Data Barang
                      </h6>
                      <p className="card-text display-5 fw-bold">
                        {totalBarang}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Total Barang Masuk */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img
                      className="me-3"
                      src="/BM.png"
                      alt="Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="ms-3">
                      <h6 className="card-title text-uppercase fw-bold">
                        Barang Masuk
                      </h6>
                      <p className="card-text display-5 fw-bold">
                        {totalBarangMasuk}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Total Barang Keluar */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img
                      className="me-3"
                      src="/BK.png"
                      alt="Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="ms-3">
                      <h6 className="card-title text-uppercase fw-bold">
                        Barang Keluar
                      </h6>
                      <p className="card-text display-5 fw-bold">
                        {totalBarangKeluar}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              {/* Diagram 1: Barang Masuk per Bulan */}
              <div className="col-md-6 mb-4">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Barang Masuk (Total)</h5>
                    <select
                      className="form-select w-auto"
                      value={selectedMonthMasuk}
                      onChange={(e) => setSelectedMonthMasuk(e.target.value)}
                    >
                      <option value="">Semua Bulan</option>
                      {namabulan.map((month, idx) => (
                        <option key={idx} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="card-body">
                    <BarangChart
                      data={prepareChartData(filterDataByMonth(barangMasuk, selectedMonthMasuk), selectedMonthMasuk)}
                      title="Barang Masuk"
                      backgroundColor="rgba(75, 192, 192, 0.6)"
                      borderColor="rgba(75, 192, 192, 1)"
                    />
                  </div>
                </div>
              </div>

              {/* Diagram 2: Barang Keluar */}
              <div className="col-md-6 mb-4">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Barang Keluar</h5>
                    <select
                      className="form-select w-auto"
                      value={selectedMonthKeluar}
                      onChange={(e) => setSelectedMonthKeluar(e.target.value)}
                    >
                      <option value="">Semua Bulan</option>
                      {namabulan.map((month, idx) => (
                        <option key={idx} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="card-body">
                    <BarangChart
                      data={prepareChartData(filterDataByMonth(filteredKeluar, selectedMonthKeluar), selectedMonthKeluar)}
                      title="Barang Keluar"
                      backgroundColor="rgba(255, 99, 132, 0.6)"
                      borderColor="rgba(255, 99, 132, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION DIKOMENTARI: Bagian chart barang masuk dan keluar per kategori */}
            {/* 
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Barang Masuk per Kategori</h5>
                    <select
                      className="form-select w-auto"
                      value={selectedMasukKategori}
                      onChange={(e) => setSelectedMasukKategori(e.target.value)}
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="card-body">
                    <BarangChart
                      data={prepareChartData(filterDataByMonth(filteredMasukByKategori))}
                      title="Barang Masuk per Kategori"
                      backgroundColor="rgba(54, 162, 235, 0.6)"
                      borderColor="rgba(54, 162, 235, 1)"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Barang Keluar per Kategori</h5>
                    <select
                      className="form-select w-auto"
                      value={selectedKeluarKategori}
                      onChange={(e) =>
                        setSelectedKeluarKategori(e.target.value)
                      }
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="card-body">
                    <BarangChart
                      data={prepareChartData(filterDataByMonth(filteredKeluarByKategori))}
                      title="Barang Keluar per Kategori"
                      backgroundColor="rgba(255, 206, 86, 0.6)"
                      borderColor="rgba(255, 206, 86, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
