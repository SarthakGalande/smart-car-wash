import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { MapPin, Phone, Mail, Clock, Send, Pin } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/contact', formData);
      toast.success(res.data.message || 'Thank you! Your message has been transmitted.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-tag">Get In Touch</span>
          <h1 className="section-title">Contact & Customer Support</h1>
          <p className="section-subtitle mx-auto">
            Have a question about our wash services, detailing treatments, or corporate packages? We are here to help.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Contact Details */}
          <div className="col-lg-5">
            <div className="scw-card p-4 mb-4">
              <h4 className="fw-bold text-primary mb-3">Our Main Detailing Hub</h4>
              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="contact-icon-box">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Central Facility</h6>
                  <p className="text-muted small mb-0">Plot 14, Barakhamba Road, Connaught Place, New Delhi - 110001</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="contact-icon-box">
                  <Phone size={20} className="text-accent" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Phone & WhatsApp</h6>
                  <p className="text-muted small mb-0">+91 98765 43210 / +91 98765 43211</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="contact-icon-box">
                  <Mail size={20} className="text-accent" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Email Support</h6>
                  <p className="text-muted small mb-0">support&#64;smartcarwash.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="contact-icon-box">
                  <Clock size={20} className="text-accent" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Operating Hours</h6>
                  <p className="text-muted small mb-0">Monday – Sunday: 08:00 AM – 08:00 PM (All 7 Days)</p>
                </div>
              </div>
            </div>

            {/* Google Maps Visual Card */}
            <div className="scw-card p-4 overflow-hidden">
              <h5 className="fw-bold text-primary mb-3">Locate Our Service Centers</h5>
              <div className="map-placeholder rounded-3 p-4 text-center text-white d-flex flex-column align-items-center justify-content-center">
                <Pin size={38} className="text-accent mb-2" />
                <h6 className="fw-bold mb-1">Connaught Place Hub</h6>
                <p className="small text-light opacity-75 mb-0">3 Centers Active across New Delhi & NCR</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="scw-card p-4 p-md-5">
              <h4 className="fw-bold text-primary mb-2">Send Us a Message</h4>
              <p className="text-muted small mb-4">Fill out the form below and our operations manager will respond within 2 business hours.</p>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control scw-input"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control scw-input"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control scw-input"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control scw-input"
                      placeholder="e.g. Question about Ceramic Coating"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Your Message *</label>
                    <textarea
                      name="message"
                      className="form-control scw-input"
                      rows={5}
                      placeholder="How can we assist you with your car detailing needs?"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-scw-primary w-100 py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span> Transmitting Message...
                        </>
                      ) : (
                        <>
                          <Send size={18} className="me-2" /> Submit Inquiry
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(183, 176, 158, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .map-placeholder {
          background: linear-gradient(135deg, #18191B 0%, #23262B 100%);
          min-height: 160px;
          border: 1px dashed rgba(222, 214, 193, 0.4);
        }
      `}</style>
    </div>
  );
};

