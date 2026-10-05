const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Create nodemailer transporter
 * Falls back to Ethereal (fake SMTP) if no real credentials set
 */
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Real SMTP (Gmail, SendGrid, Mailgun, etc.)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development fallback: Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  console.log('📧 Using Ethereal test email. Preview URL will be logged below.');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Generate a personalized follow-up email body using Gemini
 */
const generateEmailContent = async (lead) => {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('No API key');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
    });

    const prompt = `Write a personalized, professional follow-up email for a B2B SaaS lead.

Lead Details:
- Name: ${lead.name}
- Requirement: ${lead.requirement}
- Company context: AI-powered lead reactivation platform

Email requirements:
- Subject line (output as: SUBJECT: ...)
- Warm, professional tone
- Reference their specific requirement
- Mention 48-hour pilot program (500 leads, see results fast)
- Include a clear CTA: book a 15-min call
- Max 200 words
- Sign off as "Aria | AI Lead Reactivator Team"
- No placeholder brackets — write it as a final email

Output format:
SUBJECT: [subject line]

[email body]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const subjectMatch = text.match(/SUBJECT:\s*(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : '🚀 Your AI Lead Reactivation Blueprint is Ready';
    const body = text.replace(/SUBJECT:\s*.+\n?/, '').trim();

    return { subject, body };
  } catch (error) {
    // Fallback static email
    return {
      subject: `🚀 ${lead.name}, Your AI Lead Reactivation Blueprint is Ready`,
      body: `Hi ${lead.name},

Thank you for chatting with Aria, our AI assistant! We've noted your interest in: "${lead.requirement}"

Here's what happens next:
✅ Our team is analyzing your reactivation scenario
✅ We're preparing a customized campaign blueprint
✅ A solutions specialist will reach out within 24 hours

Want to fast-track results? Join our 48-Hour Pilot: upload 500 of your coldest leads and watch our AI book meetings on your calendar — no risk, no long-term commitment.

👉 Book your 15-min discovery call: https://aireactivator.io/demo

Looking forward to reviving your pipeline!

Warm regards,
Aria | AI Lead Reactivator Team
contact@aireactivator.io`,
    };
  }
};

/**
 * Send a personalized AI-generated follow-up email to a newly captured lead
 */
const sendFollowUpEmail = async (lead) => {
  const transporter = await createTransporter();
  const { subject, body } = await generateEmailContent(lead);

  const fromName = process.env.EMAIL_FROM_NAME || 'AI Lead Reactivator';
  const fromAddress = process.env.SMTP_USER || 'aria@aireactivator.io';

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background: #07090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
    .card { background: linear-gradient(135deg, #0d121f 0%, #121827 100%); border: 1px solid rgba(99,102,241,0.25); border-radius: 16px; padding: 40px; }
    .logo { display: flex; align-items: center; margin-bottom: 32px; }
    .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, #06b6d4, #6366f1, #a855f7); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 20px; }
    .logo-text { font-size: 1.1rem; font-weight: 700; color: #f8fafc; }
    .greeting { font-size: 1.5rem; font-weight: 800; color: #f8fafc; margin-bottom: 8px; }
    .body-text { color: #94a3b8; font-size: 0.95rem; line-height: 1.7; white-space: pre-line; margin-bottom: 28px; }
    .cta-btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; font-weight: 700; font-size: 0.95rem; text-decoration: none; border-radius: 10px; margin-bottom: 32px; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
    .footer { font-size: 0.8rem; color: #64748b; text-align: center; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 999px; font-size: 0.75rem; color: #c7d2fe; font-weight: 600; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">🤖</div>
        <div class="logo-text">AI Lead Reactivator</div>
      </div>
      <div class="badge">✨ Powered by Gemini AI</div>
      <div class="greeting">Hi ${lead.name}! 👋</div>
      <div class="body-text">${body.replace(/\n/g, '<br>')}</div>
      <a href="https://aireactivator.io/demo" class="cta-btn">📅 Book Your Free 15-Min Demo</a>
      <hr class="divider">
      <div class="footer">
        <p>You're receiving this because you chatted with Aria on aireactivator.io</p>
        <p style="margin-top:8px;">© ${new Date().getFullYear()} AI Lead Reactivator. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: lead.email,
    subject,
    text: body,
    html: htmlBody,
  });

  // Log Ethereal preview URL in dev mode
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`📧 Email preview (Ethereal): ${previewUrl}`);
  }

  return info;
};

module.exports = { sendFollowUpEmail };
