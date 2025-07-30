'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BoltIcon,
  FolderIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    title: "Main Menu",
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { 
        name: 'Tasks', 
        href: '/tasks', 
        icon: ClipboardDocumentListIcon, 
        badge: '5', 
        badgeColor: 'bg-red-100 text-red-600' 
      },
      { 
        name: 'Meetings', 
        href: '/meetings', 
        icon: CalendarDaysIcon,
        badge: '2',
        badgeColor: 'bg-green-100 text-green-600'
      },
      { name: 'Team', href: '/team', icon: UsersIcon },
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ]
  }
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  const isActiveRoute = (href: string): boolean => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`
        relative z-30 h-full
        transition-all duration-300 ease-in-out
        backdrop-blur-md bg-white/90 border-r border-white/20 shadow-xl
        ${isOpen ? 'w-72' : 'w-0 lg:w-16'}
        overflow-hidden
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
              <Image
                src="/Logo_kujang.jpg"
                alt="Logo Kujang"
                width={40}
                height={40}
                className="object-cover rounded-xl"
              />
            </div>
            {isOpen && (
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                  PUPUK KUJANG
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {isOpen && (
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </div>
              )}
              
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200 relative overflow-hidden
                        ${isActive
                          ? 'bg-gradient-to-r from-[#009a44] to-[#007d37] text-white shadow-md'
                          : 'text-gray-600 hover:bg-[#e6f7ef]/60 hover:text-[#009a44]'
                        }
                        ${!isOpen && 'justify-center px-2'}
                      `}
                      aria-current={isActive ? 'page' : undefined}
                      title={!isOpen ? item.name : undefined}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <item.icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-white' : ''
                        }`} />
                      </div>
                      
                      {/* Label and Badge */}
                      {isOpen && (
                        <div className="flex items-center justify-between min-w-0 flex-1">
                          <span className="font-medium truncate">
                            {item.name}
                          </span>
                          
                          {item.badge && (
                            <span className={`
                              ml-2 px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0
                              ${isActive ? 'bg-white/20 text-white' : item.badgeColor}
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Quick Action Button */}
          {isOpen && (
            <div className="pt-2">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-[#FFD500] to-[#E6C200] text-gray-900 rounded-lg hover:from-[#E6C200] hover:to-[#CCB000] transition-all duration-200 hover:shadow-md group font-medium">
                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span className="font-medium">New Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => {/* Handle close */}}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </aside>
  );
};