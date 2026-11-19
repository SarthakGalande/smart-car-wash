import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CalendarPlus,
  Car,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
  ArrowRight,
  MapPin,
  Calendar,
  Gauge
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings'),
      api.get('/vehicles')
    ])
      .then(([bookingsRes, vehiclesRes]) => {
        setBookings(bookingsRes.data.bookings || []);
        setVehicles(vehiclesRes.data.vehicles || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const totalBookings = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter((b) => b.bookingDate >= todayStr && b.bookingStatus !== 'CANCELLED').length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'COMPLETED').length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'CANCELLED').length;
  const totalSpent = bookings
    .filter((b) => b.bookingStatus !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

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
        {/* WELCOME BANNER */}
        <div className="dashboard-banner scw-card p-4 p-md-5 mb-5 text-white position-relative overflow-hidden">
          <div className="row align-items-center position-relative z-1">
            <div className="col-lg-8">
              <span className="badge-scw-accent mb-2 d-inline-block">Customer Dashboard</span>
              <h1 className="h1 fw-bold text-white mb-2">
                Welcome back, {user?.fullName}! 👋
              </h1>
              <p className="text-light opacity-75 mb-4 fs-5">
                Manage your garage, schedule high-gloss washes, view upcoming appointments, and access digital invoices.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/booking" className="btn btn-scw-primary px-4 py-3">
                  <CalendarPlus size={18} className="me-1" /> Book New Wash
                </Link>
                <Link to="/dashboard/vehicles" className="btn btn-scw-secondary px-4 py-3">
                  <Car size={18} className="me-1" /> Add / Manage Vehicles
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center d-none d-lg-block">
              <Gauge size={130} className="text-accent opacity-50" />
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY */}
        <div className="row g-3 mb-4">
          <div className="col-xl-2 col-md-4 col-6">
            <div className="scw-card p-3 h-100 text-center">
              <span className="text-muted small fw-semibold d-block mb-1">Total Bookings</span>
              <h3 className="fw-bold text-primary mb-0">{totalBookings}</h3>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <div className="scw-card p-3 h-100 text-center border-start border-4 border-accent">
              <span className="text-muted small fw-semibold d-block mb-1">Upcoming</span>
              <h3 className="fw-bold text-accent mb-0">{upcomingBookings}</h3>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <div className="scw-card p-3 h-100 text-center border-start border-4 border-success">
              <span className="text-muted small fw-semibold d-block mb-1">Completed</span>
              <h3 className="fw-bold text-success mb-0">{completedBookings}</h3>
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <div className="scw-card p-3 h-100 text-center border-start border-4 border-danger">
              <span className="text-muted small fw-semibold d-block mb-1">Cancelled</span>
              <h3 className="fw-bold text-danger mb-0">{cancelledBookings}</h3>
            </div>
          </div>
          <div className="col-xl-4 col-md-8 col-12">
            <div className="scw-card p-3 h-100 d-flex align-items-center justify-content-between px-4">
              <div>
                <span className="text-muted small fw-semibold d-block mb-1">Total Money Invested</span>
                <h3 className="fw-bold text-primary mb-0">₹{totalSpent.toFixed(2)}</h3>
              </div>
              <div className="stat-icon-circle bg-primary bg-opacity-10 text-primary">
                <Wallet size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* RECENT BOOKINGS */}
          <div className="col-lg-8">
            <div className="scw-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="h5 fw-bold text-primary mb-0">Recent Appointments</h4>
                <Link to="/dashboard/my-bookings" className="small text-accent fw-bold text-decoration-none">
                  View All <ArrowRight size={14} className="inline ms-1" />
                </Link>
              </div>

              {bookings.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <Clock size={40} className="mb-2 mx-auto d-block opacity-50" />
                  <p>No bookings found yet. Book your first wash today!</p>
                  <Link to="/booking" className="btn btn-sm btn-scw-primary mt-2">Book Now</Link>
                </div>
              )}

              <div className="d-flex flex-column gap-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id || booking.id} className="scw-card p-3 border bg-white">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                      <div>
                        <span className="fw-bold text-primary me-2">#{booking.bookingReference}</span>
                        {getStatusBadge(booking.bookingStatus)}
                      </div>
                      <span className="h6 fw-bold text-primary mb-0">₹{booking.finalAmount}</span>
                    </div>

                    <div className="row g-2 text-muted small">
                      <div className="col-sm-6">
                        <Car size={14} className="text-accent me-1 inline" />
                        <strong>{booking.vehicleSnapshot?.brand || booking.vehicle?.brand} {booking.vehicleSnapshot?.model || booking.vehicle?.model}</strong>
                        <span className="license-plate ms-2 small">{booking.vehicleSnapshot?.registrationNumber || booking.vehicle?.registrationNumber}</span>
                      </div>
                      <div className="col-sm-6">
                        <Calendar size={14} className="text-accent me-1 inline" />
                        {booking.bookingDate} ({booking.timeSlot})
                      </div>
                      <div className="col-12">
                        <MapPin size={14} className="text-accent me-1 inline" />
                        {booking.center?.centerName}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                      <Link to="/dashboard/my-bookings" className="btn btn-sm btn-scw-outline-dark py-1 px-3">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SAVED VEHICLES PREVIEW */}
          <div className="col-lg-4">
            <div className="scw-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="h5 fw-bold text-primary mb-0">Registered Cars</h4>
                <Link to="/dashboard/vehicles" className="small text-accent fw-bold text-decoration-none">
                  Manage <ArrowRight size={14} className="inline ms-1" />
                </Link>
              </div>

              {vehicles.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <Car size={40} className="mb-2 mx-auto d-block opacity-50" />
                  <p className="small">No vehicles added yet.</p>
                  <Link to="/dashboard/vehicles" className="btn btn-sm btn-scw-outline-dark mt-1">Add Vehicle</Link>
                </div>
              )}

              <div className="d-flex flex-column gap-3">
                {vehicles.map((car) => (
                  <div key={car._id || car.id} className="p-3 rounded-3 border bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="fw-bold mb-0 text-primary">{car.brand} {car.model}</h6>
                      <span className="badge bg-secondary small">{car.vehicleType}</span>
                    </div>
                    <div className="mt-2 d-flex justify-content-between align-items-center">
                      <span className="license-plate">{car.registrationNumber}</span>
                      <span className="small text-muted">{car.color}</span>
                    </div>
                  </div>
                ))}

                <Link to="/dashboard/vehicles" className="btn btn-sm btn-scw-outline-dark w-100 mt-2">
                  + Add Another Car
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-banner {
          background: linear-gradient(135deg, #18191B 0%, #23262B 100%);
          border: 1.5px solid rgba(58,182,255,0.15);
          border-radius: 18px;
        }
        .stat-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

