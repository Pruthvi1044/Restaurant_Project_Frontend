import React from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/CartSidebar.css';

const CartSidebar = () => {
    const { isCartOpen, setIsCartOpen, cartItems, cartCount, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.dish?.price || 0;
        return sum + (parseFloat(price) * item.quantity);
    }, 0);

    const handleViewCart = () => {
        setIsCartOpen(false);
        navigate('/cart');
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    const getImageUrl = (image) => {
        if (!image) return null;
        const BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
        return image.startsWith('http') ? image : `${BASE_URL}${image}`;
    };

    return (
        <>
            <div 
                className={`cart-sidebar-overlay ${isCartOpen ? 'open' : ''}`} 
                onClick={() => setIsCartOpen(false)}
            />
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-sidebar-header">
                    <h2 className="cart-sidebar-title">My Cart ({cartCount})</h2>
                    <button className="close-sidebar-btn" onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-sidebar-items">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty-msg">
                            <ShoppingBag size={64} opacity={0.2} />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.dish?.id || item.id} className="cart-sidebar-item">
                                <img 
                                    src={getImageUrl(item.dish?.image)} 
                                    alt={item.dish?.name} 
                                    className="cart-sidebar-item-img" 
                                />
                                <div className="cart-sidebar-item-info">
                                    <h3 className="cart-sidebar-item-name">{item.dish?.name}</h3>
                                    <p className="cart-sidebar-item-price">₹{parseFloat(item.dish?.price).toFixed(2)}</p>
                                    <div className="cart-sidebar-item-actions">
                                        <div className="qty-controls">
                                            <button 
                                                className="qty-btn" 
                                                onClick={() => updateQuantity(item.dish?.id, item.quantity - 1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-num">{item.quantity}</span>
                                            <button 
                                                className="qty-btn" 
                                                onClick={() => updateQuantity(item.dish?.id, item.quantity + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button 
                                            className="remove-item-btn" 
                                            onClick={() => removeFromCart(item.dish?.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-sidebar-footer">
                        <div className="cart-sidebar-subtotal">
                            <span>Sub Total:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="cart-sidebar-btns">
                            <button className="view-cart-btn-full" onClick={handleViewCart}>
                                View Cart
                            </button>
                            <button className="checkout-btn-full" onClick={handleCheckout}>
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
