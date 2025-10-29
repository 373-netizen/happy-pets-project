import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Home, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { isLoggedIn, logout } from "../utils/auth"; // ✅ Import helper functions
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to homepage
    window.location.reload(); // Refresh to update navbar state
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Heart className="logo-icon" />
          <span>Happy Pets</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            <BarChart3 size={20} />
            Dashboard
          </Link>
        </div>

        <div className="nav-actions">
          {!loggedIn ? (
            <>
              <Link to="/login">
                <button className="btn-secondary">Sign In</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary">Join Now</button>
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-secondary logout-btn">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
