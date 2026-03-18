import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="page-container">
      <Navbar />

      <section className="about-section">
        {/* Hero Banner */}
        <div className="about-hero">
          <div className="about-hero-overlay">
            <h1 className="about-hero-title">Our Story</h1>
            <p className="about-hero-subtitle">Crafted with love. Served with pride.</p>
          </div>
        </div>

        <div className="about-content">

          {/* Who We Are */}
          <div className="about-block about-intro">
            <div className="about-text">
              <h2 className="about-heading">Who We Are</h2>
              <p>
                Welcome to <strong>Swaad Indian Bistro</strong> — a celebration of India's rich and diverse culinary heritage.
                Nestled in the heart of Lucknow, we bring authentic flavours from across the country right to your plate.
                Every dish we serve is a tribute to centuries-old recipes, refined with a modern touch.
              </p>
              <p>
                Founded in 2018, Swaad began as a small family kitchen with one simple mission: to serve food that feels
                like home. Today, we are proud to serve hundreds of guests every day who come not just for the food, but
                for the experience.
              </p>
            </div>
            <div className="about-image-box">
              <div className="about-image-placeholder">🍛</div>
            </div>
          </div>

          {/* Values */}
          <div className="about-values">
            <h2 className="about-heading center">What We Stand For</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌿</div>
                <h3>Fresh Ingredients</h3>
                <p>We source the finest, freshest local produce daily to ensure every dish is packed with real flavour.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">👨‍🍳</div>
                <h3>Expert Chefs</h3>
                <p>Our team of experienced chefs brings decades of culinary knowledge and passion to every meal.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🫶</div>
                <h3>Made with Love</h3>
                <p>Every recipe is prepared with care and respect for tradition, just like your grandmother's kitchen.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">⭐</div>
                <h3>Guest First</h3>
                <p>Your comfort, satisfaction and dining experience is our highest priority — every single time.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">6+</span>
              <span className="stat-label">Years of Service</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Guests</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8★</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
