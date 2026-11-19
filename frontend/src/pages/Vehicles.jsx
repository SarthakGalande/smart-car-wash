import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Car, Plus, Star, MoreVertical, Edit, Trash2, Droplets } from 'lucide-react';

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    registrationNumber: '',
    vehicleType: 'Sedan',
    fuelType: 'Petrol',
    color: 'White',
    isDefault: false
  });

  const toast = useToast();

  const loadVehicles = () => {
    setLoading(true);
    api.get('/vehicles')
      .then((res) => {
        setVehicles(res.data.vehicles || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      brand: '',
      model: '',
      registrationNumber: '',
      vehicleType: 'Sedan',
      fuelType: 'Petrol',
      color: 'White',
      isDefault: vehicles.length === 0
    });
    setShowModal(true);
  };

  const openEditModal = (car) => {
    setIsEditing(true);
    setEditingId(car._id || car.id);
    setFormData({
      brand: car.brand,
      model: car.model,
      registrationNumber: car.registrationNumber,
      vehicleType: car.vehicleType || 'Sedan',
      fuelType: car.fuelType || 'Petrol',
      color: car.color || 'White',
      isDefault: !!car.isDefault
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.registrationNumber) {
      toast.warning('Please enter vehicle brand, model, and registration number.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && editingId) {
        const res = await api.put(`/vehicles/${editingId}`, formData);
        toast.success(res.data.message || 'Vehicle updated successfully!');
      } else {
        const res = await api.post('/vehicles', formData);
        toast.success(res.data.message || 'Vehicle added to your garage!');
      }
      setShowModal(false);
      loadVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (car) => {
    const id = car._id || car.id;
    if (!id) return;

    if (window.confirm(`Are you sure you want to remove ${car.brand} ${car.model} (${car.registrationNumber})?`)) {
      try {
        const res = await api.delete(`/vehicles/${id}`);
        toast.success(res.data.message || 'Vehicle deleted.');
        loadVehicles();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete vehicle.');
      }
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
          <div>
            <span className="section-tag">My Garage</span>
            <h1 className="h2 fw-bold text-primary mb-1">Vehicle Management</h1>
            <p className="text-muted mb-0 fs-6">Register and manage your cars for instant one-click wash bookings.</p>
          </div>
          <button className="btn btn-scw-primary px-4 py-3" onClick={openAddModal}>
            <Plus size={18} className="me-1" /> Add New Vehicle
          </button>
        </div>

        {/* Vehicles Grid */}
        {!loading && (
          <div className="row g-4">
            {vehicles.map((car) => (
              <div key={car._id || car.id} className="col-lg-4 col-md-6">
                <div className={`scw-card p-4 h-100 position-relative d-flex flex-column ${car.isDefault ? 'border-accent shadow-md' : ''}`}>
                  {car.isDefault && (
                    <span className="badge-scw-accent position-absolute top-0 end-0 m-3">
                      <Star size={12} className="fill-current me-1 inline" /> Primary Car
                    </span>
                  )}

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="vehicle-icon-circle">
                      <Car size={26} className="text-accent" />
                    </div>
                    <div>
                      <h5 className="fw-bold text-primary mb-0">{car.brand} {car.model}</h5>
                      <span className="badge bg-light text-secondary border small">{car.vehicleType}</span>
                      {car.fuelType && (
                        <span className="badge bg-light text-secondary border small ms-1">{car.fuelType}</span>
                      )}
                    </div>
                  </div>

                  {/* License Plate */}
                  <div className="my-3 py-2 bg-light rounded-3 text-center border">
                    <span className="license-plate fs-6">{car.registrationNumber}</span>
                    <div className="small text-muted mt-1">
                      Color: <strong className="text-dark">{car.color || 'Standard'}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <Link to={`/booking?vehicleId=${car._id || car.id}`} className="btn btn-scw-outline-dark py-2 px-3 fw-bold small">
                      <Droplets size={14} className="me-1 inline" /> Wash This Car
                    </Link>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-light text-primary" onClick={() => openEditModal(car)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(car)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {vehicles.length === 0 && (
              <div className="col-12 text-center py-5">
                <div className="scw-card p-5 mx-auto" style={{ maxWidth: 500 }}>
                  <Car size={56} className="text-muted opacity-50 mb-3 mx-auto" />
                  <h4 className="fw-bold text-primary mb-2">No Vehicles Registered</h4>
                  <p className="text-muted small mb-4">Add your car once and enjoy swift, automated slot bookings whenever you need a wash.</p>
                  <button className="btn btn-scw-primary" onClick={openAddModal}>
                    <Plus size={18} className="me-1" /> Add Your First Vehicle
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scw-card border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-primary">
                    {isEditing ? 'Edit Vehicle Details' : 'Register New Vehicle'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Car Brand *</label>
                        <input
                          type="text"
                          className="form-control scw-input"
                          placeholder="e.g. BMW, Hyundai"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Car Model *</label>
                        <input
                          type="text"
                          className="form-control scw-input"
                          placeholder="e.g. 330i, Creta"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold small">Registration Number *</label>
                        <input
                          type="text"
                          className="form-control scw-input font-monospace text-uppercase"
                          placeholder="e.g. DL 01 AB 1234"
                          value={formData.registrationNumber}
                          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                          required
                        />
                        <div className="form-text small">Enter registration plate with state code.</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Vehicle Category *</label>
                        <select
                          className="form-select scw-input"
                          value={formData.vehicleType}
                          onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        >
                          <option value="Hatchback">Hatchback</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Pickup / Other">Pickup / Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Fuel Type</label>
                        <select
                          className="form-select scw-input"
                          value={formData.fuelType}
                          onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                        >
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric">Electric (EV)</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="CNG">CNG</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold small">Vehicle Color</label>
                        <input
                          type="text"
                          className="form-control scw-input"
                          placeholder="e.g. Portimao Blue, Polar White"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <div className="form-check form-switch mt-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="defaultCheck"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="defaultCheck">
                            Set as Primary Default Vehicle
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top bg-light">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-scw-primary btn-sm px-4" disabled={submitting}>
                      {submitting ? 'Saving...' : (isEditing ? 'Update Vehicle' : 'Save Vehicle')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .vehicle-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: rgba(183, 176, 158, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .border-accent {
          border: 2px solid #3AB6FF !important;
          box-shadow: 0 8px 24px rgba(183, 176, 158, 0.25);
        }
      `}</style>
    </div>
  );
};

