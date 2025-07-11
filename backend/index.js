const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const HRChatbotAgent = require('./src/agent');
const MemoryManager = require('./src/memory');
const GuardrailsManager = require('./src/guardrails');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Initialize managers
const memoryManager = new MemoryManager();
const guardrailsManager = new GuardrailsManager();
const hrAgent = new HRChatbotAgent();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main chat endpoint
app.post('/api/chat', [
  body('message').isString().trim().isLength({ min: 1, max: 1000 }),
  body('sessionId').isString().optional()
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() });
    }

    const { message, sessionId = 'default' } = req.body;

    // Apply guardrails
    const guardrailCheck = await guardrailsManager.checkMessage(message);
    if (!guardrailCheck.allowed) {
      return res.json({
        response: guardrailCheck.response,
        type: 'guardrail_block',
        timestamp: new Date().toISOString()
      });
    }

    // Get conversation history
    const conversationHistory = memoryManager.getConversation(sessionId);

    // Process message with HR agent
    const agentResponse = await hrAgent.processMessage(message, conversationHistory);

    // Store in memory
    memoryManager.addMessage(sessionId, 'user', message);
    memoryManager.addMessage(sessionId, 'assistant', agentResponse.response);

    // Return response
    res.json({
      response: agentResponse.response,
      type: agentResponse.type,
      sources: agentResponse.sources,
      toolsUsed: agentResponse.toolsUsed,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'I apologize, but I encountered an error processing your request. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
});

// Get conversation history endpoint
app.get('/api/conversation/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const conversation = memoryManager.getConversation(sessionId);
  res.json({ conversation, sessionId });
});

// Clear conversation endpoint
app.delete('/api/conversation/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  memoryManager.clearConversation(sessionId);
  res.json({ message: 'Conversation cleared', sessionId });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`HR Chatbot backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 