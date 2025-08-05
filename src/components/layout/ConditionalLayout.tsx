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
  
  // Halaman yang tidak perlu header dan sidebar (hanya auth pages)
  const authPages = ['/auth/signin', '/auth/signup'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    // Layout untuk halaman authentication (tanpa header & sidebar)
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