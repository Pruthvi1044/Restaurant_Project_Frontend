import React from 'react';
import '../styles/LogoutModal.css';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-overlay" onClick={onCancel}>
      <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-icon-wrapper">
          <LogOut size={32} />
        </div>
        <h3 className="logout-title">Confirm Logout</h3>
        <p className="logout-text">Are you sure you want to logout from your account?</p>

        <div className="logout-actions">
          <button className="logout-cancel-btn" onClick={onCancel}>
            <X size={16} /> Cancel
          </button>
          <button className="logout-confirm-btn" onClick={onConfirm}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
