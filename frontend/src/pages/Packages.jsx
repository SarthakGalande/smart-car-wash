import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Clock, CheckCircle2, Minus, Settings2 } from 'lucide-react';

export const Packages = () => {
  const [packages, setPackages] = useState([]);

  const comparisonRows = [
    { feature: 'High-Pressure Exterior Snow Foam', basic: true, standard: true, premium: true, ultimate: true },
    { feature: 'Tire Cleaning & High-Gloss Dressing', basic: true, standard: true, premium: true, ultimate: true },
    { feature: 'Microfiber Scratch-Free Hand Drying', basic: true, standard: true, premium: true, ultimate: true },
    { feature: 'Interior Cabin Deep Vacuuming', basic: false, standard: true, premium: true, ultimate: true },
    { feature: 'Dashboard & Console Conditioning', basic: false, standard: true, premium: true, ultimate: true },
    { feature: 'Streak-Free Glass & Window Cleaning', basic: false, standard: true, premium: true, ultimate: true },
    { feature: 'Door Jambs & Trunk Deep Cleaned', basic: false, standard: false, premium: true, ultimate: true },
    { feature: 'AC Vent Sanitization & Fresh Scent', basic: false, standard: false, premium: true, ultimate: true },
    { feature: 'Brazilian Carnauba Wax Buffing', basic: false, standard: false, premium: false, ultimate: true },
    { feature: 'Engine Bay Steam Degreasing', basic: false, standard: false, premium: false, ultimate: true },
    { feature: 'Paint Decontamination & Machine Polish', basic: false, standard: false, premium: false, ultimate: true },
    { feature: 'Rain-Repellent Windshield Coating', basic: false, standard: false, premium: true, ultimate: true }
  ];

  useEffect(() => {
    api.get('/packages')
      .then((res) => {
        if (res.data.packages && res.data.packages.length > 0) {
          setPackages(res.data.packages);
        } else {
          // Fallback packages
          setPackages([
            {
              id: '1',
              packageName: 'Basic Wash',
              description: 'Exterior wash and basic tire shine.',
              price: 199,
              duration: 30,
              features: ['Exterior foam wash', 'High-pressure rinse', 'Tire cleaning & shine', 'Microfiber hand dry']
            },
            {
              id: '2',
              packageName: 'Standard Wash',
              description: 'Exterior wash and complete interior vacuum.',
              price: 399,
              duration: 60,
              features: ['Everything in Basic Wash', 'Interior cabin vacuum', 'Dashboard wipe & shine', 'Window glass cleaning']
            },
            {
              id: '3',
              packageName: 'Premium Wash',
              description: 'Exterior foam, deep interior clean, tyre and dashboard polishing.',
              price: 699,
              duration: 90,
              popular: true,
              badge: 'Most Popular',
              features: ['Exterior foam bath', 'Interior deep extraction', 'Tyre & rim polishing', 'Dashboard UV protectant', 'Air freshener']
            },
            {
              id: '4',
              packageName: 'Ultimate Detailing',
              description: 'Complete interior shampoo, wax polishing, and engine bay detailing.',
              price: 1499,
              duration: 180,
              badge: 'Best Value',
              features: ['Full interior steam shampoo', 'Exterior detailing & polish', 'Brazilian wax coat', 'Engine bay clean', 'Leather conditioner']
            }
          ]);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-tag">Value Bundles</span>
          <h1 className="section-title">Car Wash & Detailing Packages</h1>
          <p className="section-subtitle mx-auto">
            Choose the ideal care package for your vehicle. Save up to 35% compared to booking individual treatments, backed by our 100% satisfaction guarantee.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="row g-4 mb-5 justify-content-center">
          {packages.map((pkg) => (
            <div key={pkg._id || pkg.id} className="col-lg-3 col-md-6">
              <div className={`scw-card h-100 p-4 p-xl-5 d-flex flex-column position-relative ${pkg.popular ? 'border-accent shadow-lg' : ''}`}>
                {pkg.badge && (
                  <div className="package-badge">
                    {pkg.badge}
                  </div>
                )}

                <h3 className="h4 fw-bold mb-1 text-primary">{pkg.packageName}</h3>
                <p className="text-muted small mb-3">{pkg.description}</p>

                <div className="my-3 py-3 border-top border-bottom border-secondary border-opacity-10">
                  <span className="display-6 fw-bold text-primary">₹{pkg.price}</span>
                  <span className="text-muted small"> / session</span>
                  <div className="small text-muted mt-2 d-flex align-items-center gap-1">
                    <Clock size={16} className="text-accent" /> {pkg.duration} mins duration
                  </div>
                </div>

                <ul className="list-unstyled my-4 small flex-grow-1">
                  {(pkg.features || []).map((feat, idx) => (
                    <li key={idx} className="d-flex align-items-start gap-2 mb-3">
                      <CheckCircle2 size={18} className="text-accent flex-shrink-0 mt-1" />
                      <span className="fw-semibold text-secondary">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/booking?packageId=${pkg._id || pkg.id}`}
                  className={`btn w-100 mt-auto py-3 fw-bold ${pkg.popular ? 'btn-scw-primary' : 'btn-scw-outline-dark'}`}
                >
                  Book {pkg.packageName}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* COMPREHENSIVE COMPARISON MATRIX */}
        <div className="scw-card p-4 p-md-5 mt-5">
          <h3 className="h3 fw-bold text-primary mb-4 text-center">Package Comparison Matrix</h3>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 comparison-table">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '32%' }}>Feature / Treatment</th>
                  <th className="text-center" style={{ width: '17%' }}>Basic Wash<br /><span className="fw-normal text-muted small">₹199</span></th>
                  <th className="text-center" style={{ width: '17%' }}>Standard Wash<br /><span className="fw-normal text-muted small">₹399</span></th>
                  <th className="text-center text-accent" style={{ width: '17%' }}>Premium Wash<br /><span className="fw-normal text-muted small">₹699</span></th>
                  <th className="text-center" style={{ width: '17%' }}>Ultimate Detailing<br /><span className="fw-normal text-muted small">₹1499</span></th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold text-secondary">
                      <Settings2 size={14} className="text-accent me-2 inline" />{row.feature}
                    </td>
                    <td className="text-center">
                      {row.basic ? <CheckCircle2 size={18} className="text-success mx-auto" /> : <Minus size={16} className="text-muted opacity-50 mx-auto" />}
                    </td>
                    <td className="text-center">
                      {row.standard ? <CheckCircle2 size={18} className="text-success mx-auto" /> : <Minus size={16} className="text-muted opacity-50 mx-auto" />}
                    </td>
                    <td className="text-center bg-light">
                      {row.premium ? <CheckCircle2 size={18} className="text-success mx-auto" /> : <Minus size={16} className="text-muted opacity-50 mx-auto" />}
                    </td>
                    <td className="text-center">
                      {row.ultimate ? <CheckCircle2 size={18} className="text-success mx-auto" /> : <Minus size={16} className="text-muted opacity-50 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .border-accent {
          border: 2px solid #3AB6FF !important;
          box-shadow: 0 10px 30px rgba(183, 176, 158, 0.25);
        }
        .package-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: #3AB6FF;
          color: #18191B;
          border: 1px solid #1a9ee8;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 4px 16px;
          border-radius: 20px;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(28, 25, 21, 0.3);
        }
        .comparison-table th, .comparison-table td {
          padding: 1.1rem 0.9rem;
        }
      `}</style>
    </div>
  );
};

