import React, { useState } from 'react';
import '../styles/Navbar.css';
import { User, ShoppingCart, Search, ClipboardList, LogOut, UserCircle, Moon, Sun } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from './AuthModal';
import LogoutModal from './LogoutModal';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    setShowDropdown(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'active' : '';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

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
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {isAuthenticated && (
            <Link to="/my-orders" className="icon-btn" aria-label="My Orders">
              <ClipboardList size={20} />
            </Link>
          )}
          
          <Link to="/cart" className="icon-btn cart-icon-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          <button className="icon-btn" aria-label="Search"><Search size={20} /></button>

          {isAuthenticated ? (
            <div className="user-dropdown">
              <div 
                className="user-avatar" 
                onClick={() => setShowDropdown(!showDropdown)}
                title={user?.username}
              >
                {getInitials(user?.username)}
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={() => { navigate('/profile'); setShowDropdown(false); }}>
                    <UserCircle size={18} /> Profile
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={() => setShowLogoutModal(true)}>
                    <LogOut size={18} /> Logout
                  </div>
                </div>
              )}
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
