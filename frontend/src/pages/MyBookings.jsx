import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  Search,
  FileText,
  XCircle,
  CalendarDays,
  Star,
  Printer,
  ChevronRight
} from 'lucide-react';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchRef, setSearchRef] = useState('');

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const loadBookings = () => {
    setLoading(true);
    let url = '/bookings';
    if (activeTab !== 'all') {
      url += `?filter=${activeTab}`;
    }

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
  }, [activeTab]);

  // Reschedule Slots fetch
  useEffect(() => {
    if (selectedBooking && rescheduleDate) {
      setLoadingSlots(true);
      const centerId = selectedBooking.center?._id || selectedBooking.center;
      api.get(`/availability?centerId=${centerId}&date=${rescheduleDate}`)
        .then((res) => {
          setRescheduleSlots(res.data.slots || []);
          setSelectedNewSlot(null);
          setLoadingSlots(false);
        })
        .catch(() => {
          setRescheduleSlots([]);
          setLoadingSlots(false);
        });
    }
  }, [selectedBooking, rescheduleDate]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const res = await api.put(`/bookings/${selectedBooking._id}/cancel`, { reason: cancelReason });
      toast.success(res.data.message || 'Booking cancelled.');
      setShowCancelModal(false);
      setCancelReason('');
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleBooking = async () => {
    if (!selectedBooking || !selectedNewSlot || !rescheduleDate) {
      toast.warning('Please select a valid new date and slot.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.put(`/bookings/${selectedBooking._id}/reschedule`, {
        newDate: rescheduleDate,
        newTimeSlot: selectedNewSlot.timeSlot,
        newSlotId: selectedNewSlot.id
      });
      toast.success(res.data.message || 'Booking rescheduled successfully!');
      setShowRescheduleModal(false);
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reschedule.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    if (!reviewComment.trim()) {
      toast.warning('Please write a short comment about your experience.');
      return;
    }

    setActionLoading(true);
    try {
      await api.post('/reviews', {
        bookingId: selectedBooking._id,
        rating: reviewRating,
        comment: reviewComment,
        packageId: selectedBooking.package?._id || selectedBooking.package
      });
      toast.success('Thank you for submitting your review!');
      setShowReviewModal(false);
      setReviewComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setActionLoading(false);
    }
  };

  const openInvoice = async (booking) => {
    try {
      const res = await api.get(`/bookings/${booking._id}/invoice`);
      setInvoiceData(res.data.invoice);
      setShowInvoiceModal(true);
    } catch (err) {
      toast.error('Failed to load invoice.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchRef.trim()) return true;
    const q = searchRef.toLowerCase();
    return (
      b.bookingReference.toLowerCase().includes(q) ||
      (b.vehicleSnapshot?.registrationNumber || '').toLowerCase().includes(q)
    );
  });

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
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
          <div>
            <span className="section-tag">Appointment Log</span>
            <h1 className="h2 fw-bold text-primary mb-1">My Booking History</h1>
            <p className="text-muted fs-6 mb-0">Track, reschedule, download invoices, or submit reviews for your appointments.</p>
          </div>
          <Link to="/booking" className="btn btn-scw-primary px-4 py-3">
            + Book New Wash
          </Link>
        </div>

        {/* Filter Tabs & Search */}
        <div className="scw-card p-4 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <div className="d-flex flex-wrap gap-2">
                {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`filter-pill text-capitalize ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control scw-input border-start-0 ps-0"
                  placeholder="Search by Reference # or License Plate..."
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {!loading && (
          <div className="row g-3">
            {filteredBookings.map((b) => (
              <div key={b._id || b.id} className="col-12">
                <div className="scw-card p-4">
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                    <div>
                      <span className="h5 fw-bold text-primary me-2">#{b.bookingReference}</span>
                      {getStatusBadge(b.bookingStatus)}
                      <span className="badge bg-light text-secondary border ms-2">Payment: {b.paymentStatus}</span>
                    </div>
                    <div className="text-end">
                      <span className="h4 fw-bold text-primary mb-0">₹{b.finalAmount}</span>
                      <span className="text-muted small d-block">({b.paymentMethod})</span>
                    </div>
                  </div>

                  <div className="row g-3 text-secondary small mb-3">
                    <div className="col-md-4">
                      <Car size={16} className="text-accent me-1 inline" />
                      <strong>{b.vehicleSnapshot?.brand || b.vehicle?.brand} {b.vehicleSnapshot?.model || b.vehicle?.model}</strong>
                      <span className="license-plate ms-2 small">{b.vehicleSnapshot?.registrationNumber || b.vehicle?.registrationNumber}</span>
                    </div>
                    <div className="col-md-4">
                      <Calendar size={16} className="text-accent me-1 inline" />
                      <strong>{b.bookingDate}</strong> ({b.timeSlot})
                    </div>
                    <div className="col-md-4">
                      <MapPin size={16} className="text-accent me-1 inline" />
                      {b.center?.centerName}
                    </div>
                  </div>

                  {b.package && (
                    <div className="small text-muted mb-3">
                      <strong>Treatment:</strong> Package: {b.package.packageName}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap gap-2 justify-content-end pt-3 border-top">
                    <button
                      className="btn btn-sm btn-scw-outline-dark px-3 py-2 fw-semibold"
                      onClick={() => { setSelectedBooking(b); setShowDetailsModal(true); }}
                    >
                      View Details
                    </button>

                    <button
                      className="btn btn-sm btn-scw-secondary px-3 py-2 fw-semibold"
                      onClick={() => openInvoice(b)}
                    >
                      <Printer size={14} className="me-1 inline" /> Invoice
                    </button>

                    {['CONFIRMED', 'PENDING'].includes(b.bookingStatus) && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary px-3 py-2 fw-semibold"
                          onClick={() => {
                            setSelectedBooking(b);
                            const t = new Date();
                            t.setDate(t.getDate() + 1);
                            setRescheduleDate(t.toISOString().split('T')[0]);
                            setShowRescheduleModal(true);
                          }}
                        >
                          <CalendarDays size={14} className="me-1 inline" /> Reschedule
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger px-3 py-2 fw-semibold"
                          onClick={() => { setSelectedBooking(b); setShowCancelModal(true); }}
                        >
                          <XCircle size={14} className="me-1 inline" /> Cancel
                        </button>
                      </>
                    )}

                    {b.bookingStatus === 'COMPLETED' && (
                      <button
                        className="btn btn-sm btn-scw-primary px-3 py-2 fw-bold"
                        onClick={() => { setSelectedBooking(b); setShowReviewModal(true); }}
                      >
                        <Star size={14} className="me-1 inline" /> Review Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredBookings.length === 0 && (
              <div className="col-12 text-center py-5 text-muted">
                <FileText size={48} className="opacity-50 mb-2 mx-auto" />
                <h5 className="fw-bold">No bookings found</h5>
                <p className="small">Try picking a different tab or book a new appointment.</p>
              </div>
            )}
          </div>
        )}

        {/* MODAL: VIEW DETAILS */}
        {showDetailsModal && selectedBooking && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scw-card border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Booking #{selectedBooking.bookingReference}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
                </div>
                <div className="modal-body p-4 small">
                  <div className="mb-2"><strong>Status:</strong> {selectedBooking.bookingStatus}</div>
                  <div className="mb-2"><strong>Date & Time:</strong> {selectedBooking.bookingDate} ({selectedBooking.timeSlot})</div>
                  <div className="mb-2"><strong>Vehicle:</strong> {selectedBooking.vehicleSnapshot?.brand} {selectedBooking.vehicleSnapshot?.model} ({selectedBooking.vehicleSnapshot?.registrationNumber})</div>
                  <div className="mb-2"><strong>Wash Facility:</strong> {selectedBooking.center?.centerName} ({selectedBooking.center?.address})</div>
                  <div className="mb-2"><strong>Payment Method:</strong> {selectedBooking.paymentMethod} ({selectedBooking.paymentStatus})</div>
                  <div className="mb-2"><strong>Base Price:</strong> ₹{selectedBooking.basePrice}</div>
                  <div className="mb-2"><strong>GST Tax (18%):</strong> ₹{selectedBooking.taxAmount}</div>
                  <div className="mb-2"><strong>Discount Applied:</strong> ₹{selectedBooking.discountAmount}</div>
                  <div className="h5 fw-bold text-primary mt-3">Total Amount: ₹{selectedBooking.finalAmount}</div>
                  {selectedBooking.notes && (
                    <div className="mt-2 text-muted fst-italic">Notes: "{selectedBooking.notes}"</div>
                  )}
                </div>
                <div className="modal-footer bg-light">
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RESCHEDULE */}
        {showRescheduleModal && selectedBooking && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scw-card border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Reschedule #{selectedBooking.bookingReference}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRescheduleModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <label className="form-label small fw-semibold">Choose New Date</label>
                  <input
                    type="date"
                    className="form-control scw-input mb-3"
                    min={new Date().toISOString().split('T')[0]}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />

                  <label className="form-label small fw-semibold">Choose Available Slot</label>
                  {loadingSlots ? (
                    <div className="text-center py-3"><span className="spinner-border spinner-border-sm"></span> Loading slots...</div>
                  ) : (
                    <div className="row g-2">
                      {rescheduleSlots.map((slot) => {
                        const isSelected = selectedNewSlot?.id === slot.id;
                        return (
                          <div key={slot.id} className="col-6">
                            <button
                              type="button"
                              disabled={!slot.isAvailable}
                              className={`btn btn-sm w-100 p-2 text-start ${isSelected ? 'btn-primary' : 'btn-outline-secondary'} ${!slot.isAvailable ? 'disabled opacity-50' : ''}`}
                              onClick={() => setSelectedNewSlot(slot)}
                            >
                              <div className="fw-bold">{slot.timeSlot}</div>
                              <div className="small">{slot.isAvailable ? `${slot.remainingSpots} spot(s)` : 'Full'}</div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="modal-footer bg-light">
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                  <button
                    className="btn btn-sm btn-scw-primary px-4"
                    disabled={!selectedNewSlot || actionLoading}
                    onClick={handleRescheduleBooking}
                  >
                    {actionLoading ? 'Updating...' : 'Confirm Reschedule'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CANCEL */}
        {showCancelModal && selectedBooking && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scw-card border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold text-danger">Cancel Booking #{selectedBooking.bookingReference}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <p className="small text-muted">
                    Are you sure you want to cancel this booking for <strong>{selectedBooking.bookingDate}</strong>? The reserved time slot will be released back to the general availability pool.
                  </p>
                  <label className="form-label small fw-semibold">Reason for Cancellation (Optional)</label>
                  <textarea
                    className="form-control scw-input"
                    rows={3}
                    placeholder="e.g. Change of plans, weather conditions..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer bg-light">
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowCancelModal(false)}>Keep Booking</button>
                  <button
                    className="btn btn-sm btn-danger px-4"
                    disabled={actionLoading}
                    onClick={handleCancelBooking}
                  >
                    {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REVIEW SERVICE */}
        {showReviewModal && selectedBooking && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scw-card border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Leave Service Feedback</h5>
                  <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3 text-center">
                    <label className="form-label small fw-semibold d-block">Overall Rating</label>
                    <div className="d-flex justify-content-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="btn btn-link p-1 text-warning"
                          onClick={() => setReviewRating(s)}
                        >
                          <Star size={28} className={s <= reviewRating ? 'fill-warning' : 'opacity-25'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Written Review *</label>
                    <textarea
                      className="form-control scw-input"
                      rows={4}
                      placeholder="Share your thoughts on the cleaning quality, punctuality, and staff courtesy..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
                  <button
                    className="btn btn-sm btn-scw-primary px-4"
                    disabled={actionLoading}
                    onClick={handleSubmitReview}
                  >
                    {actionLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINTABLE INVOICE */}
        {showInvoiceModal && invoiceData && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content scw-card border-0 p-3">
                <div className="modal-header border-0 pb-0">
                  <button type="button" className="btn-close" onClick={() => setShowInvoiceModal(false)}></button>
                </div>
                <div className="modal-body p-4 pt-0">
                  {/* Branded Header */}
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                      <h4 className="fw-bold text-primary mb-0">SMART CAR WASH</h4>
                      <div className="small text-muted">Official Booking Invoice & Tax Receipt</div>
                    </div>
                    <div className="text-end">
                      <div className="h6 fw-bold text-primary mb-0">{invoiceData.invoiceNumber}</div>
                      <div className="small text-muted">{new Date(invoiceData.invoiceDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Customer & Facility info */}
                  <div className="row g-3 small mb-4">
                    <div className="col-6">
                      <h6 className="fw-bold text-primary mb-1">Billed To:</h6>
                      <div>{invoiceData.customer?.name}</div>
                      <div className="text-muted">{invoiceData.customer?.email}</div>
                      <div className="text-muted">{invoiceData.customer?.phone}</div>
                    </div>
                    <div className="col-6 text-end">
                      <h6 className="fw-bold text-primary mb-1">Service Center:</h6>
                      <div>{invoiceData.center?.centerName}</div>
                      <div className="text-muted">{invoiceData.center?.address}</div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <table className="table table-bordered small">
                    <thead className="table-light">
                      <tr>
                        <th>Item Description</th>
                        <th className="text-end" style={{ width: 120 }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.description}</td>
                          <td className="text-end">₹{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="fw-bold">Subtotal</td>
                        <td className="text-end fw-bold">₹{invoiceData.pricing?.basePrice.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>GST Tax ({invoiceData.pricing?.taxRatePercent}%)</td>
                        <td className="text-end">₹{invoiceData.pricing?.taxAmount.toFixed(2)}</td>
                      </tr>
                      {invoiceData.pricing?.discountAmount > 0 && (
                        <tr className="text-success">
                          <td>Promotional Discount</td>
                          <td className="text-end">-₹{invoiceData.pricing?.discountAmount.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="table-light fw-bold fs-6">
                        <td>Final Total Paid</td>
                        <td className="text-end text-primary">₹{invoiceData.pricing?.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="text-center pt-3 mt-3 border-top d-print-none">
                    <button className="btn btn-scw-primary me-2" onClick={() => window.print()}>
                      <Printer size={16} className="me-1 inline" /> Print Invoice
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => setShowInvoiceModal(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
