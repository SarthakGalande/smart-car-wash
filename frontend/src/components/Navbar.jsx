import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CalendarCheck,
  Bell,
  User,
  ShieldCheck,
  LayoutDashboard,
  Car,
  ClipboardList,
  Star,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then((res) => setUnreadCount(res.data.unreadCount || 0))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top scw-navbar">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/logo-icon.png"
            alt="Smart Car Wash Logo"
            className="navbar-brand-logo"
          />
          <span className="brand-text">
            SMART<span className="text-accent">CARWASH</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} className="text-accent" /> : <Menu size={28} className="text-accent" />}
        </button>

        {/* Desktop & Mobile Menu */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="scwNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/packages" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Packages
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-sm text-white fw-bold px-3 py-2 nav-signin-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm btn-scw-outline-light px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/booking"
                  className="btn btn-sm btn-scw-primary ms-lg-2 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CalendarCheck size={16} className="me-1" /> Book Now
                </Link>
              </>
            ) : (
              <>
                {/* Notifications Link */}
                <Link
                  to="/dashboard/notifications"
                  className="position-relative notification-btn text-white me-2"
                  title="Notifications"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Book Wash CTA */}
                <Link to="/booking" className="btn btn-sm btn-scw-primary d-none d-md-inline-flex px-3 py-2" onClick={() => setMobileMenuOpen(false)}>
                  <CalendarCheck size={16} className="me-1" /> Book Wash
                </Link>

                {/* User Dropdown */}
                <div className="dropdown position-relative">
                  <button
                    className="btn user-profile-btn dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="avatar-circle">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="user-name d-none d-sm-inline text-white fw-semibold">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <ul className="dropdown-menu dropdown-menu-end scw-dropdown shadow-lg show position-absolute end-0 mt-2">
                      <li className="dropdown-header text-muted">
                        Signed in as <strong className="text-white d-block text-truncate">{user?.email}</strong>
                      </li>
                      <li><hr className="dropdown-divider border-secondary opacity-25" /></li>

                      {isAdmin && (
                        <>
                          <li>
                            <Link to="/admin/dashboard" className="dropdown-item text-accent fw-bold" onClick={() => setDropdownOpen(false)}>
                              <ShieldCheck size={16} className="me-2" /> Admin Dashboard
                            </Link>
                          </li>
                          <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
                        </>
                      )}

                      <li>
                        <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <LayoutDashboard size={16} className="me-2" /> Dashboard Overview
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard/my-bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <ClipboardList size={16} className="me-2" /> My Bookings
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard/vehicles" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <Car size={16} className="me-2" /> My Vehicles
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard/reviews" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <Star size={16} className="me-2" /> My Reviews
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <Settings size={16} className="me-2" /> Profile Settings
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          <LogOut size={16} className="me-2" /> Sign Out
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scw-navbar {
          background: rgba(24, 25, 27, 0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(58, 182, 255, 0.15);
          padding: 1rem 0;
          z-index: 1050;
        }
        .brand-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.45rem;
          color: #F0F4F8;
        }
        .text-accent {
          color: #3AB6FF;
        }
        .navbar-brand-logo {
          height: 42px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
          transition: transform 0.25s ease;
        }
        .navbar-brand:hover .navbar-brand-logo {
          transform: scale(1.06);
        }
        .nav-link {
          color: #CED4DA !important;
          font-weight: 600;
          font-size: 1.05rem;
          padding: 0.6rem 1.1rem !important;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .nav-link:hover, .nav-link.active {
          color: #3AB6FF !important;
          background: rgba(58, 182, 255, 0.1);
        }
        .nav-signin-btn {
          border: 1px solid rgba(206, 212, 218, 0.4);
          border-radius: 30px;
          font-size: 0.95rem;
          color: #F0F4F8 !important;
        }
        .nav-signin-btn:hover {
          background: rgba(58, 182, 255, 0.12);
          color: #3AB6FF !important;
          border-color: rgba(58, 182, 255, 0.4);
        }
        .avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #23262B;
          border: 2px solid #3AB6FF;
          color: #3AB6FF;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }
        .user-profile-btn {
          background: rgba(58, 182, 255, 0.08);
          border: 1px solid rgba(58, 182, 255, 0.2);
          border-radius: 30px;
          padding: 5px 14px 5px 6px;
        }
        .scw-dropdown {
          background: #23262B;
          border: 1px solid rgba(58, 182, 255, 0.2);
          border-radius: 16px;
          padding: 0.75rem;
          min-width: 240px;
        }
        .scw-dropdown .dropdown-item {
          color: #CED4DA;
          border-radius: 8px;
          padding: 0.65rem 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .scw-dropdown .dropdown-item:hover {
          background: rgba(58, 182, 255, 0.12);
          color: #3AB6FF;
        }
        .notification-btn {
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(58, 182, 255, 0.08);
          color: #CED4DA !important;
          transition: all 0.2s;
        }
        .notification-btn:hover {
          background: rgba(58, 182, 255, 0.18);
          color: #3AB6FF !important;
        }
      `}</style>
    </nav>
  );
};
