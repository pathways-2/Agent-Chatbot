import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TypingIndicator from './TypingIndicator';
import MessageSources from './MessageSources';

const ChatInterface = ({ messages, onSendMessage, isLoading, sessionId }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'policy_response':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'employee_response':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'calculation_response':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'policy_response':
        return 'border-green-200 bg-green-50';
      case 'employee_response':
        return 'border-blue-200 bg-blue-50';
      case 'calculation_response':
        return 'border-purple-200 bg-purple-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white rounded-lg rounded-br-sm'
                  : `${getMessageTypeColor(message.type)} border rounded-lg rounded-bl-sm`
              } p-4 shadow-sm`}
            >
              {/* Message Header */}
              {message.role === 'assistant' && (
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getMessageTypeIcon(message.type)}
                    <span className="text-sm font-medium text-gray-700">
                      HR Assistant
                    </span>
                    {message.toolsUsed && message.toolsUsed.length > 0 && (
                      <div className="flex space-x-1">
                        {message.toolsUsed.map((tool, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              )}

              {/* Message Content */}
              <div className={`message-bubble ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      // Custom components for better styling
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children }) => (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>

              {/* Message Sources */}
              {message.sources && message.sources.length > 0 && (
                <MessageSources sources={message.sources} />
              )}

              {/* User Message Timestamp */}
              {message.role === 'user' && (
                <div className="flex justify-end mt-2">
                  <span className="text-xs text-primary-100 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 border rounded-lg rounded-bl-sm p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">HR Assistant</span>
              </div>
              <TypingIndicator />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-gray-50 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your HR question here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 text-xs text-gray-400">
              {inputMessage.length}/1000
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* Character count warning */}
        {inputMessage.length > 900 && (
          <div className="mt-2 text-sm text-yellow-600">
            Message is getting long. Keep it under 1000 characters for best results.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface; 