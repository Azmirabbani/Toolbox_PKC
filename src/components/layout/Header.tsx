'use client';

import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useSidebar } from '@/context/SidebarContext';

export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu & Title */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="group p-2.5 rounded-xl hover:bg-[#e6f7ef]/60 text-gray-600 hover:text-[#009a44] transition-all duration-200 hover:scale-105"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            {/* Page Title */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#009a44] to-[#007d37] bg-clip-text text-transparent">
                Web Toolbox PKC
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Task Management & Meeting System
              </p>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#009a44] z-10 text-opacity-100" /> {/* Hijau sesuai permintaan */}
              </div>
              <input
                type="text"
                placeholder="Search tasks, meetings, or files..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl 
                          text-gray-900 placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-[#009a44]/20 focus:border-[#009a44]/30
                          hover:bg-white/80 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Section - Actions & Profile */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <button className="md:hidden p-2.5 rounded-xl hover:bg-[#e6f7ef]/60 text-gray-600 hover:text-[#009a44] transition-all duration-200">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Messages
            <button className="relative p-2.5 rounded-xl hover:bg-[#e6f7ef]/60 text-gray-600 hover:text-[#009a44] transition-all duration-200 group">
              <ChatBubbleLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009a44] text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                2
              </span>
            </button> */}
            
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl hover:bg-[#e6f7ef]/60 text-gray-600 hover:text-[#009a44] transition-all duration-200 group">
              <BellIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFD500] text-gray-900 text-xs rounded-full flex items-center justify-center animate-bounce font-medium">
                5
              </span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            
            {/* User Profile */}
            <div className="relative">
              <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#e6f7ef]/60 transition-all duration-200 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#009a44] to-[#007d37] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FFD500] border-2 border-white rounded-full"></div>
                </div>
                
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#009a44]">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500">
                    Administrator
                  </p>
                </div>
                
                <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-[#009a44] group-hover:rotate-180 transition-all duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};