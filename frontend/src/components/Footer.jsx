import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="scw-footer mt-auto pt-5 pb-3">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src="/logo-icon.png"
                alt="Smart Car Wash Logo"
                className="footer-brand-logo"
              />
              <span className="brand-text text-white">
                SMART<span className="text-accent">CARWASH</span>
              </span>
            </div>
            <p style={{ color: '#CED4DA' }} className="pe-lg-4 small">
              Setting new benchmarks in automotive care. Utilizing German touchless snow foam formulas, scratch-free plush microfiber mitts, and certified nano-ceramic coatings to preserve that coveted showroom shine.
            </p>
            <div className="d-flex gap-2 mt-4">
              <a href="#facebook" className="social-btn" title="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#instagram" className="social-btn" title="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#twitter" className="social-btn" title="Twitter"><i className="bi bi-twitter-x"></i></a>
              <a href="#youtube" className="social-btn" title="YouTube"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Navigation</h6>
            <ul className="list-unstyled footer-links small">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/services">All Services</Link></li>
              <li className="mb-2"><Link to="/packages">Value Packages</Link></li>
              <li className="mb-2"><Link to="/booking">Book Appointment</Link></li>
              <li className="mb-2"><Link to="/contact">Customer Support</Link></li>
            </ul>
          </div>

          {/* Popular Services */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Featured Detailing</h6>
            <ul className="list-unstyled footer-links small">
              <li className="mb-2"><Link to="/services">Exterior Foam Bath</Link></li>
              <li className="mb-2"><Link to="/services">Interior Steam Sanitization</Link></li>
              <li className="mb-2"><Link to="/services">Carnauba Wax Buffing</Link></li>
              <li className="mb-2"><Link to="/services">Ceramic 9H Nano Coating</Link></li>
              <li className="mb-2"><Link to="/services">Engine Bay Degreasing</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Center Hub</h6>
            <ul className="list-unstyled footer-contact small">
              <li className="d-flex gap-2 mb-2">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-1" />
                <span style={{ color: '#CED4DA' }}>Plot 14, Barakhamba Road, Connaught Place, New Delhi</span>
              </li>
              <li className="d-flex gap-2 mb-2">
                <Phone size={18} className="text-accent flex-shrink-0 mt-1" />
                <span style={{ color: '#CED4DA' }}>+91 98765 43210</span>
              </li>
              <li className="d-flex gap-2 mb-2">
                <Mail size={18} className="text-accent flex-shrink-0 mt-1" />
                <span style={{ color: '#CED4DA' }}>support&#64;smartcarwash.com</span>
              </li>
              <li className="d-flex gap-2">
                <Clock size={18} className="text-accent flex-shrink-0 mt-1" />
                <span style={{ color: '#CED4DA' }}>Open 7 Days: 08:00 AM – 08:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary opacity-25" />

        <div className="row pt-2 align-items-center">
          <div className="col-md-6 text-center text-md-start small" style={{ color: '#CED4DA' }}>
            &copy; {new Date().getFullYear()} Smart Car Wash System. All rights reserved. Precision automotive care.
          </div>
          <div className="col-md-6 text-center text-md-end small mt-2 mt-md-0" style={{ color: '#CED4DA' }}>
            <a href="#privacy" style={{ color: '#CED4DA' }} className="me-3">Privacy Policy</a>
            <a href="#terms" style={{ color: '#CED4DA' }} className="me-3">Terms & Conditions</a>
            <a href="#cancellation" style={{ color: '#CED4DA' }}>Cancellation Policy</a>
          </div>
        </div>
      </div>

      <style>{`
        .scw-footer {
          background: #18191B;
          color: #CED4DA;
          border-top: 1px solid rgba(58, 182, 255, 0.15);
        }
        .footer-brand-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5));
        }
        .footer-links a {
          color: #CED4DA;
          transition: all 0.2s;
        }
        .footer-links a:hover {
          color: #3AB6FF;
          padding-left: 4px;
        }
        .social-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(58, 182, 255, 0.08);
          border: 1px solid rgba(58, 182, 255, 0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #CED4DA;
          transition: all 0.2s;
        }
        .social-btn:hover {
          background: #3AB6FF;
          color: #18191B;
          transform: translateY(-2px);
          border-color: #3AB6FF;
        }
      `}</style>
    </footer>
  );
};
