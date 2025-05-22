// api.js — versi tanpa backend & login

import axios from "axios";

// API pada aplikasi StokFlow Inventory Management System
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ganti dengan endpoint API Anda
});

// Fungsi untuk login
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};


// Fungsi dummy untuk login (langsung berhasil)
// export const login = async (credentials) => {
//   return {
//     user: {
//       username: credentials.username,
//     },
//     token: "dummy-token",
//   };
// };

// Fungsi dummy untuk logout
export const logout = async () => {
  return { message: "Logged out successfully" };
};




