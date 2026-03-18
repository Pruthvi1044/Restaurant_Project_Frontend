import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.get('orders/my-cart/');
      const items = res.data?.items || [];
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (dishId, quantity = 1) => {
    if (!isAuthenticated) return false;
    try {
      await axiosInstance.post('orders/add/', { dish_id: dishId, quantity });
      await fetchCart();
      return true;
    } catch (err) {
      console.error('Add to cart failed', err);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, loading, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export default CartContext;
