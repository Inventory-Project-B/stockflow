import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Daftar bulan dari Januari sampai Desember
const bulanLabels = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

function BarangChart({ data, title, backgroundColor, borderColor }) {
  // Buat objek dengan nilai default 0 untuk semua bulan
  const dataByMonth = bulanLabels.reduce((acc, bulan) => {
    acc[bulan] = 0;
    return acc;
  }, {});

  // Isi data dari API ke dalam objek dataByMonth
  data.forEach((item) => {
    const bulanIndex = new Date(item.tanggal).getMonth(); // Ambil bulan dari tanggal (0-11)
    const bulanNama = bulanLabels[bulanIndex]; // Konversi ke nama bulan
    if (bulanNama) {
      dataByMonth[bulanNama] = item.jumlah;
    }
  });

  // Buat dataset untuk chart
  const chartData = {
    labels: bulanLabels,
    datasets: [
      {
        label: title,
        data: bulanLabels.map((bulan) => dataByMonth[bulan]), // Data sesuai urutan bulan
        backgroundColor: backgroundColor + "80", // Tambah transparansi 50%
        borderColor: borderColor,
        borderWidth: 2,
        hoverBackgroundColor: borderColor,
        hoverBorderColor: "#000",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Sembunyikan legend untuk tampilan lebih bersih
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
        padding: 10,
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 5,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hilangkan garis grid pada sumbu X
        },
        title: {
          display: true,
          text: "",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        grid: {
          color: "#ddd", // Warna grid lebih soft
        },
        title: {
          display: true,
          text: "",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 10, // Jarak antar nilai di sumbu Y
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default BarangChart;


