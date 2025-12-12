// src/components/Navbar.jsx
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Home, BarChart3, LogOut, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn, logout, getUser, USER_UPDATED_EVENT_NAME } from "../utils/auth";
import "./Navbar.css"; // keep/adjust your CSS

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [user, setUser] = useState(getUser());
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleUserUpdate = () => {
      setLoggedIn(isLoggedIn());
      setUser(getUser());
    };
    window.addEventListener(USER_UPDATED_EVENT_NAME, handleUserUpdate);
    // also respond to storage events (other tabs)
    window.addEventListener("storage", handleUserUpdate);

    // mount-time check
    handleUserUpdate();
    return () => {
      window.removeEventListener(USER_UPDATED_EVENT_NAME, handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, []);

  useEffect(() => {
    const userData = getUser();
    if (isLoggedIn() !== loggedIn || JSON.stringify(userData) !== JSON.stringify(user)) {
      setLoggedIn(isLoggedIn());
      setUser(userData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (ev) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const initials = () => {
    if (!user?.username) return "U";
    return user.username.slice(0, 2).toUpperCase();
  };

  return (
    <motion.nav className="navbar" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Heart className="logo-icon" />
          <span>Happy Pets</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            <Home size={18} /> Home
          </Link>
          <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <BarChart3 size={18} /> Dashboard
          </Link>
        </div>

        <div className="nav-actions">
          {!loggedIn ? (
            <>
              <Link to="/login"><button className="btn-secondary">Sign In</button></Link>
              <Link to="/register"><button className="btn-primary">Join Now</button></Link>
            </>
          ) : (
            <div className="user-menu" ref={dropdownRef}>
              <div className="user-avatar-wrapper" onClick={() => setShowDropdown((s) => !s)}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="user-avatar" onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                ) : (
                  <div className="avatar-fallback">{initials()}</div>
                )}
                <div className="user-status-indicator" />
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div className="dropdown-menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <div className="dropdown-header">
                      {user?.avatar ? (
                        <img src={user.avatar} className="dropdown-avatar" alt="avatar" />
                      ) : (
                        <div className="dropdown-avatar avatar-fallback">{initials()}</div>
                      )}
                      <div className="dropdown-user-info">
                        <p className="dropdown-username">{user?.username || "User"}</p>
                        <p className="dropdown-email">{user?.email || ""}</p>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate("/profile"); }}>
                      <User size={16} /> <span>My Profile</span>
                    </button>

                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate("/settings"); }}>
                      <Settings size={16} /> <span>Settings</span>
                    </button>

                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} /> <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
