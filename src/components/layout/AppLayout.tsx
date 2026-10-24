import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface AppLayoutProps {
  pageTitle: string;
  children: ReactNode;
}

export default function AppLayout({ pageTitle, children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col w-full">
        <TopNavbar
          pageTitle={pageTitle}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

