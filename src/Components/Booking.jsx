import React, { useState } from 'react';
import '../styles/Booking.css';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import axiosInstance from '../api/axiosInstance';

const Booking = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '',
    booking_date: '',
    booking_time: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('booking/create/', formData);
      alert('Table booking request sent successfully! Check your email for details.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        guests: '',
        booking_date: '',
        booking_time: '',
        message: ''
      });
    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      const errorMsg = error.response?.data 
        ? Object.values(error.response.data).flat().join(', ')
        : 'Failed to book table. Please try again.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="booking section" id="book-table">
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Book A Table</h2>

        {!isAuthenticated && (
          <div className="booking-auth-notice">
            🔒 Please <span onClick={() => setShowAuthModal(true)}>login</span> to book a table.
          </div>
        )}

        <div className="booking-container">
          <div className="booking-form-wrapper">
            <form className="booking-form" onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name" 
                  required 
                  className="form-input" 
                  value={formData.name}
                  onChange={handleChange}
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email" 
                  required 
                  className="form-input" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Phone Number" 
                  required 
                  className="form-input" 
                  value={formData.phone}
                  onChange={handleChange}
                />
                <select 
                  name="guests"
                  className="form-input" 
                  required 
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="" disabled>How many persons?</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4">4 Persons</option>
                  <option value="5">5 Persons</option>
                  <option value="6">6+ Persons</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input 
                  type="date" 
                  name="booking_date"
                  required 
                  className="form-input" 
                  value={formData.booking_date}
                  onChange={handleChange}
                />
                <input 
                  type="time" 
                  name="booking_time"
                  required 
                  className="form-input" 
                  value={formData.booking_time}
                  onChange={handleChange}
                />
              </div>

              <textarea 
                name="message"
                placeholder="Special Request or Message (Optional)"
                className="form-input"
                style={{ minHeight: '100px', resize: 'vertical' }}
                value={formData.message}
                onChange={handleChange}
              ></textarea>

              <button 
                type="submit" 
                className="btn-primary form-submit-btn"
                disabled={loading}
              >
                {loading ? 'BOOKING...' : 'BOOK NOW'}
              </button>
            </form>
          </div>

          <div className="booking-map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.33282216896!2d80.85906804561858!3d26.848596482103444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1689626388484!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            ></iframe>
          </div>
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Booking;
