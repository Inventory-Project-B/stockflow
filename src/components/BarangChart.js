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
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Versi singkat untuk label chart
const bulanSingkat = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
];

function BarangChart({ data, title, backgroundColor, borderColor }) {
  // Data sudah diformat di Dashboard.js
  const dataByLabel = {};
  const chartLabels = [];

  // Ambil data dari props
  data.forEach((item) => {
    if (item.tanggal && item.jumlah !== undefined) {
      dataByLabel[item.tanggal] = item.jumlah;
      // Tambahkan label ke array jika belum ada
      if (!chartLabels.includes(item.tanggal)) {
        chartLabels.push(item.tanggal);
      }
    }
  });

  // Tentukan labels berdasarkan data yang diterima
  // Jika formatnya seperti "Jun-9", gunakan labels dari data
  // Jika formatnya adalah nama bulan penuh, gunakan bulanSingkat
  const isDateFormat = chartLabels.length > 0 && chartLabels[0].includes('-');
  const labels = isDateFormat ? chartLabels : bulanSingkat;

  // Buat dataset untuk chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: isDateFormat
          ? labels.map(label => dataByLabel[label] || 0)
          : bulanLabels.map((bulan) => dataByLabel[bulan] || 0), // Data sesuai urutan bulan
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


