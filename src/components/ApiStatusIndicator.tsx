import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface ApiStatusIndicatorProps {
  className?: string;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await apiService.utils.testConnection();
      setIsConnected(connected);
      setLastChecked(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isChecking) return 'text-yellow-600 bg-yellow-100';
    if (isConnected === null) return 'text-gray-600 bg-gray-100';
    if (isConnected) return 'text-green-600 bg-green-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (isConnected === null) return 'Unknown';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (isChecking) return <LoadingSpinner size="xs" />;
    if (isConnected === null) return '❓';
    if (isConnected) return '✅';
    return '❌';
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} ${className}`}>
      <span className="flex items-center justify-center w-4 h-4">
        {getStatusIcon()}
      </span>
      <span>API: {getStatusText()}</span>
      {lastChecked && (
        <span className="text-xs opacity-75">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
};

export default ApiStatusIndicator;