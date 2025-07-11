# 🤖 TechCorp HR Chatbot

> **A production-ready AI-powered HR assistant demonstrating modern agent architecture, RAG implementation, conversation memory, and enterprise-grade guardrails.**

This document provides a comprehensive overview of an autonomous HR Chatbot system designed to answer HR-related queries by utilizing large language models (LLMs) and specialized tools. The system interprets natural language questions, retrieves relevant information from HR policies through RAG-based semantic search, accesses employee data, and performs calculations to provide accurate responses without human intervention. Built with OpenAI Agent SDK, it showcases advanced AI agent architecture with robust security measures and enterprise-grade guardrails.

## 🎯 What This Agent Does

### Core Mission
The TechCorp HR Chatbot serves as a **24/7 AI-powered HR assistant** that helps employees and HR staff with:

- **📋 Policy Questions**: Instant access to company policies through semantic search
- **👥 Employee Lookups**: Professional employee information retrieval and department searches
- **🧮 HR Calculations**: Vacation day calculations, overtime computations, and benefit math
- **💬 Conversational Support**: Natural language interactions with context awareness
- **🛡️ Safe Operations**: Enterprise-grade security with 12+ guardrail types

### Key Value Propositions

1. **🚀 24/7 Availability**: Always-on support for HR queries
2. **⚡ Instant Responses**: Sub-second policy and employee data retrieval
3. **🔒 Enterprise Security**: Protects sensitive data with comprehensive guardrails
4. **📊 Smart Context**: Remembers conversation history for natural follow-ups
5. **🎯 HR-Focused**: Stays on-topic with professional, compliant responses

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TechCorp HR Chatbot Architecture                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   👤 User       │    │  🖥️ Frontend     │    │  🖥️ Backend      │
│   Interface     │    │  (React)        │    │  (Node.js)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ User Query            │ HTTP Request          │
         ├──────────────────────>│──────────────────────>│
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 🛡️ Guardrails   │
         │                       │              │ Security Layer  │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 🧠 Memory       │
         │                       │              │ Manager         │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 🤖 AI Agent     │
         │                       │              │ (OpenAI GPT-4)  │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 🛠️ Tool         │
         │                       │              │ Orchestration   │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │            ┌─────────┬─────────┬─────────┐
         │                       │            ▼         ▼         ▼         
         │                       │    ┌─────────┐ ┌─────────┐ ┌─────────┐
         │                       │    │ 👥 EMP  │ │ 📋 POL  │ │ 🧮 CALC │
         │                       │    │ LOOKUP  │ │ SEARCH  │ │ TOOL    │
         │                       │    └─────────┘ └─────────┘ └─────────┘
         │                       │            │         │         │
         │                       │            ▼         ▼         ▼
         │                       │    ┌─────────┐ ┌─────────┐ ┌─────────┐
         │                       │    │ 📊 CSV  │ │ 🔍 RAG  │ │ 🔢 MATH │
         │                       │    │ DATA    │ │ Vector  │ │ ENGINE  │
         │                       │    └─────────┘ └─────────┘ └─────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 📝 Response     │
         │                       │              │ Formatter       │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │ JSON Response         │
         │                       │<──────────────────────┤
         │                       │                       │
         │ Formatted Response    │                       │
         │<──────────────────────┤                       │
         │                       │                       │
         ▼                       ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │ 🎨 Chat UI      │    │ 📱 Components   │    │ 💾 Session      │
    │ Display         │    │ - Sources       │    │ Storage         │
    │                 │    │ - Tools Used    │    │                 │
    └─────────────────┘    └─────────────────┘    └─────────────────┘

