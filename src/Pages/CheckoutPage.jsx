import React, { useState, useEffect } from 'react';
import './CheckoutPage.css';
import { ArrowLeft, CheckCircle, Truck, CreditCard, ShoppingBag, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../Components/Navbar';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const { cartItems = [], totalPrice = 0 } = location.state || {};

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
        navigate('/cart');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const TAX_RATE = 0.05;
  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + tax;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
        setError('Please provide a delivery address');
        return;
    }
    setPlacing(true);
    setError('');
    try {
      const res = await axiosInstance.post('orders/create-order/', {
        payment_method: paymentMethod,
        shipping_address: address
      });
      setSuccess(res.data.order_number || 'Order placed!');
      fetchCart();
      setTimeout(() => navigate('/my-orders'), 3500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
        <Navbar />
        <div className="checkout-empty">
          <ShoppingBag size={60} />
          <h2>No items to checkout</h2>
          <Link to="/cart" className="btn-primary">Go to Cart</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
        <Navbar />
        <div className="checkout-success">
          <CheckCircle size={72} color="#22c55e" />
          <h2>Order Placed Successfully!</h2>
          <p className="order-num-label">Order Number</p>
          <div className="order-number-badge">{success}</div>
          <p className="redirect-note">Redirecting you to your orders in a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
      <Navbar />
      <div className="checkout-page">
        <div className="checkout-header">
          <Link to="/cart" className="back-link"><ArrowLeft size={18} /> Back to Cart</Link>
          <h1 className="checkout-title">Checkout</h1>
        </div>

        <div className="checkout-layout">
          <div className="checkout-left">
            {/* Delivery Address */}
            <div className="checkout-section">
                <h2 className="checkout-section-title"><MapPin size={20} /> Delivery Address</h2>
                <div className="address-input-wrapper">
                    <textarea 
                        className="address-textarea"
                        placeholder="Enter your full address for delivery..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows="4"
                    ></textarea>
                    {user?.address && (
                        <p className="address-hint">Auto-filled from your profile. You can edit it here for this order.</p>
                    )}
                </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
                <h2 className="checkout-section-title"><CreditCard size={20} /> Payment Method</h2>

                <div className="payment-options">
                {/* Cash on Delivery */}
                <label
                    className={`payment-option${paymentMethod === 'cash' ? ' selected' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                >
                    <div className="payment-option-left">
                    <Truck size={28} className="payment-icon" />
                    <div>
                        <div className="payment-label">Cash on Delivery</div>
                        <div className="payment-sub">Pay when your order arrives</div>
                    </div>
                    </div>
                    <div className={`payment-radio${paymentMethod === 'cash' ? ' active' : ''}`} />
                </label>

                {/* Online Payment — disabled / coming soon */}
                <label className="payment-option disabled">
                    <div className="payment-option-left">
                    <CreditCard size={28} className="payment-icon" />
                    <div>
                        <div className="payment-label">Online Payment</div>
                        <div className="payment-sub coming-soon">Coming Soon</div>
                    </div>
                    </div>
                    <div className="payment-soon-badge">Soon</div>
                </label>
                </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="checkout-bill">
            <h2 className="checkout-section-title">Order Summary</h2>
            <div className="bill-items">
              {cartItems.map((item) => (
                <div key={item.id} className="bill-row">
                  <span className="bill-item-name">
                    {item.dish?.name}
                    <span className="bill-qty"> × {item.quantity}</span>
                  </span>
                  <span className="bill-item-amount">
                    ₹{((item.dish?.discounted_price || item.dish?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="bill-divider" />
            <div className="bill-row subtotal-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="bill-row tax-row">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="bill-divider" />
            <div className="bill-row total-row">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            {error && <div className="checkout-error">{error}</div>}

            <button
              className="btn-primary place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? 'Placing Order...' : `Place Order · ₹${grandTotal.toFixed(2)}`}
            </button>

            <p className="checkout-note">
              🔒 Your order details are securely processed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
