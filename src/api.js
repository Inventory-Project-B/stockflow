// api.js — versi tanpa backend & login

// Fungsi dummy untuk login (langsung berhasil)
export const login = async (credentials) => {
  return {
    user: {
      username: credentials.username,
    },
    token: "dummy-token",
  };
};

// Fungsi dummy untuk logout
export const logout = async () => {
  return { message: "Logged out successfully" };
};

