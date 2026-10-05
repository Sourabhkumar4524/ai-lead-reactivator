'use client';

import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { submitLead } from '../services/api';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // Validate form fields on client
  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else {
      // Basic phone format validation (allowing +, dashes, spaces, digits, minimum 7 digits)
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        errs.phone = 'Please enter a valid phone number (7-15 digits)';
      }
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address (e.g. name@company.com)';
      }
    }

    if (!formData.requirement.trim()) {
      errs.requirement = 'Please describe your lead reactivation requirements';
    } else if (formData.requirement.trim().length < 10) {
      errs.requirement = 'Requirement description must be at least 10 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error upon typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setServerError('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const result = await submitLead(formData);
      setSuccessMessage(
        result.message || 'Thank you! Your lead request has been captured. Our AI engine is initializing your custom plan.'
      );
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        requirement: '',
      });
      setErrors({});
    } catch (error) {
      setServerError(
        error.message || 'An error occurred while submitting your request. Please check if backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lead-enquiry-section" className="lead-section">
      <div className="container">
        <div className="section-title-wrap">
          <div className="badge" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} color="#a855f7" />
            <span>Get Started Today</span>
          </div>
          <h2 className="section-title">
            Request an <span className="gradient-text">AI Reactivation Audit</span>
          </h2>
          <p className="section-subtitle">
            Tell us about your lapsed database size, sales model, or reactivation goal. 
            Our team and AI models will demonstrate customized recovery campaigns within 24 hours.
          </p>
        </div>

        <div className="form-layout">
          {/* Left Column: Context / Contact info */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Why Leading Teams Deploy Us
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Most organizations sit on 10,000+ leads that cost thousands to generate but never converted. 
              We bring them back to life without increasing ad spend.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  color: '#06b6d4',
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                    Instant Backend Ingestion
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Form submissions sync directly to the Express + MongoDB cluster and stream to the live Admin Dashboard.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  color: '#818cf8',
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                    Enterprise Privacy & Encryption
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Zero data-leakage policy with SOC2-ready encryption at rest and in transit.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  color: '#34d399',
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                    Autonomous Pilot Launch
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Upload 500 test leads and see booked calls on your calendar within 48 hours.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '2.5rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Direct Inquiries: <strong style={{ color: 'var(--text-primary)' }}>contact@aireactivator.io</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Lead Enquiry Form */}
          <div className="glass-card form-card">
            {successMessage && (
              <div id="lead-form-success" className="alert-success">
                <CheckCircle2 size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            {serverError && (
              <div id="lead-form-error" className="alert-error">
                <AlertCircle size={20} />
                <span>{serverError}</span>
              </div>
            )}

            <form id="lead-enquiry-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="lead-name" className="form-label">
                  <User size={15} color="#818cf8" />
                  <span>Full Name</span>
                </label>
                <input
                  id="lead-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  className={`form-input ${errors.name ? 'has-error' : ''}`}
                  disabled={loading}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="lead-phone" className="form-label">
                  <Phone size={15} color="#06b6d4" />
                  <span>Phone Number</span>
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 349-2819"
                  className={`form-input ${errors.phone ? 'has-error' : ''}`}
                  disabled={loading}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label htmlFor="lead-email" className="form-label">
                  <Mail size={15} color="#a855f7" />
                  <span>Business Email</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. sarah@venturecorp.com"
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  disabled={loading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Requirement Description */}
              <div className="form-group">
                <label htmlFor="lead-requirement" className="form-label">
                  <FileText size={15} color="#10b981" />
                  <span>Reactivation Requirement & Database Details</span>
                </label>
                <textarea
                  id="lead-requirement"
                  name="requirement"
                  rows={4}
                  value={formData.requirement}
                  onChange={handleChange}
                  placeholder="e.g. We have ~5,000 leads from Q1-Q3 marketing webinars. Looking to re-engage them via WhatsApp & email to schedule software demo calls."
                  className={`form-textarea ${errors.requirement ? 'has-error' : ''}`}
                  disabled={loading}
                />
                {errors.requirement && (
                  <span className="error-text">{errors.requirement}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                id="lead-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span>Submitting to Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Reactivation Request</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
