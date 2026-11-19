import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';

export const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    price: 199,
    duration: 30,
    category: 'Exterior',
    image: '',
    features: '',
    isPopular: false
  });

  const toast = useToast();

  const loadServices = () => {
    setLoading(true);
    api.get('/services')
      .then((res) => {
        setServices(res.data.services || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      serviceName: '',
      description: '',
      price: 199,
      duration: 30,
      category: 'Exterior',
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      features: '',
      isPopular: false
    });
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setIsEditing(true);
    setEditingId(s._id || s.id);
    setFormData({
      serviceName: s.serviceName,
      description: s.description,
      price: s.price,
      duration: s.duration,
      category: s.category || 'Exterior',
      image: s.image,
      features: Array.isArray(s.features) ? s.features.join(', ') : '',
      isPopular: !!s.isPopular
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing && editingId) {
        await api.put(`/services/admin/${editingId}`, formData);
        toast.success('Service updated successfully!');
      } else {
        await api.post('/services/admin', formData);
        toast.success('Service created successfully!');
      }
      setShowModal(false);
      loadServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete service "${name}"?`)) {
      try {
        await api.delete(`/services/admin/${id}`);
        toast.success('Service deleted.');
        loadServices();
      } catch (err) {
        toast.error('Failed to delete service.');
      }
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="section-tag">Catalog Management</span>
            <h1 className="h3 fw-bold text-primary mb-1">Services Manager</h1>
            <p className="text-muted small mb-0">Configure prices, treatment durations, and catalog services.</p>
          </div>
          <button className="btn btn-scw-primary" onClick={openAddModal}>
            <Plus size={16} className="me-1 inline" /> Add Service
          </button>
        </div>

        {/* Services List Table */}
        <div className="scw-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Popular</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id || s.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={s.image} alt={s.serviceName} className="rounded" style={{ width: 44, height: 44, objectFit: 'cover' }} />
                        <div>
                          <strong className="text-primary d-block">{s.serviceName}</strong>
                          <span className="text-muted text-truncate d-inline-block" style={{ maxWidth: 280 }}>{s.description}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-secondary">{s.category}</span></td>
                    <td className="fw-bold text-primary">₹{s.price}</td>
                    <td>{s.duration} mins</td>
                    <td>⭐ {s.rating || 4.8}</td>
                    <td>{s.isPopular ? '🔥 Yes' : 'No'}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-light text-primary me-2" onClick={() => openEditModal(s)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(s._id || s.id, s.serviceName)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content scw-card border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold text-primary">
                    {isEditing ? 'Edit Service' : 'Add New Service'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Service Name *</label>
                        <input
                          type="text"
                          className="form-control scw-input"
                          value={formData.serviceName}
                          onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Category</label>
                        <select
                          className="form-select scw-input"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="Exterior">Exterior</option>
                          <option value="Interior">Interior</option>
                          <option value="Complete">Complete</option>
                          <option value="Detailing">Detailing</option>
                          <option value="Specialized">Specialized</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control scw-input"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Duration (Minutes) *</label>
                        <input
                          type="number"
                          className="form-control scw-input"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Image URL</label>
                        <input
                          type="text"
                          className="form-control scw-input"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Description *</label>
                        <textarea
                          className="form-control scw-input"
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Features (Comma separated)</label>
                        <input
                          type="text"
                          className="form-control scw-input"
                          placeholder="e.g. High Pressure Rinse, Snow Foam Bath, Microfiber Dry"
                          value={formData.features}
                          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="popularSwitch"
                            checked={formData.isPopular}
                            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="popularSwitch">
                            Feature as Popular Service on Homepage
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-scw-primary btn-sm px-4" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Save Service'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
