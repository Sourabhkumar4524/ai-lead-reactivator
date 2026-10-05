import React from 'react';
import {
  Users,
  UserCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Mail,
  Phone,
  Eye,
  Zap,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';

export default function Dashboard({ leads, loading, onSelectLead, onNavigateToLeads }) {
  // Calculate basic statistics
  const totalLeads = leads.length;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const leadsToday = leads.filter((lead) => {
    if (!lead.createdAt) return false;
    return new Date(lead.createdAt) >= todayStart;
  }).length;

  // Latest 5 leads
  const latestLeads = leads.slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            Live overview of inbound prospects, autonomous reactivation metrics, and database pipeline.
          </p>
        </div>

        <button
          id="dash-view-leads-btn"
          onClick={onNavigateToLeads}
          className="btn btn-primary"
        >
          <span>Manage All Leads</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="TOTAL CAPTURED LEADS"
          value={loading ? '...' : totalLeads}
          icon={<Users size={22} />}
          trend="+14% this month"
          trendPositive={true}
          color="#6366f1"
        />

        <StatsCard
          title="NEW LEADS TODAY"
          value={loading ? '...' : leadsToday}
          icon={<UserCheck size={22} />}
          trend={leadsToday > 0 ? 'Active ingestion' : 'Awaiting sync'}
          trendPositive={leadsToday > 0}
          color="#06b6d4"
        />

        <StatsCard
          title="AVG RECOVERY RATE"
          value="38.4%"
          icon={<TrendingUp size={22} />}
          trend="+5.2% vs industry avg"
          trendPositive={true}
          color="#10b981"
        />

        <StatsCard
          title="AI AGENT READINESS"
          value="100% Online"
          icon={<Zap size={22} />}
          trend="0 queue latency"
          trendPositive={true}
          color="#a855f7"
        />
      </div>

      {/* Main Grid: Latest Leads + System Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Latest Leads Card */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Latest Leads</h2>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Most recently ingested prospects ready for reactivation
              </span>
            </div>

            <button
              onClick={onNavigateToLeads}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Loading latest leads...</div>
            </div>
          ) : latestLeads.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                No leads recorded yet. Submit the form on the website to see them stream in!
              </p>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                Go to Website Form
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {latestLeads.map((lead) => {
                const initial = lead.name ? lead.name.charAt(0).toUpperCase() : '?';
                const createdDate = lead.createdAt
                  ? new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Just now';

                return (
                  <div
                    key={lead._id}
                    onClick={() => onSelectLead(lead)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="lead-avatar">{initial}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {lead.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {createdDate}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem' }}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Reactivation Engine Status & Pipeline Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Sparkles size={18} color="#a855f7" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Reactivation Engine</h3>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              The multi-agent workflow actively analyzes leads ingested via the Express REST API and connects with MongoDB to evaluate response potential.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ingestion Pipeline</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Active (Port 5000)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>MongoDB Cluster</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CORS Handshake</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Enabled (3000 & 3001)</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Quick Architecture Flow
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#06b6d4', fontWeight: 700 }}>1.</span> Website Form (`/lead-reactivator-website`)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#6366f1', fontWeight: 700 }}>2.</span> POST `/api/leads` (`/lead-reactivator-backend`)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>3.</span> Mongoose Model Ingestion into MongoDB
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#a855f7', fontWeight: 700 }}>4.</span> Live Admin Listing (`/lead-reactivator-admin`)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
