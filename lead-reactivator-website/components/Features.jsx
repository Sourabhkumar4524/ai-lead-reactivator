'use client';

import React from 'react';
import {
  MessageSquareShare,
  BrainCircuit,
  CalendarCheck,
  ShieldCheck,
  BarChart3,
  Flame,
} from 'lucide-react';

const featuresData = [
  {
    icon: <BrainCircuit size={24} />,
    title: 'Contextual AI Memory',
    desc: 'The AI parses past sales touchpoints, previous proposals, and objection history to draft 100% natural, contextual reactivations.',
  },
  {
    icon: <MessageSquareShare size={24} />,
    title: 'Omnichannel Resurfacing',
    desc: 'Reach contacts wherever they pay closest attention: synchronized follow-ups over Email, WhatsApp Business, and SMS.',
  },
  {
    icon: <Flame size={24} />,
    title: 'Intent & Temperature Scoring',
    desc: 'Automatically categorize reactivated leads into Cold, Warm, and High-Intent Hot buyers based on response velocity.',
  },
  {
    icon: <CalendarCheck size={24} />,
    title: 'Autonomous Booking Bot',
    desc: 'Directly schedules qualified calls on your sales calendar via Calendly, Google Meet, or HubSpot without human intervention.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Real-time Live Analytics',
    desc: 'Track exact ROI, reply rates, sentiment trends, and reactivation conversion funnels inside the unified Admin Console.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Enterprise Safety Guardrails',
    desc: 'Built-in opt-out detection, TCPA/GDPR compliance, frequency throttling, and seamless handoff to human representatives.',
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '4rem 0 2rem' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="badge" style={{ marginBottom: '1rem' }}>
            <span>Core Capabilities</span>
          </div>
          <h2 className="section-title">
            Engineered to Turn Forgotten Prospects into <span className="gradient-text">Closed Won</span>
          </h2>
          <p className="section-subtitle">
            Most sales teams never follow up more than twice. Our autonomous agent operates round-the-clock to capture hidden value in your existing database.
          </p>
        </div>

        <div className="features-grid">
          {featuresData.map((feat, index) => (
            <div key={index} className="glass-card feature-card">
              <div className="feature-icon-wrapper">
                {feat.icon}
              </div>
              <h3 className="feature-heading">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
