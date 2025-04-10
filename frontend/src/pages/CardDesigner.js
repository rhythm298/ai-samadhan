import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CardDesigner.css';


const CardDesigner = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState({});
  const [error, setError] = useState(null);
    const navigate = useNavigate();

  // State for AI suggestion feature
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // Main component state
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // ...rest of your component
};


// Sample template data in case API fails
const fallbackTemplates = [
  {
    id: 'elegant-floral',
    name: 'Elegant Floral',
    thumbnail: '/assets/templates/elegant-floral.jpg',
    description: 'Classic design with elegant floral motifs'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    thumbnail: '/assets/templates/modern-minimal.jpg',
    description: 'Clean and minimalist design with sophisticated typography'
  },
  {
    id: 'rustic-charm',
    name: 'Rustic Charm',
    thumbnail: '/assets/templates/rustic-charm.jpg',
    description: 'Warm earthy tones with rustic decorative elements'
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    thumbnail: '/assets/templates/royal-gold.jpg',
    description: 'Luxurious design with gold accents and ornate details'
  },
  {
    id: 'garden-romance',
    name: 'Garden Romance',
    thumbnail: '/assets/templates/garden-romance.jpg',
    description: 'Romantic floral design with soft pastel colors'
  },
  {
    id: 'destination-wedding',
    name: 'Destination Wedding',
    thumbnail: '/assets/templates/destination-wedding.jpg',
    description: 'Perfect for beach or travel-themed celebrations'
  }
];



  // Design state
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
    customElements: [],
  });

  // In your theme selection component's useEffect or componentDidMount
