// Versi Garis

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register komponen Chart.js untuk line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 3,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3, // Memberikan sedikit kurva pada garis
        fill: false,
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
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hilangkan garis grid pada sumbu X
        },
        title: {
          display: true,
          text: "Bulan",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        grid: {
          color: "#eee", // Warna grid lebih soft
          drawBorder: false,
        },
        title: {
          display: true,
          text: "Jumlah",
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
    elements: {
      line: {
        borderJoinStyle: 'round' // Membuat garis lebih smooth
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export default BarangChart;