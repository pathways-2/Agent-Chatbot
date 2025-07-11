const { v4: uuidv4 } = require('uuid');

class MemoryManager {
  constructor() {
    this.conversations = new Map();
    this.maxMessagesPerSession = 10; // Keep last 10 messages
    this.sessionTimeoutMs = 30 * 60 * 1000; // 30 minutes
    
    // Cleanup expired sessions every 5 minutes
    setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
  }

  addMessage(sessionId, role, content, metadata = {}) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, {
        messages: [],
        context: {},
        lastActivity: Date.now(),
        created: Date.now()
      });
    }

    const session = this.conversations.get(sessionId);
    
    // Add new message
    session.messages.push({
      id: uuidv4(),
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata
    });

    // Keep only the last N messages
    if (session.messages.length > this.maxMessagesPerSession) {
      session.messages = session.messages.slice(-this.maxMessagesPerSession);
    }

    // Update activity timestamp
    session.lastActivity = Date.now();

    // Extract and update context
    this.updateContext(sessionId, content, role);
  }

  getConversation(sessionId) {
    const session = this.conversations.get(sessionId);
    if (!session) {
      return { messages: [], context: {} };
    }

    // Update last activity
    session.lastActivity = Date.now();
    
    return {
      messages: session.messages,
      context: session.context
    };
  }

  updateContext(sessionId, content, role) {
    const session = this.conversations.get(sessionId);
    if (!session) return;

    // Extract context information from messages
    const context = session.context;

    // Detect if user is asking about specific employees
    if (role === 'user') {
      const employeeNamePattern = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
      const employeeMatches = content.match(employeeNamePattern);
      
      if (employeeMatches) {
        context.currentEmployee = employeeMatches[0];
        context.lastEmployeeQuery = Date.now();
      }

      // Detect topic context
      const topicKeywords = {
        vacation: ['vacation', 'time off', 'pto', 'leave'],
        salary: ['salary', 'pay', 'compensation', 'wage'],
        benefits: ['benefits', 'insurance', 'health', 'dental', 'vision'],
        policy: ['policy', 'rule', 'procedure', 'guideline'],
        performance: ['performance', 'review', 'evaluation', 'rating']
      };

      const contentLower = content.toLowerCase();
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => contentLower.includes(keyword))) {
          context.currentTopic = topic;
          context.lastTopicQuery = Date.now();
          break;
        }
      }
    }

    // Clear old context if topic changed significantly
    if (context.lastTopicQuery && Date.now() - context.lastTopicQuery > 5 * 60 * 1000) {
      delete context.currentTopic;
      delete context.currentEmployee;
    }
  }

  clearConversation(sessionId) {
    this.conversations.delete(sessionId);
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.conversations.entries()) {
      if (now - session.lastActivity > this.sessionTimeoutMs) {
        this.conversations.delete(sessionId);
      }
    }
  }

  getSessionInfo(sessionId) {
    const session = this.conversations.get(sessionId);
    if (!session) return null;

    return {
      messageCount: session.messages.length,
      created: session.created,
      lastActivity: session.lastActivity,
      context: session.context
    };
  }

  // Get formatted conversation history for AI prompt
  getFormattedHistory(sessionId) {
    const conversation = this.getConversation(sessionId);
    
    if (conversation.messages.length === 0) {
      return '';
    }

    const history = conversation.messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    let contextInfo = '';
    if (conversation.context.currentEmployee) {
      contextInfo += `Current employee context: ${conversation.context.currentEmployee}\n`;
    }
    if (conversation.context.currentTopic) {
      contextInfo += `Current topic context: ${conversation.context.currentTopic}\n`;
    }

    return contextInfo + '\nConversation history:\n' + history;
  }
}

module.exports = MemoryManager; 