"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Edit3,
  Zap,
  BarChart3,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

// Type definitions
type MeetingStatus =
  | "completed"
  | "scheduled"
  | "ongoing"
  | "cancelled"
  | "overdue";
type TaskStatus = "completed" | "in-progress" | "pending" | "overdue";
type Status = MeetingStatus | TaskStatus;
type CreateDraft = {
  title: string;
  date: string;
  time: string;
  agenda: { id: string; title: string; completed: boolean }[];
  participants: Participant[]; // <— penting: Participant[]
};

interface Participant {
  id: string | number;
  name: string;
  department?: string; // <— pakai department
  role?: string; // opsional (buat kompatibel data lama)
  avatar: string;
  attended?: boolean;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  status: MeetingStatus;
  participants: Participant[];
  notes: string;
  location: string;
  agenda: string[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: string;
  dueDate: string;
  assignee: string;
  progress: number;
  category: string;
}

// Mock data untuk meetings
const meetings: Meeting[] = [
  {
    id: 1,
    title: "Weekly Production Review",
    date: "2025-08-07",
    time: "10:30 - 11:30",
    status: "completed" as MeetingStatus,
    participants: [
      { id: 1, name: "Ahmad Rizki", role: "Production Manager", avatar: "AR" },
      { id: 2, name: "Siti Nurhaliza", role: "Quality Control", avatar: "SN" },
      { id: 3, name: "Budi Santoso", role: "Supervisor", avatar: "BS" },
    ],
    notes:
      "Diskusi mengenai target produksi bulan ini. Kualitas produk sudah mencapai 98%. Perlu perbaikan di line 3 untuk minggu depan.",
    location: "Conference Room A",
    agenda: [
      "Review target produksi",
      "Analisis kualitas",
      "Issue mesin line 3",
    ],
  },
  {
    id: 2,
    title: "Safety Committee Meeting",
    date: "2025-08-08",
    time: "14:00 - 15:00",
    status: "scheduled" as MeetingStatus,
    participants: [
      { id: 4, name: "Indra Wijaya", role: "Safety Officer", avatar: "IW" },
      { id: 5, name: "Maya Sari", role: "HR Manager", avatar: "MS" },
    ],
    notes: "",
    location: "Online Meeting",
    agenda: ["Review incident report", "Safety training schedule"],
  },
  {
    id: 3,
    title: "Monthly Team Sync",
    date: "2025-08-05",
    time: "10:00 - 11:00",
    status: "ongoing" as MeetingStatus,
    participants: [
      { id: 6, name: "Lisa Davis", role: "Team Lead", avatar: "LD" },
      { id: 7, name: "Mike Johnson", role: "Developer", avatar: "MJ" },
    ],
    location: "Main Conference Hall",
    notes: "Progress update dari semua tim. Diskusi roadmap Q3.",
    agenda: ["Team progress", "Q3 roadmap", "Resource allocation"],
  },
  {
    id: 4,
    title: "Quality Assurance Review",
    date: "2025-08-09",
    time: "09:00 - 10:00",
    status: "scheduled" as MeetingStatus,
    participants: [
      { id: 8, name: "Dewi Sartika", role: "QA Manager", avatar: "DS" },
    ],
    location: "QA Lab",
    notes: "",
    agenda: ["Monthly QA report", "Process improvements"],
  },
  {
    id: 5,
    title: "Project Planning Session",
    date: "2025-08-10",
    time: "13:00 - 14:30",
    status: "scheduled" as MeetingStatus,
    participants: [
      { id: 9, name: "Rudi Hartono", role: "Project Manager", avatar: "RH" },
      { id: 10, name: "Andi Kurniawan", role: "Technical Lead", avatar: "AK" },
    ],
    location: "Meeting Room B",
    notes: "",
    agenda: ["Q4 project roadmap", "Resource planning"],
  },
];

// Mock data untuk tasks
const tasks: Task[] = [
  {
    id: 1,
    title: "Safety Protocol Review",
    description: "Review and update safety protocols for production line A",
    status: "in-progress" as TaskStatus,
    priority: "high",
    dueDate: "2025-08-01",
    assignee: "John Doe",
    progress: 75,
    category: "Safety",
  },
  {
    id: 2,
    title: "Quality Control Inspection",
    description: "Monthly quality control inspection for all production units",
    status: "completed" as TaskStatus,
    priority: "medium",
    dueDate: "2025-07-28",
    assignee: "Jane Smith",
    progress: 100,
    category: "Quality",
  },
  {
    id: 3,
    title: "Production Report",
    description: "Generate monthly production report and analysis",
    status: "overdue" as TaskStatus,
    priority: "urgent",
    dueDate: "2025-07-31",
    assignee: "Mike Johnson",
    progress: 50,
    category: "Reporting",
  },
  {
    id: 4,
    title: "Equipment Maintenance",
    description: "Scheduled maintenance for production equipment",
    status: "in-progress" as TaskStatus,
    priority: "medium",
    dueDate: "2025-08-05",
    assignee: "Sarah Wilson",
    progress: 30,
    category: "Maintenance",
  },
  {
    id: 5,
    title: "Training Documentation",
    description: "Create training materials for new safety procedures",
    status: "pending" as TaskStatus,
    priority: "low",
    dueDate: "2025-08-15",
    assignee: "David Chen",
    progress: 0,
    category: "Training",
  },
  {
    id: 6,
    title: "Inventory Audit",
    description: "Complete quarterly inventory audit for warehouse",
    status: "in-progress" as TaskStatus,
    priority: "high",
    dueDate: "2025-08-12",
    assignee: "Lisa Wong",
    progress: 60,
    category: "Operations",
  },
];

export default function SimplifiedDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  console.log("Current page:", currentPage); // Debug log

