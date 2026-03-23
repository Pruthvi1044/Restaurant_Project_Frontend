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
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartItems(guestCart);
      setCartCount(guestCart.reduce((sum, item) => sum + item.quantity, 0));
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

  const syncCart = useCallback(async () => {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    if (guestCart.length > 0 && isAuthenticated) {
      try {
        for (const item of guestCart) {
          await axiosInstance.post('orders/add/', { 
            dish_id: item.dish.id || item.dish_id, 
            quantity: item.quantity 
          });
        }
        localStorage.removeItem('guestCart');
        await fetchCart();
      } catch (err) {
        console.error('Failed to sync guest cart', err);
      }
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated, syncCart]);

  const addToCart = async (dish, quantity = 1) => {
    if (!isAuthenticated) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItem = guestCart.find(item => (item.dish.id || item.dish_id) === dish.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.push({ dish, quantity });
      }
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setCartItems([...guestCart]);
      setCartCount(guestCart.reduce((sum, item) => sum + item.quantity, 0));
      return true;
    }

    try {
      await axiosInstance.post('orders/add/', { dish_id: dish.id, quantity });
      await fetchCart();
      return true;
    } catch (err) {
      console.error('Add to cart failed', err);
      return false;
    }
  };

  const removeFromCart = async (dishId) => {
    if (!isAuthenticated) {
      let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      guestCart = guestCart.filter(item => (item.dish.id || item.dish_id) !== dishId);
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setCartItems([...guestCart]);
      setCartCount(guestCart.reduce((sum, item) => sum + item.quantity, 0));
      return true;
    }

    try {
      await axiosInstance.delete('orders/remove/', { data: { dish_id: dishId } });
      await fetchCart();
      return true;
    } catch (err) {
      console.error('Remove from cart failed', err);
      return false;
    }
  };

  const updateQuantity = async (dishId, quantity) => {
    if (!isAuthenticated) {
        let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const item = guestCart.find(item => (item.dish.id || item.dish_id) === dishId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                guestCart = guestCart.filter(i => (i.dish.id || i.dish_id) !== dishId);
            }
            localStorage.setItem('guestCart', JSON.stringify(guestCart));
            setCartItems([...guestCart]);
            setCartCount(guestCart.reduce((sum, item) => sum + item.quantity, 0));
        }
        return true;
    }

    try {
        const currentItem = cartItems.find(i => (i.dish?.id || i.dish_id) === dishId);
        const currentQty = currentItem?.quantity || 0;
        await axiosInstance.post('orders/add/', { dish_id: dishId, quantity: quantity - currentQty });
        await fetchCart();
        return true;
    } catch (err) {
        console.error('Update quantity failed', err);
        return false;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, loading, fetchCart, addToCart, removeFromCart, updateQuantity }}>
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
