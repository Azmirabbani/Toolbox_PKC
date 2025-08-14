"use client";

import React, { useMemo } from "react";
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
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* =========================
 * Types
 * ========================= */
type MeetingStatus =
  | "completed"
  | "scheduled"
  | "ongoing"
  | "cancelled"
  | "overdue";
type TaskStatus = "completed" | "in-progress" | "pending" | "overdue";

interface Participant {
  id: string | number;
  name: string;
  role?: string;
  avatar: string; // initials
  department?: string;
  attended?: boolean;
}
interface Meeting {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // "HH:mm - HH:mm"
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
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string; // YYYY-MM-DD
  assignee: string;
  progress: number; // 0..100
  category: string;
}

/* =========================
 * Mock Data
 * ========================= */
const meetings: Meeting[] = [
  {
    id: 1,
    title: "Weekly Production Review",
    date: "2025-08-07",
    time: "10:30 - 11:30",
    status: "completed",
    participants: [
      { id: 1, name: "Ahmad Rizki", role: "Production Manager", avatar: "AR" },
      { id: 2, name: "Siti Nurhaliza", role: "Quality Control", avatar: "SN" },
      { id: 3, name: "Budi Santoso", role: "Supervisor", avatar: "BS" },
    ],
    notes: "Diskusi mengenai target produksi bulan ini.",
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
    date: "2025-08-18",
    time: "14:00 - 15:00",
    status: "scheduled",
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
    date: "2025-08-14",
    time: "10:00 - 11:00",
    status: "ongoing",
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
    date: "2025-08-20",
    time: "09:00 - 10:00",
    status: "scheduled",
    participants: [
      { id: 8, name: "Dewi Sartika", role: "QA Manager", avatar: "DS" },
    ],
    location: "QA Lab",
    notes: "",
    agenda: ["Monthly QA report", "Process improvements"],
  },
];

const tasks: Task[] = [
  {
    id: 1,
    title: "Safety Protocol Review",
    description: "Review and update safety protocols for production line A",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-08-16",
    assignee: "John Doe",
    progress: 75,
    category: "Safety",
  },
  {
    id: 2,
    title: "Quality Control Inspection",
    description: "Monthly quality control inspection for all production units",
    status: "completed",
    priority: "medium",
    dueDate: "2025-08-10",
    assignee: "Jane Smith",
    progress: 100,
    category: "Quality",
  },
  {
    id: 3,
    title: "Production Report",
    description: "Generate monthly production report and analysis",
    status: "overdue",
    priority: "urgent",
    dueDate: "2025-08-12",
    assignee: "Mike Johnson",
    progress: 50,
    category: "Reporting",
  },
  {
    id: 4,
    title: "Equipment Maintenance",
    description: "Scheduled maintenance for production equipment",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-08-20",
    assignee: "Sarah Wilson",
    progress: 30,
    category: "Maintenance",
  },
];

/* =========================
 * Utils
 * ========================= */
const toLocalYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const toDateOnly = (s: string) => new Date(`${s}T00:00:00`);
const formatDateID = (s: string) =>
  new Date(`${s}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
const formatTime = (t: string) => t.split(" - ")[0] || "";

/** ====== COLOR MAPPING (DISAMAKAN DENGAN PAGE MEETING) ====== */
const getMeetingStatusColor = (status: MeetingStatus) => {
  switch (status) {
    case "ongoing": // Berlangsung
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "completed": // Selesai
      return "bg-green-100 text-green-700 border-green-200";
    case "scheduled": // Terjadwal
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "overdue": // Terlewat/Perlu tindak lanjut
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getTaskStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "overdue":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const TaskStatusIcon: React.FC<{ status: TaskStatus; className?: string }> = ({
  status,
  className,
}) => {
  switch (status) {
    case "completed":
      return (
        <CheckCircle className={`w-4 h-4 text-green-600 ${className || ""}`} />
      );
    case "in-progress":
      return <Clock className={`w-4 h-4 text-blue-600 ${className || ""}`} />;
    case "pending":
      return (
        <AlertTriangle
          className={`w-4 h-4 text-yellow-600 ${className || ""}`}
        />
      );
    case "overdue":
      return (
        <AlertTriangle className={`w-4 h-4 text-red-600 ${className || ""}`} />
      );
  }
};

/* =========================
 * Small Components
 * ========================= */
const StatCard: React.FC<{
  icon: React.ReactNode;
  toneBg: string;
  toneText: string;
  value: React.ReactNode;
  label: string;
}> = ({ icon, toneBg, toneText, value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/50 shadow-sm hover:shadow transition-all">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${toneBg}`}>{icon}</div>
      <div>
        <p
          className={`text-xl lg:text-2xl font-extrabold tracking-tight ${toneText}`}
        >
          {value}
        </p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  </div>
);

