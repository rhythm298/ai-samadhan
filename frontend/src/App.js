import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CardDesigner from './pages/CardDesigner';
import Preview from './pages/Preview';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Gallery from './components/Gallery';
import './styles/App.css';

// Custom hook for background animation effect
const useBackgroundAnimation = () => {
  useEffect(() => {
    const createFlower = () => {
      const flower = document.createElement('div');
      flower.classList.add('flower');
      
      // Randomize flower properties
      flower.style.left = `${Math.random() * 100}vw`;
      flower.style.animationDuration = `${Math.random() * 15 + 10}s`;
      flower.style.opacity = `${Math.random() * 0.6 + 0.2}`;
      flower.style.transform = `scale(${Math.random() * 0.4 + 0.2})`;
      
      document.querySelector('.background').appendChild(flower);
      
      // Remove flower after animation completes
      setTimeout(() => {
        flower.remove();
      }, 25000);
    };
    
    // Create flowers periodically
    const interval = setInterval(createFlower, 3000);
    // Create initial set of flowers
    for (let i = 0; i < 6; i++) createFlower();
    
    return () => clearInterval(interval);
  }, []);
};

// Font loader component
const FontLoader = () => {
  useEffect(() => {
    // Load elegant fonts ideal for wedding designs
    const fonts = [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap'
    ];
    
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = font;
      document.head.appendChild(link);
    });
    
    // Add custom CSS for font application
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --font-primary: 'Cormorant Garamond', serif;
        --font-secondary: 'Montserrat', sans-serif;
        --font-accent: 'Great Vibes', cursive;
        --font-display: 'Playfair Display', serif;
      }
      body {
        font-family: var(--font-secondary);
      }
      h1, h2 {
        font-family: var(--font-accent);
      }
      h3, h4, h5 {
        font-family: var(--font-display);
      }
      button, .btn {
        font-family: var(--font-secondary);
        letter-spacing: 1px;
      }
    `;
    document.head.appendChild(style);
  }, []);
  
  return null;
};

function App() {
  // Theme state for color scheme toggle
  const [theme, setTheme] = useState('light');
  
  // Call the custom background animation hook
  useBackgroundAnimation();
  
  // Color scheme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.dataset.theme = newTheme;
    localStorage.setItem('weddingAppTheme', newTheme);
  };
  
  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('weddingAppTheme') || 'light';
    setTheme(savedTheme);
    document.body.dataset.theme = savedTheme;
  }, []);

  return (
    <Router>
      <FontLoader />
      <div className="app">
        <div className="background">
          {/* Background animations rendered here */}
        </div>
        <div className="theme-toggle" onClick={toggleTheme}>
          <span className="icon">
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
        </div>
        <Header toggleTheme={toggleTheme} theme={theme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design" element={<CardDesigner />} />
            <Route path="/preview/:id" element={<Preview />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Login and Register routes removed as requested */}
            {/* Redirect any attempts to access them */}
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
