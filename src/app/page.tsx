'use client';

import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp,
  BarChart3,
  Plus,
  ArrowRight,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: string;
  progress: number;
  category: string;
}

export default function HomePage() {
  const handleViewAllTasks = () => {
    console.log('Navigate to tasks page');
    // In a real app, this would handle navigation
  };

  // Task data yang sama dengan di halaman Tasks
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Safety Protocol Review',
      description: 'Review and update safety protocols for production line A',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-08-01',
      assignee: 'John Doe',
      progress: 75,
      category: 'Safety'
    },
    {
      id: 2,
      title: 'Quality Control Inspection',
      description: 'Monthly quality control inspection for all production units',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-07-28',
      assignee: 'Jane Smith',
      progress: 100,
      category: 'Quality'
    },
    {
      id: 3,
      title: 'Production Report',
      description: 'Generate monthly production report and analysis',
      status: 'overdue',
      priority: 'urgent',
      dueDate: '2024-07-31',
      assignee: 'Mike Johnson',
      progress: 50,
      category: 'Reporting'
    },
    {
      id: 4,
      title: 'Equipment Maintenance',
      description: 'Scheduled maintenance for production equipment',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-08-05',
      assignee: 'Sarah Wilson',
      progress: 30,
      category: 'Maintenance'
    },
    {
      id: 5,
      title: 'Training Session Planning',
      description: 'Plan and organize safety training session for new employees',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-08-10',
      assignee: 'David Brown',
      progress: 0,
      category: 'Training'
    },
    {
      id: 6,
      title: 'Inventory Audit',
      description: 'Complete inventory audit for raw materials',
      status: 'overdue',
      priority: 'high',
      dueDate: '2024-07-25',
      assignee: 'Lisa Davis',
      progress: 80,
      category: 'Inventory'
    }
  ];

  // Helper function untuk format tanggal
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function untuk mendapatkan warna status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Helper function untuk mendapatkan icon status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Helper function untuk mendapatkan warna kategori
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Safety':
        return 'bg-green-50 text-green-600';
      case 'Quality':
        return 'bg-blue-50 text-blue-600';
      case 'Reporting':
        return 'bg-orange-50 text-orange-600';
      case 'Maintenance':
        return 'bg-purple-50 text-purple-600';
      case 'Training':
        return 'bg-indigo-50 text-indigo-600';
      case 'Inventory':
        return 'bg-amber-50 text-amber-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <div className="space-y-6 p-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Azmi! 
          </h1>
          <p className="text-gray-700 mt-1">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks - 2 columns */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#009a44]" />
                  Recent Tasks
                </h3>
                <button 
                  onClick={handleViewAllTasks}
                  className="flex items-center gap-2 text-[#009a44] hover:text-[#007d37] text-sm font-medium hover:bg-white/50 px-3 py-2 rounded-lg transition-all"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {tasks.map((task) => (
                  <div key={task.id} className={`group bg-white/90 backdrop-blur-sm rounded-lg p-4 border hover:shadow-md transition-all duration-200 ${getStatusColor(task.status)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg shrink-0" style={{backgroundColor: 'rgba(255,255,255,0.7)'}}>
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                            <span className="px-2 py-1 text-xs font-medium rounded-full shrink-0 capitalize border" style={{
                              backgroundColor: task.status === 'completed' ? '#f0fdf4' :
                                             task.status === 'in-progress' ? '#eff6ff' :
                                             task.status === 'pending' ? '#fefce8' : '#fef2f2',
                              color: task.status === 'completed' ? '#15803d' :
                                     task.status === 'in-progress' ? '#1d4ed8' :
                                     task.status === 'pending' ? '#a16207' : '#dc2626',
                              borderColor: task.status === 'completed' ? '#bbf7d0' :
                                          task.status === 'in-progress' ? '#bfdbfe' :
                                          task.status === 'pending' ? '#fde68a' : '#fecaca'
                            }}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(task.dueDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {task.assignee}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-all">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards - 4 cards sedikit lebih besar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:bg-white/80 transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#e6f7ef] rounded-lg">
                    <FileText className="w-5 h-5 text-[#009a44]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                    <p className="text-xs text-gray-600">Total Tasks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:bg-white/80 transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#e6f7ef] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[#009a44]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'completed').length}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:bg-white/80 transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FFD500]/20 rounded-lg">
                    <Users className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-600">Meetings</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-white/30 hover:bg-white/80 transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FFD500]/20 rounded-lg">
                    <Clock className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'pending').length}</p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#009a44]" />
                  Upcoming Meetings
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {/* Meeting 1 */}
                  <div className="bg-gradient-to-r from-[#e6f7ef]/80 to-[#e6f7ef]/60 rounded-xl p-4 border border-[#009a44]/20 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009a44] text-white p-2 rounded-lg text-center min-w-[50px]">
                        <div className="text-lg font-bold">30</div>
                        <div className="text-xs">JUL</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Weekly Production Review</h4>
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          Tomorrow, 9:00 AM
                        </div>
                        <p className="text-xs text-gray-500">Conference Room A</p>
                      </div>
                    </div>
                  </div>

                  {/* Meeting 2 */}
                  <div className="bg-gradient-to-r from-[#e6f7ef]/80 to-[#e6f7ef]/60 rounded-xl p-4 border border-[#009a44]/20 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009a44] text-white p-2 rounded-lg text-center min-w-[50px]">
                        <div className="text-lg font-bold">02</div>
                        <div className="text-xs">AUG</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Safety Committee Meeting</h4>
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          Aug 2, 2:00 PM
                        </div>
                        <p className="text-xs text-gray-500">Online Meeting</p>
                      </div>
                    </div>
                  </div>

                  {/* Meeting 3 */}
                  <div className="bg-gradient-to-r from-[#FFD500]/20 to-[#FFD500]/30 rounded-xl p-4 border border-[#FFD500]/40 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#FFD500] text-gray-900 p-2 rounded-lg text-center min-w-[50px]">
                        <div className="text-lg font-bold">05</div>
                        <div className="text-xs">AUG</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Monthly Team Sync</h4>
                        <div className="flex items-center text-xs text-gray-600 mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          Aug 5, 10:00 AM
                        </div>
                        <p className="text-xs text-gray-500">Main Conference Hall</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Meeting Button */}
                <div className="mt-6 pt-4 border-t border-gray-200/50">
                  <button className="w-full flex items-center justify-center gap-2 p-3 bg-[#009a44] hover:bg-[#007d37] text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg">
                    <Calendar className="w-4 h-4" />
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}