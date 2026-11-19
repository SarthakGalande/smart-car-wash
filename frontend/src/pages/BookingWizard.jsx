import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Car,
  Package as PackageIcon,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Tag,
  ShieldCheck,
  AlertCircle,
  Download,
  Printer,
  Phone
} from 'lucide-react';
import { mockServices } from '../data/mockServices';
import { fallbackCenters, fallbackPackages, fallbackSlots } from '../data/mockBookingData';

export const BookingWizard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  // Wizard Step (1 to 8)
  const [currentStep, setCurrentStep] = useState(1);

  // Data Collections
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Selected Booking Form State
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingMode, setBookingMode] = useState('package'); // 'package' or 'custom'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  // Payment & Notes
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // 'CASH' or 'ONLINE'
  const [notes, setNotes] = useState('');

  // Confirmation result
  const [bookingResult, setBookingResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline Quick Add Vehicle Modal state
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newCar, setNewCar] = useState({ brand: '', model: '', registrationNumber: '', vehicleType: 'Sedan' });

  // Initial Data Fetch
  useEffect(() => {
    Promise.all([
      api.get('/vehicles'),
      api.get('/packages'),
      api.get('/services'),
      api.get('/wash-centers')
    ])
      .then(([vRes, pRes, sRes, cRes]) => {
        const vList = vRes.data.vehicles || [];
        const pList = (pRes.data.packages && pRes.data.packages.length > 0) ? pRes.data.packages : fallbackPackages;
        const sList = (sRes.data.services && sRes.data.services.length > 0) ? sRes.data.services : mockServices;
        const cList = (cRes.data.centers && cRes.data.centers.length > 0) ? cRes.data.centers : fallbackCenters;

        setVehicles(vList);
        setPackages(pList);
        setServices(sList);
        setCenters(cList);

        // Pre-select vehicle if in queryParams or default
        const queryVehId = searchParams.get('vehicleId');
        if (queryVehId) {
          const match = vList.find((v) => (v._id || v.id) === queryVehId);
          if (match) setSelectedVehicle(match);
        } else if (vList.length > 0) {
          const def = vList.find((v) => v.isDefault) || vList[0];
          setSelectedVehicle(def);
        }

        // Pre-select package or service if in queryParams
        const queryPkgId = searchParams.get('packageId');
        const querySvcId = searchParams.get('serviceId');
        if (queryPkgId) {
          const match = pList.find((p) => (p._id || p.id) === queryPkgId);
          if (match) {
            setSelectedPackage(match);
            setBookingMode('package');
          }
        } else if (querySvcId) {
          const match = sList.find((s) => (s._id || s.id) === querySvcId);
          if (match) {
            setSelectedServices([match]);
            setBookingMode('custom');
          }
        } else if (pList.length > 0) {
          // Default to Premium or first
          setSelectedPackage(pList.find((p) => p.popular) || pList[0]);
        }

        // Pre-select first center
        if (cList.length > 0) {
          setSelectedCenter(cList[0]);
        }
      })
      .catch(() => {
        setPackages(fallbackPackages);
        setServices(mockServices);
        setCenters(fallbackCenters);
        setSelectedPackage(fallbackPackages[0]);
        setSelectedCenter(fallbackCenters[0]);
      });
  }, [searchParams]);

  // Fetch slots whenever center or date changes
  useEffect(() => {
    if (selectedCenter && selectedDate) {
      setLoadingSlots(true);
      const centerId = selectedCenter._id || selectedCenter.id;
      api.get(`/availability?centerId=${centerId}&date=${selectedDate}`)
        .then((res) => {
          const slots = (res.data.slots && res.data.slots.length > 0) ? res.data.slots : fallbackSlots;
          setAvailableSlots(slots);
          setSelectedSlot(null); // Reset picked slot on date change
          setLoadingSlots(false);
        })
        .catch(() => {
          setAvailableSlots(fallbackSlots);
          setLoadingSlots(false);
        });
    }
  }, [selectedCenter, selectedDate]);

  // Dynamic Price Calculations
  const packagePrice = bookingMode === 'package' && selectedPackage ? selectedPackage.price : 0;
  const servicesPrice = bookingMode === 'custom'
    ? selectedServices.reduce((sum, s) => sum + s.price, 0)
    : 0;

  const basePrice = packagePrice + servicesPrice;
  const taxRate = 18; // 18% GST
  const taxAmount = Math.round(basePrice * (taxRate / 100) * 100) / 100;
  const finalAmount = Math.max(0, Math.round((basePrice + taxAmount - couponDiscount) * 100) / 100);

  // Validate coupon handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, amount: basePrice });
      setCouponDiscount(res.data.discountAmount || 0);
      setCouponApplied(true);
      toast.success(res.data.message || 'Coupon applied successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code.');
      setCouponDiscount(0);
      setCouponApplied(false);
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Inline Quick Add Vehicle
  const handleQuickAddVehicle = async (e) => {
    e.preventDefault();
    if (!newCar.brand || !newCar.model || !newCar.registrationNumber) {
      toast.warning('Please complete vehicle fields.');
      return;
    }
    try {
      const res = await api.post('/vehicles', newCar);
      toast.success('Vehicle registered and selected!');
      setVehicles([...vehicles, res.data.vehicle]);
      setSelectedVehicle(res.data.vehicle);
      setShowAddVehicle(false);
      setNewCar({ brand: '', model: '', registrationNumber: '', vehicleType: 'Sedan' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle.');
    }
  };

  // Submit Final Booking
  const handleConfirmBooking = async () => {
    if (!selectedVehicle) {
      toast.warning('Please select a vehicle.');
      setCurrentStep(1);
      return;
    }
    if (!selectedPackage && selectedServices.length === 0) {
      toast.warning('Please choose a package or service.');
      setCurrentStep(2);
      return;
    }
    if (!selectedCenter) {
      toast.warning('Please choose a wash center.');
      setCurrentStep(3);
      return;
    }
    if (!selectedSlot) {
      toast.warning('Please select an available appointment time slot.');
      setCurrentStep(5);
      return;
    }

    setIsSubmitting(true);
    const bookingPayload = {
      vehicleId: selectedVehicle._id || selectedVehicle.id,
      centerId: selectedCenter._id || selectedCenter.id,
      packageId: bookingMode === 'package' && selectedPackage ? (selectedPackage._id || selectedPackage.id) : null,
      serviceIds: bookingMode === 'custom' ? selectedServices.map((s) => s._id || s.id) : [],
      bookingDate: selectedDate,
      timeSlot: selectedSlot.timeSlot,
      slotId: selectedSlot.id,
      couponCode: couponApplied ? couponCode : null,
      paymentMethod,
      notes
    };

    try {
      const res = await api.post('/bookings', bookingPayload);
      const createdBooking = res.data.booking;

      // If online payment is chosen, trigger verification
      if (paymentMethod === 'ONLINE') {
        await api.post('/payments/verify', {
          bookingId: createdBooking._id,
          paymentMethod: 'ONLINE',
          transactionId: `TXN-${Date.now()}`
        });
      }

      setBookingResult(createdBooking);
      setCurrentStep(8); // Step 8: Confirmation
      toast.success('🎉 Booking confirmed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book slot. Please try another time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Steps Navigator
  const stepsList = [
    { num: 1, label: 'Vehicle', icon: Car },
    { num: 2, label: 'Treatment', icon: PackageIcon },
    { num: 3, label: 'Center', icon: MapPin },
    { num: 4, label: 'Date', icon: Calendar },
    { num: 5, label: 'Time Slot', icon: Clock },
    { num: 6, label: 'Summary', icon: FileText },
    { num: 7, label: 'Payment', icon: CreditCard },
    { num: 8, label: 'Confirmed', icon: CheckCircle2 }
  ];

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Wizard Progress Bar */}
        <div className="scw-card p-4 mb-4 overflow-auto">
          <div className="d-flex justify-content-between align-items-center min-w-steps">
            {stepsList.map((step) => {
              const IconComp = step.icon;
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`d-flex flex-column align-items-center cursor-pointer px-2 ${isActive ? 'text-accent' : isDone ? 'text-success' : 'text-muted'}`}
                  onClick={() => {
                    if (step.num < currentStep && currentStep !== 8) {
                      setCurrentStep(step.num);
                    }
                  }}
                  style={{ cursor: step.num < currentStep && currentStep !== 8 ? 'pointer' : 'default' }}
                >
                  <div
                    className={`step-circle mb-2 ${isActive ? 'active' : isDone ? 'done' : ''}`}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : <IconComp size={18} />}
                  </div>
                  <span className="small fw-bold">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SELECT VEHICLE */}
        {currentStep === 1 && (
          <div className="scw-card p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="section-tag">Step 1 of 8</span>
                <h3 className="fw-bold text-primary mb-1">Select Your Vehicle</h3>
                <p className="text-muted small mb-0">Choose which vehicle is arriving for service today.</p>
              </div>
              <button className="btn btn-sm btn-scw-outline-dark" onClick={() => setShowAddVehicle(true)}>
                + Add Another Car
              </button>
            </div>

            <div className="row g-3">
              {vehicles.map((car) => {
                const isSelected = (selectedVehicle?._id || selectedVehicle?.id) === (car._id || car.id);
                return (
                  <div key={car._id || car.id} className="col-md-6 col-lg-4">
                    <div
                      className={`scw-card p-3 cursor-pointer h-100 ${isSelected ? 'border-accent selected-card' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedVehicle(car)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0 text-primary">{car.brand} {car.model}</h5>
                        {isSelected && <CheckCircle2 size={20} className="text-accent" />}
                      </div>
                      <span className="badge bg-secondary mb-2">{car.vehicleType}</span>
                      <div className="mt-2 text-center bg-light p-2 rounded border">
                        <span className="license-plate">{car.registrationNumber}</span>
                        <div className="small text-muted mt-1">{car.color} • {car.fuelType}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {vehicles.length === 0 && (
                <div className="col-12 text-center py-4 text-muted">
                  <Car size={48} className="opacity-50 mb-2 mx-auto" />
                  <p>No saved vehicles found in your garage.</p>
                  <button className="btn btn-scw-primary mt-2" onClick={() => setShowAddVehicle(true)}>
                    Add Vehicle Now
                  </button>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <button
                className="btn btn-scw-primary px-4 py-2 fw-bold"
                disabled={!selectedVehicle}
                onClick={() => setCurrentStep(2)}
              >
                Proceed to Treatment <ChevronRight size={18} className="ms-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT TREATMENT (PACKAGE OR CUSTOM SERVICES) */}
        {currentStep === 2 && (
          <div className="scw-card p-4 p-md-5">
            <span className="section-tag">Step 2 of 8</span>
            <h3 className="fw-bold text-primary mb-1">Select Wash Package or Services</h3>
            <p className="text-muted small mb-4">Select an all-in-one package or tailor individual treatments.</p>

            {/* Toggle Mode */}
            <div className="btn-group w-100 mb-4">
              <button
                type="button"
                className={`btn py-3 fw-bold ${bookingMode === 'package' ? 'btn-scw-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setBookingMode('package')}
              >
                <PackageIcon size={18} className="me-1 inline" /> Bundled Packages (Recommended)
              </button>
              <button
                type="button"
                className={`btn py-3 fw-bold ${bookingMode === 'custom' ? 'btn-scw-secondary' : 'btn-outline-secondary'}`}
                onClick={() => setBookingMode('custom')}
              >
                <Tag size={18} className="me-1 inline" /> A La Carte Services
              </button>
            </div>

            {/* Package Mode */}
            {bookingMode === 'package' && (
              <div className="row g-3">
                {packages.map((pkg) => {
                  const isSelected = (selectedPackage?._id || selectedPackage?.id) === (pkg._id || pkg.id);
                  return (
                    <div key={pkg._id || pkg.id} className="col-md-6 col-lg-3">
                      <div
                        className={`scw-card p-3 h-100 d-flex flex-column ${isSelected ? 'border-accent selected-card' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="fw-bold mb-0 text-primary">{pkg.packageName}</h6>
                          {isSelected && <CheckCircle2 size={18} className="text-accent" />}
                        </div>
                        <div className="h4 fw-bold text-primary my-2">₹{pkg.price}</div>
                        <div className="small text-muted mb-2"><Clock size={12} className="inline me-1" />{pkg.duration} mins</div>
                        <ul className="list-unstyled small mb-0 flex-grow-1 text-muted">
                          {(pkg.features || []).slice(0, 4).map((f, i) => (
                            <li key={i} className="mb-1"><CheckCircle2 size={12} className="text-accent me-1 inline" />{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Custom Mode */}
            {bookingMode === 'custom' && (
              <div className="row g-3">
                {services.map((svc) => {
                  const isSelected = selectedServices.some((s) => (s._id || s.id) === (svc._id || svc.id));
                  return (
                    <div key={svc._id || svc.id} className="col-md-6">
                      <div
                        className={`scw-card p-3 d-flex align-items-center justify-content-between ${isSelected ? 'border-accent selected-card' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedServices(selectedServices.filter((s) => (s._id || s.id) !== (svc._id || svc.id)));
                          } else {
                            setSelectedServices([...selectedServices, svc]);
                          }
                        }}
                      >
                        <div>
                          <h6 className="fw-bold mb-1 text-primary">{svc.serviceName}</h6>
                          <span className="badge bg-light text-secondary border small">{svc.category}</span>
                          <span className="small text-muted ms-2"><Clock size={12} className="inline me-1" />{svc.duration} mins</span>
                        </div>
                        <div className="text-end">
                          <div className="h5 fw-bold text-primary mb-1">₹{svc.price}</div>
                          {isSelected ? (
                            <span className="badge bg-success">Selected</span>
                          ) : (
                            <span className="badge bg-light text-muted border">+ Add</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(1)}>
                <ChevronLeft size={18} className="me-1" /> Back
              </button>
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-primary">Subtotal: ₹{basePrice}</span>
                <button
                  className="btn btn-scw-primary px-4"
                  disabled={basePrice === 0}
                  onClick={() => setCurrentStep(3)}
                >
                  Select Center <ChevronRight size={18} className="ms-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT WASH CENTER */}
        {currentStep === 3 && (
          <div className="scw-card p-4 p-md-5">
            <span className="section-tag">Step 3 of 8</span>
            <h3 className="fw-bold text-primary mb-1">Choose Service Facility</h3>
            <p className="text-muted small mb-4">Select the nearest Smart Car Wash center equipped for your booking.</p>

            <div className="row g-3">
              {centers.map((c) => {
                const isSelected = (selectedCenter?._id || selectedCenter?.id) === (c._id || c.id);
                return (
                  <div key={c._id || c.id} className="col-md-4">
                    <div
                      className={`scw-card p-4 h-100 ${isSelected ? 'border-accent selected-card' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedCenter(c)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold text-primary mb-0">{c.centerName}</h5>
                        {isSelected && <CheckCircle2 size={20} className="text-accent" />}
                      </div>
                      <p className="text-muted small mb-3">{c.address}, {c.city}</p>
                      <div className="small text-muted mb-2">
                        <Phone size={14} className="text-accent me-1 inline" /> {c.phone}
                      </div>
                      <div className="small text-muted">
                        <Clock size={14} className="text-accent me-1 inline" /> {c.openingTime} – {c.closingTime}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between mt-4 pt-3 border-top">
              <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(2)}>
                <ChevronLeft size={18} className="me-1" /> Back
              </button>
              <button
                className="btn btn-scw-primary px-4"
                disabled={!selectedCenter}
                onClick={() => setCurrentStep(4)}
              >
                Choose Date & Slot <ChevronRight size={18} className="ms-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 & 5: SELECT DATE & TIME SLOT */}
        {(currentStep === 4 || currentStep === 5) && (
          <div className="scw-card p-4 p-md-5">
            <span className="section-tag">Step {currentStep} of 8</span>
            <h3 className="fw-bold text-primary mb-1">Select Date & Time Slot</h3>
            <p className="text-muted small mb-4">Live availability synchronized directly with {selectedCenter?.centerName}.</p>

            <div className="row g-4 mb-4">
              <div className="col-md-5">
                <label className="form-label fw-bold text-primary">Appointment Date *</label>
                <input
                  type="date"
                  className="form-control scw-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    if (currentStep === 4) setCurrentStep(5);
                  }}
                />
                <div className="form-text small">Bookings cannot be scheduled for past dates.</div>
              </div>
            </div>

            {/* Real-time Time Slots Grid */}
            <h5 className="fw-bold text-primary mb-3">Available Time Slots for {selectedDate}</h5>

            {loadingSlots && (
              <div className="text-center py-4">
                <span className="spinner-border text-primary me-2"></span>
                <span className="text-muted">Loading live capacity...</span>
              </div>
            )}

            {!loadingSlots && (
              <div className="row g-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isSoldOut = !slot.isAvailable;
                  return (
                    <div key={slot.id} className="col-6 col-md-4 col-lg-3">
                      <button
                        type="button"
                        disabled={isSoldOut}
                        className={`btn w-100 p-2 text-start scw-slot-btn ${isSelected ? 'active' : ''} ${isSoldOut ? 'disabled' : ''}`}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setCurrentStep(5);
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold small">{slot.timeSlot}</span>
                          {isSelected && <CheckCircle2 size={14} className="text-accent" />}
                        </div>
                        <div className="small opacity-75">
                          {isSoldOut ? (
                            <span className="text-danger fw-bold">Fully Booked / Closed</span>
                          ) : (
                            <span className="text-success">{slot.remainingSpots} spot(s) left</span>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}

                {availableSlots.length === 0 && (
                  <div className="col-12 text-center py-4 text-muted">
                    <AlertCircle size={32} className="mb-2 mx-auto" />
                    <p>No available slots for this date. Please choose another date.</p>
                  </div>
                )}
              </div>
            )}

            <div className="d-flex justify-content-between mt-4 pt-3 border-top">
              <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(3)}>
                <ChevronLeft size={18} className="me-1" /> Back
              </button>
              <button
                className="btn btn-scw-primary px-4"
                disabled={!selectedSlot}
                onClick={() => setCurrentStep(6)}
              >
                Review Summary <ChevronRight size={18} className="ms-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: BOOKING SUMMARY & COUPON */}
        {currentStep === 6 && (
          <div className="scw-card p-4 p-md-5">
            <span className="section-tag">Step 6 of 8</span>
            <h3 className="fw-bold text-primary mb-1">Booking Summary & Coupons</h3>
            <p className="text-muted small mb-4">Review all appointment details and apply promotional discounts.</p>

            <div className="row g-4">
              {/* Summary Details */}
              <div className="col-lg-7">
                <div className="p-3 bg-light rounded-3 mb-3 border">
                  <h6 className="fw-bold text-primary mb-2">Appointment Details</h6>
                  <div className="small text-muted mb-1">
                    <strong>Facility:</strong> {selectedCenter?.centerName} ({selectedCenter?.address})
                  </div>
                  <div className="small text-muted mb-1">
                    <strong>Date & Time:</strong> {selectedDate} • {selectedSlot?.timeSlot}
                  </div>
                  <div className="small text-muted">
                    <strong>Vehicle:</strong> {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.registrationNumber})
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 border">
                  <h6 className="fw-bold text-primary mb-2">Selected Treatments</h6>
                  {bookingMode === 'package' && (
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Package: {selectedPackage?.packageName}</span>
                      <strong className="text-dark">₹{selectedPackage?.price}</strong>
                    </div>
                  )}
                  {bookingMode === 'custom' && (
                    <div>
                      {selectedServices.map((s) => (
                        <div key={s._id || s.id} className="d-flex justify-content-between small text-muted mb-1">
                          <span>{s.serviceName}</span>
                          <strong className="text-dark">₹{s.price}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <label className="form-label fw-semibold small">Special Requests / Notes</label>
                  <textarea
                    className="form-control scw-input"
                    rows={2}
                    placeholder="e.g. Extra attention to dog hair in trunk..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Pricing Breakdown & Coupon */}
              <div className="col-lg-5">
                <div className="scw-card p-4 border bg-white">
                  <h6 className="fw-bold text-primary mb-3">Price Breakdown</h6>

                  {/* Coupon Input */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Have a Promo Coupon?</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control scw-input text-uppercase font-monospace"
                        placeholder="e.g. WELCOME50"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                      />
                      <button
                        type="button"
                        className="btn btn-scw-secondary"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode}
                      >
                        {validatingCoupon ? 'Checking...' : (couponApplied ? 'Applied ✓' : 'Apply')}
                      </button>
                    </div>
                    {couponApplied && (
                      <div className="text-success small fw-semibold mt-1">
                        Coupon code {couponCode} applied! Saved ₹{couponDiscount}
                      </div>
                    )}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-muted">Subtotal:</span>
                    <span className="fw-semibold">₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-muted">GST Tax (18%):</span>
                    <span className="fw-semibold">₹{taxAmount.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="d-flex justify-content-between small text-success mb-2">
                      <span>Promo Discount:</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between align-items-center mb-0">
                    <span className="fw-bold text-primary fs-5">Total Payable:</span>
                    <span className="h4 fw-bold text-primary mb-0">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4 pt-3 border-top">
              <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(5)}>
                <ChevronLeft size={18} className="me-1" /> Back
              </button>
              <button className="btn btn-scw-primary px-4" onClick={() => setCurrentStep(7)}>
                Select Payment <ChevronRight size={18} className="ms-1" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: PAYMENT SELECTION */}
        {currentStep === 7 && (
          <div className="scw-card p-4 p-md-5">
            <span className="section-tag">Step 7 of 8</span>
            <h3 className="fw-bold text-primary mb-1">Choose Payment Method</h3>
            <p className="text-muted small mb-4">Total Amount to Pay: <strong>₹{finalAmount.toFixed(2)}</strong></p>

            <div className="row g-3 justify-content-center mb-4">
              <div className="col-md-6">
                <div
                  className={`scw-card p-4 h-100 ${paymentMethod === 'CASH' ? 'border-accent selected-card' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPaymentMethod('CASH')}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0 text-primary">Pay at Service Center (Cash / UPI)</h5>
                    {paymentMethod === 'CASH' && <CheckCircle2 size={20} className="text-accent" />}
                  </div>
                  <p className="text-muted small mb-0">
                    Pay via cash, UPI scan, or debit/credit card physically when you arrive at {selectedCenter?.centerName}.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className={`scw-card p-4 h-100 ${paymentMethod === 'ONLINE' ? 'border-accent selected-card' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPaymentMethod('ONLINE')}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0 text-primary">Instant Online Payment (Test Gateway)</h5>
                    {paymentMethod === 'ONLINE' && <CheckCircle2 size={20} className="text-accent" />}
                  </div>
                  <p className="text-muted small mb-0">
                    Secure simulated instant checkout supporting UPI, NetBanking, and Visa/Mastercard credit cards.
                  </p>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4 pt-3 border-top">
              <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(6)}>
                <ChevronLeft size={18} className="me-1" /> Back
              </button>
              <button
                className="btn btn-scw-primary px-5 py-3"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span> Reserving Slot...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} className="me-2" /> Confirm & Reserve Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: CONFIRMATION & INVOICE */}
        {currentStep === 8 && bookingResult && (
          <div className="scw-card p-4 p-md-5 text-center">
            <div className="confirmation-icon-circle mx-auto mb-3">
              <CheckCircle2 size={42} className="text-accent" />
            </div>
            <h2 className="display-6 fw-bold text-primary mb-1">Appointment Confirmed!</h2>
            <p className="text-muted small mb-4">
              Your car wash booking has been registered and verified in our database.
            </p>

            <div className="scw-card p-4 mx-auto mb-4 bg-light text-start" style={{ maxWidth: 600 }}>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <span className="text-muted small">Booking Reference</span>
                <strong className="text-primary font-monospace fs-5">#{bookingResult.bookingReference}</strong>
              </div>
              <div className="row g-2 small text-muted">
                <div className="col-6"><strong>Vehicle:</strong> {bookingResult.vehicleSnapshot?.brand} {bookingResult.vehicleSnapshot?.model}</div>
                <div className="col-6 text-end"><strong>Reg Number:</strong> {bookingResult.vehicleSnapshot?.registrationNumber}</div>
                <div className="col-6"><strong>Date:</strong> {bookingResult.bookingDate}</div>
                <div className="col-6 text-end"><strong>Slot:</strong> {bookingResult.timeSlot}</div>
                <div className="col-12"><strong>Facility:</strong> {bookingResult.center?.centerName}</div>
                <div className="col-6"><strong>Payment:</strong> {bookingResult.paymentMethod}</div>
                <div className="col-6 text-end"><strong>Total Amount:</strong> ₹{bookingResult.finalAmount}</div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <Link to="/dashboard/my-bookings" className="btn btn-scw-primary">
                View in My Bookings
              </Link>
              <button
                className="btn btn-scw-secondary"
                onClick={() => window.print()}
              >
                <Printer size={16} className="me-1 inline" /> Print Invoice
              </button>
              <Link to="/" className="btn btn-scw-outline-dark">
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {/* INLINE QUICK ADD VEHICLE MODAL */}
        {showAddVehicle && (
          <div className="modal fade show d-block" style={{ background: 'rgba(11, 19, 43, 0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content scw-card border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Register New Car</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddVehicle(false)}></button>
                </div>
                <form onSubmit={handleQuickAddVehicle}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Brand *</label>
                      <input
                        type="text"
                        className="form-control scw-input"
                        placeholder="e.g. BMW"
                        value={newCar.brand}
                        onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Model *</label>
                      <input
                        type="text"
                        className="form-control scw-input"
                        placeholder="e.g. 330i"
                        value={newCar.model}
                        onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Registration Number *</label>
                      <input
                        type="text"
                        className="form-control scw-input text-uppercase font-monospace"
                        placeholder="e.g. DL 01 AB 1234"
                        value={newCar.registrationNumber}
                        onChange={(e) => setNewCar({ ...newCar, registrationNumber: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Type</label>
                      <select
                        className="form-select scw-input"
                        value={newCar.vehicleType}
                        onChange={(e) => setNewCar({ ...newCar, vehicleType: e.target.value })}
                      >
                        <option value="Hatchback">Hatchback</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Pickup / Other">Pickup / Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowAddVehicle(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-scw-primary btn-sm px-4">
                      Add & Select Car
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .min-w-steps {
          min-width: 650px;
        }
        .step-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          color: #64748B;
        }
        .step-circle.active {
          border-color: #00D4FF;
          background: #00D4FF;
          color: #0B132B;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
        }
        .step-circle.done {
          border-color: #22C55E;
          background: #22C55E;
          color: #FFFFFF;
        }
        .selected-card {
          border: 2px solid #00D4FF !important;
          background-color: #F0FBFF !important;
        }
        .scw-slot-btn {
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          background: #FFFFFF;
          transition: all 0.15s ease;
        }
        .scw-slot-btn:hover:not(.disabled) {
          border-color: #3AB6FF;
          background: #F0F9FF;
        }
        .scw-slot-btn.active {
          border-color: #3AB6FF;
          background: #3AB6FF;
          color: #18191B;
        }
        .scw-slot-btn.active .text-success {
          color: #18191B !important;
          font-weight: bold;
        }
        .scw-slot-btn.disabled {
          background: #E2E8F0;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .confirmation-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(183, 176, 158, 0.25);
          border: 2px solid #3AB6FF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