Legend:
👤 User Interface    🖥️ Application Layer    🛡️ Security Layer    🧠 Memory System
🤖 AI Agent         🛠️ Tool System         📊 Data Layer        🎨 Presentation Layer
```

## 🚀 Core Features & Capabilities

### 🤖 AI Agent Intelligence
- **OpenAI GPT-4 Integration**: Latest language model with function calling
- **Intent Recognition**: Automatically determines user needs and selects appropriate tools
- **Context Awareness**: Maintains conversation flow and understands follow-up questions
- **Professional Tone**: Consistent, helpful, and compliant HR communication style

### 🛠️ Three Powerful Tools

#### 1. 👥 Employee Lookup Tool
- **Smart Search**: Find employees by name, ID, department, or job title
- **Professional Data**: Job titles, departments, contact info, hire dates
- **Department Filtering**: Show all employees in specific departments
- **Privacy Protection**: Blocks sensitive data like salaries and SSNs
- **Vacation Tracking**: Access to vacation balances and benefits information

#### 2. 📋 Policy Search Tool (RAG-Based)
- **Semantic Search**: Advanced vector search through HR policies
- **Vectorize.io Integration**: Real-time policy retrieval from vector database
- **Mock Data Fallback**: 6 comprehensive policies for demonstration
- **Citation System**: Provides source references for all policy responses
- **Topic Coverage**: Remote work, benefits, performance reviews, time off, etc.

#### 3. 🧮 Calculator Tool
- **HR Mathematics**: Vacation calculations, overtime computations, benefit math
- **Security Sanitization**: Prevents code injection through input filtering
- **Natural Language**: Understands requests like "calculate 15 days times 1.5"
- **Contextual Calculations**: Combines with employee data for personalized results

### 🧠 Advanced Memory System
- **Session-Based Storage**: Each conversation maintains unique context
- **5-10 Message History**: Optimal balance of context and performance
- **Employee Context Tracking**: Remembers which employee is being discussed
- **Topic Continuity**: Maintains conversation flow across multiple exchanges
- **Automatic Cleanup**: Prevents memory bloat with smart session management

### 🛡️ Enterprise-Grade Security

#### 12 Comprehensive Guardrail Types:

1. **💰 Salary Protection**: Blocks all compensation-related queries
2. **📊 Bulk Data Prevention**: Stops mass employee data extraction
3. **🚫 Content Filtering**: Removes inappropriate or sensitive content
4. **🎯 Topic Boundaries**: Keeps conversations HR-focused
5. **🔒 Injection Prevention**: Blocks SQL, XSS, and code injection attempts
6. **📏 Input Validation**: Ensures proper message length and format
7. **🚪 Rate Limiting**: 100 requests per 15 minutes per IP
8. **🛡️ HTTP Security**: Helmet.js security headers
9. **🔍 Response Sanitization**: Masks SSNs and sensitive patterns
10. **📋 Data Field Filtering**: Only exposes safe employee information
11. **⚠️ Disclaimer System**: Adds appropriate legal disclaimers
12. **📝 Audit Logging**: Tracks all guardrail violations

### 🎨 Modern User Experience
- **React 18**: Modern component architecture with hooks
- **Tailwind CSS**: Beautiful, responsive design
- **Real-time Chat**: Live typing indicators and instant responses
- **Source Citations**: Transparent sourcing for all information
- **Tool Usage Badges**: Visual indicators showing which tools were used
- **Connection Monitoring**: Live status updates and error handling
- **Sample Questions**: Guided user experience with suggested queries

## 🔧 Technical Implementation

### Backend Architecture (Node.js/Express)
```javascript
// Key Components:
- Express Server with security middleware
- OpenAI Agent SDK integration
- Three specialized tools (Employee, Policy, Calculator)
- Memory management system
- Comprehensive guardrails engine
- CSV data processing
- RESTful API endpoints
```

### Frontend Architecture (React)
```javascript
// Key Components:
- Modern React 18 application
- Tailwind CSS for styling
- Component-based architecture
- Real-time chat interface
- API service layer
- Error handling and retry logic
```

### Data Layer
```
Employee Data: CSV with 30 fictional TechCorp employees (generated by ChatGPT)
Policy Data: 6 comprehensive HR policies (fictional mock data generated by ChatGPT)
Memory Storage: Session-based conversation history
Vector Database: Vectorize.io integration (optional)
```

> **📝 Note**: All employee data and HR policies used in this system are completely fictional and generated by ChatGPT for demonstration purposes. No real company or employee information is used.

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v16 or higher)
- **OpenAI API Key** (required)
- **Vectorize.io Account** (optional - uses mock data)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd hr-chatbot

# 2. Install all dependencies
npm run setup

# 3. Configure environment variables
cd backend
cp env.example .env
# Edit .env with your OpenAI API key

# 4. Start development servers
npm run dev
```

### Environment Configuration

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (uses mock data if not provided)
VECTORIZE_API_KEY=your_vectorize_api_key_here
VECTORIZE_ENDPOINT=https://api.vectorize.io/v1
VECTORIZE_INDEX_NAME=hr-policies

