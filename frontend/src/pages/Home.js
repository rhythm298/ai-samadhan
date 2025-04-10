import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Create Stunning Wedding Invitations</h1>
          <p>Design personalized, elegant invitations that reflect your unique style and love story.</p>
          <Link to="/design" className="cta-button">Create Your Invitation</Link>
        </div>
        <div className="hero-image">
          <img src="/images/hero-wedding-card.png" alt="Sample Wedding Invitation" />
        </div>
      </section>
      
      <section className="features">
        <h2>Why Choose Eternal Bonds</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-palette"></i></div>
            <h3>Beautiful Designs</h3>
            <p>Choose from dozens of professionally designed templates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-language"></i></div>
            <h3>Multilingual Support</h3>
            <p>Create invitations in multiple languages including RTL support.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-magic"></i></div>
            <h3>AI-Powered</h3>
            <p>Our AI generates unique designs that match your wedding style.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-print"></i></div>
            <h3>Print Ready</h3>
            <p>Download high-resolution files ready for professional printing.</p>
          </div>
        </div>
      </section>
      
      <section className="testimonials">
        <h2>Customer Testimonials</h2>
        <div className="testimonial-slider">
          <div className="testimonial">
            <p>"The invitations were perfect! Everyone loved the design and quality."</p>
            <div className="testimonial-author">
              <img src="/images/testimonial-1.jpg" alt="Testimonial Author" />
              <span>Sarah & James</span>
            </div>
          </div>
          {/* More testimonials would go here */}
        </div>
      </section>
      
      <section className="cta-section">
        <h2>Ready to Create Your Perfect Wedding Invitation?</h2>
        <p>Start designing in minutes with our easy-to-use tools.</p>
        <Link to="/design" className="cta-button">Get Started Now</Link>
      </section>
    </div>
  );
};

export default Home;
