// src/components/ProtectedRoute.jsx
// Optional: Use this for cleaner route protection

import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  if (!isLoggedIn()) {
    // Redirect to login with return URL
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export default ProtectedRoute;

// Usage in your App.jsx or Routes file:
/*
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

<Routes>
  <Route path="/login" element={<Login />} />
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } 
  />
  <Route path="/" element={<Home />} />
</Routes>
*/