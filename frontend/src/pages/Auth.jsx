import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

export const Auth = ({ initialMode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form state
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: 'New Delhi'
  });

  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const fillDemo = (role) => {
    if (role === 'ADMIN') {
      setLoginData({ email: 'admin@smartcarwash.com', password: 'Admin@123' });
    } else {
      setLoginData({ email: 'john@example.com', password: 'Customer@123' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(loginData.email, loginData.password);
      toast.success(`Welcome back, ${res.user?.fullName}!`);
      if (res.user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        const targetPath = from && !from.startsWith('/admin') ? from : '/dashboard';
        navigate(targetPath, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regData.fullName.trim() || regData.fullName.trim().length < 2) {
      toast.warning('Full name must be at least 2 characters.');
      return;
    }
    if (!regData.email.trim()) {
      toast.warning('Please enter a valid email address.');
      return;
    }
    if (!regData.phone.trim() || regData.phone.replace(/\D/g, '').length < 10) {
      toast.warning('Phone number must have at least 10 digits (e.g. +91 98765 43210).');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      toast.warning('Passwords do not match.');
      return;
    }
    if (regData.password.length < 6) {
      toast.warning('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: regData.fullName,
        email: regData.email,
        phone: regData.phone,
        password: regData.password,
        address: { city: regData.city }
      };
      await register(payload);
      toast.success('Registration successful! Welcome to Smart Car Wash.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.warning('Please enter your email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      toast.info(res.data.message || 'Password reset link sent.');
      setIsForgotPassword(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper min-vh-100 d-flex align-items-center py-5">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="scw-card p-4 p-md-5 auth-card position-relative overflow-hidden">
              <div className="auth-glow-bar"></div>

              {/* Brand Header */}
              <div className="text-center mb-4">
                <Link to="/" className="d-inline-flex align-items-center gap-2 mb-2 text-decoration-none">
                  <img src="/logo-icon.png" alt="Smart Car Wash" style={{ height: '36px', objectFit: 'contain' }} />
                  <span className="brand-text">
                    SMART<span className="text-accent">CARWASH</span>
                  </span>
                </Link>
                <p className="text-muted small">
                  {isLoginMode ? 'Access your dashboard and booking appointments' : 'Create your account to unlock premium car care'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="auth-tabs d-flex p-1 mb-4 rounded-3 bg-light">
                <button
                  type="button"
                  className={`btn flex-fill auth-tab-btn ${isLoginMode ? 'active' : ''}`}
                  onClick={() => { setIsLoginMode(true); setIsForgotPassword(false); }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`btn flex-fill auth-tab-btn ${!isLoginMode ? 'active' : ''}`}
                  onClick={() => { setIsLoginMode(false); setIsForgotPassword(false); }}
                >
                  Register
                </button>
              </div>

              {/* LOGIN FORM */}
              {isLoginMode && !isForgotPassword && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Mail size={16} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 ps-0 scw-input"
                        placeholder="john@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label fw-semibold small">Password</label>
                      <button
                        type="button"
                        className="btn btn-link p-0 small text-accent fw-semibold text-decoration-none"
                        onClick={() => setIsForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-start-0 border-end-0 px-0 scw-input"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0 bg-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-scw-primary w-100 py-3 mt-3" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Authenticating...
                      </>
                    ) : (
                      'Sign In to Account'
                    )}
                  </button>

                  {/* Quick Demo Access */}
                  <div className="mt-4 pt-3 border-top text-center">
                    <span className="text-muted small d-block mb-2">Quick Demo One-Click Access:</span>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary small rounded-pill px-3"
                        onClick={() => fillDemo('CUSTOMER')}
                      >
                        Demo Customer
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark small rounded-pill px-3"
                        onClick={() => fillDemo('ADMIN')}
                      >
                        Admin Login
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* REGISTRATION FORM */}
              {!isLoginMode && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <User size={16} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0 scw-input"
                        placeholder="e.g. John Doe"
                        value={regData.fullName}
                        onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Email Address *</label>
                      <input
                        type="email"
                        className="form-control scw-input"
                        placeholder="john@example.com"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control scw-input"
                        placeholder="+91 98765 43210"
                        value={regData.phone}
                        onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                        required
                        minLength={10}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Password *</label>
                      <input
                        type="password"
                        className="form-control scw-input"
                        placeholder="Min. 6 characters"
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Confirm Password *</label>
                      <input
                        type="password"
                        className="form-control scw-input"
                        placeholder="Repeat password"
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">City</label>
                    <input
                      type="text"
                      className="form-control scw-input"
                      placeholder="e.g. New Delhi"
                      value={regData.city}
                      onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-scw-primary w-100 py-3 mt-3" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> Registering...
                      </>
                    ) : (
                      'Create Smart Car Wash Account'
                    )}
                  </button>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {isForgotPassword && (
                <form onSubmit={handleForgotSubmit}>
                  <h5 className="fw-bold text-primary mb-2">Reset Password</h5>
                  <p className="text-muted small mb-4">Enter your registered email address to receive password reset instructions.</p>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <input
                      type="email"
                      className="form-control scw-input"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-scw-primary w-100 py-2 mb-2" disabled={submitting}>
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    className="btn btn-link w-100 small text-secondary text-decoration-none"
                    onClick={() => setIsForgotPassword(false)}
                  >
                    <ArrowLeft size={14} className="me-1 inline" /> Back to Sign In
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-wrapper {
          background: radial-gradient(circle at 50% 20%, #23262B 0%, #18191B 100%);
        }
        .auth-card {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          border-radius: 18px;
          border: 1.5px solid rgba(58,182,255,0.2);
        }
        .auth-glow-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3AB6FF, #EA3546, #3AB6FF);
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(135deg, #3AB6FF 0%, #23262B 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          color: #18191B;
        }
        .auth-tab-btn {
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 6px;
          color: #718096;
          padding: 0.45rem;
          transition: all 0.2s;
        }
        .auth-tab-btn.active {
          background: #FFFFFF;
          color: #18191B;
          box-shadow: 0 2px 6px rgba(58,182,255,0.15);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
