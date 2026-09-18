import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Home, AlertCircle, ArrowRight, Shield, User, Key } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click demo login helper
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container" style={{ maxWidth: 480 }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Home size={26} />
            </div>
            <span className="brand-font fs-2 fw-bold text-dark">
              House<span style={{ color: '#4f46e5' }}>Hunt</span>
            </span>
          </Link>
          <h4 className="fw-bold text-dark">Sign In to Your Account</h4>
          <p className="text-muted small">Manage properties, track bookings, and explore rentals</p>
        </div>

        {/* Demo Login Quick Fill Card */}
        <div className="bg-white p-3 rounded-4 border shadow-sm mb-4">
          <div className="text-secondary small fw-bold mb-2 text-uppercase">
            ⚡ Quick Demo Accounts (1-Click Fill)
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@househunt.com', 'Admin@123')}
              className="btn btn-sm btn-outline-danger demo-pill"
            >
              <Shield size={13} /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('landlord@househunt.com', 'Landlord@123')}
              className="btn btn-sm btn-outline-warning text-dark demo-pill"
            >
              <User size={13} /> Landlord
            </button>
            <button
              type="button"
              onClick={() => fillDemo('renter@househunt.com', 'Renter@123')}
              className="btn btn-sm btn-outline-info text-dark demo-pill"
            >
              <Key size={13} /> Tenant / Renter
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Mail size={16} className="text-muted" />
                </span>
                <input
                  type="email"
                  className="form-control form-control-modern border-start-0"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-semibold text-dark mb-0">Password</label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Lock size={16} className="text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control form-control-modern border-start-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-househunt-primary w-100 py-2 mb-3 fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-muted small mt-3">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary fw-bold text-decoration-none">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
