import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, Home, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name,
        email,
        password,
        role,
        phone,
      });

      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container" style={{ maxWidth: 520 }}>
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
          <h4 className="fw-bold text-dark">Create Your Free Account</h4>
          <p className="text-muted small">Join thousands of happy tenants and property owners</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small rounded-3 mb-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Role Selector */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-dark mb-2">
                I want to join as:
              </label>
              <div className="row g-2">
                <div className="col-6">
                  <div
                    onClick={() => setRole('tenant')}
                    className={`p-3 rounded-3 border text-center cursor-pointer ${
                      role === 'tenant'
                        ? 'border-primary bg-primary-subtle text-primary fw-bold'
                        : 'bg-light text-secondary'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fs-5 mb-1">🔑</div>
                    <div className="small">Tenant / Renter</div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    onClick={() => setRole('owner')}
                    className={`p-3 rounded-3 border text-center cursor-pointer ${
                      role === 'owner'
                        ? 'border-primary bg-primary-subtle text-primary fw-bold'
                        : 'bg-light text-secondary'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fs-5 mb-1">🏡</div>
                    <div className="small">Landlord / Owner</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <User size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control form-control-modern border-start-0"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Mail size={16} className="text-muted" />
                </span>
                <input
                  type="email"
                  className="form-control form-control-modern border-start-0"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-dark">Phone Number (Optional)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Phone size={16} className="text-muted" />
                </span>
                <input
                  type="tel"
                  className="form-control form-control-modern border-start-0"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-dark">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Lock size={16} className="text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control form-control-modern border-start-0"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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
                  Creating Account...
                </>
              ) : (
                <>
                  Register & Continue <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-muted small mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-bold text-decoration-none">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
