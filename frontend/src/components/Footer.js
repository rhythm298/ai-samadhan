import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Eternal Bonds</h3>
          <p>Creating memorable wedding invitations that reflect your unique love story.</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-pinterest"></i></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/design">Create Invitation</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@eternalbonds.com</p>
          <p>Phone: +1 (800) 123-4567</p>
          <p>Address: 123 Wedding Ave, Suite 100, New York, NY 10001</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Eternal Bonds. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
