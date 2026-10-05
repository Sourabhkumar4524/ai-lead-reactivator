const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000', // Website (Next.js)
  'http://localhost:3001', // Admin Portal (React)
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

if (process.env.CLIENT_ORIGINS) {
  process.env.CLIENT_ORIGINS.split(',').forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: This origin is not allowed by Access-Control-Allow-Origin'));
    },
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'AI Lead Reactivator Backend API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/chat', chatRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Lead Reactivator API',
    endpoints: {
      health: 'GET /api/health',
      createLead: 'POST /api/leads',
      getLeads: 'GET /api/leads',
      getLeadById: 'GET /api/leads/:id',
      deleteLead: 'DELETE /api/leads/:id',
      aiChat: 'POST /api/chat',
      aiGreet: 'GET /api/chat/greet',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 AI Lead Reactivator Backend running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📡 Leads API: http://localhost:${PORT}/api/leads`);
  console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Gemini AI: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ NOT SET — add GEMINI_API_KEY to .env'}`);
  console.log(`📧 Email: ${process.env.SMTP_HOST ? '✅ Configured' : '⚠️  Using Ethereal test mode'}`);
  console.log(`===============================================`);
});

module.exports = app;
