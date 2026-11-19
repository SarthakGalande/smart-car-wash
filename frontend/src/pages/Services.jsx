import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, Clock, CheckCircle2 } from 'lucide-react';
import { mockServices } from '../data/mockServices';

export const Services = () => {
  const [services, setServices] = useState(mockServices);
  const [filteredServices, setFilteredServices] = useState(mockServices);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['All', 'Exterior', 'Interior', 'Complete', 'Detailing', 'Specialized'];

  useEffect(() => {
    api.get('/services')
      .then((res) => {
        if (res.data.services && res.data.services.length > 0) {
          setServices(res.data.services);
        }
      })
      .catch(() => {
        // Fallback remains active on mockServices
      });
  }, []);

  useEffect(() => {
    let result = [...services];

    if (selectedCategory !== 'All') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.serviceName.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.features || []).some((f) => f.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    setFilteredServices(result);
  }, [services, selectedCategory, searchKeyword, sortBy]);

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-tag">Explore Treatments</span>
          <h1 className="section-title">Car Wash & Detailing Services</h1>
          <p className="section-subtitle mx-auto">
            Choose from our specialized individual automotive cleaning treatments, performed by certified master detailers using touchless snow foam and pH-neutral formulas.
          </p>
        </div>

        {/* Filter and Search Box */}
        <div className="scw-card p-4 mb-5">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={20} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 scw-input fs-6"
                  placeholder="Search services (e.g. foam, interior, ceramic, wax)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4 ms-auto">
              <select
                className="form-select scw-input fs-6"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
                <option value="rating">Sort: Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="scw-card p-3">
                  <div className="skeleton-box mb-3" style={{ height: 180 }} />
                  <div className="skeleton-box mb-2" style={{ height: 24, width: '60%' }} />
                  <div className="skeleton-box" style={{ height: 40 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!loading && (
          <div className="row g-4">
            {filteredServices.map((service) => (
              <div key={service._id || service.id} className="col-lg-4 col-md-6">
                <div className="scw-card h-100 overflow-hidden d-flex flex-column">
                  <div className="position-relative service-img-box">
                    <img src={service.image} alt={service.serviceName} className="w-100 service-img" />
                    <span className="badge-scw-accent position-absolute top-0 end-0 m-3">
                      {service.category}
                    </span>
                    {service.isPopular && (
                      <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="h5 fw-bold mb-0 text-primary">{service.serviceName}</h4>
                      <div className="text-warning small d-flex align-items-center">
                        <Star size={14} className="fill-warning me-1" />
                        <span className="fw-bold">{service.rating || 4.8}</span>
                      </div>
                    </div>

                    <p className="text-secondary small mb-3 flex-grow-1">
                      {service.description}
                    </p>

                    <ul className="list-unstyled small mb-3">
                      {(service.features || []).map((feat, idx) => (
                        <li key={idx} className="d-flex align-items-center gap-2 mb-1 text-muted">
                          <CheckCircle2 size={14} className="text-accent" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                      <div>
                        <span className="text-muted small d-block">Starting from</span>
                        <span className="h4 fw-bold text-primary mb-0">₹{service.price}</span>
                        <span className="text-muted small ms-1">({service.duration} mins)</span>
                      </div>
                      <Link to={`/booking?serviceId=${service._id || service.id}`} className="btn btn-scw-primary px-3 py-2 fw-bold">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="col-12 text-center py-5">
                <div className="py-5">
                  <Search size={54} className="text-muted mb-3 mx-auto" />
                  <h4 className="fw-bold text-primary">No services found</h4>
                  <p className="text-muted">Try adjusting your search query or selecting another category.</p>
                  <button
                    className="btn btn-scw-outline-dark mt-2"
                    onClick={() => {
                      setSearchKeyword('');
                      setSelectedCategory('All');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .service-img-box {
          height: 240px;
          overflow: hidden;
        }
        .service-img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .scw-card:hover .service-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};
