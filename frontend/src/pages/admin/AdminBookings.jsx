import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Calendar, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  const toast = useToast();

  const loadBookings = () => {
    setLoading(true);
    let url = '/admin/bookings?';
    if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
    if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;
    if (dateFilter) url += `date=${dateFilter}&`;

    api.get(url)
      .then((res) => {
        setBookings(res.data.bookings || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/admin/bookings/${id}/status`, { status: newStatus });
      toast.success(res.data.message || `Booking updated to ${newStatus}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: newStatus } : b))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-primary';
      case 'IN_PROGRESS': return 'bg-info text-dark';
      case 'COMPLETED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="section-tag">Operations</span>
          <h1 className="h3 fw-bold text-primary mb-1">Booking Operations Manager</h1>
          <p className="text-muted small mb-0">Review appointments, update fulfillment statuses, and manage slot changes.</p>
        </div>

        {/* Filters Toolbar */}
        <div className="scw-card p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control scw-input border-start-0 ps-0"
                  placeholder="Search Ref # or Vehicle plate..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadBookings()}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select scw-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control scw-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-scw-primary w-100" onClick={loadBookings}>
                Filter
              </button>
              {(statusFilter !== 'ALL' || dateFilter || search) && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => { setStatusFilter('ALL'); setDateFilter(''); setSearch(''); }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="scw-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Booking Ref</th>
                  <th>Customer</th>
                  <th>Vehicle Details</th>
                  <th>Date & Slot</th>
                  <th>Center</th>
                  <th>Amount</th>
                  <th>Current Status</th>
                  <th>Action / Change Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id || b.id}>
                    <td className="fw-bold font-monospace text-primary">#{b.bookingReference}</td>
                    <td>
                      <div className="fw-bold">{b.user?.fullName || 'Customer'}</div>
                      <div className="text-muted small">{b.user?.email}</div>
                      <div className="text-muted small">{b.user?.phone}</div>
                    </td>
                    <td>
                      <div>{b.vehicleSnapshot?.brand} {b.vehicleSnapshot?.model}</div>
                      <span className="license-plate small" style={{ fontSize: '0.68rem' }}>{b.vehicleSnapshot?.registrationNumber}</span>
                    </td>
                    <td>
                      <div className="fw-semibold">{b.bookingDate}</div>
                      <div className="text-muted small">{b.timeSlot}</div>
                    </td>
                    <td>{b.center?.centerName}</td>
                    <td>
                      <div className="fw-bold text-primary">₹{b.finalAmount}</div>
                      <span className="text-muted small">{b.paymentMethod}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(b.bookingStatus)}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm scw-input py-1"
                        style={{ minWidth: 140 }}
                        value={b.bookingStatus}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No matching bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
