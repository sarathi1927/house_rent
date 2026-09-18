import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, PlusCircle, LayoutDashboard, User, LogOut, LogIn, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge bg-danger text-uppercase px-2 py-1">Admin</span>;
      case 'owner':
        return <span className="badge bg-warning text-dark text-uppercase px-2 py-1">Landlord</span>;
      default:
        return <span className="badge bg-info text-dark text-uppercase px-2 py-1">Renter</span>;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Home size={22} />
          </div>
          <div>
            <span className="fw-bolder brand-font fs-4 text-dark" style={{ letterSpacing: '-0.5px' }}>
              House<span style={{ color: '#4f46e5' }}>Hunt</span>
            </span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link fw-semibold px-3 ${
                  location.pathname === '/' ? 'text-primary' : 'text-secondary'
                }`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/properties"
                className={`nav-link fw-semibold px-3 ${
                  location.pathname.startsWith('/properties') && location.pathname !== '/properties/new'
                    ? 'text-primary'
                    : 'text-secondary'
                }`}
              >
                Browse Rentals
              </Link>
            </li>

            {/* If landlord or admin, show Post Property shortcut */}
            {isAuthenticated && (user?.role === 'owner' || user?.role === 'admin') && (
              <li className="nav-item">
                <Link
                  to="/properties/new"
                  className={`nav-link fw-semibold px-3 d-flex align-items-center gap-1 ${
                    location.pathname === '/properties/new' ? 'text-primary' : 'text-secondary'
                  }`}
                >
                  <PlusCircle size={16} />
                  Post Property
                </Link>
              </li>
            )}

            {/* Dashboard Link if logged in */}
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link fw-semibold px-3 d-flex align-items-center gap-1 ${
                    location.pathname === '/dashboard' ? 'text-primary' : 'text-secondary'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Right Action Area */}
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-light d-flex align-items-center gap-2 border rounded-pill py-1 px-3"
                  type="button"
                  id="userMenuBtn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="rounded-circle"
                    style={{ width: 30, height: 30, objectFit: 'cover' }}
                  />
                  <span className="fw-semibold text-dark fs-6 d-none d-sm-inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  {getRoleBadge(user?.role)}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" style={{ minWidth: 220 }}>
                  <li className="px-3 py-2 border-bottom">
                    <div className="fw-bold text-dark">{user?.name}</div>
                    <div className="text-muted small">{user?.email}</div>
                  </li>
                  <li>
                    <Link to="/dashboard" className="dropdown-item py-2 d-flex align-items-center gap-2">
                      <LayoutDashboard size={16} className="text-primary" />
                      My Dashboard
                    </Link>
                  </li>
                  {(user?.role === 'owner' || user?.role === 'admin') && (
                    <li>
                      <Link to="/properties/new" className="dropdown-item py-2 d-flex align-items-center gap-2">
                        <PlusCircle size={16} className="text-success" />
                        List a New House
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-secondary fw-semibold rounded-pill px-3 py-1">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-househunt-primary rounded-pill px-3 py-1">
                  <Sparkles size={15} /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
