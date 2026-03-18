import React from 'react';
import './Footer.css';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer section" id="footer">
      <div className="footer-grid">
        
        {/* Contact Us */}
        <div className="footer-col">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-links">
            <li><MapPin size={16} /> Location</li>
            <li><Phone size={16} /> Call +01 1234567890</li>
            <li><Mail size={16} /> demo@gmail.com</li>
          </ul>
        </div>

        {/* Brand */}
        <div className="footer-col brand-col">
          <h2 className="footer-brand">Swaad Indian Bistro</h2>
          <p className="footer-desc">
            Necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with
          </p>
          <div className="footer-socials">
            <a href="#fb" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#tw" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#in" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#ig" aria-label="Instagram"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="footer-col">
          <h3 className="footer-title">Opening Hours</h3>
          <p className="footer-hours">Everyday</p>
          <p className="footer-hours">10.00 Am - 10.00 Pm</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;