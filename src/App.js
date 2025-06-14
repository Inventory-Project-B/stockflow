import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import BarangMasuk from "./pages/BarangMasuk";
import BarangKeluar from "./pages/BarangKeluar";
import ProtectedRoute from "./pages/ProtectedRoute"; // Import ProtectedRoute
import Laporan from "./pages/Laporan"; // Import Laporan page
import Profile from "./pages/Profile"; // Import Profile page




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Hanya bisa diakses jika sudah login */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/barang" element={<ProtectedRoute element={<Barang />} />} />
        <Route path="/barang-masuk" element={<ProtectedRoute element={<BarangMasuk />} />} />
        <Route path="/barang-keluar" element={<ProtectedRoute element={<BarangKeluar />} />} />
        <Route path="/laporan" element={<ProtectedRoute element={<Laporan/>} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile/>} />} />
        

        {/* Not Found Page */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
