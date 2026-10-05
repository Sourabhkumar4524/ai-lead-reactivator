import '../styles/globals.css';
import { Bot, ArrowUpRight } from 'lucide-react';
import AIChatWidget from '../components/AIChatWidget';

export const metadata = {
  title: 'AI Lead Reactivator - Autonomous Revenue & Pipeline Recovery Engine',
  description:
    'Turn dormant, cold, and unresponsive leads into booked appointments with omnichannel conversational AI agents.',
  keywords: ['AI lead generation', 'lead reactivation', 'sales automation', 'outreach agent', 'crm recovery'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <header className="site-header">
          <div className="container header-content">
            <a href="/" className="logo">
              <div className="logo-icon">
                <Bot size={20} />
              </div>
              <span>AI Lead Reactivator</span>
            </a>

            <nav>
              <ul className="nav-links">
                <li>
                  <a href="#features" className="nav-link">Features</a>
                </li>
                <li>
                  <a href="#lead-enquiry-section" className="nav-link">Enquiry Form</a>
                </li>
                <li>
                  <a
                    href="http://localhost:3001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
                  >
                    <span>Admin Dashboard</span>
                    <ArrowUpRight size={14} />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* 🤖 AI Chat Widget — Aria (Gemini-powered lead qualification agent) */}
        <AIChatWidget />
      </body>
    </html>
  );
}
