'use client';

import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon" style={{ width: '30px', height: '30px' }}>
              <Bot size={18} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
              AI Lead Reactivator
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#lead-enquiry-section" className="nav-link">Request Audit</a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ color: '#818cf8', fontWeight: 600 }}
            >
              Admin Portal
            </a>
          </div>

          <div className="footer-text">
            © {new Date().getFullYear()} AI Lead Reactivator Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
