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
  const [selectedMasukKategori, setSelectedMasukKategori] = useState("");
  const [selectedKeluarKategori, setSelectedKeluarKategori] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const token = localStorage.getItem("token");

  // Calculate totals
  // const totalBarang = inventory.reduce((sum, item) => sum + item.jumlah, 0);
  // const totalBarangMasuk = barangMasuk.reduce(
  //   (sum, item) => sum + item.jumlah,
  //   0
  // );
  // const totalBarangKeluar = barangKeluar.reduce(
  //   (sum, item) => sum + item.jumlah,
  //   0
  // );

  // Fungsi untuk mengelompokkan data per bulan
  const groupDataByMonth = (data, type) => {
    const groupedData = {};
    data.forEach((item) => {
      const date = new Date(item.tanggal);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!groupedData[monthYear]) groupedData[monthYear] = 0;
      groupedData[monthYear] += item.jumlah;
    });
    return groupedData;
  };

  // Get unique months for filter
  const getUniqueMonths = (data) => {
    const months = new Set();
    data.forEach((item) => {
      const date = new Date(item.tanggal);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      months.add(monthYear);
    });
    return Array.from(months).sort();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataInventory = await getInventory(token);
        const dataBarangMasuk = await getBarangMasuk(token);
        const dataBarangKeluar = await getBarangKeluar(token);

        setInventory(dataInventory);
        setBarangMasuk(dataBarangMasuk);
        setBarangKeluar(dataBarangKeluar);

        // Ambil kategori unik dari inventory
        const uniqueCategories = [
          ...new Set(dataInventory.map((item) => item.kategori)),
        ];
        setCategories(uniqueCategories);

        // Kelompokkan data per bulan
        const groupedDataMasuk = groupDataByMonth(dataBarangMasuk, "masuk");
        const groupedDataKeluar = groupDataByMonth(dataBarangKeluar, "keluar");

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
  }, [token]);

  // Filter data sesuai dropdown
  const filteredKeluar = selectedKeluarFilter
    ? barangKeluar.filter((item) => item.tujuan === selectedKeluarFilter)
    : barangKeluar;

  const filteredMasukByKategori = selectedMasukKategori
    ? barangMasuk.filter((item) => item.kategori === selectedMasukKategori)
    : barangMasuk;

  const filteredKeluarByKategori = selectedKeluarKategori
    ? barangKeluar.filter((item) => item.kategori === selectedKeluarKategori)
    : barangKeluar;

  // Filter by month if selected
  const filteredByMonth = selectedMonth
    ? {
        masuk: barangMasuk.filter(
          (item) =>
            new Date(item.tanggal).toISOString().slice(0, 7) === selectedMonth
        ),
        keluar: barangKeluar.filter(
          (item) =>
            new Date(item.tanggal).toISOString().slice(0, 7) === selectedMonth
        ),
      }
    : { masuk: barangMasuk, keluar: barangKeluar };

  // Format data untuk chart setelah filter dan group by bulan
  const prepareChartData = (data) => {
    const grouped = groupDataByMonth(data);
    return Object.keys(grouped).map((month) => ({
      tanggal: month,
      jumlah: grouped[month],
    }));
  };

  // Hitung total barang, barang masuk, dan barang keluar
  const totalBarang = inventory.length;
  const totalBarangMasuk = barangMasuk.reduce(
    (total, item) => total + item.jumlah,
    0
  );
  const totalBarangKeluar = barangKeluar.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  // Get unique months for filter dropdown
  const uniqueMonths = getUniqueMonths([...barangMasuk, ...barangKeluar]);

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
                    {/* <i className="bi bi-boxes bg-warning p-3 rounded-end-circle display-5 me-3"></i> */}
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
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Semua Bulan</option>
                      {uniqueMonths.map((month, idx) => (
                        <option key={idx} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="card-body">
                    <BarangChart
                      data={prepareChartData(barangMasuk)}
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
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">Semua Bulan</option>
                      {uniqueMonths.map((month, idx) => (
                        <option key={idx} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="card-body">
                    <BarangChart
                      data={prepareChartData(filteredKeluar)}
                      title="Barang Keluar"
                      backgroundColor="rgba(255, 99, 132, 0.6)"
                      borderColor="rgba(255, 99, 132, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              {/* Diagram 3: Barang Masuk per Kategori */}
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
                      data={prepareChartData(filteredMasukByKategori)}
                      title="Barang Masuk per Kategori"
                      backgroundColor="rgba(54, 162, 235, 0.6)"
                      borderColor="rgba(54, 162, 235, 1)"
                    />
                  </div>
                </div>
              </div>

              {/* Diagram 4: Barang Keluar per Kategori */}
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
                      data={prepareChartData(filteredKeluarByKategori)}
                      title="Barang Keluar per Kategori"
                      backgroundColor="rgba(255, 206, 86, 0.6)"
                      borderColor="rgba(255, 206, 86, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
