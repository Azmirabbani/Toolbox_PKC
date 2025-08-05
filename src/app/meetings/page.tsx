"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  Bell, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

// Type definitions
type MeetingStatus = 'scheduled' | 'completed' | 'rescheduled' | 'cancelled' | 'upcoming';
type ReminderType = 'meeting' | 'task' | 'update' | 'success';
type ViewType = 'Week' | 'Month' | 'Year';

interface Meeting {
  id: number;
  title: string;
  time: string;
  participants: number;
  status: MeetingStatus;
  location: string;
  category: string;
  membersGoing: number;
  pending?: number;
  avatar: string;
}

interface Reminder {
  id: number;
  message: string;
  type: ReminderType;
  time: string;
  category: string;
}

export default function MeetingDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<ViewType>('Month');

  // Sample meeting data matching the reference
  const meetings: Meeting[] = [
    {
      id: 1,
      title: "Weekly Production Review",
      time: "10:30 AM to 11:00 AM",
      participants: 9,
      status: "upcoming",
      location: "Conference Room A",
      category: "Production",
      membersGoing: 9,
      pending: 2,
      avatar: "WP"
    },
    {
      id: 2,
      title: "Safety Committee Meeting",
      time: "10:30 AM to 11:00 AM",
      participants: 4,
      status: "upcoming",
      location: "Online Meeting",
      category: "Safety",
      membersGoing: 4,
      avatar: "SC"
    },
    {
      id: 3,
      title: "Quality Control Review",
      time: "10:30 AM to 11:00 AM",
      participants: 2,
      status: "upcoming",
      location: "Lab Conference Room",
      category: "Quality",
      membersGoing: 2,
      avatar: "QC"
    },
    {
      id: 4,
      title: "Equipment Maintenance",
      time: "10:30 AM to 11:00 AM",
      participants: 8,
      status: "upcoming",
      location: "Maintenance Office",
      category: "Maintenance",
      membersGoing: 8,
      pending: 5,
      avatar: "EM"
    },
    {
      id: 5,
      title: "Budget Planning Session",
      time: "10:30 AM to 11:00 AM",
      participants: 3,
      status: "rescheduled",
      location: "Finance Room",
      category: "Finance",
      membersGoing: 3,
      pending: 1,
      avatar: "BP"
    },
    {
      id: 6,
      title: "Monthly Team Sync",
      time: "10:30 AM to 11:00 AM",
      participants: 6,
      status: "upcoming",
      location: "Main Hall",
      category: "Team",
      membersGoing: 6,
      pending: 1,
      avatar: "MT"
    }
  ];

  const reminders: Reminder[] = [
    {
      id: 1,
      message: "Today is your meeting with PM",
      type: "meeting",
      time: "2 hours ago",
      category: "Design team"
    },
    {
      id: 2,
      message: "You need to add a network in vector.",
      type: "task",
      time: "4 hours ago",
      category: "Design team"
    },
    {
      id: 3,
      message: "You have closed the logo design is final.",
      type: "update",
      time: "6 hours ago",
      category: "Design & Team Lead"
    },
    {
      id: 4,
      message: "Successfully completion of project.",
      type: "success",
      time: "1 day ago",
      category: "Design & Team Lead"
    }
  ];

  const generateCalendarDays = (): Date[] => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case 'meeting':
        return '📅';
      case 'task':
        return '📋';
      case 'update':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '📅';
    }
  };

  const getReminderColor = (type: ReminderType) => {
    switch (type) {
      case 'meeting':
        return 'bg-purple-50 border-l-purple-400';
      case 'task':
        return 'bg-blue-50 border-l-blue-400';
      case 'update':
        return 'bg-red-50 border-l-red-400';
      case 'success':
        return 'bg-green-50 border-l-green-400';
      default:
        return 'bg-gray-50 border-l-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 p-6">


      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Schedule Meetings</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">36</div>
                  <div className="text-sm text-gray-600">Schedule meeting</div>
                  <div className="text-xs text-green-600">This month</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">14</div>
                  <div className="text-sm text-gray-600">Rescheduled meeting</div>
                  <div className="text-xs text-yellow-600">This month</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">20</div>
                  <div className="text-sm text-gray-600">Cancelled meeting</div>
                  <div className="text-xs text-red-600">This month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Meetings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Today - 6 meeting</h2>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              {meetings.slice(0, 3).map((meeting, index) => (
                <div key={meeting.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{meeting.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{meeting.title}</h3>
                      <p className="text-sm text-gray-500">{meeting.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{meeting.membersGoing} Members Going</span>
                      {meeting.pending && (
                        <span className="text-orange-600 ml-2">{meeting.pending} Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(meeting.participants, 4))].map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-br from-green-400 to-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {String.fromCharCode(65 + i)}
                          </span>
                        </div>
                      ))}
                      {meeting.participants > 4 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-semibold">
                            +{meeting.participants - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      index === 1 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {meetings.slice(3, 6).map((meeting, index) => (
                <div key={meeting.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{meeting.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{meeting.title}</h3>
                      <p className="text-sm text-gray-500">{meeting.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{meeting.membersGoing} Members Going</span>
                      {meeting.pending && (
                        <span className="text-orange-600 ml-2">{meeting.pending} Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(meeting.participants, 4))].map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {String.fromCharCode(65 + i)}
                          </span>
                        </div>
                      ))}
                      {meeting.participants > 4 && (
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-semibold">
                            +{meeting.participants - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col h-fit max-h-screen overflow-hidden">
          {/* Calendar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Calendar</h2>
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(['Week', 'Month', 'Year'] as ViewType[]).map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeView === view 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <h3 className="text-sm font-medium text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button 
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((date, index) => {
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const hasEvent = [5, 12, 18, 25].includes(date.getDate()) && isCurrentMonth;
                
                return (
                  <button
                    key={index}
                    className={`p-1.5 text-xs relative transition-colors rounded-md ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${
                      isToday 
                        ? 'bg-green-600 text-white font-semibold' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                    {hasEvent && !isToday && (
                      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Reminders</h2>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto min-h-0 mb-6">
              {reminders.map((reminder) => (
                <div key={reminder.id} className={`p-4 rounded-xl border-l-4 ${getReminderColor(reminder.type)} flex-shrink-0`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getReminderIcon(reminder.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{reminder.message}</p>
                      <p className="text-xs text-gray-500">{reminder.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors flex-shrink-0">
              <Plus className="w-5 h-5" />
              Create Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}