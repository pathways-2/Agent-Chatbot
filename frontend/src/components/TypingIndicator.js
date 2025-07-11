import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 py-1">
      <span className="text-sm text-gray-600">Thinking</span>
      <div className="typing-indicator">
        <div className="typing-dot bg-gray-400"></div>
        <div className="typing-dot bg-gray-400"></div>
        <div className="typing-dot bg-gray-400"></div>
      </div>
    </div>
  );
};

export default TypingIndicator; 