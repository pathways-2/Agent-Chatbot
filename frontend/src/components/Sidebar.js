import React from 'react';
import { X, MessageSquare, RefreshCw, HelpCircle, Settings, User, FileText, Calculator } from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  onClearConversation, 
  sampleQuestions, 
  onSampleQuestionClick,
  connectionStatus 
}) => {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:inset-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  const features = [
    {
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: "Policy Search",
      description: "Find HR policies and procedures"
    },
    {
      icon: <User className="w-5 h-5 text-green-500" />,
      title: "Employee Lookup",
      description: "Search employee information"
    },
    {
      icon: <Calculator className="w-5 h-5 text-purple-500" />,
      title: "Calculations",
      description: "Calculate vacation days and benefits"
    }
  ];

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">HR Assistant</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={onClearConversation}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clear Conversation</span>
            </button>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">What I Can Help With</h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Questions */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" />
            Sample Questions
          </h3>
          <div className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  onSampleQuestionClick(question);
                  onClose();
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors border border-gray-200 hover:border-primary-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tips</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p>• Be specific in your questions for better results</p>
              <p>• I can search policies, employee data, and calculate benefits</p>
              <p>• For sensitive matters, contact HR directly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' :
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-600">
              {connectionStatus === 'connected' ? 'Online' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               connectionStatus === 'error' ? 'Offline' : 'Unknown'}
            </span>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          TechCorp HR Assistant v1.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 