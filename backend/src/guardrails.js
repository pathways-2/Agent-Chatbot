class GuardrailsManager {
  constructor() {
    // Prohibited words/phrases
    this.prohibitedWords = [
      'salary', 'wage', 'compensation', 'pay', 'income', 'bonus',
      'ssn', 'social security', 'personal information', 'private',
      'confidential', 'secret', 'password', 'login'
    ];

    // Sensitive topics that require careful handling
    this.sensitiveTopics = [
      'discrimination', 'harassment', 'lawsuit', 'legal action',
      'termination', 'firing', 'disciplinary action', 'complaint'
    ];

    // Non-HR related topics to redirect
    this.nonHRTopics = [
      'weather', 'sports', 'politics', 'religion', 'personal life',
      'dating', 'relationship', 'medical advice', 'financial advice'
    ];

    // Maximum request patterns (to prevent bulk data extraction)
    this.bulkRequestPatterns = [
      /all employees/i,
      /entire (database|list|roster)/i,
      /everyone('s| in the)/i,
      /complete (list|database)/i,
      /full (roster|directory)/i
    ];
  }

  async checkMessage(message) {
    const messageLower = message.toLowerCase();
    
    // Check for prohibited salary/compensation requests
    if (this.containsProhibitedContent(messageLower)) {
      return {
        allowed: false,
        response: "I'm sorry, but I cannot provide salary or compensation information as this is confidential. For questions about your own compensation, please contact HR directly or check your employee portal."
      };
    }

    // Check for bulk data requests
    if (this.isBulkDataRequest(message)) {
      return {
        allowed: false,
        response: "I can't provide information about all employees at once for privacy reasons. Please ask about specific employees or use more targeted queries."
      };
    }

    // Check for sensitive topics
    if (this.containsSensitiveTopic(messageLower)) {
      return {
        allowed: true,
        response: null,
        requiresDisclaimer: true,
        disclaimer: "Please note: For sensitive HR matters, I recommend speaking directly with HR personnel. This information is for general guidance only."
      };
    }

    // Check for non-HR topics
    if (this.isNonHRTopic(messageLower)) {
      return {
        allowed: false,
        response: "I'm designed to help with HR-related questions only. Please ask about company policies, employee information, benefits, or other HR topics. How can I assist you with HR matters today?"
      };
    }

    // Check message length and complexity
    if (message.length > 1000) {
      return {
        allowed: false,
        response: "Please keep your questions concise (under 1000 characters). How can I help you with a specific HR question?"
      };
    }

    // Check for potential injection attempts
    if (this.containsSuspiciousContent(message)) {
      return {
        allowed: false,
        response: "I detected potentially problematic content in your message. Please rephrase your HR question."
      };
    }

    return {
      allowed: true,
      response: null
    };
  }

  containsProhibitedContent(message) {
    return this.prohibitedWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(message);
    });
  }

  isBulkDataRequest(message) {
    return this.bulkRequestPatterns.some(pattern => pattern.test(message));
  }

  containsSensitiveTopic(message) {
    return this.sensitiveTopics.some(topic => {
      const regex = new RegExp(`\\b${topic}\\b`, 'i');
      return regex.test(message);
    });
  }

  isNonHRTopic(message) {
    return this.nonHRTopics.some(topic => {
      const regex = new RegExp(`\\b${topic}\\b`, 'i');
      return regex.test(message);
    });
  }

  containsSuspiciousContent(message) {
    // Check for potential injection attempts
    const suspiciousPatterns = [
      /\bSELECT\s+.*\bFROM\b/i,
      /\bDROP\s+TABLE\b/i,
      /\bINSERT\s+INTO\b/i,
      /\bUPDATE\s+.*\bSET\b/i,
      /\bDELETE\s+FROM\b/i,
      /<script[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /exec\s*\(/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(message));
  }

  // Filter sensitive information from responses
  filterResponse(response) {
    // Remove or mask sensitive information
    let filtered = response;

    // Mask partial SSN or ID numbers
    filtered = filtered.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****');
    filtered = filtered.replace(/\b\d{9}\b/g, '*********');

    // Remove detailed salary information if it somehow gets through
    filtered = filtered.replace(/\$\d+,?\d*/g, '$***');

    return filtered;
  }

  // Add disclaimer to responses when needed
  addDisclaimer(response, type = 'general') {
    const disclaimers = {
      general: "\n\n*Please note: This information is for general guidance only. For specific HR matters, contact HR directly.*",
      policy: "\n\n*Disclaimer: Policy information provided is for reference only. Always refer to the official employee handbook for authoritative policy details.*",
      sensitive: "\n\n*Important: For sensitive HR matters, please speak directly with HR personnel. This information should not be considered as official HR advice.*"
    };

    return response + (disclaimers[type] || disclaimers.general);
  }

  // Validate employee data sharing
  validateEmployeeDataSharing(employeeData) {
    // Define what employee information is safe to share
    const safeFields = [
      'employee_id', 'first_name', 'last_name', 'email', 'department',
      'job_title', 'supervisor_name', 'employment_status', 'hire_date',
      'employment_type', 'location', 'phone', 'emergency_contact',
      'emergency_phone', 'benefits_eligible', 'last_performance_review',
      'performance_rating', 'next_review_date'
    ];

    // Remove sensitive fields
    const filtered = {};
    for (const field of safeFields) {
      if (employeeData[field] !== undefined) {
        filtered[field] = employeeData[field];
      }
    }

    return filtered;
  }

  // Log guardrail violations for monitoring
  logViolation(message, violationType, clientIP = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message.substring(0, 200), // Log first 200 chars only
      violationType,
      clientIP,
      severity: this.getViolationSeverity(violationType)
    };

    // In production, this would go to a proper logging system
    console.warn('Guardrail violation:', logEntry);
  }

  getViolationSeverity(violationType) {
    const severityMap = {
      'prohibited_content': 'medium',
      'bulk_request': 'high',
      'sensitive_topic': 'low',
      'non_hr_topic': 'low',
      'suspicious_content': 'high',
      'length_violation': 'low'
    };

    return severityMap[violationType] || 'medium';
  }
}

module.exports = GuardrailsManager; 