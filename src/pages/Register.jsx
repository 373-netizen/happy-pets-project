import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();

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
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      const file = files[0] || null;
      setFormData({ ...formData, avatar: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
      } else setAvatarPreview(null);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const focusFirstError = (errorObj) => {
    const order = ["username", "email", "password", "password2", "address", "avatar"];
    for (let f of order) {
      if (errorObj[f] && refs[f]?.current) {
        refs[f].current.focus();
        window.scrollTo({
          top: refs[f].current.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth"
        });
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

      Object.entries(formData).forEach(([k, v]) => v && data.append(k, v));

      await axios.post("http://127.0.0.1:8000/api/register/", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});


      setMessage("🎉 Registration successful!");
      clearToast();

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
        navigate("/login");
      }, 2000);
    } catch (err) {
      const resp = err?.response;
      if (resp?.data) {
        setErrors(resp.data);
        setMessage("❌ Registration failed. Fix the errors.");
        clearToast();
        focusFirstError(resp.data);
      } else {
        setMessage("❌ Network error. Check backend & CORS.");
        clearToast();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldErrors = ({ name }) =>
    errors[name] ? (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="field-errors"
        >
          {errors[name].map((m, i) => (
            <div key={i} className="field-error-item">⚠️ {m}</div>
          ))}
        </motion.div>
      </AnimatePresence>
    ) : null;

  return (
    <div className="register-bg">
      <div className="paws-bg">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className={`paw paw${i + 1}`}
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.25, 0.1],
              y: [0, -60, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 15, repeat: Infinity, delay: i * 2.5 }}
          >🐾</motion.div>
        ))}
      </div>

      <motion.div className="register-container"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        
        <h2 className="register-heading">Join the Happy Pets Family 🐾</h2>
        <p className="register-sub">Create an account to connect with fellow pet lovers!</p>

        {/* FORM */}
        <form className="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
          
          {/* USERNAME */}
          <div className="form-group">
            <input ref={refs.username} type="text" name="username" placeholder="Username"
              value={formData.username} onChange={handleChange} required />
            <FieldErrors name="username" />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <input ref={refs.email} type="email" name="email" placeholder="Email"
              value={formData.email} onChange={handleChange} required />
            <FieldErrors name="email" />
          </div>

          {/* PASSWORD */}
          <div className="form-group password-group">
            <input ref={refs.password} type={showPassword ? "text" : "password"}
              name="password" placeholder="Password" value={formData.password}
              onChange={handleChange} required />
            <button type="button" className="pass-toggle"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "👁️" : "🙈"}
            </button>
            <FieldErrors name="password" />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group password-group">
            <input ref={refs.password2} type={showPassword2 ? "text" : "password"}
              name="password2" placeholder="Confirm Password" value={formData.password2}
              onChange={handleChange} required />
            <button type="button" className="pass-toggle"
              onClick={() => setShowPassword2(!showPassword2)}>
              {showPassword2 ? "👁️" : "🙈"}
            </button>
            <FieldErrors name="password2" />
          </div>

          {/* ADDRESS */}
          <div className="form-group">
            <input ref={refs.address} type="text" name="address"
              placeholder="Address (Optional)" value={formData.address}
              onChange={handleChange} />
            <FieldErrors name="address" />
          </div>

          {/* AVATAR UPLOAD */}
          <div className="form-group file-group">
            <label className="file-upload">
              {formData.avatar ? formData.avatar.name : "Upload Avatar 🐾 📸"}
              <input ref={refs.avatar} type="file" name="avatar" accept="image/*"
                onChange={handleChange} />
            </label>

            {avatarPreview && (
              <div className="avatar-preview">
                <img src={avatarPreview} alt="Avatar preview" />
                <button type="button" className="remove-avatar"
                  onClick={() => {
                    setFormData({ ...formData, avatar: null });
                    setAvatarPreview(null);
                  }}>✕</button>
              </div>
            )}
            <FieldErrors name="avatar" />
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="register-btn" disabled={isSubmitting}>
            {isSubmitting ? "🔄 Creating Account..." : "Sign Up 🚀"}
          </button>
        </form>

        {/* TOAST */}
        <AnimatePresence>
          {message && (
            <motion.div className={`toast ${message.startsWith("🎉") ? "success" : "error"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}>
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGIN LINK */}
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
