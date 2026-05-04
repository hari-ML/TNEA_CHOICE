'use client';

import { useState } from 'react';

export default function FloatingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', school: '', email: '', mobile: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setFormData({ name: '', school: '', email: '', mobile: '' });
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="floating-popup">
      {!isOpen && (
        <button className="floating-btn" onClick={() => setIsOpen(true)}>
          1-ON-1 SESSION COMING SOON
        </button>
      )}

      <div className={`popup-modal ${isOpen ? 'active' : ''}`}>
        <div className="glass-card popup-content" style={{ position: 'relative' }}>
          <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Register for 1-on-1 Session</h3>
          
          {status === 'success' ? (
            <div style={{ color: 'var(--success)', textAlign: 'center', padding: '2rem 0' }}>
              <h3>Registration Successful!</h3>
              <p>We will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">School Name</label>
                <input type="text" name="school" className="form-input" required value={formData.school} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" name="mobile" className="form-input" required pattern="[0-9]{10}" title="10 digit mobile number" value={formData.mobile} onChange={handleChange} />
              </div>
              
              {status === 'error' && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>An error occurred. Please try again.</p>}
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
                {status === 'loading' ? 'Registering...' : 'Register Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
