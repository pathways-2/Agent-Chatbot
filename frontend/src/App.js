import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { chatService } from './services/chatService';
import './index.css';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Initialize session
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    
    // Check backend connection
    checkConnection();
    
    // Add welcome message
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Hello! I'm TechCorp's HR Assistant. I'm here to help you with HR policies, employee information, and benefit calculations. What can I help you with today?",
        timestamp: new Date().toISOString(),
        type: 'welcome'
      }
    ]);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await chatService.checkHealth();
      setConnectionStatus(response.status === 'ok' ? 'connected' : 'error');
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('error');
    }
  };

  const sendMessage = async (messageContent) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(messageContent, sessionId);
      
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        type: response.type,
        sources: response.sources || [],
        toolsUsed: response.toolsUsed || []
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting to the server. Please check your connection and try again.",
        timestamp: new Date().toISOString(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    try {
      await chatService.clearConversation(sessionId);
      setMessages([
        {
          id: uuidv4(),
          role: 'assistant',
          content: "Conversation cleared! How can I help you today?",
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ]);
      
      // Generate new session ID
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const getSampleQuestions = () => [
    "What is the company's remote work policy?",
    "How many vacation days does John Smith have?",
    "What are the health insurance benefits?",
    "If I take 3 days off, how many vacation days will I have left?",
    "Who is the HR Director?",
    "What is the performance review process?"
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onClearConversation={clearConversation}
        sampleQuestions={getSampleQuestions()}
        onSampleQuestionClick={sendMessage}
        connectionStatus={connectionStatus}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          connectionStatus={connectionStatus}
          onRetryConnection={checkConnection}
        />

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            sessionId={sessionId}
          />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App; 