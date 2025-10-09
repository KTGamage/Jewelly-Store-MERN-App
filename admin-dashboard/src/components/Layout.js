import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 md:ml-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;