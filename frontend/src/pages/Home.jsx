import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ShieldCheck,
  CalendarCheck,
  Grid,
  CheckCircle2,
  Star,
  Clock,
  ChevronDown,
  Sparkles,
  Users,
  Award,
  Zap,
  ArrowRight,
  Droplets,
  ThumbsUp,
  MapPin,
  Car,
  Calendar,
  Check
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(0);

  // Quick Estimator State
  const [quickVehicle, setQuickVehicle] = useState('Sedan');
  const [quickCenter, setQuickCenter] = useState('Central Connaught Hub');
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [quickDate, setQuickDate] = useState(tomorrowStr);

  useEffect(() => {
  }, []);

  const handleQuickBook = (e) => {
    e.preventDefault();
    navigate(`/booking?vehicleType=${encodeURIComponent(quickVehicle)}&date=${encodeURIComponent(quickDate)}`);
  };

  const faqs = [
    {
      q: 'How long does a standard car wash session take?',
      a: 'Our Basic Wash takes approximately 30 minutes, while Standard and Premium Washes range from 60 to 90 minutes. For Ultimate Detailing or Ceramic Coating, sessions can take between 2 to 4 hours with dedicated multi-stage paint treatment.'
    },
    {
      q: 'Can I cancel or reschedule my appointment?',
      a: 'Yes! You can reschedule or cancel any upcoming appointment directly from your "My Bookings" dashboard up to 1 hour before the scheduled time slot without any penalty. Slot capacity is freed atomically in real time.'
    },
    {
      q: 'Do you use scratch-free washing techniques?',
      a: 'Absolutely. We exclusively employ two-bucket dirt-trap wash methods, ultra-soft plush microfiber mitts, pH-neutral active snow foam, and filtered spotless de-ionized water rinses.'
    },
    {
      q: 'What payment options are supported?',
      a: 'We accept Cash on Service at the wash center, UPI, all major Credit/Debit Cards, and instant Online Payment with promo coupons.'
    }
  ];

  return (
    <div>
      {/* ========================================================
          HERO SECTION (Luxury Automotive Aesthetic)
          ======================================================== */}
      <header className="hero-section position-relative d-flex align-items-center">
        <div className="hero-overlay"></div>
        <div className="container position-relative z-1 py-5">
          <div className="row align-items-center min-vh-85 pt-5 pb-5">
            <div className="col-lg-8 text-white">
              <span className="badge-scw-accent mb-3 d-inline-block px-3 py-2">
                <ShieldCheck size={16} className="me-2 inline" /> Certified Master Automotive Detailing
              </span>
              <h1 className="hero-title display-3 fw-bolder mb-4 text-white">
                Your Car Deserves the <span className="hero-highlight">Best Care</span>
              </h1>
              <p className="hero-description lead mb-5 pe-lg-5 fs-5">
                Experience the pinnacle of automotive cleaning. Our eco-friendly snow foam wash, interior deep steam extraction, and certified 9H ceramic treatments restore that coveted showroom finish.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link to="/booking" className="btn btn-hero-primary btn-lg px-5 py-3 fs-6">
                  <CalendarCheck size={20} className="me-2" /> Book Your Wash
                </Link>
                <Link to="/services" className="btn btn-hero-secondary btn-lg px-5 py-3 fs-6">
                  <Grid size={20} className="me-2" /> Explore Services
                </Link>
              </div>

              {/* Badges Bar */}
              <div className="row g-4 pt-4 border-top border-secondary border-opacity-25">
                <div className="col-auto d-flex align-items-center gap-2">
                  <div className="hero-badge-icon"><CheckCircle2 size={18} style={{ color: '#3AB6FF' }} /></div>
                  <span className="hero-badge-text fs-6">100% Scratch-Free</span>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                  <div className="hero-badge-icon"><CheckCircle2 size={18} style={{ color: '#3AB6FF' }} /></div>
                  <span className="hero-badge-text fs-6">Certified Detailers</span>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                  <div className="hero-badge-icon"><CheckCircle2 size={18} style={{ color: '#3AB6FF' }} /></div>
                  <span className="hero-badge-text fs-6">On-Time Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          QUICK BOOKING ESTIMATOR STRIP (Floating Bridge)
          ======================================================== */}
      <div className="container position-relative z-2" style={{ marginTop: '-42px' }}>
        <div className="scw-card p-4 p-lg-4 shadow-lg bg-white quick-estimator-card">
          <form onSubmit={handleQuickBook} className="row g-3 align-items-center">
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted mb-1">
                <Car size={15} className="me-1 inline" /> Vehicle Category
              </label>
              <select
                className="form-select scw-input fs-6"
                value={quickVehicle}
                onChange={(e) => setQuickVehicle(e.target.value)}
              >
                <option value="Hatchback">Hatchback (Compact)</option>
                <option value="Sedan">Sedan (Executive)</option>
                <option value="SUV">SUV (Full Size)</option>
                <option value="Luxury">Luxury / Sports</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted mb-1">
                <MapPin size={15} className="me-1 inline" /> Wash Center
              </label>
              <select
                className="form-select scw-input fs-6"
                value={quickCenter}
                onChange={(e) => setQuickCenter(e.target.value)}
              >
                <option value="Central Connaught Hub">Connaught Place Hub</option>
                <option value="South Ex Detailing Studio">South Extension Studio</option>
                <option value="Gurugram Cyber Hub Lounge">Gurugram Cyber Lounge</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted mb-1">
                <Calendar size={15} className="me-1 inline" /> Preferred Date
              </label>
              <input
                type="date"
                className="form-control scw-input fs-6"
                min={new Date().toISOString().split('T')[0]}
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
              />
            </div>

            <div className="col-md-3 d-flex align-items-end pt-md-4">
              <button type="submit" className="btn btn-scw-primary w-100 py-3 fw-bold fs-6">
                Check Live Slots <ArrowRight size={18} className="ms-1" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================
          STATISTICS SECTION (Band 1: #EBE2CC Warm Linen Cream)
          ======================================================== */}
      <section className="py-section bg-scw-cream border-top border-bottom mt-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-lg-3 col-6">
              <div className="scw-card p-4 p-lg-5 h-100 stat-tile">
                <Users size={36} className="text-secondary mb-3 mx-auto opacity-75" />
                <h2 className="stat-number mb-1 text-primary">15,000+</h2>
                <p className="text-secondary mb-0 fw-bold fs-6">Happy Customers</p>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="scw-card p-4 p-lg-5 h-100 stat-tile border-accent">
                <Droplets size={36} className="text-primary mb-3 mx-auto" />
                <h2 className="stat-number mb-1 text-primary">28,500+</h2>
                <p className="text-secondary mb-0 fw-bold fs-6">Cars Washed</p>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="scw-card p-4 p-lg-5 h-100 stat-tile">
                <Award size={36} className="text-secondary mb-3 mx-auto opacity-75" />
                <h2 className="stat-number mb-1 text-primary">45+</h2>
                <p className="text-secondary mb-0 fw-bold fs-6">Certified Techs</p>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="scw-card p-4 p-lg-5 h-100 stat-tile">
                <ThumbsUp size={36} className="text-success mb-3 mx-auto" />
                <h2 className="stat-number mb-1 text-success">99.4%</h2>
                <p className="text-secondary mb-0 fw-bold fs-6">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS (Band 1: #EBE2CC Warm Linen Cream)
          ======================================================== */}
      <section className="py-section bg-scw-cream border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Seamless Process</span>
            <h2 className="section-title">How It Works in 4 Simple Steps</h2>
            <p className="section-subtitle mx-auto">
              Book your professional car wash in under 60 seconds with our hassle-free appointment workflow.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="scw-card p-4 p-lg-5 h-100 step-tile">
                <div className="step-badge mb-4">1</div>
                <h4 className="fw-bold mb-2 text-primary">Select Vehicle</h4>
                <p className="text-secondary small mb-0 fs-6">
                  Choose from your saved garage or quickly add a new car model and registration number.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="scw-card p-4 p-lg-5 h-100 step-tile">
                <div className="step-badge mb-4">2</div>
                <h4 className="fw-bold mb-2 text-primary">Choose Treatment</h4>
                <p className="text-secondary small mb-0 fs-6">
                  Pick an all-in-one wash package or tailor individual treatments and preferred center.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="scw-card p-4 p-lg-5 h-100 step-tile">
                <div className="step-badge mb-4">3</div>
                <h4 className="fw-bold mb-2 text-primary">Pick Slot & Confirm</h4>
                <p className="text-secondary small mb-0 fs-6">
                  Check live slot availability, apply promo coupons, and choose online or cash payment.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="scw-card p-4 p-lg-5 h-100 step-tile">
                <div className="step-badge mb-4">4</div>
                <h4 className="fw-bold mb-2 text-primary">Enjoy Clean Car</h4>
                <p className="text-secondary small mb-0 fs-6">
                  Arrive at your appointment time and drive away in a sparkling clean, protected vehicle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          WHY CHOOSE US (Luxury Deep Obsidian Section #1C1915)
          ======================================================== */}
      <section className="py-section bg-scw-dark position-relative">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-scw-accent mb-2 px-3 py-2">Superior Standards</span>
            <h2 className="text-white section-title text-white">Why Choose Smart Car Wash</h2>
            <p className="text-light opacity-75 mx-auto fs-5" style={{ maxWidth: 700 }}>
              We combine high-performance German pressure technology with pH-neutral care.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="p-4 p-lg-5 rounded-4 dark-feature-tile h-100">
                <Users size={38} className="text-stone mb-3" />
                <h4 className="text-white fw-bold mb-3">Experienced Professionals</h4>
                <p className="text-light opacity-75 small mb-0 fs-6">
                  Our technicians undergo certified detailing training. Every vehicle is treated with individual care and precision.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="p-4 p-lg-5 rounded-4 dark-feature-tile h-100">
                <Sparkles size={38} className="text-stone mb-3" />
                <h4 className="text-white fw-bold mb-3">Eco-Friendly Chemistry</h4>
                <p className="text-light opacity-75 small mb-0 fs-6">
                  100% biodegradable shampoos and water-recycling filtration systems protect the environment and your paint coat.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="p-4 p-lg-5 rounded-4 dark-feature-tile h-100">
                <Zap size={38} className="text-stone mb-3" />
                <h4 className="text-white fw-bold mb-3">Affordable & Transparent</h4>
                <p className="text-light opacity-75 small mb-0 fs-6">
                  Honest pricing starting from just ₹199. No hidden charges, no upselling pressure, and clear itemized receipts.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="p-4 p-lg-5 rounded-4 dark-feature-tile h-100">
                <Award size={38} className="text-stone mb-3" />
                <h4 className="text-white fw-bold mb-3">Premium Equipment</h4>
                <p className="text-light opacity-75 small mb-0 fs-6">
                  Touchless dual-foam canons, variable-pressure wands, and high-suction upholstery extractors deliver spotless results.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="p-4 p-lg-5 rounded-4 dark-feature-tile h-100">
                <Clock size={38} className="text-stone mb-3" />
                <h4 className="text-white fw-bold mb-3">On-Time Service</h4>
                <p className="text-light opacity-75 small mb-0 fs-6">
                  Our strict slot capacity system guarantees your appointment begins immediately without waiting in long queues.
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="p-4 p-lg-5 rounded-4 dark-feature-tile h-100">
                <ShieldCheck size={38} className="text-stone mb-3" />
                <h4 className="text-white fw-bold mb-3">100% Satisfaction Guarantee</h4>
                <p className="text-light opacity-75 small mb-0 fs-6">
                  If you aren't completely delighted with your wash, our supervisors will re-wash your car for free on the spot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FAQ SECTION (Band 3: Soft Dune #F4EFE6)
          ======================================================== */}
      <section className="py-section" style={{ backgroundColor: '#F0F9FF' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Questions Answered</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle mx-auto">
              Everything you need to know about our car wash centers, slot bookings, and cancellation policies.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="d-flex flex-column gap-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="scw-card p-4 p-lg-5 overflow-hidden">
                    <div
                      className="d-flex justify-content-between align-items-center cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    >
                      <h4 className="fw-bold text-primary mb-0 fs-5">{faq.q}</h4>
                      <ChevronDown
                        size={22}
                        className={`text-primary ${openFaq === idx ? 'rotate-180' : ''}`}
                        style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
                      />
                    </div>
                    {openFaq === idx && (
                      <p className="text-secondary small mb-0 mt-3 pt-3 border-top fs-6 leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BOTTOM CTA BANNER (Deep Luxury Dark)
          ======================================================== */}
      <section className="py-section position-relative overflow-hidden text-center text-white" style={{ background: 'linear-gradient(135deg, #1C1915 0%, #2A251E 100%)' }}>
        <div className="container py-4 position-relative z-1">
          <h2 className="display-5 fw-bold text-white mb-3">Ready to Give Your Car the Care It Deserves?</h2>
          <p className="lead text-light opacity-80 mb-5 mx-auto fs-5" style={{ maxWidth: 680 }}>
            Choose your favorite wash center, pick a convenient slot, and experience the best detailing in town.
          </p>
          <Link to="/booking" className="btn btn-scw-accent btn-lg px-5 py-3 fs-5 shadow-lg">
            <CalendarCheck size={22} className="me-2" /> Book Appointment Now
          </Link>
        </div>
      </section>

      <style>{`
        .hero-section {
          background: url('/hero-bg.jpg') center/cover no-repeat;
          min-height: 92vh;
        }
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(105deg, rgba(24, 25, 27, 0.92) 0%, rgba(24, 25, 27, 0.80) 55%, rgba(24, 25, 27, 0.45) 100%);
        }
        .min-vh-85 {
          min-height: 85vh;
        }
        .hero-highlight {
          color: #3AB6FF;
          text-shadow: 0 0 32px rgba(58, 182, 255, 0.45);
        }
        .text-stone {
          color: #3AB6FF !important;
        }
        .hero-badge-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(58, 182, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quick-estimator-card {
          border: 1.5px solid #CED4DA !important;
          border-radius: 20px;
        }
        .stat-tile {
          border: 1.5px solid #CED4DA;
          transition: transform 0.3s;
        }
        .stat-tile:hover {
          transform: translateY(-6px);
        }
        .stat-number {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #3AB6FF;
        }
        .service-img-wrap {
          height: 240px;
          overflow: hidden;
        }
        .service-img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .scw-card:hover .service-img {
          transform: scale(1.08);
        }
        .border-accent {
          border: 2px solid #3AB6FF !important;
          box-shadow: 0 12px 35px rgba(58, 182, 255, 0.22);
        }
        .popular-ribbon {
          position: absolute;
          top: -14px;
          right: 24px;
          background: #EA3546;
          color: #fff;
          border: 1px solid #c82030;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 4px 16px;
          border-radius: 20px;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(234, 53, 70, 0.35);
        }
        .step-tile {
          border: 1.5px solid #CED4DA;
        }
        .step-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #3AB6FF;
          color: #18191B;
          border: 2px solid #2a8ccf;
          font-weight: 900;
          font-size: 1.6rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(58, 182, 255, 0.35);
          margin: 0 auto;
        }
        .dark-feature-tile {
          background: #18191B;
          border: 1px solid #2a2d31;
          transition: transform 0.3s;
        }
        .dark-feature-tile:hover {
          transform: translateY(-5px);
          border-color: #3AB6FF;
        }
        .avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #18191B;
          color: #3AB6FF;
          border: 2px solid #3AB6FF;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

