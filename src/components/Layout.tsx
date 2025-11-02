import React, { useState } from 'react';
import NavigationBar from './NavigationBar.tsx';
import SidebarMenu from './SidebarMenu.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavigationBar 
        onToggleSidebar={toggleSidebar}
        onToggleMobileMenu={toggleMobileMenu}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      
      <div className="flex">
        {/* Sidebar Menu */}
        <SidebarMenu 
          isCollapsed={isSidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Main Content Area */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out pt-16 ${
            isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className={`bg-white border-t border-gray-200 py-4 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="px-6">
          <p className="text-sm text-gray-600 text-center">
            Powered by <span className="font-semibold text-primary-600">Gemini AI</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;