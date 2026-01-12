import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, setLoading } from './store/slices/authSlice';

// Route Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Components
import Loader from './components/common/Loader';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated, user } = useSelector((state) => state.auth);

  // ============================================
  // INITIALIZATION EFFECT
  // ============================================
  useEffect(() => {
    // Check if user has a token in localStorage
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // If token exists, fetch current user data
      // This will:
      // 1. Validate the token
      // 2. Get user information
      // 3. Connect socket if valid
      dispatch(getCurrentUser());
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ============================================
  // AUTHENTICATION REDIRECT LOGIC
  // ============================================
  useEffect(() => {
    // Only run after loading is complete
    if (!isLoading) {
      // If user is authenticated and trying to access auth pages
      if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
        navigate('/', { replace: true });
      }
      
      // If user is not authenticated and trying to access protected routes
      if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/404') {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  // ============================================
  // GLOBAL ERROR HANDLER
  // ============================================
  useEffect(() => {
    // Handle uncaught errors globally
    const handleError = (event) => {
      console.error('Global error:', event.error);
      // You can log to error tracking service here (e.g., Sentry)
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // ============================================
  // PREVENT RESIZE ANIMATION JANK
  // ============================================
  useEffect(() => {
    let resizeTimer;
    
    const handleResize = () => {
      document.body.classList.add('resize-animation-stopper');
      
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
      }, 400);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <Loader size="xl" />
          <p className="text-white mt-4 text-lg font-medium">Loading Chat App...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN ROUTES
  // ============================================
  return (
    <div className="app-container">
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES (Only accessible when logged out) */}
        {/* ============================================ */}
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ============================================ */}
        {/* PROTECTED ROUTES (Only accessible when logged in) */}
        {/* ============================================ */}
        
        {/* Dashboard - Main Chat Interface */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ============================================ */}
        {/* ERROR ROUTES */}
        {/* ============================================ */}
        
        {/* 404 Not Found */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Catch all - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;