import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    address: "",
    avatar: null,
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastTimeoutRef = useRef(null);

  const refs = {
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    password2: useRef(null),
    address: useRef(null),
    avatar: useRef(null),
  };

  const clearToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files[0] || null;
      setFormData({ ...formData, avatar: file });
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setAvatarPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const focusFirstError = (errorObj) => {
    const fieldOrder = ["username", "email", "password", "password2", "address", "avatar"];
    for (let field of fieldOrder) {
      if (errorObj[field]) {
        const r = refs[field];
        if (r && r.current) {
          r.current.focus?.();
          window.scrollTo({ 
            top: r.current.getBoundingClientRect().top + window.scrollY - 80, 
            behavior: "smooth" 
          });
        }
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setErrors({ password2: ["Passwords do not match."] });
      setMessage("❌ Fix the errors and try again.");
      clearToast();
      focusFirstError({ password2: true });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      setErrors({});

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        const val = formData[key];
        if (val !== null && val !== undefined && val !== "") {
          data.append(key, val);
        } else {
          if (key === "avatar") return;
          data.append(key, "");
        }
      });

      const res = await axios.post("http://127.0.0.1:8000/api/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("🎉 Registration successful!");
      setErrors({});
      clearToast();
      console.log(res.data);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          username: "",
          email: "",
          password: "",
          password2: "",
          address: "",
          avatar: null,
        });
        setAvatarPreview(null);
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      const resp = err?.response;
      if (resp && resp.data) {
        setErrors(resp.data);
        setMessage("❌ Registration failed. Fix the errors.");
        clearToast();
        focusFirstError(resp.data);
      } else {
        setMessage("❌ Network error. Make sure backend is running and CORS is allowed.");
        clearToast();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldErrors = ({ name }) => {
    if (!errors || !errors[name]) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="field-errors"
          role="alert"
        >
          {errors[name].map((errMsg, i) => (
            <div key={i} className="field-error-item">
              ⚠️ {errMsg}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="register-bg">
      <div className="paws-bg">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`paw paw${i + 1}`}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{ 
              opacity: [0.1, 0.25, 0.1],
              y: [0, -60, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2.5
            }}
          >
            🐾
          </motion.div>
        ))}
      </div>

      <motion.div
        className="register-container"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="pet-deco dog"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🐶
        </motion.div>
        <motion.div 
          className="pet-deco cat"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          🐱
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="register-heading">Join the Happy Pets Family 🐾</h2>
          <p className="register-sub">Create an account to connect with fellow pet lovers!</p>
        </motion.div>

        <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          <motion.div 
            className={`form-group ${errors.username ? "has-error" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              ref={refs.username}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              aria-invalid={!!errors.username}
            />
            <span className="input-icon">👤</span>
            <FieldErrors name="username" />
          </motion.div>

          <motion.div 
            className={`form-group ${errors.email ? "has-error" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              ref={refs.email}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
            />
            <span className="input-icon">📧</span>
            <FieldErrors name="email" />
          </motion.div>

          <motion.div 
            className={`form-group password-group ${errors.password ? "has-error" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              ref={refs.password}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-invalid={!!errors.password}
            />
            <motion.button
              type="button"
              className="pass-toggle"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "🙈"}
            </motion.button>
            <FieldErrors name="password" />
          </motion.div>

          <motion.div 
            className={`form-group password-group ${errors.password2 ? "has-error" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <input
              ref={refs.password2}
              type={showPassword2 ? "text" : "password"}
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              required
              aria-invalid={!!errors.password2}
            />
            <motion.button
              type="button"
              className="pass-toggle"
              onClick={() => setShowPassword2(!showPassword2)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={showPassword2 ? "Hide password" : "Show password"}
            >
              {showPassword2 ? "👁️" : "🙈"}
            </motion.button>
            <FieldErrors name="password2" />
          </motion.div>

          <motion.div 
            className={`form-group ${errors.address ? "has-error" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <input
              ref={refs.address}
              type="text"
              name="address"
              placeholder="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
            />
            <span className="input-icon">🏠</span>
            <FieldErrors name="address" />
          </motion.div>

          <motion.div 
            className={`form-group file-group ${errors.avatar ? "has-error" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.label 
              className="file-upload"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {formData.avatar ? formData.avatar.name : "Upload Avatar 🐾 📸"}
              <input
                ref={refs.avatar}
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
              />
            </motion.label>
            
            <AnimatePresence>
              {avatarPreview && (
                <motion.div
                  className="avatar-preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="avatar-preview-wrapper">
                    <img src={avatarPreview} alt="Avatar preview" />
                    <motion.button
                      type="button"
                      className="remove-avatar"
                      onClick={() => {
                        setFormData({ ...formData, avatar: null });
                        setAvatarPreview(null);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <FieldErrors name="avatar" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="register-btn"
              whileHover={{ scale: isSubmitting ? 1 : 1.05, y: isSubmitting ? 0 : -2 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
              {isSubmitting ? (
                <span className="btn-content">
                  <motion.span
                    className="spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🔄
                  </motion.span>
                  {" "}Creating Account...
                </span>
              ) : (
                <span className="btn-content">Sign Up 🚀</span>
              )}
            </motion.button>
          </motion.div>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              className={`toast ${message.startsWith("🎉") ? "success" : "error"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="status"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          className="login-link"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Already have an account?{" "}
          <a href="/login">Login here</a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;