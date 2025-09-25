import { Link, useLocation } from 'react-router-dom'
import { Heart, Home, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()

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
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            Dashboard
          </Link>
        </div>

        <div className="nav-actions">
          <button className="btn-secondary">Sign In</button>
          <button className="btn-primary">Join Now</button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar