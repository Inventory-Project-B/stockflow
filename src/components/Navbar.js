import React, { useEffect, useState } from "react";
import Logout from "./Logout";
import { Link, useNavigate } from "react-router-dom"; // Pastikan sudah install react-router-dom
import axios from 'axios';

const Navbar = () => {
  const [namaUser, setNamaUser] = useState("");
  const [userData, setUserData] = useState({
    nama: '',
    username: '',
    email: '',
    role: '',
    foto_profil: '',
    previewFoto: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { foto_profil, nama, username, email, role } = response.data;

        // Set state with user data from the API response
        setUserData({
          nama,
          username,
          email,
          role,
          foto_profil,
          previewFoto: foto_profil 
            ? foto_profil.startsWith('http') 
              ? foto_profil 
              : `http://localhost:5000${foto_profil.startsWith('/') ? '' : '/'}${foto_profil}` 
            : ''
        });

        setNamaUser(nama || 'User'); // Set the name of the user
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // Handle error gracefully (e.g. show an error message)
      }
    };

    fetchProfile();
  }, [navigate]); // Dependency array to ensure this runs once when the component is mounted

  return (
    <nav className="navbar navbar-expand-lg navbar-light px-4 shadow-sm">
      <div className="container">
        
        {/* Menu Navbar */}
        <div className="collapse navbar-collapse justify-content-end me-2">
          <ul className="navbar-nav align-items-center">
            {/* Nama Admin dengan Dropdown */}
            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-link d-flex align-items-center"
              >
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                     style={{ width: '40px', height: '40px' }}>
                  {userData.previewFoto ? (
                    <img 
                      src={userData.previewFoto} 
                      alt="Profile" 
                      className="rounded-circle w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.src = 'http://localhost:5000/uploads/profile/default.png'; // Default photo if error
                      }}
                    />
                  ) : (
                    <span className="fs-1 text-primary">
                      {userData.nama?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span className="fw-semibold me-1">{namaUser || "Error"}</span>
              </Link>
            </li>
          </ul>

          {/* Import tombol logout */}
          <Logout className="dropdown-item" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
