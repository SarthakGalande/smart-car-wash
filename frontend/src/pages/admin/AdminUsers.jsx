import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Search, CheckCircle, Ban, Shield } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const loadUsers = () => {
    setLoading(true);
    let url = '/admin/users?';
    if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

    api.get(url)
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await api.put(`/admin/users/${user._id}/status`, { status: newStatus });
      toast.success(res.data.message || `User marked as ${newStatus}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="section-tag">User Accounts</span>
            <h1 className="h3 fw-bold text-primary mb-1">Customer Account Directory</h1>
            <p className="text-muted small mb-0">Search registered customer profiles and toggle account statuses.</p>
          </div>
        </div>

        {/* Search */}
        <div className="scw-card p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><Search size={16} className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control scw-input border-start-0 ps-0"
                  placeholder="Search customer by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                />
              </div>
            </div>
            <div className="col-md-2">
              <button className="btn btn-scw-primary w-100" onClick={loadUsers}>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="scw-card p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered Date</th>
                  <th>Status</th>
                  <th className="text-end">Manage Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>
                      <div className="fw-bold text-primary">{u.fullName}</div>
                      <span className="text-muted small">{u.address?.city || 'New Delhi'}</span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {u.role !== 'ADMIN' ? (
                        <button
                          className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => toggleStatus(u)}
                        >
                          {u.status === 'ACTIVE' ? (
                            <>
                              <Ban size={14} className="me-1 inline" /> Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle size={14} className="me-1 inline" /> Activate
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-muted small">Protected Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
