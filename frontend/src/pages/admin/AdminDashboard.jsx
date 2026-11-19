import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  Car,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Settings,
  Package,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => {
        setStats(res.data.stats || {});
        setRecentBookings(res.data.recentBookings || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return <span className="badge bg-primary">Confirmed</span>;
      case 'IN_PROGRESS': return <span className="badge bg-info text-dark">In Progress</span>;
      case 'COMPLETED': return <span className="badge bg-success">Completed</span>;
      case 'CANCELLED': return <span className="badge bg-danger">Cancelled</span>;
      default: return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Admin Navigation Pills */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
          <div>
            <span className="badge-scw-accent mb-1 d-inline-block">Master Control</span>
            <h1 className="h2 fw-bold text-primary mb-0">Administrator Dashboard</h1>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/admin/bookings" className="btn btn-scw-outline-dark btn-sm px-3 py-2 fw-semibold">
              <CalendarCheck size={14} className="me-1 inline" /> Bookings
            </Link>
            <Link to="/admin/services" className="btn btn-scw-outline-dark btn-sm px-3 py-2 fw-semibold">
              <Sparkles size={14} className="me-1 inline" /> Services
            </Link>
            <Link to="/admin/packages" className="btn btn-scw-outline-dark btn-sm px-3 py-2 fw-semibold">
              <Package size={14} className="me-1 inline" /> Packages
            </Link>
            <Link to="/admin/users" className="btn btn-scw-outline-dark btn-sm px-3 py-2 fw-semibold">
              <Users size={14} className="me-1 inline" /> Customers
            </Link>
            <Link to="/admin/reports" className="btn btn-scw-secondary btn-sm px-3 py-2 fw-semibold">
              <BarChart3 size={14} className="me-1 inline" /> Reports & Analytics
            </Link>
          </div>
        </div>

        {/* STATS METRIC TILES */}
        {!loading && stats && (
          <div className="row g-3 mb-4">
            <div className="col-xl-3 col-md-6">
              <div className="scw-card p-4 h-100 d-flex justify-content-between align-items-center border-start border-4 border-primary">
                <div>
                  <span className="text-muted small fw-semibold d-block mb-1">Total Revenue</span>
                  <h3 className="fw-bold text-primary mb-0">₹{stats.totalRevenue?.toLocaleString()}</h3>
                  <span className="small text-muted">This month: ₹{stats.monthlyRevenue?.toLocaleString()}</span>
                </div>
                <div className="admin-stat-icon bg-primary bg-opacity-10 text-primary">
                  <IndianRupee size={24} />
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="scw-card p-4 h-100 d-flex justify-content-between align-items-center border-start border-4 border-accent">
                <div>
                  <span className="text-muted small fw-semibold d-block mb-1">Total Bookings</span>
                  <h3 className="fw-bold text-accent mb-0">{stats.totalBookings}</h3>
                  <span className="small text-muted">{stats.todayBookings} scheduled for today</span>
                </div>
                <div className="admin-stat-icon bg-info bg-opacity-10 text-accent">
                  <CalendarCheck size={24} />
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="scw-card p-4 h-100 d-flex justify-content-between align-items-center border-start border-4 border-success">
                <div>
                  <span className="text-muted small fw-semibold d-block mb-1">Completed Services</span>
                  <h3 className="fw-bold text-success mb-0">{stats.completedBookings}</h3>
                  <span className="small text-muted">{stats.pendingBookings} awaiting confirmation</span>
                </div>
                <div className="admin-stat-icon bg-success bg-opacity-10 text-success">
                  <CheckCircle2 size={24} />
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="scw-card p-4 h-100 d-flex justify-content-between align-items-center border-start border-4 border-warning">
                <div>
                  <span className="text-muted small fw-semibold d-block mb-1">Active Customers</span>
                  <h3 className="fw-bold text-primary mb-0">{stats.totalCustomers}</h3>
                  <span className="small text-muted">{stats.totalVehicles} registered cars</span>
                </div>
                <div className="admin-stat-icon bg-warning bg-opacity-10 text-warning">
                  <Users size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECENT BOOKINGS TABLE */}
        <div className="scw-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="h5 fw-bold text-primary mb-0">Recent System Bookings</h4>
            <Link to="/admin/bookings" className="small text-accent fw-bold text-decoration-none">
              View All Bookings <ArrowRight size={14} className="inline ms-1" />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Booking Ref</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Date & Time</th>
                  <th>Facility</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id || b.id}>
                    <td className="fw-bold font-monospace text-primary">#{b.bookingReference}</td>
                    <td>
                      <div className="fw-semibold">{b.user?.fullName || 'Customer'}</div>
                      <div className="text-muted small">{b.user?.phone}</div>
                    </td>
                    <td>
                      <div>{b.vehicleSnapshot?.brand} {b.vehicleSnapshot?.model}</div>
                      <span className="license-plate small" style={{ fontSize: '0.7rem' }}>{b.vehicleSnapshot?.registrationNumber}</span>
                    </td>
                    <td>
                      <div>{b.bookingDate}</div>
                      <div className="text-muted small">{b.timeSlot}</div>
                    </td>
                    <td>{b.center?.centerName}</td>
                    <td className="fw-bold text-primary">₹{b.finalAmount}</td>
                    <td>{getStatusBadge(b.bookingStatus)}</td>
                  </tr>
                ))}

                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      No system bookings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .admin-stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
