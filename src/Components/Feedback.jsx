import React, { useState, useEffect, useCallback } from 'react';
import './Feedback.css';
import { Star } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const StarRating = ({ value, onChange }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={24}
        className={star <= value ? 'star filled' : 'star'}
        onClick={() => onChange && onChange(star)}
        fill={star <= value ? '#fbbf24' : 'none'}
        color={star <= value ? '#fbbf24' : '#6b7280'}
        style={{ cursor: onChange ? 'pointer' : 'default' }}
      />
    ))}
  </div>
);

const Feedback = () => {
  const { isAuthenticated, user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await axiosInstance.get('feedback/all/');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Failed to fetch feedbacks', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  useEffect(() => {
    if (isAuthenticated && user) {
        setFormData(prev => ({ 
            ...prev, 
            name: `${user.first_name} ${user.last_name}`.trim() || user.username, 
            email: user.email 
        }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      await axiosInstance.post('feedback/create/', formData);
      setFormSuccess('Thank you! Your review has been submitted.');
      setFormData({ name: '', email: '', rating: 5, comment: '' });
      // Instantly refresh feedback list
      fetchFeedbacks();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      const detail = err.response?.data;
      if (typeof detail === 'object') {
        setFormError(Object.values(detail).flat().join(' '));
      } else {
        setFormError('Submission failed. Please try again.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <section className="feedback-section section" id="feedback">
        <h2 className="section-title">What Our Customers Say</h2>

        {/* Feedback Cards */}
        {loading ? (
          <div className="feedback-loading">Loading reviews...</div>
        ) : feedbacks.length === 0 ? (
          <div className="feedback-empty">No reviews yet. Be the first to leave one!</div>
        ) : (
          <div className="feedback-grid">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="feedback-card">
                <div className="feedback-card-header">
                  <div className="feedback-avatar">{fb.name?.charAt(0)?.toUpperCase()}</div>
                  <div>
                    <h4 className="feedback-name">{fb.name}</h4>
                    <span className="feedback-date">{formatDate(fb.created_at)}</span>
                  </div>
                </div>
                <StarRating value={fb.rating} />
                <p className="feedback-comment">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Leave a Review Form */}
        <div className="leave-review-wrapper">
          <h3 className="review-form-title">Leave a Review</h3>

          {!isAuthenticated && (
            <div className="feedback-auth-notice">
              🔒 Please <span onClick={() => setShowAuthModal(true)}>login</span> to submit a review.
            </div>
          )}

          {formError && <div className="fb-alert fb-error">{formError}</div>}
          {formSuccess && <div className="fb-alert fb-success">{formSuccess}</div>}

          <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="review-input"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="review-input"
              />
            </div>

            <div className="rating-row">
              <span className="rating-label">Your Rating:</span>
              <StarRating value={formData.rating} onChange={(val) => setFormData({ ...formData, rating: val })} />
            </div>

            <textarea
              name="comment"
              placeholder="Share your experience..."
              value={formData.comment}
              onChange={handleChange}
              required
              className="review-textarea"
              rows={4}
            />

            <button type="submit" className="btn-primary review-submit-btn" disabled={formLoading}>
              {formLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Feedback;
