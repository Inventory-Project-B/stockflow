import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Ambil path saat ini

  // Daftar menu sidebar
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "bi-columns-gap" },
    { name: "Data Barang", path: "/barang", icon: "bi-box" },
    { name: "Barang Masuk", path: "/barang-masuk", icon: "bi-box-arrow-down-right" },
    { name: "Barang Keluar", path: "/barang-keluar", icon: "bi-box-arrow-up-right" },
    { name: "Laporan", path: "/laporan", icon: "bi-exclamation-octagon" },
  ];

  return (
    <div className="col-md-2 p-2 vh-100">
      <h3 className="mb-4 text-center mt-3 d-flex justify-content-center align-items-center gap-2">
        <img src="/logo.png" alt="Logo" style={{ width: "30px", height: "30px" }} />
        <span style={{color: '#7E3AF2'}} >Stock</span>Flow
      </h3>

      <ul className="nav flex-column">
        {menuItems.map((item, index) => (
          <NavLink
          to={item.path}
          className="nav-link font-weight-bold rounded"
          style={({ isActive }) => ({
            color: isActive ? '#7E3AF2' : '#212529',
            backgroundColor: isActive ? '#e5d9fa' : 'transparent',
          })}
          end
        >
          <i className={`bi ${item.icon} me-2`}></i> {item.name}
        </NavLink>
        
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
