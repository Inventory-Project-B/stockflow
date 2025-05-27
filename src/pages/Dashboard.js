import React, { useEffect, useState } from "react";
import BarangChart from "../components/BarangChart";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [chartDataMasuk, setChartDataMasuk] = useState([]);
  const [chartDataKeluar, setChartDataKeluar] = useState([]);

  useEffect(() => {
    // Dummy data
    const dummyInventory = [
      { id: 1, nama: "Keyboard" },
      { id: 2, nama: "Mouse" },
      { id: 3, nama: "Monitor" },
    ];

    const dummyBarangMasuk = [
      { id: 1, tanggal: "2025-01-15", jumlah: 5 },
      { id: 2, tanggal: "2025-02-10", jumlah: 8 },
      { id: 3, tanggal: "2025-02-20", jumlah: 3 },
    ];

    const dummyBarangKeluar = [
      { id: 1, tanggal: "2025-01-18", jumlah: 2 },
      { id: 2, tanggal: "2025-02-15", jumlah: 4 },
    ];

    setInventory(dummyInventory);
    setBarangMasuk(dummyBarangMasuk);
    setBarangKeluar(dummyBarangKeluar);

    // Kelompokkan data per bulan
    const groupedDataMasuk = groupDataByMonth(dummyBarangMasuk);
    const groupedDataKeluar = groupDataByMonth(dummyBarangKeluar);

    // Format data untuk chart
    const chartDataMasukFormatted = Object.keys(groupedDataMasuk).map(month => ({
      tanggal: month,
      jumlah: groupedDataMasuk[month],
    }));

    const chartDataKeluarFormatted = Object.keys(groupedDataKeluar).map(month => ({
      tanggal: month,
      jumlah: groupedDataKeluar[month],
    }));

    setChartDataMasuk(chartDataMasukFormatted);
    setChartDataKeluar(chartDataKeluarFormatted);
  }, []);

  const groupDataByMonth = (data) => {
    const grouped = {};
    data.forEach(item => {
      const date = new Date(item.tanggal);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      grouped[monthYear] = (grouped[monthYear] || 0) + item.jumlah;
    });
    return grouped;
  };

  const totalBarang = inventory.length;
  const totalBarangMasuk = barangMasuk.reduce((total, item) => total + item.jumlah, 0);
  const totalBarangKeluar = barangKeluar.reduce((total, item) => total + item.jumlah, 0);

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />
          <div className="card p-3 mt-3 bg-light vh-100 border-0">
            <h2 className="mb-4">DASHBOARD</h2>
            <div className="row">
              {/* Total Barang */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img src="/DB.png" alt="Logo" className="me-3" style={{ width: "40px" }} />
                    <div className="ms-3">
                      <h6 className="text-uppercase fw-bold">Data Barang</h6>
                      <p className="display-5 fw-bold">{totalBarang}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barang Masuk */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img src="/BM.png" alt="Logo" className="me-3" style={{ width: "40px" }} />
                    <div className="ms-3">
                      <h6 className="text-uppercase fw-bold">Barang Masuk</h6>
                      <p className="display-5 fw-bold">{totalBarangMasuk}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barang Keluar */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img src="/BK.png" alt="Logo" className="me-3" style={{ width: "40px" }} />
                    <div className="ms-3">
                      <h6 className="text-uppercase fw-bold">Barang Keluar</h6>
                      <p className="display-5 fw-bold">{totalBarangKeluar}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartDataMasuk}
                      title="Barang Masuk"
                      backgroundColor="rgba(75, 192, 192, 0.6)"
                      borderColor="rgba(75, 192, 192, 1)"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartDataKeluar}
                      title="Barang Keluar"
                      backgroundColor="rgba(255, 99, 132, 0.6)"
                      borderColor="rgba(255, 99, 132, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>

             <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartDataMasuk}
                      title="Barang Masuk dari Supplier per Kategori"
                      backgroundColor="rgba(0, 30, 255, 0.6)"
                      borderColor="rgba(0, 30, 255, 0.6)"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartDataKeluar}
                      title="Barang Keluar Terjual per Kategori"
                      backgroundColor="rgba(255, 140, 0, 0.6)"
                      borderColor="rgba(255, 140, 0, 0.6)"
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