const MeetingBadge: React.FC<{ status: MeetingStatus }> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getMeetingStatusColor(
      status
    )}`}
  >
    {status}
  </span>
);

const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-gray-900 text-sm">{meeting.title}</h4>
      <MeetingBadge status={meeting.status} />
    </div>
    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
      <span className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {meeting.time}
      </span>
      <span className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        {meeting.location}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex -space-x-1">
        {meeting.participants.slice(0, 3).map((p) => (
          <div
            key={String(p.id)}
            className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
            title={p.name}
            aria-label={p.name}
          >
            {p.avatar}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
        aria-label="Edit meeting"
      >
        <Edit3 className="w-4 h-4" />
        Edit
      </button>
    </div>
  </div>
);

const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
  <div className="group bg-white rounded-lg p-4 border hover:shadow-md transition-all">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-white/70">
        <TaskStatusIcon status={task.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getTaskStatusColor(
              task.status
            )}`}
          >
            {task.status.replace("-", " ")}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Due: {formatDateID(task.dueDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {task.assignee}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {task.category}
          </span>
        </div>
      </div>
    </div>
  </div>
);

/* =========================
 * Page
 * ========================= */
export default function MeetingsPage() {
  const router = useRouter();

  const today = toLocalYMD(new Date());
  const todayDate = toDateOnly(today);

  const { todayMeetings, upcomingMeetings, ongoingToday, completedTasksCount } =
    useMemo(() => {
      const todayMeetings = meetings.filter((m) => m.date === today);
      const upcomingMeetings = meetings
        .filter(
          (m) => toDateOnly(m.date) > todayDate && m.status === "scheduled"
        )
        .sort((a, b) => +toDateOnly(a.date) - +toDateOnly(b.date))
        .slice(0, 3);
      const ongoingToday = meetings.filter(
        (m) => m.status === "ongoing" && m.date === today
      );
      const completedTasksCount = tasks.filter(
        (t) => t.status === "completed"
      ).length;
      return {
        todayMeetings,
        upcomingMeetings,
        ongoingToday,
        completedTasksCount,
      };
    }, [today, todayDate]);

  const stats = [
    {
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      value: todayMeetings.length,
      label: "Today Meetings",
      toneBg: "bg-blue-100",
      toneText: "text-blue-600",
    },
    {
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      value: upcomingMeetings.length,
      label: "Upcoming Meetings",
      toneBg: "bg-yellow-100",
      toneText: "text-yellow-600",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      value: completedTasksCount,
      label: "Completed Tasks",
      toneBg: "bg-green-100",
      toneText: "text-green-600",
    },
    {
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      value: tasks.length,
      label: "Total Tasks",
      toneBg: "bg-purple-100",
      toneText: "text-purple-600",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <header className="px-1 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Azmi!
          </h1>
          <p className="text-gray-700 mt-1">
            Ringkas, fokus ke tasks dan meetings.
          </p>
        </header>

        {/* Stats (4 only) */}
        <section
          aria-label="Key stats"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
        >
          {stats.map((s, i) => (
            <StatCard
              key={i}
              icon={s.icon}
              toneBg={s.toneBg}
              toneText={s.toneText}
              value={s.value}
              label={s.label}
            />
          ))}
        </section>

        {/* Live banner */}
        {ongoingToday.length > 0 && (
          <section
            aria-label="Live meeting banner"
            className="bg-yellow-50/90 backdrop-blur-sm border border-yellow-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Meeting Sedang Berlangsung
                  </h3>
                  <p className="text-sm text-yellow-700">
                    {ongoingToday[0].title} • {ongoingToday[0].location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  router.push(`/meetings?id=${ongoingToday[0].id}`)
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Join Meeting
              </button>
            </div>
          </section>
        )}

        {/* Main */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <section className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" /> Recent Tasks
              </h3>
              <button
                type="button"
                onClick={() => router.push("/tasks")}
                className="flex items-center gap-2 text-green-700 hover:text-green-800 text-sm font-medium hover:bg-green-50 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {tasks.slice(0, 4).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Tidak ada task.
                </div>
              )}
            </div>
          </section>

          {/* Meetings column */}
          <section className="space-y-6">
            {/* Today meetings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Today's
                  Meetings
                </h3>
                <button
                  type="button"
                  onClick={() => router.push("/meetings")}
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                {todayMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {todayMeetings.map((m) => (
                      <MeetingCard key={m.id} meeting={m} />
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

            {/* Upcoming */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200/60">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" /> Upcoming
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#FFD500] text-gray-900 p-2 rounded-lg text-center min-w-[46px] leading-tight">
                        <div className="text-sm font-extrabold">
                          {formatDateID(meeting.date).split(" ")[0]}
                        </div>
                        <div className="text-[11px] uppercase tracking-wide">
                          {formatDateID(meeting.date).split(" ")[1]}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {meeting.title}
                          </h4>
                          <MeetingBadge status={meeting.status} />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {formatTime(meeting.time)} • {meeting.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {meeting.participants.slice(0, 3).map((p) => (
                          <div
                            key={String(p.id)}
                            className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-white text-[11px] font-bold border-2 border-white"
                            title={p.name}
                            aria-label={p.name}
                          >
                            {p.avatar}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      >
                        Prepare
                      </button>
                    </div>
                  </div>
                ))}
                {upcomingMeetings.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No upcoming meetings
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
