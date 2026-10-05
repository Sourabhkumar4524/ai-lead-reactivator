'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Minimize2,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper: fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 30000) => {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(tid);
    return res;
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
};

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [greetingLoaded, setGreetingLoaded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasOpened = useRef(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Fetch greeting when first opened
  const loadGreeting = useCallback(async () => {
    if (greetingLoaded) return;
    setGreetingLoaded(true);
    setIsTyping(true);

    try {
      const res = await fetchWithTimeout(`${API_BASE}/chat/greet`, {}, 15000);
      const data = await res.json();
      const greeting = data.greeting || "👋 Hi! I'm Aria. How can I help you reactivate your cold leads today?";
      setIsTyping(false);
      setMessages([{ id: Date.now(), role: 'ai', content: greeting, ts: new Date() }]);
    } catch {
      setIsTyping(false);
      setMessages([
        {
          id: Date.now(),
          role: 'ai',
          content:
            "👋 Hi! I'm **Aria**, your AI Lead Reactivation specialist!\n\nAre you sitting on a database of cold or lapsed leads? I'd love to show you how we turn them into booked calls — no extra ad spend required! 🚀",
          ts: new Date(),
        },
      ]);
    }
  }, [greetingLoaded]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowPulse(false);
    if (!hasOpened.current) {
      hasOpened.current = true;
      loadGreeting();
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', content: text, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const res = await fetchWithTimeout(
        `${API_BASE}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, sessionId }),
        },
        30000
      );

      const data = await res.json();
      setIsTyping(false);

      if (data.success) {
        if (data.sessionId && !sessionId) setSessionId(data.sessionId);
        if (data.leadCaptured) setLeadCaptured(true);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'ai', content: data.reply, ts: new Date() },
        ]);
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      setIsTyping(false);
      const errMsg =
        err.name === 'AbortError'
          ? "⏱️ Response timed out. Please try again!"
          : err.message?.includes('GEMINI_API_KEY')
          ? "⚙️ AI service needs configuration. Please add your GEMINI_API_KEY to the backend .env file."
          : "😕 Sorry, I'm having trouble connecting. Please try again in a moment!";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', content: errMsg, ts: new Date(), isError: true },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render message with basic markdown (bold, newlines)
  const renderMessageContent = (content) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          id="ai-chat-open-btn"
          onClick={handleOpen}
          aria-label="Open AI chat assistant"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            border: '2px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99,102,241,0.55), 0 0 0 0 rgba(99,102,241,0.4)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: showPulse ? 'chatPulse 2.5s infinite' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <MessageCircle size={28} color="#ffffff" />
          {showPulse && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '18px',
                height: '18px',
                background: '#10b981',
                borderRadius: '50%',
                border: '2px solid #07090e',
                animation: 'chatDot 2s infinite',
              }}
            />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-chat-window"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            width: isMinimized ? '280px' : '380px',
            height: isMinimized ? 'auto' : '580px',
            borderRadius: '20px',
            background: 'rgba(13, 18, 31, 0.97)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(99,102,241,0.35)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 18px',
              background: 'linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(124,58,237,0.2) 100%)',
              borderBottom: '1px solid rgba(99,102,241,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 16px rgba(99,102,241,0.5)',
              }}
            >
              <Bot size={20} color="#ffffff" />
            </div>

            {/* Name + Status */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>Aria</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    color: '#c7d2fe',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Sparkles size={9} /> Gemini AI
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>AI Sales Specialist · Online</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                id="ai-chat-minimize-btn"
                onClick={() => setIsMinimized((v) => !v)}
                aria-label="Minimize chat"
                style={iconBtnStyle}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minimize2 size={15} />
              </button>
              <button
                id="ai-chat-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={iconBtnStyle}
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Lead Captured Banner */}
          {leadCaptured && !isMinimized && (
            <div
              style={{
                padding: '10px 16px',
                background: 'rgba(16,185,129,0.12)',
                borderBottom: '1px solid rgba(16,185,129,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#34d399',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={14} />
              <span>✅ Your info is saved! A personalized follow-up email is on its way.</span>
            </div>
          )}

          {/* Messages */}
          {!isMinimized && (
            <div
              id="ai-chat-messages"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(99,102,241,0.3) transparent',
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: '8px',
                    animation: 'msgFadeIn 0.25s ease',
                  }}
                >
                  {/* AI Avatar (only for AI messages) */}
                  {msg.role === 'ai' && (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Bot size={14} color="#fff" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div style={{ maxWidth: '75%' }}>
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                            : msg.isError
                            ? 'rgba(244,63,94,0.12)'
                            : 'rgba(255,255,255,0.06)',
                        border:
                          msg.role === 'ai'
                            ? msg.isError
                              ? '1px solid rgba(244,63,94,0.3)'
                              : '1px solid rgba(255,255,255,0.08)'
                            : 'none',
                        fontSize: '0.875rem',
                        lineHeight: '1.55',
                        color: msg.isError ? '#fb7185' : '#f1f5f9',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: '#475569',
                        marginTop: '3px',
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                        paddingLeft: msg.role === 'ai' ? '4px' : '0',
                        paddingRight: msg.role === 'user' ? '4px' : '0',
                      }}
                    >
                      {formatTime(msg.ts)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div
                  style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', animation: 'msgFadeIn 0.25s ease' }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={14} color="#fff" />
                  </div>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#6366f1',
                          display: 'block',
                          animation: `typingDot 1.4s ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          {!isMinimized && (
            <div
              style={{
                padding: '12px 14px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(7,9,14,0.5)',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end',
                flexShrink: 0,
              }}
            >
              <textarea
                id="ai-chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aria anything about lead reactivation..."
                disabled={isLoading}
                rows={1}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '1.5',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                id="ai-chat-send-btn"
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background:
                    isLoading || !input.trim()
                      ? 'rgba(99,102,241,0.2)'
                      : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  border: 'none',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  boxShadow: input.trim() && !isLoading ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {isLoading ? (
                  <Loader2 size={17} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Send size={17} color={input.trim() ? '#fff' : '#475569'} />
                )}
              </button>
            </div>
          )}

          {/* Minimized footer */}
          {isMinimized && (
            <div
              style={{
                padding: '10px 18px',
                fontSize: '0.8rem',
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              Chat minimized · Click to expand
            </div>
          )}
        </div>
      )}

      {/* Injected Animations */}
      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(99,102,241,0.55), 0 0 0 0 rgba(99,102,241,0.4); }
          50% { box-shadow: 0 8px 32px rgba(99,102,241,0.55), 0 0 0 12px rgba(99,102,241,0); }
        }
        @keyframes chatDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes chatSlideIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        #ai-chat-messages::-webkit-scrollbar { width: 4px; }
        #ai-chat-messages::-webkit-scrollbar-track { background: transparent; }
        #ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
      `}</style>
    </>
  );
}

const iconBtnStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#94a3b8',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
};