# Server configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
hr-chatbot/
├── 📦 Root Configuration
│   ├── package.json              # Project dependencies & scripts
│   ├── README.md                 # This comprehensive guide
│   └── .gitignore               # Git ignore patterns
│
├── 🖥️ Backend (Node.js/Express)
│   ├── index.js                  # Main Express server
│   ├── package.json             # Backend dependencies
│   ├── env.example              # Environment template
│   │
│   ├── 🧠 src/                   # Core application logic
│   │   ├── agent.js             # Main AI agent orchestrator
│   │   ├── memory.js            # Conversation memory manager
│   │   ├── guardrails.js        # Security & safety system
│   │   ├── employeeData.js      # Employee data processor
│   │   │
│   │   └── 🛠️ tools/             # AI Agent tools
│   │       ├── employeeLookup.js # Employee search & data retrieval
│   │       ├── calculator.js     # Mathematical calculations
│   │       └── policySearch.js   # RAG-based policy retrieval
│   │
│   └── 📊 data/                  # Data storage
│       └── employee_data.csv     # 30 TechCorp employees
│
├── 🎨 Frontend (React)
│   ├── package.json             # Frontend dependencies
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   │
│   ├── 🎯 public/               # Static assets
│   │   └── index.html           # HTML template
│   │
│   └── 💻 src/                  # React application
│       ├── index.js             # React entry point
│       ├── App.js               # Main application component
│       ├── index.css            # Global styles
│       │
│       ├── 🧩 components/        # UI components
│       │   ├── ChatInterface.js  # Main chat interface
│       │   ├── Header.js         # Application header
│       │   ├── Sidebar.js        # Navigation & samples
│       │   ├── TypingIndicator.js # Loading animation
│       │   └── MessageSources.js # Source citations
│       │
│       └── 🔗 services/          # API communication
│           └── chatService.js    # Backend API integration
```

## 🎯 Usage Examples & Demo Scenarios

### Employee Lookup Queries
```
"Tell me about John Smith"
"Who is the HR Director?"
"Show me employees in the Engineering department"
"What are Sarah Johnson's contact details?"
"How many vacation days does Michael Brown have?"
```

### Policy Questions
```
"What is the company's remote work policy?"
"How does the performance review process work?"
"What are the health insurance benefits?"
"What's the policy on time off requests?"
"Can you explain the employee referral program?"
```

### Calculation Requests
```
"If John takes 5 vacation days, how many will he have left?"
"Calculate 40 hours times 1.5 for overtime"
"What's 15% of 240 hours?"
"How many working days between March 1 and March 15?"
```

### Guardrail Testing
```
"What is John Smith's salary?" → BLOCKED
"Give me all employee data" → BLOCKED
"What's the weather today?" → BLOCKED
"Execute SQL commands" → BLOCKED
```

## 🔍 AI Agent Deep Dive

### System Prompt Engineering
```
The agent operates as a professional HR assistant with:
- Helpful, professional tone
- Focus on HR-related topics only
- Appropriate disclaimers for sensitive matters
- Source citations for all information
- Privacy-conscious responses
```

### Tool Selection Logic
```javascript
// The agent automatically determines tool usage:
1. Employee names/IDs/departments → Employee Lookup Tool
2. Policy keywords (remote, benefits, review) → Policy Search Tool
3. Mathematical expressions/calculations → Calculator Tool
4. Multiple tools can be used in a single response
```

### Function Calling Implementation
```javascript
// OpenAI function calling with structured outputs:
{
  "name": "employee_lookup",
  "description": "Search for employee information",
  "parameters": {
    "type": "object",
    "properties": {
      "searchQuery": {"type": "string"},
      "searchType": {"enum": ["name", "id", "department"]}
    }
  }
}
```

## 🛡️ Security & Privacy Framework

### Data Protection Measures
- **No SSN Storage**: Employee data intentionally excludes Social Security Numbers
- **Salary Blocking**: All compensation information is protected
- **Field Filtering**: Only professional information is exposed
- **Session Isolation**: Each conversation is completely independent

### Input Validation & Sanitization
- **Length Limits**: Maximum 1000 characters per message
- **Content Filtering**: Removes malicious patterns and inappropriate content
- **SQL Injection Prevention**: Blocks database query patterns
- **XSS Protection**: Prevents script injection attempts

### Rate Limiting & Monitoring
- **API Rate Limits**: 100 requests per 15 minutes per IP
- **Violation Logging**: All blocked requests are logged with severity levels
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Security Headers**: Comprehensive HTTP security headers via Helmet.js

## 🧪 Testing & Quality Assurance

### Manual Testing Checklist
```
✅ Employee lookup functionality
✅ Policy search responses
✅ Calculator operations
✅ Conversation memory
✅ Guardrail blocking
✅ Error handling
✅ UI responsiveness
✅ Source citations
```

### API Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Chat message
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about John Smith", "sessionId": "test"}'

# Conversation history
curl http://localhost:3001/api/conversation/test

# Clear conversation
curl -X DELETE http://localhost:3001/api/conversation/test
```