useEffect(() => {
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(theme => {
    theme.addEventListener('click', function() {
      // Remove active class from all themes
      themeOptions.forEach(t => {
        t.classList.remove('active');
      });
      
      // Add active class to selected theme
      this.classList.add('active');
      
      // Store selected theme ID or data
      const selectedThemeId = this.dataset.themeId;
      setSelectedTheme(selectedThemeId); // If using React hooks
    });
  });
}, []);
  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        
        // Attempt to fetch from API
        const response = await fetch('/api/templates');
        
        if (!response.ok) {
          throw new Error('Failed to load templates from server');
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
          setTemplates(data);
          setDesign(prev => ({ ...prev, template: data[0].id }));
        } else {
          // Use fallback if API returns empty array
          throw new Error('No templates received from server');
        }
      } catch (err) {
        console.warn('Using fallback templates:', err.message);
        // Use fallback templates instead of showing error
        setTemplates(fallbackTemplates);
        setDesign(prev => ({ ...prev, template: fallbackTemplates[0].id }));
        setError(null); // Clear error since we're using fallbacks
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // AI suggestion handler
  const handleAISuggest = async () => {
    if (!aiPrompt.trim()) {
      setError("Please enter a wedding vibe description first");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoadingAI(true);
    setAiResponse('');

    try {
      // Simulated AI response if API endpoint isn't available
      setTimeout(() => {
        const themes = ['traditional', 'modern', 'indian', 'western', 'middleEastern'];
        const palettes = ['luxury', 'modern', 'cultural'];
        
        const suggestedTheme = themes[Math.floor(Math.random() * themes.length)];
        const suggestedPalette = palettes[Math.floor(Math.random() * palettes.length)];
        
        const suggestion = `Based on your "${aiPrompt}" description, I recommend:
        
Theme: ${suggestedTheme}
ColorPalette: ${suggestedPalette}

This combination will create a beautiful atmosphere that matches your vision. The ${suggestedTheme} theme provides the perfect structure, while the ${suggestedPalette} color palette adds the right mood.`;
        
        setAiResponse(suggestion);
        
        // Apply the suggestions to the design
        handleDesignChange('theme', suggestedTheme);
        handleDesignChange('colorPalette', suggestedPalette);
        
        setLoadingAI(false);
      }, 2000);
      
      // Uncomment below for actual API implementation
      /*
      const response = await fetch(`/api/ai/suggest-style`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (!response.ok) throw new Error('AI service unavailable');

      const data = await response.json();
      if (data.suggestion) {
        setAiResponse(data.suggestion);

        const themeMatch = data.suggestion.match(/theme:\s*(\w+)/i);
        const paletteMatch = data.suggestion.match(/colorPalette:\s*(\w+)/i);
        
        if (themeMatch) handleDesignChange('theme', themeMatch[1].toLowerCase());
        if (paletteMatch) handleDesignChange('colorPalette', paletteMatch[1].toLowerCase());
      } else {
        setAiResponse("No suggestion received.");
      }
      setLoadingAI(false);
      */
      
    } catch (err) {
      console.error(err);
      setAiResponse("AI suggestion service is currently unavailable.");
      setLoadingAI(false);
    }
  };

  // Handler for design field changes
  const handleDesignChange = (field, value, lang = null) => {
    setDesign((prev) => {
      if (lang) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [lang]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
  };

  // Handler for language toggles
  const handleLanguageToggle = (lang) => {
    setDesign((prev) => {
      const langs = [...prev.languages];
      if (langs.includes(lang)) {
        return { ...prev, languages: langs.filter((l) => l !== lang) };
      } else {
        return { ...prev, languages: [...langs, lang] };
      }
    });
  };

  // Handler for form submission
  const handleSubmit = () => {
    setLoadingPreview(true);
    
    // Since we removed login, we'll directly navigate to preview with query params
    const queryParams = new URLSearchParams({
      template: design.template,
      theme: design.theme,
      colorPalette: design.colorPalette,
      // Add other essential parameters as needed
      names: design.names.en,
      date: design.date,
      preview: 'true'
    }).toString();
    
    setTimeout(() => {
      setLoadingPreview(false);
      navigate(`/preview/demo?${queryParams}`);
    }, 1500);
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="design-step template-step">
            <h2>Choose Your Perfect Template</h2>
            <p className="step-description">Select a beautiful template as the foundation for your wedding invitation.</p>
            
            {loading ? (
              <div className="loading-templates">
                <div className="spinner"></div>
                <p>Loading beautiful templates...</p>
              </div>
            ) : (
              <div className="template-grid">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className={`template-card ${design.template === template.id ? 'selected' : ''}`}
                    onClick={() => handleDesignChange('template', template.id)}
                  >
                    <div className="template-image">
                      <img 
                        src={template.thumbnail} 
                        alt={template.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/templates/placeholder.jpg';
                        }}
                      />
                      {design.template === template.id && (
                        <div className="selected-badge">
                          <span>Selected</span>
                        </div>
                      )}
                    </div>
                    <div className="template-info">
                      <h3>{template.name}</h3>
                      {template.description && <p>{template.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="design-step style-step">
            <h2>Personalize Your Style</h2>
            <p className="step-description">Customize the look and feel of your invitation to match your wedding atmosphere.</p>
            
            <div className="option-sections">
              <div className="option-section">
                <h3>Theme</h3>
                <div className="option-cards">
                  {[
                    { value: 'traditional', label: 'Traditional', icon: '🏛️' },
                    { value: 'modern', label: 'Modern', icon: '🔷' },
                    { value: 'indian', label: 'Indian', icon: '🪔' },
                    { value: 'western', label: 'Western', icon: '🤠' },
                    { value: 'middleEastern', label: 'Middle Eastern', icon: '☪️' }
                  ].map(theme => (
                    <div 
                      key={theme.value}
                      className={`option-card ${design.theme === theme.value ? 'selected' : ''}`}
                      onClick={() => handleDesignChange('theme', theme.value)}
                    >
                      <span className="option-icon">{theme.icon}</span>
                      <span className="option-label">{theme.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3>Color Palette</h3>
                <div className="option-cards">
                  {[
                    { value: 'luxury', label: 'Luxury', colors: ['#d4af37', '#2c3e50', '#34495e'] },
                    { value: 'modern', label: 'Modern', colors: ['#3498db', '#2ecc71', '#e74c3c'] },
                    { value: 'cultural', label: 'Cultural', colors: ['#e67e22', '#d35400', '#f1c40f'] }
                  ].map(palette => (
                    <div 
                      key={palette.value}
                      className={`option-card ${design.colorPalette === palette.value ? 'selected' : ''}`}
                      onClick={() => handleDesignChange('colorPalette', palette.value)}
                    >
                      <div className="color-preview">
                        {palette.colors.map((color, i) => (
                          <span 
                            key={i} 
                            className="color-swatch" 
                            style={{ backgroundColor: color }}
                          ></span>
                        ))}
                      </div>
                      <span className="option-label">{palette.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ai-suggester">
                <h3>AI Style Suggestion</h3>
                <p>Describe your wedding vibe and let our AI suggest a perfect style combination.</p>
                
                <div className="ai-input-group">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Royal pastel beachside at sunset"
                    className="ai-input"
                  />
                  <button 
                    onClick={handleAISuggest} 
                    disabled={loadingAI}
                    className="ai-button"
                  >
                    {loadingAI ? 'Generating...' : 'Get Suggestion'}
                  </button>
                </div>

                {aiResponse && (
                  <div className="ai-result">
                    <h4>AI Suggestion</h4>
                    <div className="ai-response">{aiResponse}</div>
                  </div>
                )}
              </div>

              <div className="language-section">
                <h3>Languages</h3>
                <p>Select the languages to include in your invitation.</p>
                
                <div className="language-toggles">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'hi', name: 'Hindi' },
                    { code: 'ar', name: 'Arabic' },
                    { code: 'es', name: 'Spanish' },
                    { code: 'zh', name: 'Chinese' }
                  ].map(lang => (
                    <button
                      key={lang.code}
                      className={`language-toggle ${design.languages.includes(lang.code) ? 'active' : ''}`}
                      onClick={() => handleLanguageToggle(lang.code)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="design-step details-step">
            <h2>Add Your Wedding Details</h2>
            <p className="step-description">Fill in the essential information for your wedding invitation.</p>
            
            <div className="details-form">
              <div className="form-section">
                <h3>Couple Names</h3>
                {design.languages.map(lang => (
                  <div key={`names-${lang}`} className="language-input">
                    <label>{lang === 'en' ? 'Names' : `Names (${lang.toUpperCase()})`}</label>
                    <input
                      type="text"
                      value={design.names[lang]}
                      onChange={(e) => handleDesignChange('names', e.target.value, lang)}
                      placeholder={lang === 'en' ? 'John & Jane' : `Names in ${lang}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="form-section date-time">
                <h3>Date & Time</h3>
                <div className="input-group">
                  <div className="input-field">
                    <label>Wedding Date</label>
                    <input
                      type="date"
                      value={design.date}
                      onChange={(e) => handleDesignChange('date', e.target.value)}
                    />
                  </div>
                  
                  <div className="input-field">
                    <label>Wedding Time</label>
                    <input
                      type="time"
                      value={design.time}
                      onChange={(e) => handleDesignChange('time', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Venue</h3>
                {design.languages.map(lang => (
                  <div key={`venue-${lang}`} className="language-input">
                    <label>{lang === 'en' ? 'Venue Address' : `Venue (${lang.toUpperCase()})`}</label>
                    <textarea
                      value={design.venue[lang]}
                      onChange={(e) => handleDesignChange('venue', e.target.value, lang)}
                      placeholder={lang === 'en' ? '123 Wedding Lane, City' : `Venue address in ${lang}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="form-section">
                <h3>RSVP Details</h3>
                <div className="input-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={design.rsvp.phone}
                    onChange={(e) => handleDesignChange('rsvp', e.target.value, 'phone')}
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                
                <div className="input-field">
                  <label>Website (Optional)</label>
                  <input
                    type="url"
                    value={design.rsvp.website}
                    onChange={(e) => handleDesignChange('rsvp', e.target.value, 'website')}
                    placeholder="https://example.com/wedding"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h3>Dress Code</h3>
                {design.languages.map(lang => (
                  <div key={`dressCode-${lang}`} className="language-input">
                    <label>{lang === 'en' ? 'Dress Code' : `Dress Code (${lang.toUpperCase()})`}</label>
                    <input
                      type="text"
                      value={design.dressCode[lang]}
                      onChange={(e) => handleDesignChange('dressCode', e.target.value, lang)}
                      placeholder={lang === 'en' ? 'Formal Attire' : `Dress code in ${lang}`}
                    />
                  </div>
                ))}
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
        <h1>Create Your Dream Wedding Invitation</h1>
        
        <div className="steps-indicator">
          {[
            { num: 1, label: 'Choose Template' },
            { num: 2, label: 'Select Style' },
            { num: 3, label: 'Add Details' }
          ].map(s => (
            <div 
              key={s.num}
              className={`step ${step >= s.num ? 'active' : ''}`}
              onClick={() => setStep(s.num)}
            >
              <div className="step-number">{s.num}</div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
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
            onClick={() => setStep((prev) => prev - 1)}
          >
            Previous
          </button>
        )}

        {step < 3 ? (
          <button 
            className="btn-primary" 
            onClick={() => setStep((prev) => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button 
            className="btn-primary create-btn" 
            onClick={handleSubmit} 
            disabled={loadingPreview}
          >
            {loadingPreview ? 'Creating...' : 'Create Invitation'}
          </button>
        )}
      </div>
    </div>
  );
};

// Replace with your actual API endpoint
const handleGenerateCard = async (formData) => {
  try {
    setIsLoading(true); // If using React state for loading indicators
    
    const response = await fetch('/api/wedding-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    // Check if response is OK before parsing
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json();
    // Handle successful response
    setCardData(data);
  } catch (error) {
    console.error('Error generating card:', error);
    setError('Failed to generate wedding card. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

export default CardDesigner;
