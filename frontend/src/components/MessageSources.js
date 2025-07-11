import React from 'react';
import { FileText, User, Calculator, ExternalLink } from 'lucide-react';

const MessageSources = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  const getSourceIcon = (type) => {
    switch (type) {
      case 'policy':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'employee_data':
        return <User className="w-4 h-4 text-green-500" />;
      case 'calculation':
        return <Calculator className="w-4 h-4 text-purple-500" />;
      default:
        return <ExternalLink className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceLabel = (source) => {
    switch (source.type) {
      case 'policy':
        return `${source.title} (${source.section})`;
      case 'employee_data':
        return `Employee Database (${source.count} result${source.count !== 1 ? 's' : ''})`;
      case 'calculation':
        return `${source.calculation_type} calculation`;
      default:
        return 'Unknown source';
    }
  };

  const getSourceDetails = (source) => {
    switch (source.type) {
      case 'policy':
        return `Last updated: ${source.last_updated}`;
      case 'employee_data':
        return `Search type: ${source.search_type}`;
      case 'calculation':
        return `Expression: ${source.expression}`;
      default:
        return '';
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="flex items-center mb-2">
        <span className="text-xs font-medium text-gray-600">Sources:</span>
      </div>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getSourceIcon(source.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {getSourceLabel(source)}
              </div>
              {getSourceDetails(source) && (
                <div className="text-xs text-gray-500 mt-1">
                  {getSourceDetails(source)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSources; 