import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CardDesigner.css';

const CardDesigner = ({ user }) => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [design, setDesign] = useState({
    template: '',
    theme: 'traditional',
    colorPalette: 'luxury',
    names: { en: '', ar: '', hi: '', es: '', zh: '' },
    date: '',
    time: '',
    venue: { en: '', ar: '', hi: '', es: '', zh: '' },
    rsvp: { phone: '', website: '' },
    dressCode: { en: '', ar: '', hi: '', es: '', zh: '' },
    languages: ['en'],
    customElements: []
  });
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch available templates
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        if (data.length > 0) {
          setDesign(prev => ({ ...prev, template: data[0].id }));
        }
      })
      .catch(err => setError('Failed to load templates'));
  }, []);
  
  const handleDesignChange = (field, value, lang = null) => {
    if (lang) {
      setDesign(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setDesign(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleLanguageToggle = (lang) => {
    setDesign(prev => {
      const langs = [...prev.languages];
      if (langs.includes(lang)) {
        return { ...prev, languages: langs.filter(l => l !== lang) };
      } else {
        return { ...prev, languages: [...langs, lang] };
      }
    });
  };
  
  const handleSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to save your design' } });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(design)
      });
      
      if (!response.ok) throw new Error('Failed to create invitation');
      
      const data = await response.json();
      navigate(`/preview/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="design-step">
            <h2>Choose a Template</h2>
            <div className="template-grid">
              {templates.map(template => (
                <div 
                  key={template.id} 
                  className={`template-card ${design.template === template.id ? 'selected' : ''}`}
                  onClick={() => handleDesignChange('template', template.id)}
                >
                  <img src={template.thumbnail} alt={template.name} />
                  <h3>{template.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="design-step">
            <h2>Select Style & Theme</h2>
            
            <div className="option-section">
              <h3>Theme</h3>
              <div className="radio-options">
                <label>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="traditional" 
                    checked={design.theme === 'traditional'} 
                    onChange={(e) => handleDesignChange('theme', e.target.value)} 
                  />
                  Traditional
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="modern" 
                    checked={design.theme === 'modern'} 
                    onChange={(e) => handleDesignChange('theme', e.target.value)} 
                  />
                  Modern
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="indian" 
                    checked={design.theme === 'indian'} 
                    onChange={(e) => handleDesignChange('theme', e.target.value)} 
                  />
                  Indian
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="western" 
                    checked={design.theme === 'western'} 
                    onChange={(e) => handleDesignChange('theme', e.target.value)} 
                  />
                  Western
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="theme" 
                    value="middleEastern" 
                    checked={design.theme === 'middleEastern'} 
                    onChange={(e) => handleDesignChange('theme', e.target.value)} 
                  />
                  Middle Eastern
                </label>
              </div>
            </div>
            
            <div className="option-section">
              <h3>Color Palette</h3>
              <div className="radio-options">
                <label>
                  <input 
                    type="radio" 
                    name="colorPalette" 
                    value="luxury" 
                    checked={design.colorPalette === 'luxury'} 
                    onChange={(e) => handleDesignChange('colorPalette', e.target.value)} 
                  />
                  Luxury (Gold, Navy, Deep Red)
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="colorPalette" 
                    value="modern" 
                    checked={design.colorPalette === 'modern'} 
                    onChange={(e) => handleDesignChange('colorPalette', e.target.value)} 
                  />
                  Modern (Pastels, Monochrome)
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="colorPalette" 
                    value="cultural" 
                    checked={design.colorPalette === 'cultural'} 
                    onChange={(e) => handleDesignChange('colorPalette', e.target.value)} 
                  />
                  Cultural (Theme-specific colors)
                </label>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="design-step">
            <h2>Add Your Details</h2>
            
            <div className="language-toggles">
              <h3>Select Languages</h3>
              <div className="checkbox-options">
                <label>
                  <input 
                    type="checkbox" 
                    value="en" 
                    checked={design.languages.includes('en')} 
                    onChange={() => handleLanguageToggle('en')}
                    disabled
                  />
                  English
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    value="ar" 
                    checked={design.languages.includes('ar')} 
                    onChange={() => handleLanguageToggle('ar')}
                  />
                  Arabic
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    value="hi" 
                    checked={design.languages.includes('hi')} 
                    onChange={() => handleLanguageToggle('hi')}
                  />
                  Hindi
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    value="es" 
                    checked={design.languages.includes('es')} 
                    onChange={() => handleLanguageToggle('es')}
                  />
                  Spanish
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    value="zh" 
                    checked={design.languages.includes('zh')} 
                    onChange={() => handleLanguageToggle('zh')}
                  />
                  Mandarin
                </label>
              </div>
            </div>
            
            <div className="detail-form">
              {design.languages.map(lang => (
                <div key={lang} className="language-section">
                  <h3>{lang === 'en' ? 'English' : lang === 'ar' ? 'Arabic' : lang === 'hi' ? 'Hindi' : lang === 'es' ? 'Spanish' : 'Mandarin'}</h3>
                  
                  <div className="form-group">
                    <label>Couple/Host Names:</label>
                    <input 
                      type="text" 
                      value={design.names[lang] || ''} 
                      onChange={(e) => handleDesignChange('names', e.target.value, lang)}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Venue:</label>
                    <input 
                      type="text" 
                      value={design.venue[lang] || ''} 
                      onChange={(e) => handleDesignChange('venue', e.target.value, lang)}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Dress Code (Optional):</label>
                    <input 
                      type="text" 
                      value={design.dressCode[lang] || ''} 
                      onChange={(e) => handleDesignChange('dressCode', e.target.value, lang)}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
              ))}
              
              <div className="common-details">
                <h3>Common Details</h3>
                
                <div className="form-group">
                  <label>Date:</label>
                  <input 
                    type="date" 
                    value={design.date} 
                    onChange={(e) => handleDesignChange('date', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Time:</label>
                  <input 
                    type="time" 
                    value={design.time} 
                    onChange={(e) => handleDesignChange('time', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>RSVP Phone:</label>
                  <input 
                    type="tel" 
                    value={design.rsvp.phone} 
                    onChange={(e) => handleDesignChange('rsvp', { ...design.rsvp, phone: e.target.value })}
                  />
                </div>
                
                <div className="form-group">
                  <label>RSVP Website (Optional):</label>
                  <input 
                    type="url" 
                    value={design.rsvp.website} 
                    onChange={(e) => handleDesignChange('rsvp', { ...design.rsvp, website: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="card-designer">
      <div className="designer-header">
        <h1>Design Your Wedding Invitation</h1>
        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Template</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Style</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Details</div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="designer-content">
        {renderStepContent()}
      </div>
      
      <div className="designer-footer">
        {step > 1 && (
          <button 
            className="btn-secondary"
            onClick={() => setStep(prev => prev - 1)}
          >
            Previous
          </button>
        )}
        
        {step < 3 ? (
          <button 
            className="btn-primary"
            onClick={() => setStep(prev => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button 
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Invitation'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardDesigner;
