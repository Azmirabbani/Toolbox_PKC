"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";

const pendingTasks = [
  {
    id: 3,
    title: "Laporan Produksi Bulanan",
    description: "Menyusun laporan produksi dari pabrik untuk manajemen pusat",
    status: "pending",
    priority: "urgent",
    dueDate: "2024-07-31",
    assignee: "Andi Pratama",
    progress: 50,
    category: "Pelaporan",
  },
  {
    id: 5,
    title: "Persiapan Pelatihan Karyawan Baru",
    description: "Membuat materi dan jadwal pelatihan untuk pegawai baru",
    status: "pending",
    priority: "low",
    dueDate: "2024-08-10",
    assignee: "Fajar Nugraha",
    progress: 0,
    category: "Pelatihan",
  },
];

export const Header = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
    setIsProfileDropdownOpen(false);
  };

  const getPriorityColor = (priority: string) =>
    priority === "urgent"
      ? "text-red-600 bg-red-50"
      : priority === "high"
      ? "text-orange-600 bg-orange-50"
      : priority === "medium"
      ? "text-yellow-600 bg-yellow-50"
      : priority === "low"
      ? "text-blue-600 bg-blue-50"
      : "text-gray-600 bg-gray-50";

  const getPriorityIcon = (priority: string) =>
    priority === "urgent" ? (
      <ExclamationTriangleIcon className="w-4 h-4" />
    ) : (
      <ClockIcon className="w-4 h-4" />
    );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                aria-expanded={isOpen}
                className="group p-2.5 rounded-xl hover:bg-[#e6f7ef]/60 text-gray-600 hover:text-[#009a44] transition-all duration-200 hover:scale-105"
              >
                <Bars3Icon
                  className={[
                    "w-5 h-5 transition-transform duration-300",
                    isOpen ? "rotate-0" : "-rotate-90",
                  ].join(" ")}
                />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#009a44] to-[#007d37] bg-clip-text text-transparent">
                  Toolbox
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Task Management & Meeting System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="md:hidden p-2.5 rounded-xl hover:bg-[#e6f7ef]/60 text-gray-600 hover:text-[#009a44] transition-all duration-200">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationOpen((v) => !v);
                    setIsProfileDropdownOpen(false);
                  }}
                  className="relative p-2.5 rounded-xl hover:bg-[#e6f7ef]/60 text-gray-600 hover:text-[#009a44] transition-all duration-200 group"
                >
                  <BellIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {pendingTasks.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFD500] text-gray-900 text-xs rounded-full flex items-center justify-center animate-bounce font-medium">
                      {pendingTasks.length}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Task Pending
                        </h3>
                        <span className="text-xs bg-[#FFD500] text-gray-900 px-2 py-1 rounded-full font-medium">
                          {pendingTasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {pendingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="px-4 py-3 hover:bg-[#e6f7ef]/30 border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {task.title}
                                </h4>
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {getPriorityIcon(task.priority)}
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {task.description}
                              </p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                  Due: {formatDate(task.dueDate)}
                                </span>
                                <span className="text-[#009a44] font-medium">
                                  {task.progress}% Complete
                                </span>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                Assignee: {task.assignee}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setIsNotificationOpen(false);
                            router.push("/tasks");
                          }}
                          className="w-full text-center text-sm text-[#009a44] hover:text-[#007d37] font-medium transition-colors"
                        >
                          Lihat Semua Task
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-300 mx-2"></div>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen((v) => !v);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#e6f7ef]/60 transition-all duration-200 group"
                >
                  <div className="relative">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPhotoModalOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-8 h-8 bg-gradient-to-r from-[#009a44] to-[#007d37] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 hover:ring-2 hover:ring-[#009a44]/20"
                    >
                      <Image
                        src="/onana 1.svg"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#FFD500] border-2 border-white rounded-full"></div>
                  </div>

                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#009a44]">
                      Azmi Rabbani
                    </p>
                  </div>

                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-400 group-hover:text-[#009a44] transition-all duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Azmi Rabbani
                      </p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#e6f7ef]/50 hover:text-[#009a44] transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#e6f7ef]/50 hover:text-[#009a44] transition-colors">
                      <Cog6ToothIcon className="w-4 h-4" /> Settings
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign
                        Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {(isProfileDropdownOpen || isNotificationOpen) && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setIsProfileDropdownOpen(false);
              setIsNotificationOpen(false);
            }}
          />
        )}
      </header>

      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <button
            onClick={() => setIsPhotoModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
          <div className="relative">
            <Image
              src="/onana 1.svg"
              alt="Profile Photo"
              width={400}
              height={400}
              className="rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsPhotoModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};
