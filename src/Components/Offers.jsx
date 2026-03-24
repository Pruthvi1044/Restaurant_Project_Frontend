import React, { useState, useEffect } from 'react';
import '../styles/Offers.css';
import { ShoppingCart } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axiosInstance.get('offers/');
        setOffers(res.data);
      } catch (err) {
        console.error('Failed to load offers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `${BASE_URL}${image}`;
  };

  const handleOfferClick = (offer) => {
    navigate('/menu', { state: { offer } });
  };

  if (loading) return null;
  if (offers.length === 0) return null;

  return (
    <section className="offers section" id="offers">
      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-image-wrapper">
              {offer.dish?.image ? (
                <img src={getImageUrl(offer.dish.image)} alt={offer.dish.name} className="offer-image" />
              ) : (
                <ShoppingCart size={50} color="var(--accent-gold)" />
              )}
            </div>
            <div className="offer-content">
              <h3 className="offer-title">{offer.title}</h3>
              {offer.dish && (
                <p className="offer-dish-name">{offer.dish.name}</p>
              )}
              <div className="offer-discount">
                <span className="discount-value">{offer.discount_percent}%</span>
                <span className="discount-off">Off</span>
              </div>
              <button className="btn-primary offer-btn" onClick={() => handleOfferClick(offer)}>
                Order Now <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Offers;