  const today = new Date().toISOString().split("T")[0];
  const todayMeetings = meetings.filter((m) => m.date === today);
  const upcomingMeetings = meetings
    .filter((m) => {
      const meetingDate = new Date(m.date);
      const todayDate = new Date(today);
      return meetingDate > todayDate && m.status === "scheduled";
    })
    .slice(0, 3);
  const ongoingMeetings = meetings.filter((m) => m.status === "ongoing");
  const recentTasks = tasks.slice(0, 4);

  const stats = {
    todayMeetings: todayMeetings.length,
    upcomingMeetings: upcomingMeetings.length,
    completedMeetings: meetings.filter((m) => m.status === "completed").length,
    ongoingNow: ongoingMeetings.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    overdueItems:
      tasks.filter((t) => t.status === "overdue").length +
      meetings.filter((m) => m.status === "overdue").length,
  };

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "ongoing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "ongoing":
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "scheduled":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "cancelled":
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (timeString: string): string => {
    return timeString?.split(" - ")[0] || "";
  };

  // Task Page Component
  const TaskPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              console.log("Back to dashboard clicked");
              setCurrentPage("dashboard");
            }}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-700 mt-1">
              Manage and track all your tasks
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
          <div className="p-6">
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-lg p-4 border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg shrink-0 bg-white/70">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {task.title}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status.replace("-", " ")}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              task.priority === "urgent"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "high"
                                ? "bg-orange-100 text-orange-700"
                                : task.priority === "medium"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {formatDate(task.dueDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {task.assignee}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {task.category}
                          </span>
                        </div>
                        {task.status !== "completed" && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Meeting Page Component
  const MeetingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              console.log("Back to dashboard clicked from meetings");
              setCurrentPage("dashboard");
            }}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Meetings</h1>
            <p className="text-gray-700 mt-1">
              View and manage all your meetings
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
          <div className="p-6">
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {meeting.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(
                            meeting.status
                          )}`}
                        >
                          {meeting.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(meeting.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {meeting.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {meeting.location}
                        </div>
                      </div>
                      {meeting.notes && (
                        <p className="text-sm text-gray-600 mb-3">
                          {meeting.notes}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          {meeting.participants.map((participant, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                              title={participant.name}
                            >
                              {participant.avatar}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {meeting.participants.length} participants
                          </span>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-1 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Azmi!
          </h1>
          <p className="text-gray-700 mt-1">
            Here's what's happening with your projects and meetings today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 lg:gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/30 shadow-lg hover:bg-white/80 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Zap className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-red-600">
                  {stats.ongoingNow}
                </p>
                <p className="text-xs text-gray-600">Live Now</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/30 shadow-lg hover:bg-white/80 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-blue-600">
                  {stats.todayMeetings}
                </p>
                <p className="text-xs text-gray-600">Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/30 shadow-lg hover:bg-white/80 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-yellow-600">
                  {stats.upcomingMeetings}
                </p>
                <p className="text-xs text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/30 shadow-lg hover:bg-white/80 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-green-600">
                  {stats.completedTasks}
                </p>
                <p className="text-xs text-gray-600">Done</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/30 shadow-lg hover:bg-white/80 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-purple-600">
                  {stats.totalTasks}
                </p>
                <p className="text-xs text-gray-600">Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/30 shadow-lg hover:bg-white/80 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-orange-600">
                  {stats.overdueItems}
                </p>
                <p className="text-xs text-gray-600">Overdue</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/30 shadow-lg hover:bg-white/80 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-indigo-600">
                  92%
                </p>
                <p className="text-xs text-gray-600">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Meetings Alert */}
        {ongoingMeetings.length > 0 && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-red-600 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    Meeting Sedang Berlangsung
                  </h3>
                  <p className="text-sm text-red-600">
                    {ongoingMeetings[0].title} - {ongoingMeetings[0].location}
                  </p>
                </div>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Join Meeting
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Tasks */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Recent Tasks
                </h3>
                <button
                  onClick={() => {
                    console.log("Tasks button clicked");
                    setCurrentPage("tasks");
                  }}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-2 rounded-lg transition-all"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-white/90 backdrop-blur-sm rounded-lg p-4 border hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg shrink-0 bg-white/70">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {task.title}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status.replace("-", " ")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {formatDate(task.dueDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {task.assignee}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Meetings */}
          <div className="space-y-6">
            {/* Today's Meetings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Today's Meetings
                  </h3>
                  <button
                    onClick={() => {
                      console.log("Meetings button clicked");
                      setCurrentPage("meetings");
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {todayMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {todayMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {meeting.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
                              meeting.status
                            )}`}
                          >
                            {meeting.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {meeting.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {meeting.location}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-1">
                            {meeting.participants
                              .slice(0, 3)
                              .map((participant, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                >
                                  {participant.avatar}
                                </div>
                              ))}
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No meetings today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  Upcoming
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#FFD500] text-gray-900 p-2 rounded-lg text-center min-w-[45px]">
                        <div className="text-sm font-bold">
                          {formatDate(meeting.date).split(" ")[0]}
                        </div>
                        <div className="text-xs">
                          {formatDate(meeting.date).split(" ")[1]}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {meeting.title}
                        </h4>
                        <div className="text-xs text-gray-600 mt-1">
                          {formatTime(meeting.time)} • {meeting.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {meeting.participants
                          .slice(0, 3)
                          .map((participant, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                            >
                              {participant.avatar}
                            </div>
                          ))}
                      </div>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                        Prepare
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on current page
  console.log("Rendering page:", currentPage);

  if (currentPage === "tasks") {
    return <TaskPage />;
  }

  if (currentPage === "meetings") {
    return <MeetingPage />;
  }

  return <Dashboard />;
}
