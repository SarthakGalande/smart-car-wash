import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Phone, MapPin, Lock, Save, KeyRound } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode
        }
      };
      const res = await api.put('/users/me', payload);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Current password incorrect.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="section-tag">Account Settings</span>
          <h1 className="h3 fw-bold text-primary mb-1">Profile & Security</h1>
          <p className="text-muted small mb-0">Manage your contact details and security credentials.</p>
        </div>

        <div className="row g-4">
          {/* Col 1: Profile Information */}
          <div className="col-lg-7">
            <div className="scw-card p-4 p-md-5 h-100">
              <h4 className="fw-bold text-primary mb-4">Personal Details</h4>

              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control scw-input"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address (Read-only)</label>
                    <input
                      type="email"
                      className="form-control scw-input bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Mobile Phone *</label>
                    <input
                      type="tel"
                      className="form-control scw-input"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">City</label>
                    <input
                      type="text"
                      className="form-control scw-input"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street Address</label>
                    <input
                      type="text"
                      className="form-control scw-input"
                      placeholder="e.g. 42 Baker Street"
                      value={profileData.street}
                      onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">State</label>
                    <input
                      type="text"
                      className="form-control scw-input"
                      placeholder="e.g. Delhi"
                      value={profileData.state}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Postal / Zip Code</label>
                    <input
                      type="text"
                      className="form-control scw-input"
                      placeholder="e.g. 110001"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-scw-primary px-4" disabled={savingProfile}>
                      <Save size={16} className="me-1 inline" /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Col 2: Change Password */}
          <div className="col-lg-5">
            <div className="scw-card p-4 p-md-5 h-100">
              <h4 className="fw-bold text-primary mb-4">Update Password</h4>

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Current Password</label>
                  <input
                    type="password"
                    className="form-control scw-input"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">New Password (Min. 6 chars)</label>
                  <input
                    type="password"
                    className="form-control scw-input"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control scw-input"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-scw-secondary w-100" disabled={savingPassword}>
                  <KeyRound size={16} className="me-1 inline" /> {savingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
