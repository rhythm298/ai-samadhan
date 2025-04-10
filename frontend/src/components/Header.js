import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import '../styles/Header.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Eternal Bonds Logo" />
          <span>Eternal Bonds</span>
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/design">Create Invitation</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="login-btn">Login</Link></li>
              <li><Link to="/register" className="register-btn">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
