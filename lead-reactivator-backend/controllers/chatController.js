const { GoogleGenerativeAI } = require('@google/generative-ai');
const Lead = require('../models/Lead');
const { getIsConnected } = require('../config/db');
const mongoose = require('mongoose');
const { sendFollowUpEmail } = require('../services/emailService');

// In-memory session store (keyed by sessionId)
const sessions = new Map();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Purge stale sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

// Initialize Gemini client lazily
let genAI = null;
const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * System prompt that turns Gemini into a lead-qualification sales agent
 */
const SYSTEM_PROMPT = `You are "Aria", an expert AI sales assistant for AI Lead Reactivator — a cutting-edge B2B SaaS platform that autonomously reactivates cold, lapsed, and unresponsive leads using AI-powered multi-channel outreach (email, WhatsApp, SMS, phone).

## Your Mission
Engage website visitors in a warm, professional conversation. Your primary goal is to:
1. Understand their lead reactivation challenge
2. Qualify them (company size, cold lead count, current channels, urgency)
3. Naturally collect: Full Name, Phone Number, Business Email, and Requirement/Goal
4. Once all 4 fields are collected, confirm and save them as a lead

## Personality
- Warm, confident, and consultative — never pushy
- Use emojis sparingly but tastefully (1-2 per message max)
- Keep responses concise (2-4 short paragraphs max)
- Ask one question at a time — don't overwhelm the user
- Reference specific pain points (e.g., "wasted ad spend", "dead pipeline", "cold Q-leads")

## Lead Collection Rules
- Collect information naturally in conversation — DO NOT use a form-like approach
- Only ask for phone after you've built rapport (after 2-3 messages)
- Validate email format internally; if invalid, politely ask again
- Once you have all 4 fields, output a special JSON block at the END of your message (after your conversational reply):

[LEAD_DATA]
{
  "name": "...",
  "phone": "...",
  "email": "...",
  "requirement": "..."
}
[/LEAD_DATA]

## Conversation Flow
1. Greet → ask about their cold lead challenge
2. Ask about scale (how many dead leads, what industry)
3. Ask about their goal (book calls, reactivate old customers, etc.)
4. Naturally ask for their name if not given
5. Ask for email to send them a personalized reactivation blueprint
6. Ask for phone for a quick 15-min demo call
7. Confirm all details → output [LEAD_DATA] block → thank them warmly

## Capabilities to Mention (when relevant)
- Omnichannel AI agents (WhatsApp, Email, SMS, LinkedIn)
- Contextual memory — remembers conversation history with leads
- Safety guardrails & compliance (GDPR, CAN-SPAM)
- 48-hour pilot: upload 500 leads, see results fast
- 67% average reactivation rate

## Important Rules
- NEVER make up statistics you're not sure of beyond what's listed above
- If asked something technical you can't answer, say "Let me connect you with our solutions team"
- If the user seems uninterested, offer a free reactivation audit instead
- NEVER output [LEAD_DATA] unless you genuinely have all 4 fields from the conversation`;

/**
 * @desc    Start or continue an AI chat session
 * @route   POST /api/chat
 * @access  Public
 */
