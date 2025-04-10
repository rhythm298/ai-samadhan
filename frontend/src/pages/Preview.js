import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/Preview.css';

const Preview = () => {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/invitations/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load invitation");
        return res.json();
      })
      .then(data => {
        setInvitation(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);
  
  if (loading) return <div className="loading">Loading preview...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!invitation) return <div className="not-found">Invitation not found</div>;
  
  return (
    <div className="preview-page">
      <div className="preview-header">
        <h1>Invitation Preview</h1>
        <div className="language-tabs">
          {invitation.languages.map(lang => (
            <button 
              key={lang}
              className={activeLanguage === lang ? 'active' : ''}
              onClick={() => setActiveLanguage(lang)}
            >
              {lang === 'en' ? 'English' : 
               lang === 'ar' ? 'Arabic' : 
               lang === 'hi' ? 'Hindi' : 
               lang === 'es' ? 'Spanish' : 'Mandarin'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="preview-container">
        <div className={`invitation-preview ${invitation.theme} ${invitation.colorPalette}`}>
          <div className="invitation-inner" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <div className="invitation-header">
              <h2 className="names">{invitation.names[activeLanguage]}</h2>
            </div>
            
            <div className="invitation-body">
              <p className="invitation-text">
                {activeLanguage === 'en' && "Request the pleasure of your company at their wedding celebration"}
                {activeLanguage === 'ar' && "يتشرفان بدعوتكم لحضور حفل زفافهما"}
                {activeLanguage === 'hi' && "आपको अपने विवाह समारोह में आमंत्रित करते हैं"}
                {activeLanguage === 'es' && "Solicitan el honor de su presencia en la celebración de su boda"}
                {activeLanguage === 'zh' && "诚挚邀请您参加我们的婚礼"}
              </p>
              
              <div className="invitation-details">
                <p className="date-time">
                  <span className="label">
                    {activeLanguage === 'en' && "Date & Time:"}
                    {activeLanguage === 'ar' && "التاريخ والوقت:"}
                    {activeLanguage === 'hi' && "दिनांक और समय:"}
                    {activeLanguage === 'es' && "Fecha y hora:"}
                    {activeLanguage === 'zh' && "日期和时间:"}
                  </span>
                  <span className="value">
                    {new Date(invitation.date).toLocaleDateString(
                      activeLanguage === 'en' ? 'en-US' : 
                      activeLanguage === 'ar' ? 'ar-EG' : 
                      activeLanguage === 'hi' ? 'hi-IN' : 
                      activeLanguage === 'es' ? 'es-ES' : 'zh-CN'
                    )} | {invitation.time}
                  </span>
                </p>
                
                <p className="venue">
                  <span className="label">
                    {activeLanguage === 'en' && "Venue:"}
                    {activeLanguage === 'ar' && "المكان:"}
                    {activeLanguage === 'hi' && "स्थान:"}
                    {activeLanguage === 'es' && "Lugar:"}
                    {activeLanguage === 'zh' && "地点:"}
                  </span>
                  <span className="value">{invitation.venue[activeLanguage]}</span>
                </p>
                
                {invitation.dressCode[activeLanguage] && (
                  <p className="dress-code">
                    <span className="label">
                      {activeLanguage === 'en' && "Dress Code:"}
                      {activeLanguage === 'ar' && "قواعد اللباس:"}
                      {activeLanguage === 'hi' && "पहनावा:"}
                      {activeLanguage === 'es' && "Código de vestimenta:"}
                      {activeLanguage === 'zh' && "着装要求:"}
                    </span>
                    <span className="value">{invitation.dressCode[activeLanguage]}</span>
                  </p>
                )}
              </div>
              
              <div className="rsvp-section">
                <p className="rsvp-heading">
                  {activeLanguage === 'en' && "RSVP"}
                  {activeLanguage === 'ar' && "الرجاء الرد"}
                  {activeLanguage === 'hi' && "कृपया उत्तर दें"}
                  {activeLanguage === 'es' && "Confirmar asistencia"}
                  {activeLanguage === 'zh' && "请回复"}
                </p>
                
                <p className="rsvp-contact">
                  <span className="phone">{invitation.rsvp.phone}</span>
                  {invitation.rsvp.website && (
                    <span className="website">{invitation.rsvp.website}</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="invitation-footer">
              <p className="footer-text">
                {activeLanguage === 'en' && "We look forward to celebrating with you!"}
                {activeLanguage === 'ar' && "نتطلع إلى الاحتفال معكم!"}
                {activeLanguage === 'hi' && "हम आपके साथ जश्न मनाने के लिए उत्सुक हैं!"}
                {activeLanguage === 'es' && "¡Esperamos celebrar con ustedes!"}
                {activeLanguage === 'zh' && "期待与您共同庆祝！"}
              </p>
            </div>
          </div>
        </div>
      </div>

<button 
  className="btn-secondary"
  onClick={handleEmailSend}
>
  <i className="fas fa-envelope"></i> Email PDF
</button>
    
const handleEmailSend = async () => {
  const emailTo = prompt("Enter the email address to send invitation:");

  if (!emailTo) return;

  const htmlContent = document.querySelector('.invitation-preview').outerHTML;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/send-invitation-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`
      },
      body: JSON.stringify({ htmlContent, emailTo })
    });

    const data = await response.json();
    if (data.message) {
      alert('Invitation sent successfully!');
    } else {
      alert('Failed to send invitation');
    }
  } catch (err) {
    console.error(err);
    alert('Error sending invitation');
  }
};



      
      <div className="preview-actions">
        <button className="btn-secondary">
          <i className="fas fa-edit"></i> Edit Design
        </button>
        <button className="btn-primary">
          <i className="fas fa-download"></i> Download
        </button>
        <button className="btn-secondary">
          <i className="fas fa-share-alt"></i> Share
        </button>
        <button className="btn-secondary">
          <i className="fas fa-print"></i> Order Prints
        </button>
      </div>
    </div>
  );
};

export default Preview;
