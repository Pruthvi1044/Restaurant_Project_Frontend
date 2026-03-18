import React, { useState } from 'react';
import './CartPage.css';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../Components/AuthModal';
import axiosInstance from '../api/axiosInstance';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');

const CartPage = () => {
  const { cartItems, loading, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="cart-empty-state">
        <ShoppingBag size={60} />
        <h2>Please log in to view your cart</h2>
        <button className="btn-primary" onClick={() => setShowAuthModal(true)}>Login</button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.dish?.discounted_price || item.dish?.price || 0;
    return sum + parseFloat(price) * item.quantity;
  }, 0);

  const handleQuantityChange = async (dishId, delta) => {
    // delta is +1 or -1; backend adjusts from current quantity
    try {
      await axiosInstance.post('orders/add/', { dish_id: dishId, quantity: delta });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (dishId) => {
    try {
      await axiosInstance.delete('orders/remove/', { data: { dish_id: dishId } });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderNow = () => {
    navigate('/checkout', {
      state: {
        cartItems,
        totalPrice,
      },
    });
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <Link to="/" className="back-link"><ArrowLeft size={20} /> Back to Menu</Link>
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
          <Link to="/#menu" className="btn-primary cart-browse-btn">Browse Menu</Link>
        </div>
      ) : (
        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-list">
            {orderSuccess && <div className="cart-alert cart-success">{orderSuccess}</div>}
            {orderError && <div className="cart-alert cart-error">{orderError}</div>}

            {cartItems.map((item) => {
              const dish = item.dish;
              const imageUrl = dish?.image?.startsWith('http')
                ? dish.image
                : `${BASE_URL}${dish?.image}`;

              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {dish?.image
                      ? <img src={imageUrl} alt={dish?.name} />
                      : <ShoppingBag size={40} />
                    }
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{dish?.name}</h3>
                    <p className="cart-item-category">{dish?.category?.name}</p>
                    <p className="cart-item-price">
                      {item.dish?.discounted_price && item.dish.discounted_price < item.dish.price ? (
                        <>
                          <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                            ₹{parseFloat(item.dish.price).toFixed(2)}
                          </span>
                          <span style={{ color: '#F9CB28', fontWeight: 'bold' }}>
                            ₹{parseFloat(item.dish.discounted_price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        `₹${parseFloat(item.dish?.price || 0).toFixed(2)}`
                      )}
                    </p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(dish?.id, -(1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(dish?.id, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="cart-item-subtotal">
                      ₹{((item.dish?.discounted_price || item.dish?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                    <button className="remove-btn" onClick={() => handleRemove(dish?.id)}>
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
                <div key={item.id} className="summary-row">
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
            <button
              className="btn-primary order-now-btn"
              onClick={handleOrderNow}
              disabled={ordering || cartItems.length === 0}
            >
              {ordering ? 'Placing Order...' : '🛒 Order Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
