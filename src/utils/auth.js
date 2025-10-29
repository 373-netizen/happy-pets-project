// src/utils/auth.js

// ✅ Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token; // returns true if token exists, false if not
};

// 🚪 Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
};
