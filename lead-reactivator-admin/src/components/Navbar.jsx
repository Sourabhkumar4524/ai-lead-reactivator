import React from 'react';
import { Bot, LayoutDashboard, Users, ExternalLink, RefreshCw } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, leadCount, onRefresh, refreshing }) {
  return (
    <header className="admin-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="brand-badge">
            <div className="brand-icon">
              <Bot size={20} />
            </div>
            <div>
              <span style={{ display: 'block', lineHeight: 1.1 }}>AI Lead Reactivator</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-indigo)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              id="nav-tab-dashboard"
              onClick={() => setCurrentTab('dashboard')}
              className={`nav-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-leads"
              onClick={() => setCurrentTab('leads')}
              className={`nav-tab-btn ${currentTab === 'leads' ? 'active' : ''}`}
            >
              <Users size={16} />
              <span>Leads</span>
              {leadCount > 0 && (
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.3)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {leadCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            id="admin-refresh-btn"
            onClick={onRefresh}
            disabled={refreshing}
            className="btn btn-secondary btn-sm"
            title="Refresh latest leads data"
          >
            <RefreshCw size={14} className={refreshing ? 'spinner' : ''} />
            <span>Sync</span>
          </button>

          <a
            id="nav-view-site-btn"
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>Live Website</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </header>
  );
}
