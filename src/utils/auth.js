// src/utils/auth.js
// Centralized storage helpers + instant-sync event

const USER_KEY = "user";
const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";
const USER_UPDATED_EVENT = "userUpdated";

export const saveTokens = (access, refresh, remember = true) => {
  if (remember) {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  } else {
    if (access) sessionStorage.setItem(ACCESS_KEY, access);
    if (refresh) sessionStorage.setItem(REFRESH_KEY, refresh);
  }
  // tokens changed -> notify
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
};

export const saveUser = (userData) => {
  if (!userData) return;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const BACKEND_BASE = API_BASE.replace("/api", "");

  // Merge with existing user first
  const existing = getUser() || {};
  const merged = { ...existing, ...userData };

  // Fix avatar URL (convert "/media/..." to full URL)
  if (merged.avatar && typeof merged.avatar === "string") {
    if (merged.avatar.startsWith("/")) {
      merged.avatar = BACKEND_BASE + merged.avatar;
    }
  }

  localStorage.setItem(USER_KEY, JSON.stringify(merged));
  sessionStorage.setItem(USER_KEY, JSON.stringify(merged));

  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
};

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("getUser: parse error", e);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem(ACCESS_KEY) || sessionStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY);
};

export const isLoggedIn = () => {
  // Check both user and token existence
  const user = getUser();
  const token = getToken();
  return !!(user && token);
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
};

// For other modules to listen to the same event name
export const USER_UPDATED_EVENT_NAME = USER_UPDATED_EVENT;