import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Package as PackageIcon } from 'lucide-react';

export const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    price: 399,
    duration: 60,
    features: '',
    popular: false,
    badge: ''
  });

  const toast = useToast();

  const loadPackages = () => {
    setLoading(true);
    api.get('/packages')
      .then((res) => {
        setPackages(res.data.packages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      packageName: '',
      description: '',
      price: 399,
      duration: 60,
      features: '',
      popular: false,
      badge: ''
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setIsEditing(true);
    setEditingId(p._id || p.id);
    setFormData({
      packageName: p.packageName,
      description: p.description,
      price: p.price,
      duration: p.duration,
      features: Array.isArray(p.features) ? p.features.join(', ') : '',
      popular: !!p.popular,
      badge: p.badge || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing && editingId) {
        await api.put(`/packages/admin/${editingId}`, formData);
        toast.success('Package updated successfully!');
      } else {
        await api.post('/packages/admin', formData);
        toast.success('Package created successfully!');
      }
      setShowModal(false);
      loadPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save package.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete package "${name}"?`)) {
      try {
        await api.delete(`/packages/admin/${id}`);
        toast.success('Package deleted.');
        loadPackages();
      } catch (err) {
        toast.error('Failed to delete package.');
      }
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="section-tag">Value Bundles</span>
            <h1 className="h3 fw-bold text-primary mb-1">Package Plan Manager</h1>
            <p className="text-muted small mb-0">Configure car wash bundles, duration, and feature sets.</p>
          </div>
          <button className="btn btn-scw-primary" onClick={openAddModal}>
            <Plus size={16} className="me-1 inline" /> Add Package
          </button>
        </div>

        {/* Packages Grid */}
        <div className="row g-4">
          {packages.map((pkg) => (
            <div key={pkg._id || pkg.id} className="col-md-6 col-lg-3">
              <div className="scw-card p-4 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-primary mb-0">{pkg.packageName}</h5>
                  {pkg.badge && <span className="badge bg-warning text-dark small">{pkg.badge}</span>}
                </div>
                <div className="h3 fw-bold text-primary my-2">₹{pkg.price}</div>
                <div className="small text-muted mb-3">{pkg.duration} mins duration</div>
                <p className="small text-secondary mb-3">{pkg.description}</p>
                <ul className="list-unstyled small flex-grow-1 text-muted">
                  {(pkg.features || []).map((f, i) => (
                    <li key={i} className="mb-1">• {f}</li>
                  ))}
                </ul>
                <div className="d-flex gap-2 pt-3 border-top mt-auto">
                  <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => openEditModal(pkg)}>
                    <Edit size={14} className="me-1 inline" /> Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(pkg._id || pkg.id, pkg.packageName)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scw-card border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {isEditing ? 'Edit Package' : 'Create Package'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Package Name *</label>
                      <input
                        type="text"
                        className="form-control scw-input"
                        value={formData.packageName}
                        onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control scw-input"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-semibold">Duration (Mins) *</label>
                        <input
                          type="number"
                          className="form-control scw-input"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Badge (e.g. Most Popular)</label>
                      <input
                        type="text"
                        className="form-control scw-input"
                        placeholder="e.g. Most Popular, Best Value"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Description *</label>
                      <textarea
                        className="form-control scw-input"
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Features (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control scw-input"
                        placeholder="Feature 1, Feature 2, Feature 3"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      />
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="pkgPopularSwitch"
                        checked={formData.popular}
                        onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      />
                      <label className="form-check-label small fw-semibold" htmlFor="pkgPopularSwitch">
                        Mark as Featured on Homepage
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-scw-primary btn-sm px-4" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Save Package'}
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
