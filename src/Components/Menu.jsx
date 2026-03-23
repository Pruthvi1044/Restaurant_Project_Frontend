import React, { useState, useEffect } from 'react';
import './Menu.css';
import { ShoppingCart, Tag, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import axiosInstance from '../api/axiosInstance';
import { useLocation } from 'react-router-dom';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [offerBannerVisible, setOfferBannerVisible] = useState(true);

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const location = useLocation();

  // Offer highlighted from navigation (clicking Offers "Order Now")
  const focusedOffer = location.state?.offer || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, dishRes, offersRes] = await Promise.all([
          axiosInstance.get('menu/categories/'),
          axiosInstance.get('menu/dishes/'),
          axiosInstance.get('offers/'),
        ]);
        setCategories(catRes.data);
        setDishes(dishRes.data);
        setOffers(offersRes.data);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDishes =
    activeCategory === 'All'
      ? dishes
      : dishes.filter((d) => d.category?.name === activeCategory);

  // Find discount for a dish from ANY active offer
  const getOfferForDish = (dish) => {
    return offers.find((o) => o.dish?.id === dish.id) || null;
  };

  const getDiscountedPrice = (dish) => {
    const offer = getOfferForDish(dish);
    if (!offer) return null;
    const discount = offer.discount_percent / 100;
    return parseFloat(dish.price) * (1 - discount);
  };

  const handleAddToCart = async (dish) => {
    setAddingId(dish.id);
    const success = await addToCart(dish, 1);
    setAddingId(null);
    if (success) {
      setAddedId(dish.id);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `${BASE_URL}${image}`;
  };

  return (
    <section className="menu section" id="menu">
      <h2 className="section-title">Our Menu</h2>

      {/* Offer Banner — shown when user navigated from an offer card */}
      {focusedOffer && offerBannerVisible && (
        <div className="offer-applied-banner">
          <Tag size={16} />
          <span>
            <strong>{focusedOffer.discount_percent}% off</strong> on{' '}
            <strong>{focusedOffer.dish?.name || focusedOffer.title}</strong> applied!
          </span>
          <button
            className="offer-banner-close"
            onClick={() => setOfferBannerVisible(false)}
            aria-label="Dismiss offer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="menu-loading">Loading menu...</div>
      ) : (
        <>
          {/* Category Filters */}
          <div className="menu-filters">
            <button
              className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => setActiveCategory('All')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Dish Grid */}
          {filteredDishes.length === 0 ? (
            <div className="menu-empty">No items available in this category.</div>
          ) : (
            <div className="menu-grid">
              {filteredDishes.map((dish) => {
                const offer = getOfferForDish(dish);
                const discountedPrice = getDiscountedPrice(dish);
                const isOfferDish = !!offer;
                return (
                  <div key={dish.id} className={`menu-card${isOfferDish ? ' offer-dish' : ''}`}>
                    <div className="menu-card-image">
                      {dish.image ? (
                        <img src={getImageUrl(dish.image)} alt={dish.name} />
                      ) : (
                        <div className="menu-card-no-img">
                          <ShoppingCart size={40} />
                        </div>
                      )}
                      {isOfferDish && (
                        <div className="offer-dish-badge">
                          {offer.discount_percent}% OFF
                        </div>
                      )}
                    </div>
                    <div className="menu-card-content">
                      <p className="menu-card-category">{dish.category?.name}</p>
                      <h3 className="menu-card-title">{dish.name}</h3>
                      <p className="menu-card-desc">{dish.description}</p>
                      <div className="menu-card-footer">
                        <div className="menu-card-price-wrap">
                          {isOfferDish ? (
                            <>
                              <span className="menu-card-price-original">₹{parseFloat(dish.price).toFixed(2)}</span>
                              <span className="menu-card-price offer-price">₹{discountedPrice.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="menu-card-price">₹{parseFloat(dish.price).toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          className={`cart-btn${addedId === dish.id ? ' added' : ''}`}
                          onClick={() => handleAddToCart(dish)}
                          disabled={addingId === dish.id}
                        >
                          {addingId === dish.id
                            ? 'Adding...'
                            : addedId === dish.id
                            ? '✓ Added'
                            : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
};

export default Menu;
