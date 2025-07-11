import React from 'react';
import { Menu, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const Header = ({ onToggleSidebar, connectionStatus, onRetryConnection }) => {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-400" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500 rounded-lg p-2">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-primary-500 font-bold text-sm">HR</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                TechCorp HR Assistant
              </h1>
              <p className="text-sm text-gray-500">
                AI-powered HR support for employees
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Connection Status */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <span className={`text-sm font-medium ${getConnectionColor()}`}>
              {getConnectionText()}
            </span>
          </div>

          {/* Retry button for connection errors */}
          {connectionStatus === 'error' && (
            <button
              onClick={onRetryConnection}
              className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Retry</span>
            </button>
          )}

          {/* Status indicator dot */}
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' :
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            {connectionStatus === 'connected' && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 