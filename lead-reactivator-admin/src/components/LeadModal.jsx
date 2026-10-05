import React, { useState } from 'react';
import { X, User, Phone, Mail, FileText, Calendar, Copy, Check, Bot, Trash2, Send, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LeadModal({ lead, onClose, onDelete }) {
  const [copiedField, setCopiedField] = useState(null);
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | sending | sent | error
  const [emailError, setEmailError] = useState('');

  if (!lead) return null;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendFollowUpEmail = async () => {
    setEmailStatus('sending');
    setEmailError('');
    try {
      const res = await fetch(`${API_BASE}/chat/send-followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          requirement: lead.requirement,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus('sent');
        setTimeout(() => setEmailStatus('idle'), 4000);
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err.message || 'Could not reach backend');
      setTimeout(() => setEmailStatus('idle'), 4000);
    }
  };

  const formattedDate = lead.createdAt
    ? new Date(lead.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'N/A';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <User size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Lead Profile Details</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ID: {lead._id}
              </span>
            </div>
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Email Status Banners */}
          {emailStatus === 'sent' && (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#34d399',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}>
              <Sparkles size={16} />
              <span>✅ AI-generated follow-up email dispatched to <strong>{lead.email}</strong>!</span>
            </div>
          )}
          {emailStatus === 'error' && (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '8px',
              color: '#fb7185',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}>
              <X size={16} />
              <span>❌ Email failed: {emailError}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="detail-row">
            <div className="detail-label">Full Name</div>
            <div className="detail-value" style={{ fontWeight: 600, fontSize: '1.05rem' }}>
              {lead.name}
            </div>
          </div>

          {/* Contact Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="detail-row">
              <div className="detail-label">Phone Number</div>
              <div
                className="detail-value"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>{lead.phone}</span>
                <button
                  onClick={() => copyToClipboard(lead.phone, 'phone')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Email Address</div>
              <div
                className="detail-value"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.email}
                </span>
                <button
                  onClick={() => copyToClipboard(lead.email, 'email')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Date Created */}
          <div className="detail-row">
            <div className="detail-label">Capture Timestamp</div>
            <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={15} color="#818cf8" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Requirement */}
          <div className="detail-row">
            <div className="detail-label">Lead Requirement & Context</div>
            <div
              className="detail-value"
              style={{
                lineHeight: 1.6,
                padding: '1rem',
                whiteSpace: 'pre-wrap',
                background: 'rgba(0, 0, 0, 0.25)',
              }}
            >
              {lead.requirement}
            </div>
          </div>

          {/* AI Action Info Box */}
          <div style={{
            marginTop: '0.5rem',
            padding: '0.85rem 1rem',
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '10px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start',
          }}>
            <Bot size={14} style={{ color: '#818cf8', marginTop: '1px', flexShrink: 0 }} />
            <span>
              Clicking <strong style={{ color: '#c7d2fe' }}>Send AI Follow-up</strong> uses Google Gemini to write a personalized reactivation email based on this lead's specific requirement, then dispatches it immediately.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button
            id="modal-delete-lead-btn"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
                onDelete(lead._id);
                onClose();
              }
            }}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={15} />
            <span>Delete Lead</span>
          </button>

          <button
            id="modal-ai-email-btn"
            onClick={handleSendFollowUpEmail}
            disabled={emailStatus === 'sending'}
            className="btn btn-primary btn-sm"
            style={{ background: emailStatus === 'sending' ? undefined : 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            {emailStatus === 'sending' ? (
              <>
                <div style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span>Generating & Sending...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Send AI Follow-up</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

