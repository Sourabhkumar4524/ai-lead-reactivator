'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Bot } from 'lucide-react';

export default function Hero() {
  const scrollToForm = () => {
    const el = document.getElementById('lead-enquiry-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="container">
        {/* Animated Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <div className="badge">
            <span className="badge-dot"></span>
            <span>Next-Gen AI Revenue Engine</span>
          </div>
        </div>

        {/* Main H1 Headline */}
        <h1 className="hero-h1">
          Turn Dormant Leads into <br />
          <span className="gradient-text">Active Pipeline Revenue</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-description">
          Stop letting qualified contacts slip through the cracks. Our autonomous AI agents re-engage,
          qualify, and resurrect cold opportunities with hyper-personalized 1-on-1 dialogue across SMS, Email, and WhatsApp.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button id="hero-cta-btn" onClick={scrollToForm} className="btn-primary">
            <span>Launch Reactivation Audit</span>
            <ArrowRight size={18} />
          </button>
          
          <a
            id="hero-admin-btn"
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Bot size={18} color="#818cf8" />
            <span>Admin Portal Live Demo</span>
          </a>
        </div>

        {/* Metric Strip */}
        <div className="metrics-strip">
          <div className="glass-card metric-item">
            <div className="metric-number gradient-text">38.4%</div>
            <div className="metric-label">Lapsed Lead Recovery Rate</div>
          </div>
          <div className="glass-card metric-item">
            <div className="metric-number" style={{ color: '#06b6d4' }}>&lt; 90s</div>
            <div className="metric-label">Autonomous AI Response Time</div>
          </div>
          <div className="glass-card metric-item">
            <div className="metric-number" style={{ color: '#10b981' }}>$3.2M+</div>
            <div className="metric-label">Pipeline Recovered to Date</div>
          </div>
          <div className="glass-card metric-item">
            <div className="metric-number" style={{ color: '#a855f7' }}>24 / 7</div>
            <div className="metric-label">Omnichannel Engagement</div>
          </div>
        </div>
      </div>
    </section>
  );
}
