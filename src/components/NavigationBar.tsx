import React from 'react';
import { useLocation } from 'react-router-dom';
import ApiStatusIndicator from './ApiStatusIndicator';

interface NavigationBarProps {
  onToggleSidebar: () => void;
  onToggleMobileMenu: () => void;
  isSidebarCollapsed: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  onToggleSidebar, 
  onToggleMobileMenu 
}) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Intelligent Dashboard';
      case '/side-hustle':
        return 'Side Hustle Discovery Hub';
      case '/resilience-coach':
        return 'AI Resilience Coach Center';
      case '/achievements':
        return 'Achievement Gamification Center';
      case '/learning-pathways':
        return 'Adaptive Learning Pathways';
      case '/community':
        return 'Community Nexus Hub';
      default:
        return 'NexoraFlow Dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 animate-slide-down">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Logo and Menu Toggle */}
        <div className="flex items-center space-x-4 animate-slide-in-left">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:block p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
              <span className="text-white font-bold text-sm transition-transform duration-200 group-hover:scale-110">N</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 transition-all duration-200 group-hover:text-primary-600">NexoraFlow</h1>
              <p className="text-xs text-gray-500 -mt-1 transition-all duration-200 animate-fade-in">{getPageTitle()}</p>
            </div>
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-4 animate-slide-in-right">
          {/* API Status Indicator */}
          <div className="animate-fade-in">
            <ApiStatusIndicator />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:scale-110 active:scale-95 group">
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 0 1 6 6v2l1.5 3h-15l1.5-3v-2a6 6 0 0 1 6-6z" />
            </svg>
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full animate-pulse-soft"></div>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
              <svg className="w-5 h-5 text-gray-600 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 transition-all duration-200 group-hover:text-primary-600">User</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;