const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 2000 characters)' });
    }

    const sid = sessionId || `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Get or create session
    let session = sessions.get(sid);
    if (!session) {
      session = { history: [], leadCaptured: false, leadData: null, lastActive: Date.now() };
      sessions.set(sid, session);
    }
    session.lastActive = Date.now();

    // Build Gemini model with chat history
    const model = getGenAI().getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.75,
        topP: 0.95,
        maxOutputTokens: 512,
      },
    });

    // Convert session history to Gemini format
    const chatHistory = session.history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.content }],
    }));

    const geminiChat = model.startChat({ history: chatHistory });

    // Send user message to Gemini
    const result = await geminiChat.sendMessage(message.trim());
    let aiResponse = result.response.text();

    // Check for [LEAD_DATA] block
    let leadSaved = false;
    let leadAlreadyCaptured = session.leadCaptured;

    if (!session.leadCaptured) {
      const leadMatch = aiResponse.match(/\[LEAD_DATA\]([\s\S]*?)\[\/LEAD_DATA\]/);
      if (leadMatch) {
        try {
          const leadData = JSON.parse(leadMatch[1].trim());
          if (leadData.name && leadData.phone && leadData.email && leadData.requirement) {
            // Save lead to DB
            await saveLead(leadData, sid);
            session.leadCaptured = true;
            session.leadData = leadData;
            leadSaved = true;

            // Trigger async follow-up email (non-blocking)
            triggerFollowUpEmail(leadData).catch((err) =>
              console.error('Follow-up email error:', err.message)
            );
          }
        } catch (parseError) {
          console.error('Failed to parse [LEAD_DATA]:', parseError.message);
        }
        // Strip the [LEAD_DATA] block from the response sent to user
        aiResponse = aiResponse.replace(/\[LEAD_DATA\][\s\S]*?\[\/LEAD_DATA\]/, '').trim();
      }
    }

    // Update history
    session.history.push({ role: 'user', content: message.trim() });
    session.history.push({ role: 'model', content: aiResponse });

    // Keep history bounded (last 40 turns = 20 exchanges)
    if (session.history.length > 40) {
      session.history = session.history.slice(-40);
    }

    return res.status(200).json({
      success: true,
      reply: aiResponse,
      sessionId: sid,
      leadCaptured: leadSaved,
      leadAlreadyCaptured,
    });
  } catch (error) {
    console.error('Chat error:', error.message);

    // Handle Gemini API key error gracefully
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured. Please add your GEMINI_API_KEY to the backend .env file.',
      });
    }

    // Handle Gemini quota/rate limit
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'AI rate limit reached. Please wait a moment before trying again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'AI service error. Please try again.',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
};

/**
 * Save lead to MongoDB or in-memory store
 */
const inMemoryStore = [];
const saveLead = async (leadData, sessionId) => {
  try {
    if (getIsConnected()) {
      await Lead.create({
        name: leadData.name.trim(),
        phone: leadData.phone.trim(),
        email: leadData.email.trim().toLowerCase(),
        requirement: leadData.requirement.trim(),
      });
      console.log(`✅ AI Chat Lead saved to MongoDB: ${leadData.email}`);
    } else {
      inMemoryStore.unshift({
        _id: new mongoose.Types.ObjectId().toString(),
        ...leadData,
        source: 'ai_chat',
        createdAt: new Date().toISOString(),
      });
      console.log(`✅ AI Chat Lead saved to memory: ${leadData.email}`);
    }
  } catch (error) {
    console.error('Error saving AI chat lead:', error.message);
  }
};

/**
 * Trigger follow-up email via email service
 */
const triggerFollowUpEmail = async (leadData) => {
  try {
    await sendFollowUpEmail(leadData);
    console.log(`📧 Follow-up email sent to: ${leadData.email}`);
  } catch (error) {
    console.error(`📧 Failed to send follow-up email to ${leadData.email}:`, error.message);
  }
};

/**
 * @desc    Get initial greeting message
 * @route   GET /api/chat/greet
 * @access  Public
 */
const greet = async (req, res) => {
  try {
    const model = getGenAI().getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { temperature: 0.8, maxOutputTokens: 150 },
    });

    const result = await model.generateContent(
      'Generate a warm, engaging opening greeting for a website visitor. Keep it to 2-3 sentences. Be friendly and curiosity-provoking about lead reactivation challenges.'
    );

    return res.status(200).json({
      success: true,
      greeting: result.response.text(),
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      greeting:
        "👋 Hi! I'm Aria, your AI Lead Reactivation specialist. Are you sitting on a database of cold or lapsed leads? I'd love to show you how we turn them into booked calls — no extra ad spend required!",
    });
  }
};

/**
 * @desc    Admin: Send AI-generated follow-up email to a lead
 * @route   POST /api/chat/send-followup
 * @access  Admin
 */
const sendFollowup = async (req, res) => {
  try {
    const { name, email, phone, requirement } = req.body;

    if (!name || !email || !requirement) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and requirement are required',
      });
    }

    await sendFollowUpEmail({ name, email, phone: phone || 'N/A', requirement });

    return res.status(200).json({
      success: true,
      message: `AI follow-up email sent to ${email}`,
    });
  } catch (error) {
    console.error('sendFollowup error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send follow-up email',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
};

module.exports = { chat, greet, sendFollowup };
