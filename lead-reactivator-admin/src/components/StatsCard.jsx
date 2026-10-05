import React from 'react';

export default function StatsCard({ title, value, icon, trend, trendPositive = true, color = '#6366f1' }) {
  return (
    <div className="glass-card stat-card">
      <div className="stat-header">
        <span className="stat-label">{title}</span>
        <div
          className="stat-icon-wrapper"
          style={{
            background: `${color}18`,
            color: color,
            border: `1px solid ${color}30`,
          }}
        >
          {icon}
        </div>
      </div>

      <div className="stat-value" style={{ color: '#ffffff' }}>
        {value}
      </div>

      {trend && (
        <div>
          <span
            className="stat-trend"
            style={{
              background: trendPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              color: trendPositive ? '#34d399' : '#fb7185',
              border: `1px solid ${trendPositive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
            }}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
