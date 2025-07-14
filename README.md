# 🤖 TechCorp HR Chatbot

> **Autonomous agentic system with RAG-powered knowledge retrieval and dynamic database integration.**

An intelligent HR assistant that autonomously orchestrates multiple tools to answer employee questions. Built with OpenAI GPT-4, it performs real-time RAG-based semantic search through HR policies, dynamically reads employee databases, and executes calculations while maintaining enterprise-grade security.

## 🎯 Overview

**TechCorp HR Chatbot** is a production-ready **autonomous agentic system** that combines AI intelligence with dynamic data retrieval:

- **🤖 Agentic Intelligence**: Autonomously selects and orchestrates tools based on user intent
- **🔍 RAG-Powered Search**: Real-time semantic search through HR policies using vector embeddings
- **📊 Dynamic Data Access**: Live database/CSV reading with real-time employee information retrieval  
- **🧠 Multi-Modal Integration**: Seamlessly combines policy documents, employee records, and calculations
- **📅 Working Days Calculator**: Accurate monthly working days calculations for any month/year
- **🛡️ Enterprise Security**: 12+ guardrail types protecting sensitive information
- **💬 Conversational Memory**: Context-aware interactions with persistent session management

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
```

## 🚀 Core Features

### 🤖 Autonomous AI Agent (OpenAI GPT-4)
- **Dynamic Tool Orchestration**: Autonomously selects and chains multiple tools based on complex user intents
- **Real-Time Decision Making**: Evaluates data sources and determines optimal retrieval strategies
- **Adaptive Context Management**: Maintains conversation state while dynamically updating based on new data
- **Multi-Modal Reasoning**: Synthesizes information from policies, databases, and calculations into coherent responses

### 🛠️ Three Specialized Tools

#### 1. 👥 Employee Lookup Tool (Dynamic Database Access)
- **Real-Time Database Queries**: Live CSV/database reading with instant employee record retrieval
- **Multi-Criteria Search**: Search by name, ID, department, job title with fuzzy matching
- **Dynamic Data Processing**: Real-time parsing and filtering of employee information
- **Privacy-First Design**: Automatically blocks sensitive data (salaries, SSNs) during retrieval

#### 2. 📋 Policy Search Tool (Advanced RAG)
- **Real-Time Vector Search**: Dynamic semantic search through HR policies using Vectorize.io embeddings
- **Similarity Scoring**: Returns relevance-ranked results with confidence scores
- **Intelligent Fallback**: Seamlessly switches to mock policy database when vector service unavailable
- **Source Attribution**: Provides detailed citations with document sections and metadata
- **Comprehensive Coverage**: Remote work, benefits, performance reviews, time off, compliance policies

#### 3. 🧮 Calculator Tool
- **HR-specific calculations**: vacation days, overtime, benefits, monthly working days
- **Monthly Working Days**: Accurate calculation of working days for any month/year
- **Input sanitization**: Prevents code injection
- **Natural language processing**: Handles math queries in conversational format

### 🧠 Memory & Context Management
- **Session-Based Storage**: Unique context per conversation
- **Conversation History**: 5-10 message rolling history
- **Employee Context Tracking**: Remembers active employee discussions
- **Automatic Cleanup**: Prevents memory bloat

### 🛡️ Enterprise Security (12 Guardrail Types)

**Data Protection:**
- Salary/compensation blocking
- SSN and sensitive data masking
- Bulk data extraction prevention
- Field-level access controls

**Content Security:**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Content filtering

**Operational Security:**
- Rate limiting (100 req/15min per IP)
- HTTP security headers
- Audit logging
- Error handling with user-friendly messages

## 💻 Tech Stack

### Backend
- **Node.js & Express**: RESTful API server
- **OpenAI GPT-4**: AI agent with function calling
- **Vectorize.io**: Vector database for RAG implementation
- **CSV Processing**: Employee data management
- **Security**: Helmet.js, express-rate-limit, input validation

### Frontend
- **React 18**: Modern component architecture
- **Tailwind CSS**: Utility-first responsive design
- **Real-time Chat**: Live typing indicators and instant responses
- **Component Library**: Reusable UI components

### Data Layer
- **Employee Data**: 30 fictional employees (CSV format)
- **Policy Data**: 6 comprehensive HR policies
- **Session Storage**: In-memory conversation management
- **Vector Database**: Optional Vectorize.io integration

## 🎯 Use Cases & Examples

### Employee Queries
```
"Tell me about John Smith"
"Who is the HR Director?"
"Show me employees in Engineering"
"How many vacation days does Sarah have?"
```

### Policy Questions
```
"What is the remote work policy?"
"How does performance review work?"
"What are the health insurance benefits?"
"Can you explain the time off policy?"
```

### Calculations
```
"Calculate John's remaining vacation days if he takes 5"
"What's 40 hours times 1.5 for overtime?"
"How many working days between March 1-15?"
"How many working days in August 2025?"
"Working days in December 2024"
"Calculate working days for July 2025"
```

### Guardrail Testing
```
"What is John's salary?" → BLOCKED
"Give me all employee data" → BLOCKED
"Execute SQL commands" → BLOCKED
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- OpenAI API Key

### Installation
```bash
# 1. Clone and install
git clone <repository-url>
cd hr-chatbot
npm run setup

# 2. Configure environment
cd backend
cp env.example .env
# Add your OpenAI API key to .env

# 3. Start development
npm run dev
```

### Environment Variables
```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional - uses mock data if not provided
VECTORIZE_PIPELINE_ACCESS_TOKEN=your_vectorize_token
VECTORIZE_ORGANIZATION_ID=your_org_id
VECTORIZE_PIPELINE_ID=your_pipeline_id
```

## 📁 Project Structure

```
hr-chatbot/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── agent.js           # Main AI agent
│   │   ├── memory.js          # Conversation memory
│   │   ├── guardrails.js      # Security system
│   │   └── tools/             # AI tools
│   │       ├── employeeLookup.js
│   │       ├── policySearch.js (RAG)
│   │       └── calculator.js
│   └── data/
│       └── employee_data.csv
├── frontend/                   # React application
│   └── src/
│       ├── components/        # UI components
│       └── services/          # API integration
└── README.md
```

## 🔍 Key Features Highlight

- **🤖 Autonomous Agent**: Self-directed tool selection and workflow orchestration based on user intent
- **🔍 Advanced RAG**: Real-time semantic search through HR policies using vector embeddings and similarity scoring
- **📊 Dynamic Data Layer**: Live CSV/database reading with real-time employee record retrieval and processing
- **🧠 Multi-Source Intelligence**: Seamlessly integrates policy documents, employee data, and computational tools
- **🛡️ Security-First**: Comprehensive guardrails protecting sensitive data with real-time filtering
- **⚡ Production-Ready**: Error handling, rate limiting, audit logging, and high-availability design

---

> **Note**: All employee data and HR policies are fictional and generated for demonstration purposes.

## 📜 License

MIT License - see LICENSE file for details.



