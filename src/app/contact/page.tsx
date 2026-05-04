import React from 'react';

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '4rem' }}>
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Contact Us</h1>
        <p style={{ marginBottom: '2rem', color: '#64748b' }}>
          Have questions about the college predictor or admissions process? Reach out to us.
        </p>
        
        <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', marginBottom: '1rem' }}>
          <h3>Hareaindiran S</h3>
          <p style={{ fontSize: '1.25rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href="mailto:0709hari@gmail.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>0709hari@gmail.com</a>
          </p>
        </div>
        
        <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Predictor
        </a>
      </div>
    </div>
  );
}
