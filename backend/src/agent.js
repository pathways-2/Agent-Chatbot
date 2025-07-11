const OpenAI = require('openai');
const EmployeeLookupTool = require('./tools/employeeLookup');
const CalculatorTool = require('./tools/calculator');
const PolicySearchTool = require('./tools/policySearch');
const GuardrailsManager = require('./guardrails');

class HRChatbotAgent {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Initialize tools
    this.employeeLookupTool = new EmployeeLookupTool();
    this.calculatorTool = new CalculatorTool();
    this.policySearchTool = new PolicySearchTool();
    this.guardrailsManager = new GuardrailsManager();
    
    // System prompt for the HR assistant
    this.systemPrompt = `You are TechCorp's HR Assistant, a helpful AI chatbot designed to assist employees with HR-related questions and tasks. 

Your capabilities include:
- Searching HR policies and procedures
- Looking up employee information (excluding sensitive data like salaries)
- Performing calculations related to vacation days, benefits, and other HR metrics
- Providing guidance on HR processes and procedures

Guidelines:
1. Always maintain a professional, helpful, and friendly tone
2. Protect sensitive information - never share salary details or confidential data
3. Always cite sources when referencing company policies
4. For sensitive HR matters, recommend speaking with HR personnel directly
5. When unsure about a policy interpretation, add appropriate disclaimers
6. Keep responses concise but informative
7. Use the available tools to provide accurate, up-to-date information

Available tools:
- employee_lookup: Search for employee information by name, ID, department, etc.
- calculator: Perform mathematical calculations including vacation day calculations
- policy_search: Search HR policies and procedures

Remember to:
- Use tools when appropriate to provide accurate information
- Format responses in a clear, professional manner
- Include relevant context from conversation history
- Suggest next steps when helpful

You represent TechCorp's HR department, so maintain high standards of professionalism and accuracy.`;
  }

  async processMessage(message, conversationHistory) {
    try {
      // Build conversation context
      const messages = this.buildConversationContext(message, conversationHistory);
      
      // Get available tools
      const tools = this.getAvailableTools();
      
      // Call OpenAI with function calling
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1000
      });

      const assistantMessage = response.choices[0].message;
      
      // Handle tool calls if present
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolResults = await this.executeTools(assistantMessage.tool_calls);
        
        // Call OpenAI again with tool results
        const toolMessages = [
          ...messages,
          assistantMessage,
          ...toolResults.map(result => ({
            role: 'tool',
            tool_call_id: result.tool_call_id,
            content: JSON.stringify(result.content)
          }))
        ];

        const finalResponse = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: toolMessages,
          temperature: 0.7,
          max_tokens: 1000
        });

        return this.formatResponse(finalResponse.choices[0].message.content, toolResults);
      }

      // No tool calls - return direct response
      return this.formatResponse(assistantMessage.content, []);

    } catch (error) {
      console.error('HR Agent processing error:', error);
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact HR directly if you need immediate assistance.",
        type: 'error',
        sources: [],
        toolsUsed: []
      };
    }
  }

  buildConversationContext(message, conversationHistory) {
    const messages = [
      { role: 'system', content: this.systemPrompt }
    ];

    // Add conversation history if available
    if (conversationHistory.messages && conversationHistory.messages.length > 0) {
      conversationHistory.messages.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    return messages;
  }

  getAvailableTools() {
    return [
      {
        type: 'function',
        function: this.employeeLookupTool.getFunctionDefinition()
      },
      {
        type: 'function',
        function: this.calculatorTool.getFunctionDefinition()
      },
      {
        type: 'function',
        function: this.policySearchTool.getFunctionDefinition()
      }
    ];
  }

  async executeTools(toolCalls) {
    const toolResults = [];

    for (const toolCall of toolCalls) {
      const { name, arguments: args } = toolCall.function;
      const toolCallId = toolCall.id;

      let result;
      
      try {
        const parsedArgs = JSON.parse(args);
        
        switch (name) {
          case 'employee_lookup':
            result = await this.employeeLookupTool.execute(parsedArgs);
            break;
          
          case 'calculator':
            result = await this.calculatorTool.execute(parsedArgs);
            break;
          
          case 'policy_search':
            result = await this.policySearchTool.execute(parsedArgs);
            break;
          
          default:
            result = { success: false, error: `Unknown tool: ${name}` };
        }

        toolResults.push({
          tool_call_id: toolCallId,
          tool_name: name,
          content: result,
          success: result.success
        });

      } catch (error) {
        console.error(`Tool execution error for ${name}:`, error);
        toolResults.push({
          tool_call_id: toolCallId,
          tool_name: name,
          content: { success: false, error: error.message },
          success: false
        });
      }
    }

    return toolResults;
  }

  formatResponse(content, toolResults) {
    // Apply guardrails to the response
    let filteredContent = this.guardrailsManager.filterResponse(content);
    
    // Add disclaimers if needed
    if (this.needsDisclaimer(toolResults)) {
      filteredContent = this.guardrailsManager.addDisclaimer(filteredContent, 'general');
    }

    // Extract sources from tool results
    const sources = this.extractSources(toolResults);
    
    // Get used tools
    const toolsUsed = toolResults.map(result => result.tool_name);

    return {
      response: filteredContent,
      type: this.determineResponseType(toolResults),
      sources: sources,
      toolsUsed: [...new Set(toolsUsed)] // Remove duplicates
    };
  }

  extractSources(toolResults) {
    const sources = [];
    
    for (const result of toolResults) {
      if (result.tool_name === 'policy_search' && result.content.success) {
        result.content.results.forEach(policy => {
          sources.push({
            type: 'policy',
            title: policy.title,
            section: policy.section,
            last_updated: policy.last_updated,
            id: policy.id
          });
        });
      } else if (result.tool_name === 'employee_lookup' && result.content.success) {
        sources.push({
          type: 'employee_data',
          count: result.content.count,
          search_type: result.content.search_type
        });
      } else if (result.tool_name === 'calculator' && result.content.success) {
        sources.push({
          type: 'calculation',
          calculation_type: result.content.type,
          expression: result.content.expression
        });
      }
    }

    return sources;
  }

  determineResponseType(toolResults) {
    if (toolResults.length === 0) {
      return 'general';
    }

    const toolTypes = toolResults.map(r => r.tool_name);
    
    if (toolTypes.includes('policy_search')) {
      return 'policy_response';
    } else if (toolTypes.includes('employee_lookup')) {
      return 'employee_response';
    } else if (toolTypes.includes('calculator')) {
      return 'calculation_response';
    }

    return 'tool_response';
  }

  needsDisclaimer(toolResults) {
    return toolResults.some(result => 
      result.tool_name === 'policy_search' || 
      result.tool_name === 'employee_lookup'
    );
  }

  // Helper method to get agent status
  getStatus() {
    return {
      initialized: true,
      tools: {
        employee_lookup: this.employeeLookupTool ? 'available' : 'unavailable',
        calculator: this.calculatorTool ? 'available' : 'unavailable',
        policy_search: this.policySearchTool ? 'available' : 'unavailable'
      },
      openai_configured: !!process.env.OPENAI_API_KEY,
      vectorize_configured: !!(process.env.VECTORIZE_PIPELINE_ACCESS_TOKEN && process.env.VECTORIZE_ORGANIZATION_ID && process.env.VECTORIZE_PIPELINE_ID)
    };
  }

  // Method to handle specific HR scenarios
  async handleSpecificScenario(scenario, params) {
    switch (scenario) {
      case 'vacation_calculation':
        return await this.handleVacationCalculation(params);
      
      case 'employee_benefits':
        return await this.handleEmployeeBenefits(params);
      
      case 'policy_question':
        return await this.handlePolicyQuestion(params);
      
      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
  }

  async handleVacationCalculation(params) {
    const { employeeId, daysToTake } = params;
    
    // Get employee data
    const employeeResult = await this.employeeLookupTool.execute({ 
      query: employeeId, 
      type: 'id' 
    });

    if (!employeeResult.success || employeeResult.results.length === 0) {
      throw new Error('Employee not found');
    }

    const employee = employeeResult.results[0];
    
    // Calculate vacation scenario
    const calcResult = await this.calculatorTool.execute({
      expression: `${employee.vacation_balance} - ${daysToTake}`,
      type: 'vacation_calculation',
      context: {
        currentBalance: parseFloat(employee.vacation_balance),
        daysToTake: daysToTake
      }
    });

    return {
      employee: employee,
      calculation: calcResult,
      formatted_response: this.formatVacationResponse(employee, calcResult)
    };
  }

  async handleEmployeeBenefits(params) {
    const { employeeId } = params;
    
    const benefitsResult = await this.employeeLookupTool.getBenefitsInfo(employeeId);
    
    if (!benefitsResult.success) {
      throw new Error('Unable to retrieve benefits information');
    }

    return {
      benefits: benefitsResult.benefits,
      formatted_response: this.formatBenefitsResponse(benefitsResult.benefits)
    };
  }

  async handlePolicyQuestion(params) {
    const { query, section } = params;
    
    const policyResult = await this.policySearchTool.execute({
      query: query,
      section: section
    });

    if (!policyResult.success) {
      throw new Error('Unable to search policies');
    }

    return {
      policies: policyResult.results,
      formatted_response: this.policySearchTool.formatPolicyResults(policyResult.results)
    };
  }

  formatVacationResponse(employee, calcResult) {
    if (!calcResult.success) {
      return 'Unable to calculate vacation balance.';
    }

    const result = calcResult.result;
    const name = employee.name || `${employee.first_name} ${employee.last_name}`;
    
    return `${name} currently has ${employee.vacation_balance} vacation days. ${calcResult.explanation}`;
  }

  formatBenefitsResponse(benefits) {
    const name = benefits.name;
    let response = `Benefits information for ${name}:\n\n`;
    
    response += `• Health Insurance: ${benefits.health_insurance}\n`;
    response += `• Dental Insurance: ${benefits.dental_insurance}\n`;
    response += `• Vision Insurance: ${benefits.vision_insurance}\n`;
    response += `• Life Insurance: ${benefits.life_insurance}\n`;
    response += `• Disability Insurance: ${benefits.disability_insurance}\n`;
    response += `• Retirement Plan: ${benefits.retirement_plan}\n`;
    
    return response;
  }
}

module.exports = HRChatbotAgent; 