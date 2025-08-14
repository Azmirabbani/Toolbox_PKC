"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  UsersIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

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
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      {
        name: "Tasks",
        href: "/tasks",
        icon: ClipboardDocumentListIcon,
        badge: "5",
        badgeColor: "bg-red-100 text-red-600",
      },
      {
        name: "Meetings",
        href: "/meetings",
        icon: CalendarDaysIcon,
        badge: "2",
        badgeColor: "bg-green-100 text-green-600",
      },
      { name: "Team", href: "/team", icon: UsersIcon },
      { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggleSidebar } = useSidebar();

  const isActiveRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      <aside
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={isOpen}
        className={[
          "fixed lg:relative z-50 h-full",
          "backdrop-blur-md bg-white/90 border-r border-white/20 shadow-xl",
          // animasikan properti yang perlu saja
          "transition-[width,left] duration-300 ease-out will-change-[width,left]",
          // MOBILE slide
          isOpen ? "left-0 w-72" : "-left-72 w-72",
          // DESKTOP width collapse (sedikit lebih lebar biar lega)
          "lg:left-0",
          isOpen ? "lg:w-64" : "lg:w-[76px]",
          "overflow-hidden",
        ].join(" ")}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/Logo_kujang.png"
                  alt="Logo Kujang"
                  width={40}
                  height={40}
                  className="object-cover rounded-xl"
                />
              </div>

              {/* brand text: tetap dirender, tapi tidak ambil ruang saat collapse */}
              <div
                className={[
                  "min-w-0 transition-all duration-200",
                  isOpen
                    ? "flex-1 opacity-100 translate-x-0"
                    : "w-0 opacity-0 -translate-x-2 pointer-events-none",
                ].join(" ")}
              >
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                  PUPUK KUJANG
                </h1>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <div
                  className={[
                    "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2",
                    "transition-opacity duration-200",
                    isOpen ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  {section.title}
                </div>

                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = isActiveRoute(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        prefetch
                        onMouseEnter={() => router.prefetch(item.href)}
                        onClick={handleLinkClick}
                        className={[
                          "group flex items-center rounded-lg transition-all duration-200 relative overflow-hidden",
                          // expanded → pill dengan padding
                          isOpen
                            ? "px-3 py-2.5 gap-3"
                            : // collapsed → ikon di tengah, tanpa padding samping
                              "h-11 w-full justify-center px-0",
                          isActive
                            ? isOpen
                              ? "bg-gradient-to-r from-[#009a44] to-[#007d37] text-white shadow-md"
                              : // state aktif saat collapse: tone lebih ringan, tetap lega
                                "text-[#009a44] bg-[#009a44]/15"
                            : "text-gray-600 hover:bg-[#e6f7ef]/60 hover:text-[#009a44]",
                        ].join(" ")}
                        aria-current={isActive ? "page" : undefined}
                        title={!isOpen ? item.name : undefined}
                      >
                        {/* ikon */}
                        <item.icon
                          className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                            isActive && isOpen ? "text-white" : ""
                          }`}
                        />

                        {/* label & badge: saat collapse tidak ambil ruang (w-0) */}
                        <div
                          className={[
                            "items-center justify-between min-w-0 transition-all duration-200",
                            isOpen
                              ? "flex flex-1 opacity-100 translate-x-0"
                              : "w-0 opacity-0 -translate-x-2 pointer-events-none",
                          ].join(" ")}
                        >
                          <span className="font-medium truncate">
                            {item.name}
                          </span>

                          {item.badge && (
                            <span
                              className={[
                                "ml-2 px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 transition-all duration-200",
                                isOpen
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-75",
                                isActive && isOpen
                                  ? "bg-white/20 text-white"
                                  : item.badgeColor ?? "",
                              ].join(" ")}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>

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
    </>
  );
};
