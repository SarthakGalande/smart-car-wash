import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Mail, Check, MessageSquare } from 'lucide-react';

export const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadMessages = () => {
    setLoading(true);
    api.get('/admin/contact')
      .then((res) => {
        setMessages(res.data.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/contact/${id}`, { status });
      toast.success(`Inquiry marked as ${status}`);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status } : m))
      );
    } catch (err) {
      toast.error('Failed to update inquiry status.');
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="section-tag">Inquiry Desk</span>
          <h1 className="h3 fw-bold text-primary mb-1">Customer Inquiries & Messages</h1>
          <p className="text-muted small mb-0">Review inbound inquiries submitted through the contact page.</p>
        </div>

        {!loading && (
          <div className="row g-3">
            {messages.map((m) => (
              <div key={m._id || m.id} className="col-12">
                <div className="scw-card p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold text-primary mb-0">{m.subject}</h5>
                      <span className="small text-muted">From: <strong>{m.name}</strong> ({m.email}) {m.phone && `• ${m.phone}`}</span>
                    </div>
                    <span className={`badge ${m.status === 'RESOLVED' ? 'bg-success' : m.status === 'IN_PROGRESS' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                      {m.status}
                    </span>
                  </div>

                  <p className="small text-secondary bg-light p-3 rounded border my-3">
                    "{m.message}"
                  </p>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top small text-muted">
                    <span>Received on: {new Date(m.createdAt).toLocaleString()}</span>
                    <div className="d-flex gap-2">
                      {m.status !== 'RESOLVED' && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => updateStatus(m._id, 'RESOLVED')}
                        >
                          <Check size={14} className="me-1 inline" /> Mark Resolved
                        </button>
                      )}
                      {m.status === 'NEW' && (
                        <button
                          className="btn btn-sm btn-outline-warning text-dark"
                          onClick={() => updateStatus(m._id, 'IN_PROGRESS')}
                        >
                          Mark In Progress
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="col-12 text-center py-5 text-muted">
                <MessageSquare size={48} className="opacity-50 mb-2 mx-auto" />
                <h5 className="fw-bold">No messages found</h5>
                <p className="small">Customer inquiries sent from the website contact page will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
