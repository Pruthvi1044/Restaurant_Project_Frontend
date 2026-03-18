import React, { useState } from 'react';
import './Navbar.css';
import { User, ShoppingCart, Search } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import LogoutModal from './LogoutModal';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Swaad Indian Bistro</Link>
        </div>

        <ul className="navbar-links">
          <li><NavLink to="/" end className={navLinkClass}>HOME</NavLink></li>
          <li><NavLink to="/menu" className={navLinkClass}>MENU</NavLink></li>
          <li><NavLink to="/about" className={navLinkClass}>ABOUT</NavLink></li>
          <li><NavLink to="/book-table" className={navLinkClass}>BOOK TABLE</NavLink></li>
          <li><NavLink to="/feedback" className={navLinkClass}>FEEDBACK</NavLink></li>
        </ul>

        <div className="navbar-actions">
          <button className="icon-btn" aria-label="User Profile"><User size={20} /></button>
          <Link to="/cart" className="icon-btn cart-icon-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="icon-btn" aria-label="Search"><Search size={20} /></button>

          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-username">Hi, {user?.username}</span>
              <button
                className="btn-primary logout-btn"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-primary login-btn"
              onClick={() => setShowAuthModal(true)}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Navbar;
