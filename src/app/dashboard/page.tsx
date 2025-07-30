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
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#000000] to-[#000000] bg-clip-text text-transparent">
          Welcome back, John! 
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks - 2 columns */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#009a44]" />
                Recent Tasks
              </h3>
              <button className="flex items-center gap-2 text-[#009a44] hover:text-[#007d37] text-sm font-medium hover:bg-[#e6f7ef] px-3 py-2 rounded-lg transition-all">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {/* Task 1 */}
              <div className="bg-gradient-to-r from-[#e6f7ef]/50 to-[#e6f7ef]/30 rounded-xl p-4 border border-[#009a44]/20">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-[#009a44] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Safety Protocol Review</h4>
                      <span className="px-2 py-1 bg-[#009a44]/20 text-[#007d37] text-xs font-medium rounded-full">
                        In Progress
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Due: August 1, 2024</p>
                    <div className="bg-[#009a44]/20 rounded-full h-2">
                      <div className="bg-[#009a44] h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task 2 */}
              <div className="bg-gradient-to-r from-[#e6f7ef]/50 to-[#e6f7ef]/30 rounded-xl p-4 border border-[#009a44]/30">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-[#009a44] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Quality Control Inspection</h4>
                      <span className="px-2 py-1 bg-[#009a44]/30 text-[#006d2f] text-xs font-medium rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Completed on July 28, 2024</p>
                    <div className="bg-[#009a44]/20 rounded-full h-2">
                      <div className="bg-[#009a44] h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task 3 */}
              <div className="bg-gradient-to-r from-[#FFD500]/10 to-[#FFD500]/20 rounded-xl p-4 border border-[#FFD500]/30">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-[#FFD500] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Production Report</h4>
                      <span className="px-2 py-1 bg-red-500/20 text-red-700 text-xs font-medium rounded-full">
                        Urgent
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Due: July 31, 2024</p>
                    <div className="bg-[#FFD500]/30 rounded-full h-2">
                      <div className="bg-[#FFD500] h-2 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Task Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#009a44]/40 rounded-xl text-[#009a44] hover:text-[#007d37] hover:border-[#009a44]/60 hover:bg-[#e6f7ef]/20 transition-all">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Stats Cards - 4 cards sedikit lebih besar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#e6f7ef] rounded-lg">
                  <FileText className="w-5 h-5 text-[#009a44]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-600">Total Tasks</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#e6f7ef] rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#009a44]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/80 transition-all duration-300">
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

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FFD500]/20 rounded-lg">
                  <Clock className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#009a44]" />
                Upcoming Meetings
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Meeting 1 */}
                <div className="bg-gradient-to-r from-[#e6f7ef]/50 to-[#e6f7ef]/30 rounded-xl p-4 border border-[#009a44]/20">
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
                <div className="bg-gradient-to-r from-[#e6f7ef]/50 to-[#e6f7ef]/30 rounded-xl p-4 border border-[#009a44]/20">
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
                <div className="bg-gradient-to-r from-[#FFD500]/10 to-[#FFD500]/20 rounded-xl p-4 border border-[#FFD500]/30">
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
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 p-3 bg-[#009a44] hover:bg-[#007d37] text-white rounded-xl font-medium transition-all">
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}