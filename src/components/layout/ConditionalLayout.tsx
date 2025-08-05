'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider } from "@/context/SidebarContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Halaman login ada di root (/)
  const isLoginPage = pathname === '/';

  if (isLoginPage) {
    // Layout untuk halaman login (tanpa header & sidebar)
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {children}
        </div>
      </div>
    );
  }

  // Layout untuk dashboard dan halaman lainnya (dengan header & sidebar)
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Layout */}
        <div className="flex flex-col flex-1 h-full">
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}