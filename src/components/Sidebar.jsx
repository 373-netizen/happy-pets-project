// src/components/Sidebar.jsx or Drawer.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, isLoggedIn, logout, USER_UPDATED_EVENT_NAME } from '../utils/auth';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Listen for auth changes
  useEffect(() => {
    const updateUser = () => {
      setUser(getUser());
    };

    updateUser(); // Initial load
    window.addEventListener(USER_UPDATED_EVENT_NAME, updateUser);
    window.addEventListener('storage', updateUser);

    return () => {
      window.removeEventListener(USER_UPDATED_EVENT_NAME, updateUser);
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose(); // Close drawer after navigation
  };

  const handleProfileClick = () => {
    if (isLoggedIn()) {
      handleNavigation('/profile');
    } else {
      // Redirect to login with return URL
      handleNavigation('/login?redirect=/profile');
    }
  };

  const handleLogout = () => {
    logout();
    handleNavigation('/');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        {user ? (
          <div className="user-info">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt="avatar" 
              className="user-avatar"
              onError={(e) => e.currentTarget.src = '/default-avatar.png'}
            />
            <div className="user-details">
              <h4>{user.username}</h4>
              <p>{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="guest-info">
            <h4>Welcome, Guest! 🐾</h4>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <button 
          onClick={() => handleNavigation('/')}
          className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          🏠 Home
        </button>

        <button 
          onClick={() => handleNavigation('/services')}
          className={`sidebar-item ${location.pathname === '/services' ? 'active' : ''}`}
        >
          🐾 Services
        </button>

        <button 
          onClick={() => handleNavigation('/appointments')}
          className={`sidebar-item ${location.pathname === '/appointments' ? 'active' : ''}`}
        >
          📅 Appointments
        </button>

        {user ? (
          <>
            <button 
              onClick={handleProfileClick}
              className={`sidebar-item ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              👤 My Profile
            </button>

            <button 
              onClick={() => handleNavigation('/my-pets')}
              className={`sidebar-item ${location.pathname === '/my-pets' ? 'active' : ''}`}
            >
              🐕 My Pets
            </button>

            <button 
              onClick={handleLogout}
              className="sidebar-item logout-btn"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => handleNavigation('/login')}
              className="sidebar-item login-btn"
            >
              🔐 Login
            </button>

            <button 
              onClick={() => handleNavigation('/register')}
              className="sidebar-item register-btn"
            >
              📝 Sign Up
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;