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
    // ✅ PERBAIKAN: Langsung return children tanpa wrapper pembatas
    return <>{children}</>;
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