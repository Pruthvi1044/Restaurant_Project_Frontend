import React, { useState } from 'react';
import '../styles/CartPage.css';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../Components/AuthModal';
import Navbar from '../Components/Navbar';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');

const CartPage = () => {
  const { cartItems, loading, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.dish?.discounted_price || item.dish?.price || 0;
    return sum + parseFloat(price) * item.quantity;
  }, 0);

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate('/checkout', {
      state: {
        cartItems,
        totalPrice,
      },
    });
  };

  return (
    <div className="cart-page-wrapper">
      <Navbar />
      <div className="cart-page">
        {/* Header */}
        <div className="cart-header">
          <Link to="/menu" className="back-link"><ArrowLeft size={20} /> Back to Menu</Link>
          <h1 className="cart-title">Your Cart</h1>
          <span className="cart-items-count">{cartItems.length} item(s)</span>
        </div>

        {loading ? (
          <div className="cart-loading">Loading your cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <ShoppingBag size={70} />
            <h2>Your cart is empty</h2>
            <p>Add some delicious items from our menu!</p>
            <Link to="/menu" className="btn-primary cart-browse-btn">Browse Menu</Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const dish = item.dish;
                const dishId = dish?.id || item.dish_id;
                const imageUrl = dish?.image?.startsWith('http')
                  ? dish.image
                  : (dish?.image ? `${BASE_URL}${dish.image}` : null);

                return (
                  <div key={dishId} className="cart-item">
                    <div className="cart-item-img">
                      {imageUrl
                        ? <img src={imageUrl} alt={dish?.name} />
                        : <ShoppingBag size={40} />
                      }
                    </div>
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{dish?.name || 'Dish'}</h3>
                      <p className="cart-item-category">{dish?.category?.name}</p>
                      <p className="cart-item-price">
                        {dish?.discounted_price && dish.discounted_price < dish.price ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                              ₹{parseFloat(dish.price).toFixed(2)}
                            </span>
                            <span style={{ color: '#F9CB28', fontWeight: 'bold' }}>
                              ₹{parseFloat(dish.discounted_price).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          `₹${parseFloat(dish?.price || 0).toFixed(2)}`
                        )}
                      </p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(dishId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(dishId, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="cart-item-subtotal">
                        ₹{((dish?.discounted_price || dish?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                      <button className="remove-btn" onClick={() => removeFromCart(dishId)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-rows">
                {cartItems.map((item) => (
                  <div key={item.dish?.id || item.dish_id} className="summary-row">
                    <span>{item.dish?.name} × {item.quantity}</span>
                    <span>₹{((item.dish?.discounted_price || item.dish?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              {!isAuthenticated && (
                <div className="cart-login-prompt">
                  <LogIn size={16} /> Login to place your order
                </div>
              )}

              <button
                className="btn-primary order-now-btn"
                onClick={handleOrderNow}
                disabled={cartItems.length === 0}
              >
                {isAuthenticated ? '🛒 Order Now' : 'Login & Order'}
              </button>
            </div>
          </div>
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default CartPage;
