import React, { useState } from 'react';
import '../styles/AuthModal.css';
import { X, Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '', first_name: '', last_name: '', email: '', phone: '', password: ''
  });

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('auth/login/', loginForm);
      const { access, is_staff, username } = res.data;
      // Decode token payload to get user id
      const payload = JSON.parse(atob(access.split('.')[1]));
      
      login(access, { 
        username: username || payload.username || loginForm.username, 
        user_id: payload.user_id,
        is_staff: is_staff
      });
      
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
        if (is_staff) {
          navigate('/admin');
        } else {
          // Stay on current page or redirect to home if needed
          // For now, let's keep it simple
        }
      }, 1000);
    } catch (err) {
      const detail = err.response?.data;
      if (typeof detail === 'object') {
        const msgs = Object.values(detail).flat();
        setError(msgs.join(' '));
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('auth/register/', registerForm);
      setSuccess('Account created! Please check your email to verify your account before logging in.');
      setMode('login');
      setRegisterForm({ username: '', first_name: '', last_name: '', email: '', phone: '', password: '' });
    } catch (err) {
      const detail = err.response?.data;
      if (typeof detail === 'object') {
        const msgs = Object.entries(detail).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
        setError(msgs.join(' | '));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={onClose}><X size={22} /></button>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Messages */}
        {error && <div className="auth-alert auth-error">{error}</div>}
        {success && <div className="auth-alert auth-success">{success}</div>}

        {/* Login Form */}
        {mode === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>

            <div className="form-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={loginForm.username}
                onChange={handleLoginChange}
                required
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                className="auth-input"
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <span onClick={() => { setMode('register'); setError(''); }}>Create Account</span>
            </p>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join Swaad Indian Bistro</p>

            <div className="form-row">
              <div className="form-group">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={registerForm.first_name}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="form-group">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={registerForm.last_name}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <div className="form-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                required
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                required
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                required
                className="auth-input"
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <span onClick={() => { setMode('login'); setError(''); }}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
