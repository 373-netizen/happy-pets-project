import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google"; // ✅ import this
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const toastTimeoutRef = useRef(null);

  const clearToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("⚠️ Please fill in all fields");
      clearToast();
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        setMessage("🎉 Login successful!");
        console.log("User token:", res.data);

        if (rememberMe) {
          localStorage.setItem("token", res.data.access);
          localStorage.setItem("refreshToken", res.data.refresh);
        } else {
          sessionStorage.setItem("token", res.data.access);
          sessionStorage.setItem("refreshToken", res.data.refresh);
        }

        clearToast();
        setTimeout(() => console.log("Redirect to dashboard"), 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setError(`❌ ${err.response.data.detail}`);
      } else if (err.response?.status === 401) {
        setError("❌ Invalid username or password");
      } else {
        setError("❌ Network error. Please check your connection.");
      }
      clearToast();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="paws-bg">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`paw paw${i + 1}`}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{
              opacity: [0.1, 0.25, 0.1],
              y: [0, -60, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2.5,
            }}
          >
            🐾
          </motion.div>
        ))}
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="login-heading">Welcome Back! 🐕</h2>
          <p className="login-sub">Sign in to continue your Happy Pets journey!</p>
        </motion.div>

        {/* FORM */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                placeholder="Username or Email"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <span className="input-icon">👤</span>
            </div>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="input-wrapper password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <motion.button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="form-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-label">Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button type="submit" disabled={isSubmitting} className="login-btn">
              {isSubmitting ? "Signing In..." : "Sign In 🚀"}
            </motion.button>
          </motion.div>
        </form>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div className="toast error">{error}</motion.div>
          )}
          {message && (
            <motion.div className="toast success">{message}</motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <motion.div className="divider">
          <span>or continue with</span>
        </motion.div>

        {/* ✅ Social Login */}
        <motion.div
          className="social-login"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const token = credentialResponse.credential;
                const res = await axios.post(
                  "http://127.0.0.1:8000/accounts/google/login/token/",
                  { access_token: token },
                  { headers: { "Content-Type": "application/json" } }
                );

                console.log("Backend response:", res.data);
                setMessage("✅ Google login successful!");
              } catch (err) {
                console.error("Google login failed:", err);
                setError("❌ Google login failed. Check backend console.");
              }
            }}
            onError={() => setError("❌ Google Login Failed")}
          />

          <motion.button className="social-btn facebook">
            📘 Facebook
          </motion.button>
        </motion.div>

        {/* Register link */}
        <motion.p className="register-link">
          Don't have an account? <a href="/register">Sign up here</a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
