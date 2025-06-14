import axios from "axios";

// API pada aplikasi StokFlow Inventory Management System
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ganti dengan endpoint API Anda
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Fungsi untuk login
export const login = async (credentials) => {
  console.log("API login called with:", credentials);
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("API login response:", response);
    return response.data;
  } catch (error) {
    console.error("API login error:", error);
    console.error("Request that caused error:", {
      url: "/auth/login",
      data: credentials,
      headers: api.defaults.headers
    });
    throw error;
  }
};

// Fungsi untuk logout
export const logout = async (token) => {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Fungsi untuk mendapatkan data inventory
export const getInventory = async (token) => {
  try {
    const response = await api.get("/barang", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Ensure we're returning an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
};

// Fungsi untuk mendapatkan data barang masuk
export const getBarangMasuk = async (token) => {
  try {
    const response = await api.get("/barang-masuk", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Ensure we're returning an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching barang masuk data:", error);
    return [];
  }
};

// Fungsi untuk mendapatkan data barang keluar
export const getBarangKeluar = async (token) => {
  try {
    const response = await api.get("/barang-keluar", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Ensure we're returning an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching barang keluar data:", error);
    return [];
  }
};
