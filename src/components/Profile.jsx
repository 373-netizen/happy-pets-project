// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser, saveUser, isLoggedIn } from "../utils/auth";
import "./Profile.css";
import Navbar from "./Navbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const Profile = () => {
  const navigate = useNavigate();
  const initialUser = getUser();
  const [user, setUser] = useState(initialUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    initialUser?.avatar || "/default-avatar.png"
  );
  const [form, setForm] = useState({
    username: initialUser?.username || "",
    email: initialUser?.email || "",
    phone: initialUser?.phone || "",
    location: initialUser?.location || "",
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login?redirect=/profile");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showMessage("File size should be less than 5MB", "error");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showMessage("Please select a valid image file", "error");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showMessage = (message, type = "success") => {
    setMsg(message);
    setMsgType(type);
    setTimeout(() => setMsg(""), 4000);
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (!token) {
      navigate("/login?redirect=/profile");
      return;
    }

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("phone", form.phone || "");
    formData.append("location", form.location || "");

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    try {
      const res = await axios.put(`${API_BASE}/profile/update/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // CRITICAL FIX: Preserve the avatar if backend doesn't return it
      const updatedUser = {
        ...user, // Keep all existing user data
        ...form, // Update with form data
        ...(res.data.user || {}), // Override with backend response if available
      };

      // If we uploaded a new file but backend didn't return avatar URL,
      // keep the preview until next login
      if (selectedFile && !res.data.user?.avatar) {
        updatedUser.avatar = avatarPreview;
      }

      // Save to localStorage/sessionStorage
      saveUser(updatedUser);
      setUser(updatedUser);
      
      // Update avatar preview
      if (res.data.user?.avatar) {
        setAvatarPreview(res.data.user.avatar);
      }
      
      setSelectedFile(null);

      showMessage("✨ Profile updated successfully!", "success");
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err);

      let errorMsg = "Failed to update profile";
      if (err.response?.status === 401) {
        errorMsg = "Unauthorized. Please login again.";
        setTimeout(() => navigate("/login?redirect=/profile"), 1500);
      } else if (err.response?.data) {
        const errors = err.response.data;
        errorMsg = Object.values(errors).flat().join(" ") || errorMsg;
      }

      showMessage(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">My Profile</h1>

          {msg && (
            <div className={`message message-${msgType}`}>
              {msg}
            </div>
          )}

          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img
                src={avatarPreview}
                alt="Profile Avatar"
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <label htmlFor="avatar-input" className="avatar-upload-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
            <p className="avatar-hint">Click the camera icon to update your photo</p>
          </div>

          <form onSubmit={submit} className="profile-form">
            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled
                style={{ backgroundColor: "#f9fafb", cursor: "not-allowed" }}
              />
            </div>

            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;