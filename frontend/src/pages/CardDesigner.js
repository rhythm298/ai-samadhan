import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CardDesigner.css';

const CardDesigner = ({ user }) => {
  const navigate = useNavigate();

  // States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Fetch templates on load
  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        if (data.length > 0) {
          setDesign((prev) => ({ ...prev, template: data[0].id }));
        }
      })
      .catch(() => setError('Failed to load templates'));
  }, []);

  const handleAISuggest = async () => {
    if (!aiPrompt) return alert("Please enter a wedding vibe first.");

    setLoadingAI(true);
    setAiResponse('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/suggest-style`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      const data = await response.json();
      if (data.suggestion) {
        setAiResponse(data.suggestion);

        // Try to parse basic structure from AI
        const themeMatch = data.suggestion.match(/theme:\s*(\w+)/i);
        const paletteMatch = data.suggestion.match(/colorPalette:\s*(\w+)/i);
        if (themeMatch) handleDesignChange('theme', themeMatch[1].toLowerCase());
        if (paletteMatch) handleDesignChange('colorPalette', paletteMatch[1].toLowerCase());
      } else {
        setAiResponse("No suggestion received.");
      }
    } catch (err) {
      console.error(err);
      setAiResponse("Something went wrong.");
    } finally {
      setLoadingAI(false);
    }
  };

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
  <button onClick={() => handleLanguageToggle('en')}>Toggle English</button>
<button onClick={() => handleLanguageToggle('hi')}>Toggle Hindi</button>

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
    switch (step) {
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
                {['traditional', 'modern', 'indian', 'western', 'middleEastern'].map(theme => (
                  <label key={theme}>
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      checked={design.theme === theme}
                      onChange={(e) => handleDesignChange('theme', e.target.value)}
                    />
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="option-section">
              <h3>Color Palette</h3>
              <div className="radio-options">
                {['luxury', 'modern', 'cultural'].map(palette => (
                  <label key={palette}>
                    <input
                      type="radio"
                      name="colorPalette"
                      value={palette}
                      checked={design.colorPalette === palette}
                      onChange={(e) => handleDesignChange('colorPalette', e.target.value)}
                    />
                    {palette.charAt(0).toUpperCase() + palette.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="ai-suggester">
              <label>Describe Your Wedding Vibe:</label>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Royal pastel beachside at sunset"
              />
              <button onClick={handleAISuggest} disabled={loadingAI}>
                {loadingAI ? 'Thinking...' : 'Get AI Suggestion'}
              </button>

              {aiResponse && <pre className="ai-result">{aiResponse}</pre>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="design-step">
            <h2>Add Your Details</h2>
            {/* Details Form code here — omitted for brevity since unchanged */}
            <p>Details form content here...</p>
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

      <div className="designer-content">{renderStepContent()}</div>

      <div className="designer-footer">
        {step > 1 && (
          <button className="btn-secondary" onClick={() => setStep((prev) => prev - 1)}>
            Previous
          </button>
        )}

        {step < 3 ? (
          <button className="btn-primary" onClick={() => setStep((prev) => prev + 1)}>
            Next
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Invitation'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardDesigner;
