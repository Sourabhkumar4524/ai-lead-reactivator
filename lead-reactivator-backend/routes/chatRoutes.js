const express = require('express');
const router = express.Router();
const { chat, greet, sendFollowup } = require('../controllers/chatController');

// POST /api/chat — send a message to the AI agent
router.post('/', chat);

// GET /api/chat/greet — get initial greeting from the AI
router.get('/greet', greet);

// POST /api/chat/send-followup — admin: send AI-generated follow-up email to a lead
router.post('/send-followup', sendFollowup);

module.exports = router;

