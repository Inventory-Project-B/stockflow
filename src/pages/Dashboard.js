import React, { useEffect, useState } from "react";
import BarangChart from "../components/BarangChart";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Fungsi-fungsi dummy untuk menggantikan API
const getDummyInventory = () => {
  return [
    { id: 1, nama: "Laptop", kategori: "Elektronik", jumlah: 15 },
    { id: 2, nama: "Meja", kategori: "Furniture", jumlah: 20 },
    { id: 3, nama: "Printer", kategori: "Elektronik", jumlah: 8 },
    { id: 4, nama: "Kursi", kategori: "Furniture", jumlah: 25 },
    { id: 5, nama: "Proyektor", kategori: "Elektronik", jumlah: 5 },
  ];
};

const getDummyBarangMasuk = () => {
  // Data untuk 6 bulan terakhir
  const categories = ["Elektronik", "Furniture", "Alat Tulis"];
  const data = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));

    data.push({
      id: i + 1,
      nama: `Barang Masuk ${i + 1}`,
      kategori: categories[Math.floor(Math.random() * categories.length)],
      jumlah: Math.floor(Math.random() * 20) + 1,
      tanggal: date.toISOString().split("T")[0],
    });
  }

  return data;
};

const getDummyBarangKeluar = () => {
  // Data untuk 6 bulan terakhir
  const categories = ["Elektronik", "Furniture", "Alat Tulis"];
  const data = [];

  for (let i = 0; i < 25; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));

    data.push({
      id: i + 1,
      nama: `Barang Keluar ${i + 1}`,
      kategori: categories[Math.floor(Math.random() * categories.length)],
      jumlah: Math.floor(Math.random() * 15) + 1,
      tanggal: date.toISOString().split("T")[0],
    });
  }

  return data;
};

function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [chartDataMasuk, setChartDataMasuk] = useState([]);
  const [chartDataKeluar, setChartDataKeluar] = useState([]);
  const [chartKategoriMasuk, setChartKategoriMasuk] = useState([]);
  const [chartKategoriKeluar, setChartKategoriKeluar] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gunakan fungsi dummy sebagai pengganti API
        const dataInventory = getDummyInventory();
        const dataBarangMasuk = getDummyBarangMasuk();
        const dataBarangKeluar = getDummyBarangKeluar();

        setInventory(dataInventory);
        setBarangMasuk(dataBarangMasuk);
        setBarangKeluar(dataBarangKeluar);

        const groupedDataMasuk = groupDataByMonth(dataBarangMasuk);
        const groupedDataKeluar = groupDataByMonth(dataBarangKeluar);

        const chartDataMasukFormatted = Object.keys(groupedDataMasuk).map(
          (month) => ({ tanggal: month, jumlah: groupedDataMasuk[month] })
        );
        const chartDataKeluarFormatted = Object.keys(groupedDataKeluar).map(
          (month) => ({ tanggal: month, jumlah: groupedDataKeluar[month] })
        );

        setChartDataMasuk(chartDataMasukFormatted);
        setChartDataKeluar(chartDataKeluarFormatted);

        // Group by category
        const groupedKategoriMasuk = groupDataByCategory(dataBarangMasuk);
        const groupedKategoriKeluar = groupDataByCategory(dataBarangKeluar);

        const chartKategoriMasukFormatted = Object.keys(
          groupedKategoriMasuk
        ).map((kategori) => ({
          kategori,
          jumlah: groupedKategoriMasuk[kategori],
        }));
        const chartKategoriKeluarFormatted = Object.keys(
          groupedKategoriKeluar
        ).map((kategori) => ({
          kategori,
          jumlah: groupedKategoriKeluar[kategori],
        }));

        setChartKategoriMasuk(chartKategoriMasukFormatted);
        setChartKategoriKeluar(chartKategoriKeluarFormatted);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Fungsi-fungsi helper tetap sama
  const groupDataByMonth = (data) => {
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

  const groupDataByCategory = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const kategori = item.kategori || "Lainnya";
      if (!grouped[kategori]) grouped[kategori] = 0;
      grouped[kategori] += item.jumlah;
    });
    return grouped;
  };

  const totalBarang = inventory.length;
  const totalBarangMasuk = barangMasuk.reduce(
    (total, item) => total + item.jumlah,
    0
  );
  const totalBarangKeluar = barangKeluar.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  // Render tetap sama
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />
          <div className="card p-3 mt-3 bg-light vh-100 border-0">
            <h2 className="mb-4">DASHBOARD</h2>
            <div className="row">
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
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartDataMasuk}
                      title="Barang Masuk per Bulan"
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
                      title="Barang Keluar per Bulan"
                      backgroundColor="rgba(255, 99, 132, 0.6)"
                      borderColor="rgba(255, 99, 132, 1)"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartKategoriMasuk}
                      title="Barang Masuk per Kategori"
                      backgroundColor="rgba(153, 102, 255, 0.6)"
                      borderColor="rgba(153, 102, 255, 1)"
                      labelKey="kategori"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartKategoriKeluar}
                      title="Barang Keluar per Kategori"
                      backgroundColor="rgba(255, 206, 86, 0.6)"
                      borderColor="rgba(255, 206, 86, 1)"
                      labelKey="kategori"
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
