"use client";

import {
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Flag,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

// Type definitions
type TaskStatus = "pending" | "in-progress" | "completed" | "overdue";
type TaskPriority = "urgent" | "high" | "medium" | "low";

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  progress: number;
  category: string;
}

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignee: "",
    category: "",
  });

  // State untuk menyimpan tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Rapat Evaluasi Kinerja",
      description:
        "Melaksanakan rapat evaluasi kinerja bulanan seluruh divisi administrasi",
      status: "in-progress",
      priority: "high",
      dueDate: "2024-08-01",
      assignee: "Budi Santoso",
      progress: 75,
      category: "Administrasi",
    },
    {
      id: 2,
      title: "Audit Internal Dokumen Keuangan",
      description: "Pemeriksaan dokumen keuangan dan operasional sesuai SOP",
      status: "completed",
      priority: "medium",
      dueDate: "2024-07-28",
      assignee: "Rina Wijaya",
      progress: 100,
      category: "Audit",
    },
    {
      id: 3,
      title: "Laporan Produksi Bulanan",
      description:
        "Menyusun laporan produksi dari pabrik untuk manajemen pusat",
      status: "pending",
      priority: "urgent",
      dueDate: "2024-07-31",
      assignee: "Andi Pratama",
      progress: 50,
      category: "Pelaporan",
    },
    {
      id: 4,
      title: "Pemeliharaan Sistem IT",
      description:
        "Pemeliharaan server, jaringan, dan perangkat komputer gedung admin",
      status: "in-progress",
      priority: "medium",
      dueDate: "2024-08-05",
      assignee: "Siti Lestari",
      progress: 30,
      category: "IT",
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
    {
      id: 6,
      title: "Stock Opname Arsip",
      description: "Pendataan ulang arsip dokumen perusahaan di ruang arsip",
      status: "overdue",
      priority: "high",
      dueDate: "2024-07-25",
      assignee: "Maya Putri",
      progress: 80,
      category: "Arsip",
    },
  ]);

  // Status columns configuration
  const statusColumns = [
    {
      id: "pending" as TaskStatus,
      title: "Pending",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-800",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "in-progress" as TaskStatus,
      title: "In Progress",
      icon: Clock,
      color: "bg-blue-100 text-blue-800",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "completed" as TaskStatus,
      title: "Completed",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "overdue" as TaskStatus,
      title: "Overdue",
      icon: XCircle,
      color: "bg-red-100 text-red-800",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  // Helper function untuk format tanggal yang konsisten
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: TaskStatus): string => {
    const column = statusColumns.find((col) => col.id === status);
    return column?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-green-600";
      case "low":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "overdue":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", task.id.toString());
    e.dataTransfer.effectAllowed = "move";

    requestAnimationFrame(() => {
      setDraggedTask(task);
    });
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();

    const draggedTaskId = e.dataTransfer.getData("text/plain");
    const taskId = parseInt(draggedTaskId);

    if (taskId) {
      const draggedTaskData = tasks.find((task) => task.id === taskId);

      if (draggedTaskData && draggedTaskData.status !== newStatus) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    }

    setDraggedTask(null);
  };

  const filteredTasks = tasks.filter((task: Task) => {
    const matchesFilter =
      activeFilter === "all" || task.status === activeFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.assignee) {
      alert("Please fill in all required fields (Title, Due Date, Assignee)");
      return;
    }

    const newId = Math.max(...tasks.map((t) => t.id), 0) + 1;

    const taskToAdd: Task = {
      id: newId,
      title: newTask.title || "",
      description: newTask.description || "",
      status: (newTask.status as TaskStatus) || "pending",
      priority: (newTask.priority as TaskPriority) || "medium",
      dueDate: newTask.dueDate || "",
      assignee: newTask.assignee || "",
      progress: 0,
      category: newTask.category || "",
    };

    setTasks((prevTasks) => [...prevTasks, taskToAdd]);

    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      assignee: "",
      category: "",
    });
    setShowNewTaskModal(false);

    alert("Task created successfully!");
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  // Task Card Component
  const TaskCard = ({ task }: { task: Task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow duration-150 cursor-move select-none ${
        draggedTask?.id === task.id
          ? "opacity-60 transform rotate-1 scale-95"
          : "hover:scale-[1.02]"
      }`}
      style={{
        transform:
          draggedTask?.id === task.id ? "rotate(2deg) scale(0.98)" : undefined,
        transition: draggedTask?.id === task.id ? "none" : "all 0.15s ease",
      }}
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                task.status
              )}`}
            >
              {task.status
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {task.title}
        </h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{task.assignee}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-green-600 transition-colors">
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Category Tag */}
        <div>
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded border">
            {task.category}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm border-b rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tasks Management
                </h1>
                <p className="text-gray-600">
                  Manage and track all your tasks efficiently
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "All", count: tasks.length },
                {
                  key: "pending",
                  label: "Pending",
                  count: tasks.filter((t) => t.status === "pending").length,
                },
                {
                  key: "in-progress",
                  label: "In Progress",
                  count: tasks.filter((t) => t.status === "in-progress").length,
                },
                {
                  key: "completed",
                  label: "Completed",
                  count: tasks.filter((t) => t.status === "completed").length,
                },
                {
                  key: "overdue",
                  label: "Overdue",
                  count: tasks.filter((t) => t.status === "overdue").length,
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === filter.key
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kanban Board View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map((column) => {
            const columnTasks =
              activeFilter === "all"
                ? tasks.filter(
                    (task) =>
                      task.status === column.id &&
                      (task.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                        task.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()))
                  )
                : filteredTasks.filter((task) => task.status === column.id);

            const IconComponent = column.icon;

            return (
              <div
                key={column.id}
                className={`${column.bgColor} ${
                  column.borderColor
                } border-2 rounded-2xl p-4 min-h-[600px] transition-colors duration-200 ${
                  draggedTask && draggedTask.status !== column.id
                    ? "border-solid border-green-400 bg-green-50"
                    : "border-dashed"
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    {column.title}
                  </h3>
                  <span className="ml-auto bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>

                {/* Empty State */}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* New Task Modal */}
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Task
                </h2>
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter task description..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Row 1: Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newTask.status || "pending"}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as TaskStatus
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority || "medium"}
                      onChange={(e) =>
                        handleInputChange(
                          "priority",
                          e.target.value as TaskPriority
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Due Date and Assignee */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignee *
                    </label>
                    <select
                      value={newTask.assignee || ""}
                      onChange={(e) =>
                        handleInputChange("assignee", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select assignee...</option>
                      <option value="John Doe">John Doe</option>
                      <option value="Jane Smith">Jane Smith</option>
                      <option value="Mike Johnson">Mike Johnson</option>
                      <option value="Sarah Wilson">Sarah Wilson</option>
                      <option value="David Brown">David Brown</option>
                      <option value="Lisa Davis">Lisa Davis</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTask.category || ""}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select category...</option>
                    <option value="Safety">Safety</option>
                    <option value="Quality">Quality</option>
                    <option value="Reporting">Reporting</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Training">Training</option>
                    <option value="Inventory">Inventory</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={
                    !newTask.title || !newTask.dueDate || !newTask.assignee
                  }
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