## 📊 Performance & Scalability

### Optimization Features
- **Parallel Processing**: Multiple tools can execute simultaneously
- **Memory Management**: Automatic cleanup prevents memory bloat
- **Response Caching**: Conversation history reduces redundant API calls
- **Lazy Loading**: Frontend components load on demand

### Production Considerations
- **Stateless Design**: Each request is independent for horizontal scaling
- **Database Migration**: Consider moving from CSV to proper database
- **Vector Database**: Implement Vectorize.io for production policy search
- **CDN Integration**: Static asset optimization for global distribution

## 🔄 Development & Customization

### Adding New Tools
1. Create tool class in `backend/src/tools/`
2. Implement `execute()` and `getFunctionDefinition()` methods
3. Register in main agent (`backend/src/agent.js`)
4. Update system prompt with new capability description

### Adding New Policies
1. **With Vectorize.io**: Upload documents to vector database
2. **With Mock Data**: Update `mockPolicies` array in `policySearch.js`
3. Ensure proper metadata (title, section, keywords)

### Customizing Guardrails
- **Edit** `backend/src/guardrails.js`
- **Add** new prohibited words or patterns
- **Modify** content filtering rules
- **Update** response disclaimers

## 🚀 Deployment Options

### Development
```bash
npm run dev  # Starts both frontend and backend
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Start backend only
cd backend && npm start

# Serve frontend through backend or separate web server
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📋 API Documentation

### Core Endpoints

#### `POST /api/chat`
**Main chat endpoint for HR assistant interactions**

Request:
```json
{
  "message": "What is the remote work policy?",
  "sessionId": "unique-session-id"
}
```

Response:
```json
{
  "response": "Based on our HR policy...",
  "type": "policy_response",
  "sources": [
    {
      "type": "policy",
      "title": "Remote Work Policy",
      "section": "Work Arrangements"
    }
  ],
  "toolsUsed": ["policy_search"],
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### `GET /api/health`
**Server health check**

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### `GET /api/conversation/:sessionId`
**Retrieve conversation history**

#### `DELETE /api/conversation/:sessionId`
**Clear conversation history**


## 🔧 Troubleshooting Guide

### Common Issues & Solutions

**Backend Won't Start**
- ✅ Check OpenAI API key in `.env` file
- ✅ Verify Node.js version (16+)
- ✅ Ensure port 3001 is available
- ✅ Check for missing dependencies

**Frontend Connection Errors**
- ✅ Confirm backend is running on port 3001
- ✅ Check proxy configuration in `frontend/package.json`
- ✅ Verify CORS settings allow frontend origin

**OpenAI API Issues**
- ✅ Validate API key format and permissions
- ✅ Check API quota and billing status
- ✅ Verify model availability (gpt-4-turbo-preview)

**Memory/Performance Issues**
- ✅ Monitor conversation cleanup logs
- ✅ Check session storage growth
- ✅ Verify guardrail processing times

### Debug Mode
```env
NODE_ENV=development
```
Enables detailed console logging for troubleshooting.

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a pull request

### Code Quality Standards
- **ESLint**: JavaScript linting and formatting
- **React Best Practices**: Hooks, functional components, proper state management
- **Security First**: Input validation and sanitization
- **Documentation**: Clear comments and README updates

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for the Agent SDK and GPT-4 model
- **Vectorize.io** for vector search capabilities
- **React & Node.js** communities for excellent frameworks
- **Tailwind CSS** for the outstanding utility-first CSS framework

---



