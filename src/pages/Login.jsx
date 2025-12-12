import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { saveTokens, saveUser } from "../utils/auth"; // Import centralized helpers
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const toastTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const clearToast = () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // GET USER LOCATION
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setShowLocationPrompt(false);
      const redirectTo = new URLSearchParams(window.location.search).get('redirect');
      navigate(redirectTo || "/");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;

          // Update user object in localStorage
          const user = JSON.parse(localStorage.getItem("user"));
          const updatedUser = { ...user, location: address, latitude, longitude };
          saveUser(updatedUser);

          const token = localStorage.getItem("access") || sessionStorage.getItem("access");
          if (token) {
            await axios.put(
              `${import.meta.env.VITE_API_BASE_URL}/user/update-location/`,
              { location: address, latitude, longitude },
              { headers: { Authorization: `Bearer ${token}` } }
            ).catch(err => console.error("Failed to save location:", err));
          }

          setMessage("📍 Location saved!");
        } catch (err) {
          console.error("Failed to get address:", err);
        }
        setShowLocationPrompt(false);
        
        // Check if there's a redirect parameter
        const redirectTo = new URLSearchParams(window.location.search).get('redirect');
        if (redirectTo) {
          setTimeout(() => navigate(redirectTo), 1000);
        } else {
          setTimeout(() => navigate("/"), 1000);
        }
      },
      (err) => {
        console.error("Location error:", err);
        setShowLocationPrompt(false);
        
        // Check if there's a redirect parameter
        const redirectTo = new URLSearchParams(window.location.search).get('redirect');
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate("/");
        }
      }
    );
  };

  // NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("⚠️ Please fill in all fields");
      clearToast();
      return;
    }

    setIsSubmitting(true);
    try {
      // 🔥 FIX: Backend expects "email", not "username"
      const payload = {
        email: formData.username,  // Changed from "username" to "email"
        password: formData.password
      };

      console.log("🔍 Sending payload:", payload);
      console.log("🔍 API URL:", `${import.meta.env.VITE_API_BASE_URL}/login/`);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("=== NORMAL LOGIN DEBUG ===", res.data);

      // Save tokens using centralized helper
      if (res.data.access && res.data.refresh) {
        if (rememberMe) {
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
        } else {
          sessionStorage.setItem("access", res.data.access);
          sessionStorage.setItem("refresh", res.data.refresh);
        }
        saveTokens(res.data.access, res.data.refresh);
      }

      // Save user data using centralized helper
      if (res.data.user) {
        const userData = {
          ...res.data.user,
          avatar: res.data.user.avatar || "/default-avatar.png"
        };
        saveUser(userData);
        console.log("Saved to localStorage:", userData);
      }

      setMessage("🎉 Login successful!");
      clearToast();

      // Check if redirected from a specific page
      const redirectTo = new URLSearchParams(window.location.search).get('redirect');
      
      if (!res.data.user?.location) {
        setTimeout(() => setShowLocationPrompt(true), 800);
      } else if (redirectTo) {
        setTimeout(() => navigate(redirectTo), 800);
      } else {
        setTimeout(() => navigate("/"), 800);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || "Invalid username or password";
      setError(`❌ ${errorMsg}`);
      clearToast();
    } finally {
      setIsSubmitting(false);
    }
  };
  //GOOGLE LOGIN
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential; // This is the ID token

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/google-login/`,
      { token }, // send as "token" field
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("=== GOOGLE LOGIN DEBUG ===", res.data);

    if (res.data.access && res.data.refresh) {
      saveTokens(res.data.access, res.data.refresh);
    }

    if (res.data.user) {
      const userData = {
        id: res.data.user.id,
        username: res.data.user.username || res.data.user.name,
        email: res.data.user.email,
        avatar: res.data.user.avatar || res.data.user.picture || "public/default-avatar.png",
        phone: res.data.user.phone || "",
        location: res.data.user.location || ""
      };
      saveUser(userData);
      console.log("Saved to localStorage:", userData);
    }

    setMessage("✅ Google Login Successful!");
    clearToast();

    const redirectTo = new URLSearchParams(window.location.search).get('redirect');
    if (!res.data.user?.location) {
      setTimeout(() => setShowLocationPrompt(true), 800);
    } else if (redirectTo) {
      setTimeout(() => navigate(redirectTo), 800);
    } else {
      setTimeout(() => navigate("/"), 800);
    }
  } catch (err) {
    console.error("Google login failed:", err);
    const errorMsg = err.response?.data?.message || "Google login failed";
    setError(`❌ ${errorMsg}`);
    clearToast();
  }
};


  return (
    <div className="login-bg">
      <div className="paws-bg">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`paw paw${i + 1}`}
            animate={{ opacity: [0.1, 0.25, 0.1], y: [0, -60, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 15, repeat: Infinity, delay: i * 2.5 }}
          >
            🐾
          </motion.div>
        ))}
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="login-heading">Welcome Back! 🐕</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              name="username"
              placeholder="Email"
              value={formData.username}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="input-wrapper password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In 🚀"}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              className="toast error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {error}
            </motion.div>
          )}
          {message && (
            <motion.div
              className="toast success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            setError("❌ Google Login Failed");
            clearToast();
          }}
        />

        <p className="register-link">
          Don't have an account? <a href="/register">Sign up here</a>
        </p>
      </motion.div>

      {/* Location Permission Modal */}
      <AnimatePresence>
        {showLocationPrompt && (
          <motion.div
            className="location-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="location-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="location-icon">
                <MapPin size={48} />
              </div>
              <h3>Enable Location</h3>
              <p>
                We'd like to access your location to show nearby pet spas, 
                hospitals, and other services for your pets.
              </p>
              <div className="location-modal-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => { 
                    setShowLocationPrompt(false); 
                    const redirectTo = new URLSearchParams(window.location.search).get('redirect');
                    navigate(redirectTo || "/"); 
                  }}
                >
                  Maybe Later
                </button>
                <button className="btn-primary" onClick={requestLocation}>
                  Enable Location
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};     

export default Login;