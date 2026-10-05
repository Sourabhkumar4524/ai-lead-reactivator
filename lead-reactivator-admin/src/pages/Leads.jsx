import React, { useState } from 'react';
import {
  Search,
  Trash2,
  Eye,
  AlertCircle,
  Users,
  Calendar,
  Phone,
  Mail,
  RefreshCw,
  Plus,
  Filter,
} from 'lucide-react';

export default function Leads({
  leads,
  loading,
  error,
  onRefresh,
  onViewLead,
  onDeleteLead,
  onCreateTestLead,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter leads based on search query
  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = lead.name && lead.name.toLowerCase().includes(term);
    const emailMatch = lead.email && lead.email.toLowerCase().includes(term);
    const phoneMatch = lead.phone && lead.phone.toLowerCase().includes(term);
    const reqMatch = lead.requirement && lead.requirement.toLowerCase().includes(term);
    return nameMatch || emailMatch || phoneMatch || reqMatch;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">
            All captured inquiries stored in MongoDB, sorted by most recent first.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            id="create-test-lead-btn"
            onClick={onCreateTestLead}
            className="btn btn-secondary"
            title="Inject a sample lead for testing"
          >
            <Plus size={16} />
            <span>Add Test Lead</span>
          </button>

          <button
            id="refresh-leads-btn"
            onClick={onRefresh}
            className="btn btn-primary"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            <span>Refresh Table</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={17} className="search-icon" />
          <input
            id="leads-search-input"
            type="text"
            placeholder="Search leads by name, email, phone, or requirement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <span>Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> records</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && leads.length === 0 && (
        <div className="glass-card state-container">
          <div className="spinner" style={{ width: '36px', height: '36px', marginBottom: '1.25rem' }} />
          <h3 className="state-title">Loading Leads from Database...</h3>
          <p className="state-desc">Connecting to backend at port 5000 and retrieving documents.</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card state-container" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
          <div className="state-icon" style={{ color: '#fb7185', background: 'rgba(244, 63, 94, 0.1)' }}>
            <AlertCircle size={28} />
          </div>
          <h3 className="state-title" style={{ color: '#fb7185' }}>Failed to Fetch Leads</h3>
          <p className="state-desc">{error}</p>
          <button onClick={onRefresh} className="btn btn-primary">
            <RefreshCw size={15} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leads.length === 0 && (
        <div className="glass-card state-container">
          <div className="state-icon">
            <Users size={28} />
          </div>
          <h3 className="state-title">No Inbound Leads Found</h3>
          <p className="state-desc">
            Your MongoDB collection is currently empty. Submit the enquiry form on the website or click below to generate a test lead.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Open Website Form
            </a>
            <button onClick={onCreateTestLead} className="btn btn-secondary">
              <Plus size={15} />
              <span>Create Test Lead</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Empty State (No search results) */}
      {!loading && !error && leads.length > 0 && filteredLeads.length === 0 && (
        <div className="glass-card state-container">
          <div className="state-icon">
            <Search size={28} />
          </div>
          <h3 className="state-title">No Matching Leads</h3>
          <p className="state-desc">
            No leads match your search query "{searchTerm}". Try clearing the search bar.
          </p>
          <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
            Clear Search
          </button>
        </div>
      )}

      {/* Leads Table */}
      {!error && filteredLeads.length > 0 && (
        <div className="table-container">
          <table className="data-table" id="leads-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Requirement</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const initial = lead.name ? lead.name.charAt(0).toUpperCase() : '?';
                const formattedDate = lead.createdAt
                  ? new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A';

                return (
                  <tr key={lead._id} id={`lead-row-${lead._id}`}>
                    {/* Name Column */}
                    <td>
                      <div className="lead-name-cell">
                        <div className="lead-avatar">{initial}</div>
                        <div>
                          <div>{lead.name}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {lead._id ? lead._id.substring(lead._id.length - 6) : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <Phone size={13} color="#06b6d4" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>

                    {/* Email Column */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <Mail size={13} color="#a855f7" />
                        <span>{lead.email}</span>
                      </div>
                    </td>

                    {/* Requirement Column */}
                    <td>
                      <div className="requirement-snippet" title={lead.requirement}>
                        {lead.requirement}
                      </div>
                    </td>

                    {/* Created Date Column */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Calendar size={13} />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    {/* Actions Column (View, Delete) */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          id={`view-lead-${lead._id}`}
                          onClick={() => onViewLead(lead)}
                          className="btn btn-secondary btn-sm"
                          title="View full lead record"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        <button
                          id={`delete-lead-${lead._id}`}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete ${lead.name}?`)) {
                              onDeleteLead(lead._id);
                            }
                          }}
                          className="btn btn-danger btn-sm"
                          title="Delete lead from database"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
