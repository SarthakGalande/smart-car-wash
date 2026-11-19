import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadNotifications = () => {
    setLoading(true);
    api.get('/notifications')
      .then((res) => {
        setNotifications(res.data.notifications || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) { }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to update notifications.');
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="section-tag">Alerts & Updates</span>
            <h1 className="h3 fw-bold text-primary mb-1">Notifications</h1>
            <p className="text-muted small mb-0">Live status changes, slot confirmations, and service alerts.</p>
          </div>
          <button className="btn btn-sm btn-scw-outline-dark" onClick={markAllRead}>
            <CheckCheck size={16} className="me-1 inline" /> Mark All Read
          </button>
        </div>

        {!loading && (
          <div className="row g-3">
            {notifications.map((n) => (
              <div key={n._id || n.id} className="col-12">
                <div className={`scw-card p-3 d-flex align-items-center justify-content-between ${!n.isRead ? 'border-accent bg-white shadow-sm' : 'bg-light opacity-75'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar-circle">
                      <Bell size={18} className="text-accent" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-primary">
                        {n.title}
                        {!n.isRead && <span className="badge bg-danger ms-2 small">New</span>}
                      </h6>
                      <p className="text-secondary small mb-1">{n.message}</p>
                      <div className="small text-muted d-flex align-items-center gap-1">
                        <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {n.link && (
                      <Link to={n.link} className="btn btn-sm btn-scw-outline py-1 px-3">
                        View
                      </Link>
                    )}
                    {!n.isRead && (
                      <button
                        className="btn btn-sm btn-light border"
                        onClick={() => markAsRead(n._id)}
                        title="Mark as Read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="col-12 text-center py-5 text-muted">
                <Bell size={48} className="opacity-50 mb-2 mx-auto" />
                <h5 className="fw-bold">No notifications yet</h5>
                <p className="small">Updates regarding appointments and promos will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
