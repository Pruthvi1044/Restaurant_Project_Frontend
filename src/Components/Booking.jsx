import React, { useState } from 'react';
import './Booking.css';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Booking = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      // TODO: connect to booking API
      alert('Table booked successfully!');
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
              <input type="text" placeholder="Your Name" required className="form-input" />
              <input type="tel" placeholder="Phone Number" required className="form-input" />
              <input type="email" placeholder="Your Email" required className="form-input" />

              <select className="form-input" required defaultValue="">
                <option value="" disabled>How many persons?</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
                <option value="5+">5+ Persons</option>
              </select>

              <input type="date" required className="form-input" />

              <button type="submit" className="btn-primary form-submit-btn">BOOK NOW</button>
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
