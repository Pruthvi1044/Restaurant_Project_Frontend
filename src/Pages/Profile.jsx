import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { User, Mail, Phone, MapPin, Lock, Save, AlertCircle, CheckCircle, Edit3, X, UserCircle } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'security'
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await axiosInstance.patch('auth/profile/', formData);
            await refreshUser();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (err) {
            console.error('Profile update error:', err);
            const errorData = err.response?.data;
            let errorMsg = 'Failed to update profile';
            
            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMsg = errorData;
                } else if (typeof errorData === 'object') {
                    // Try to find a message in common DRF error fields
                    errorMsg = errorData.error || errorData.detail || Object.values(errorData).flat()[0] || JSON.stringify(errorData);
                }
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await axiosInstance.post('auth/change-password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
        } catch (err) {
            console.error('Password update error:', err);
            const errorData = err.response?.data;
            let errorMsg = 'Failed to change password';
            
            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMsg = errorData;
                } else if (typeof errorData === 'object') {
                    errorMsg = errorData.error || errorData.detail || Object.values(errorData).flat()[0] || JSON.stringify(errorData);
                }
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-container">
                {/* Hero Section */}
                <div className="profile-hero">
                    <div className="hero-overlay"></div>
                    <div className="profile-header-main">
                        <div className="user-avatar-premium">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="header-info">
                            <h1>{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}</h1>
                            <p className="user-email-subtitle"><Mail size={14} /> {user?.email}</p>
                            <span className="badge-premium">Verified Member</span>
                        </div>
                    </div>
                </div>

                <div className="profile-content-wrap">
                    {/* Sidebar Nav */}
                    <div className="profile-sidebar">
                        <button
                            className={`side-tab ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('info'); setIsEditing(false); setMessage({ type: '', text: '' }); }}
                        >
                            <User size={18} /> Personal Information
                        </button>
                        <button
                            className={`side-tab ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('security'); setIsEditing(false); setMessage({ type: '', text: '' }); }}
                        >
                            <Lock size={18} /> Password & Security
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="profile-main-card">
                        {message.text && (
                            <div className={`status-banner ${message.type}`}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        {activeTab === 'info' && (
                            <div className="info-tab-content">
                                <div className="section-header">
                                    <h2>{isEditing ? 'Edit Personal Information' : 'Personal Information'}</h2>
                                    {!isEditing && (
                                        <button className="edit-action-btn" onClick={() => setIsEditing(true)}>
                                            <Edit3 size={16} /> Edit Info
                                        </button>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <div className="user-details-list">
                                        <div className="detail-row">
                                            <span className="label-text">Full Name :</span>
                                            <span className="value-text">{user?.first_name ? `${user.first_name} ${user.last_name}` : 'Not provided'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label-text">Username :</span>
                                            <span className="value-text">{user?.username}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label-text">Email Address :</span>
                                            <span className="value-text">{user?.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label-text">Mobile Number :</span>
                                            <span className="value-text">{user?.phone || 'Not provided'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label-text">Delivery Address :</span>
                                            <span className="value-text address-val">{user?.address || 'No address saved'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleUpdateProfile} className="premium-form">
                                        <div className="form-grid">
                                            <div className="input-box">
                                                <label>First Name</label>
                                                <input name="first_name" value={formData.first_name} onChange={handleFormChange} placeholder="Enter your first name" />
                                            </div>
                                            <div className="input-box">
                                                <label>Last Name</label>
                                                <input name="last_name" value={formData.last_name} onChange={handleFormChange} placeholder="Enter your last name" />
                                            </div>
                                        </div>
                                        <div className="input-box">
                                            <label>Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Enter your email" />
                                        </div>
                                        <div className="input-box">
                                            <label>Mobile Number</label>
                                            <input name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Enter your phone number" />
                                        </div>
                                        <div className="input-box">
                                            <label>Delivery Address</label>
                                            <textarea name="address" value={formData.address} onChange={handleFormChange} rows="3" placeholder="Enter your delivery address"></textarea>
                                        </div>
                                        <div className="form-buttons">
                                            <button type="submit" className="save-premium-btn" disabled={loading}>
                                                {loading ? 'Saving Changes...' : 'Save & Update'}
                                            </button>
                                            <button type="button" className="cancel-premium-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="security-tab-content">
                                <div className="section-header">
                                    <h2>Change Your Password</h2>
                                    <p className="header-hint">Ensure your account is using a long, random password to stay secure.</p>
                                </div>

                                <form onSubmit={handleUpdatePassword} className="premium-form max-500">
                                    <div className="input-box">
                                        <label>Current Password</label>
                                        <input type="password" name="old_password" value={passwordData.old_password} onChange={handlePasswordChange} required placeholder="••••••••" />
                                    </div>
                                    <div className="input-box">
                                        <label>New Password</label>
                                        <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} required placeholder="••••••••" />
                                    </div>
                                    <div className="input-box">
                                        <label>Confirm New Password</label>
                                        <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} required placeholder="••••••••" />
                                    </div>
                                    <button type="submit" className="save-premium-btn" disabled={loading}>
                                        {loading ? 'Updating Password...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
