import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart3, TrendingUp, DollarSign, Package, Car } from 'lucide-react';

export const AdminReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/reports')
      .then((res) => {
        setReportData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="section-tag">Business Intelligence</span>
          <h1 className="h3 fw-bold text-primary mb-1">Reports & Revenue Analytics</h1>
          <p className="text-muted small mb-0">Detailed breakdown of appointments, package revenue, and fleet distributions.</p>
        </div>

        {!loading && reportData && (
          <div className="row g-4">
            {/* Daily Revenue Trend */}
            <div className="col-lg-8">
              <div className="scw-card p-4 h-100">
                <h5 className="fw-bold text-primary mb-3">Daily Revenue Trend</h5>
                <div className="d-flex flex-column gap-3">
                  {reportData.dailyRevenue?.map((d) => {
                    const maxRev = Math.max(...reportData.dailyRevenue.map((r) => r.revenue), 1000);
                    const percent = Math.min(100, Math.round((d.revenue / maxRev) * 100));
                    return (
                      <div key={d._id}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-semibold">{d._id}</span>
                          <span className="fw-bold text-primary">₹{d.revenue.toLocaleString()} ({d.bookingsCount} bookings)</span>
                        </div>
                        <div className="progress" style={{ height: 10 }}>
                          <div
                            className="progress-bar bg-accent"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: '#00D4FF',
                              transition: 'width 0.5s'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {(!reportData.dailyRevenue || reportData.dailyRevenue.length === 0) && (
                    <div className="text-center py-4 text-muted small">No daily revenue recorded yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Package Revenue Share */}
            <div className="col-lg-4">
              <div className="scw-card p-4 h-100">
                <h5 className="fw-bold text-primary mb-3">Package Popularity</h5>
                <div className="d-flex flex-column gap-3">
                  {reportData.packageStats?.map((p, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-primary">{p.name}</strong>
                        <span className="badge bg-primary">{p.count} booked</span>
                      </div>
                      <div className="small text-muted">
                        Revenue Generated: <strong>₹{p.totalRevenue?.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                  {(!reportData.packageStats || reportData.packageStats.length === 0) && (
                    <div className="text-center py-4 text-muted small">No package analytics available.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Type Demographics */}
            <div className="col-md-6">
              <div className="scw-card p-4">
                <h5 className="fw-bold text-primary mb-3">Vehicle Category Breakdown</h5>
                <div className="row g-2">
                  {reportData.vehicleTypeStats?.map((v, i) => (
                    <div key={i} className="col-6">
                      <div className="p-3 border rounded text-center bg-light">
                        <Car size={24} className="text-accent mb-1 mx-auto" />
                        <h6 className="fw-bold mb-0">{v._id || 'Standard'}</h6>
                        <span className="text-muted small">{v.count} washed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Status Distribution */}
            <div className="col-md-6">
              <div className="scw-card p-4">
                <h5 className="fw-bold text-primary mb-3">Booking Status Distribution</h5>
                <div className="row g-2">
                  {reportData.statusStats?.map((s, i) => (
                    <div key={i} className="col-6">
                      <div className="p-3 border rounded text-center bg-light">
                        <div className="h4 fw-bold text-primary mb-0">{s.count}</div>
                        <span className="badge bg-secondary mt-1">{s._id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
