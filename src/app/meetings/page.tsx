"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Download, 
  Save,
  X,
  Calendar,
  Clock,
  FileText,
  Menu,
  BarChart3
} from 'lucide-react';

type MeetingStatus = 'scheduled' | 'ongoing' | 'completed';

interface Participant {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  status: MeetingStatus;
  participants: Participant[];
  notes: string;
  agenda: string[];
}

export default function SimpleMeetingDashboard() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    agenda: [''],
    participants: [{ name: '', role: '' }]
  });
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      title: "Weekly Production Review",
      date: "2025-08-06",
      time: "10:30 - 11:30",
      status: "completed",
      participants: [
        { id: 1, name: "Ahmad Rizki", role: "Production Manager", avatar: "AR" },
        { id: 2, name: "Siti Nurhaliza", role: "Quality Control", avatar: "SN" },
        { id: 3, name: "Budi Santoso", role: "Supervisor", avatar: "BS" }
      ],
      notes: "Diskusi mengenai target produksi bulan ini. Kualitas produk sudah mencapai 98%. Perlu perbaikan di line 3 untuk minggu depan. Action item: Tim maintenance akan check mesin hari Jumat.",
      agenda: ["Review target produksi", "Analisis kualitas", "Issue mesin line 3", "Planning minggu depan"]
    },
    {
      id: 2,
      title: "Safety Committee Meeting",
      date: "2025-08-06",
      time: "14:00 - 15:00",
      status: "scheduled",
      participants: [
        { id: 4, name: "Indra Wijaya", role: "Safety Officer", avatar: "IW" },
        { id: 5, name: "Maya Sari", role: "HR Manager", avatar: "MS" }
      ],
      notes: "",
      agenda: ["Review incident report", "Safety training schedule", "New safety equipment"]
    },
  ]);

  // Calculate dashboard statistics
  const today = new Date().toISOString().split('T')[0];
  const todayMeetings = meetings.filter(m => m.date === today).length;
  const upcomingMeetings = meetings.filter(m => new Date(m.date) > new Date() && m.status === 'scheduled').length;
  const completedWithNotes = meetings.filter(m => m.notes && m.notes.trim()).length;
  const totalMeetings = meetings.length;

  const handleSaveNotes = () => {
    if (selectedMeeting) {
      setMeetings(meetings.map(m => 
        m.id === selectedMeeting.id 
          ? { ...m, notes: editedNotes, status: 'completed' as MeetingStatus }
          : m
      ));
      setSelectedMeeting({ ...selectedMeeting, notes: editedNotes, status: 'completed' });
      setIsEditing(false);
    }
  };

  const handleEditNotes = () => {
    if (selectedMeeting) {
      setEditedNotes(selectedMeeting.notes);
      setIsEditing(true);
    }
  };

  const handleCreateMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      const meeting: Meeting = {
        id: meetings.length + 1,
        title: newMeeting.title,
        date: newMeeting.date,
        time: newMeeting.time,
        status: 'scheduled',
        participants: newMeeting.participants
          .filter(p => p.name && p.role)
          .map((p, index) => ({
            id: Date.now() + index,
            name: p.name,
            role: p.role,
            avatar: p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          })),
        notes: '',
        agenda: newMeeting.agenda.filter(item => item.trim())
      };
      
      setMeetings([...meetings, meeting]);
      setNewMeeting({ 
        title: '', 
        date: '', 
        time: '',
        agenda: [''],
        participants: [{ name: '', role: '' }]
      });
      setShowCreateForm(false);
    }
  };

  const handleEditMeeting = () => {
    if (selectedMeeting) {
      setEditingMeeting({
        ...selectedMeeting,
        time: selectedMeeting.time.split(' - ')[0] // Ambil waktu mulai saja untuk form
      });
      setShowEditForm(true);
    }
  };

  const handleUpdateMeeting = () => {
    if (editingMeeting) {
      const updatedMeeting: Meeting = {
        ...editingMeeting,
        participants: editingMeeting.participants
          .filter(p => p.name && p.role)
          .map((p, index) => ({
            ...p,
            id: p.id || Date.now() + index,
            avatar: p.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          })),
        agenda: editingMeeting.agenda.filter(item => item.trim())
      };
      
      setMeetings(meetings.map(m => m.id === editingMeeting.id ? updatedMeeting : m));
      setSelectedMeeting(updatedMeeting);
      setEditingMeeting(null);
      setShowEditForm(false);
    }
  };

  const addAgendaItem = (isCreate = true) => {
    if (isCreate) {
      setNewMeeting({
        ...newMeeting,
        agenda: [...newMeeting.agenda, '']
      });
    } else if (editingMeeting) {
      setEditingMeeting({
        ...editingMeeting,
        agenda: [...editingMeeting.agenda, '']
      });
    }
  };

  const removeAgendaItem = (index: number, isCreate = true) => {
    if (isCreate) {
      setNewMeeting({
        ...newMeeting,
        agenda: newMeeting.agenda.filter((_, i) => i !== index)
      });
    } else if (editingMeeting) {
      setEditingMeeting({
        ...editingMeeting,
        agenda: editingMeeting.agenda.filter((_, i) => i !== index)
      });
    }
  };

  const updateAgendaItem = (index: number, value: string, isCreate = true) => {
    if (isCreate) {
      const newAgenda = [...newMeeting.agenda];
      newAgenda[index] = value;
      setNewMeeting({
        ...newMeeting,
        agenda: newAgenda
      });
    } else if (editingMeeting) {
      const newAgenda = [...editingMeeting.agenda];
      newAgenda[index] = value;
      setEditingMeeting({
        ...editingMeeting,
        agenda: newAgenda
      });
    }
  };

  const addParticipant = (isCreate = true) => {
    if (isCreate) {
      setNewMeeting({
        ...newMeeting,
        participants: [...newMeeting.participants, { name: '', role: '' }]
      });
    } else if (editingMeeting) {
      setEditingMeeting({
        ...editingMeeting,
        participants: [...editingMeeting.participants, { id: 0, name: '', role: '', avatar: '' }]
      });
    }
  };

  const removeParticipant = (index: number, isCreate = true) => {
    if (isCreate) {
      setNewMeeting({
        ...newMeeting,
        participants: newMeeting.participants.filter((_, i) => i !== index)
      });
    } else if (editingMeeting) {
      setEditingMeeting({
        ...editingMeeting,
        participants: editingMeeting.participants.filter((_, i) => i !== index)
      });
    }
  };

  const updateParticipant = (index: number, field: string, value: string, isCreate = true) => {
    if (isCreate) {
      const newParticipants = [...newMeeting.participants];
      newParticipants[index] = { ...newParticipants[index], [field]: value };
      setNewMeeting({
        ...newMeeting,
        participants: newParticipants
      });
    } else if (editingMeeting) {
      const newParticipants = [...editingMeeting.participants];
      newParticipants[index] = { ...newParticipants[index], [field]: value };
      setEditingMeeting({
        ...editingMeeting,
        participants: newParticipants
      });
    }
  };

  const exportToPDF = () => {
    if (selectedMeeting) {
      // Membuat HTML untuk print sebagai PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Notulensi - ${selectedMeeting.title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                line-height: 1.6;
                color: #333;
              }
              .header {
                text-align: center;
                border-bottom: 3px solid #059669;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #059669;
                font-size: 24px;
                margin: 0 0 10px 0;
              }
              .meeting-info {
                background: #f0fdf4;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
                border-left: 4px solid #059669;
              }
              .section {
                margin-bottom: 25px;
              }
              .section h3 {
                color: #059669;
                border-bottom: 1px solid #d1d5db;
                padding-bottom: 5px;
                font-size: 16px;
              }
              .participants {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 10px;
              }
              .participant {
                background: #f9fafb;
                padding: 10px;
                border-radius: 6px;
                border-left: 3px solid #fbbf24;
              }
              .agenda-list {
                list-style: none;
                padding: 0;
              }
              .agenda-list li {
                background: #fef3c7;
                margin: 8px 0;
                padding: 10px 15px;
                border-radius: 6px;
                border-left: 3px solid #f59e0b;
              }
              .notes {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                white-space: pre-wrap;
              }
              @media print {
                body { margin: 0; padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>NOTULENSI RAPAT</h1>
              <p style="margin: 0; color: #6b7280;">Dokumen resmi hasil rapat</p>
            </div>
            
            <div class="meeting-info">
              <h2 style="margin-top: 0; color: #1f2937;">${selectedMeeting.title}</h2>
              <p><strong>Tanggal:</strong> ${new Date(selectedMeeting.date).toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Waktu:</strong> ${selectedMeeting.time}</p>
              <p><strong>Status:</strong> ${getStatusText(selectedMeeting.status)}</p>
            </div>
            
            <div class="section">
              <h3>PESERTA RAPAT</h3>
              <div class="participants">
                ${selectedMeeting.participants.map(p => `
                  <div class="participant">
                    <strong>${p.name}</strong><br>
                    <small style="color: #6b7280;">${p.role}</small>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <h3>AGENDA RAPAT</h3>
              <ol class="agenda-list">
                ${selectedMeeting.agenda.map(item => `<li>${item}</li>`).join('')}
              </ol>
            </div>
            
            ${selectedMeeting.notes ? `
              <div class="section">
                <h3>NOTULENSI</h3>
                <div class="notes">${selectedMeeting.notes}</div>
              </div>
            ` : ''}
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
              Dokumen dibuat pada ${new Date().toLocaleDateString('id-ID')} | Meeting Management System
            </div>
          </body>
          </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Auto print setelah load
        printWindow.onload = () => {
          printWindow.print();
          // Tutup window setelah print (opsional)
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        };
      } else {
        // Fallback jika popup diblokir
        const content = `NOTULENSI RAPAT
================

Judul: ${selectedMeeting.title}
Tanggal: ${new Date(selectedMeeting.date).toLocaleDateString('id-ID')}
Waktu: ${selectedMeeting.time}

PESERTA:
${selectedMeeting.participants.map(p => `- ${p.name} (${p.role})`).join('\n')}

AGENDA:
${selectedMeeting.agenda.map((item, i) => `${i + 1}. ${item}`).join('\n')}

NOTULENSI:
${selectedMeeting.notes || 'Belum ada notulensi.'}
        `;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notulensi-${selectedMeeting.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const getStatusColor = (status: MeetingStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border border-green-200';
      case 'ongoing': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusText = (status: MeetingStatus) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'ongoing': return 'Berlangsung';
      case 'scheduled': return 'Terjadwal';
      default: return 'Unknown';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 bg-white/90 backdrop-blur-md border-b border-green-200 px-4 py-4 z-40">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Meeting Management</h1>
            <button 
              onClick={() => setShowMobileList(!showMobileList)}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meeting Management</h1>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Buat Meeting Baru
            </button>
          </div>

          {/* Dashboard Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {/* Meeting Hari Ini */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-green-100 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-3">
                <div className="p-2 lg:p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg lg:rounded-xl mb-2 lg:mb-0 self-start">
                  <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <span className="text-xl lg:text-2xl font-bold text-blue-600">
                  {todayMeetings}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-xs lg:text-sm">Meeting Hari Ini</h3>
              <p className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </p>
            </div>

            {/* Meeting Mendatang */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-green-100 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-3">
                <div className="p-2 lg:p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg lg:rounded-xl mb-2 lg:mb-0 self-start">
                  <Clock className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
                <span className="text-xl lg:text-2xl font-bold text-yellow-600">
                  {upcomingMeetings}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-xs lg:text-sm">Meeting Mendatang</h3>
              <p className="text-xs text-gray-500 mt-1">Terjadwal</p>
            </div>

            {/* Meeting dengan Notulensi */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-green-100 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-3">
                <div className="p-2 lg:p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg lg:rounded-xl mb-2 lg:mb-0 self-start">
                  <FileText className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <span className="text-xl lg:text-2xl font-bold text-green-600">
                  {completedWithNotes}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-xs lg:text-sm">Ada Notulensi</h3>
              <p className="text-xs text-gray-500 mt-1">Selesai</p>
            </div>

            {/* Total Meeting */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-green-100 p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 lg:mb-3">
                <div className="p-2 lg:p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg lg:rounded-xl mb-2 lg:mb-0 self-start">
                  <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <span className="text-xl lg:text-2xl font-bold text-purple-600">
                  {totalMeetings}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-xs lg:text-sm">Total Meeting</h3>
              <p className="text-xs text-gray-500 mt-1">Semua</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meeting List */}
            <div className={`lg:col-span-1 ${showMobileList ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-green-100">
                <div className="p-6 border-b border-green-100">
                  <h2 className="text-lg font-semibold text-gray-900">Daftar Meeting</h2>
                </div>
                <div className="divide-y divide-green-50">
                  {meetings.map((meeting) => (
                    <div 
                      key={meeting.id}
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowMobileList(false);
                      }}
                      className={`p-4 cursor-pointer hover:bg-green-50 transition-colors ${
                        selectedMeeting?.id === meeting.id ? 'bg-gradient-to-r from-green-50 to-yellow-50 border-r-4 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight">{meeting.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {getStatusText(meeting.status)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(meeting.date).toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meeting.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-gray-600">{meeting.participants.length} peserta</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Meeting Detail */}
            <div className={`lg:col-span-2 ${showMobileList ? 'hidden lg:block' : 'block'}`}>
              {selectedMeeting ? (
                <div className="bg-white rounded-2xl shadow-sm border border-green-100">
                  <div className="p-4 lg:p-6 border-b border-green-100">
                    <div className="flex flex-col gap-4">
                      <div className="flex-1">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">{selectedMeeting.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            {new Date(selectedMeeting.date).toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            {selectedMeeting.time}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMeeting.status)}`}>
                            {getStatusText(selectedMeeting.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {selectedMeeting.notes && (
                          <button 
                            onClick={exportToPDF}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 text-xs lg:text-sm font-medium shadow-md transition-all duration-200"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export PDF</span>
                            <span className="sm:hidden">PDF</span>
                          </button>
                        )}
                        <button 
                          onClick={handleEditMeeting}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 text-xs lg:text-sm font-medium shadow-md transition-all duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit Meeting</span>
                          <span className="sm:hidden">Edit</span>
                        </button>
                        <button 
                          onClick={handleEditNotes}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 text-xs lg:text-sm font-medium shadow-md transition-all duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit Notes</span>
                          <span className="sm:hidden">Notes</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
                    {/* Participants */}
                    <div>
                      <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                        <Users className="w-4 lg:w-5 h-4 lg:h-5 text-green-600" />
                        Peserta Meeting
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedMeeting.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg lg:rounded-xl border border-green-100">
                            <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-medium text-xs lg:text-sm">{participant.avatar}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{participant.name}</div>
                              <div className="text-xs text-gray-600">{participant.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Agenda */}
                    <div>
                      <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                        <FileText className="w-4 lg:w-5 h-4 lg:h-5 text-yellow-600" />
                        Agenda
                      </h3>
                      <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-yellow-100">
                        <ul className="space-y-2">
                          {selectedMeeting.agenda.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-3 lg:mb-4">Notulensi</h3>
                      {isEditing ? (
                        <div className="space-y-4">
                          <textarea
                            value={editedNotes}
                            onChange={(e) => setEditedNotes(e.target.value)}
                            placeholder="Tulis notulensi meeting di sini..."
                            className="w-full h-36 lg:h-48 p-3 lg:p-4 border-2 border-green-200 rounded-lg lg:rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-500 text-sm lg:text-base"
                            style={{ color: '#111827' }}
                          />
                          <div className="flex gap-3">
                            <button 
                              onClick={handleSaveNotes}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 text-sm font-medium shadow-md transition-all duration-200"
                            >
                              <Save className="w-4 h-4" />
                              Simpan
                            </button>
                            <button 
                              onClick={() => setIsEditing(false)}
                              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-4 lg:px-6 py-2 rounded-lg lg:rounded-xl flex items-center gap-2 text-sm font-medium shadow-md transition-all duration-200"
                            >
                              <X className="w-4 h-4" />
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg lg:rounded-xl p-4 lg:p-6 border border-green-100">
                          {selectedMeeting.notes ? (
                            <p className="text-gray-700 leading-relaxed text-sm lg:text-base">{selectedMeeting.notes}</p>
                          ) : (
                            <p className="text-gray-500 italic text-sm lg:text-base">Belum ada notulensi. Klik Edit untuk menambahkan.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 lg:p-12 text-center">
                  <FileText className="w-12 lg:w-16 h-12 lg:h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Pilih Meeting</h3>
                  <p className="text-gray-600 text-sm lg:text-base">Pilih meeting dari daftar untuk melihat detail dan notulensi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Create Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="w-14 h-14 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Create Meeting Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Buat Meeting Baru</h3>
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewMeeting({ 
                      title: '', 
                      date: '', 
                      time: '',
                      agenda: [''],
                      participants: [{ name: '', role: '' }]
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 lg:w-6 h-5 lg:h-6 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4 lg:space-y-6">
                <div className="space-y-3 lg:space-y-4">
                  <input 
                    type="text" 
                    placeholder="Judul meeting"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                    className="w-full p-3 lg:p-4 border border-green-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-500 text-sm lg:text-base"
                  />
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <input 
                      type="date" 
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                      className="w-full p-3 lg:p-4 border border-green-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 text-sm lg:text-base"
                    />
                    <input 
                      type="time" 
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                      className="w-full p-3 lg:p-4 border border-green-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 text-sm lg:text-base"
                    />
                  </div>
                </div>

                {/* Participants Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Peserta</h4>
                    <button
                      onClick={() => addParticipant(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm flex items-center gap-1"
                    >
                      <Plus className="w-3 lg:w-4 h-3 lg:h-4" />
                      Tambah
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newMeeting.participants.map((participant, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          placeholder="Nama peserta"
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, 'name', e.target.value, true)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Role/Jabatan"
                          value={participant.role}
                          onChange={(e) => updateParticipant(index, 'role', e.target.value, true)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 text-sm"
                        />
                        <button
                          onClick={() => removeParticipant(index, true)}
                          disabled={newMeeting.participants.length === 1}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg text-sm disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agenda Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Agenda</h4>
                    <button
                      onClick={() => addAgendaItem(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm flex items-center gap-1"
                    >
                      <Plus className="w-3 lg:w-4 h-3 lg:h-4" />
                      Tambah
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newMeeting.agenda.map((item, index) => (
                      <div key={index} className="flex gap-2 lg:gap-3">
                        <input
                          type="text"
                          placeholder={`Agenda ${index + 1}`}
                          value={item}
                          onChange={(e) => updateAgendaItem(index, e.target.value, true)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 text-sm"
                        />
                        <button
                          onClick={() => removeAgendaItem(index, true)}
                          disabled={newMeeting.agenda.length === 1}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleCreateMeeting}
                    disabled={!newMeeting.title || !newMeeting.date || !newMeeting.time}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 text-sm lg:text-base"
                  >
                    Buat Meeting
                  </button>
                  <button 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewMeeting({ 
                        title: '', 
                        date: '', 
                        time: '',
                        agenda: [''],
                        participants: [{ name: '', role: '' }]
                      });
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-colors text-sm lg:text-base"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Meeting Modal */}
        {showEditForm && editingMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Edit Meeting</h3>
                <button 
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingMeeting(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 lg:w-6 h-5 lg:h-6 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4 lg:space-y-6">
                <div className="space-y-3 lg:space-y-4">
                  <input 
                    type="text" 
                    placeholder="Judul meeting"
                    value={editingMeeting.title}
                    onChange={(e) => setEditingMeeting({...editingMeeting, title: e.target.value})}
                    className="w-full p-3 lg:p-4 border border-green-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-500 text-sm lg:text-base"
                  />
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <input 
                      type="date" 
                      value={editingMeeting.date}
                      onChange={(e) => setEditingMeeting({...editingMeeting, date: e.target.value})}
                      className="w-full p-3 lg:p-4 border border-green-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 text-sm lg:text-base"
                    />
                    <input 
                      type="time" 
                      value={editingMeeting.time}
                      onChange={(e) => setEditingMeeting({...editingMeeting, time: e.target.value})}
                      className="w-full p-3 lg:p-4 border border-green-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 text-sm lg:text-base"
                    />
                  </div>
                </div>

                {/* Participants Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Peserta</h4>
                    <button
                      onClick={() => addParticipant(false)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm flex items-center gap-1"
                    >
                      <Plus className="w-3 lg:w-4 h-3 lg:h-4" />
                      Tambah
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editingMeeting.participants.map((participant, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          placeholder="Nama peserta"
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, 'name', e.target.value, false)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Role/Jabatan"
                          value={participant.role}
                          onChange={(e) => updateParticipant(index, 'role', e.target.value, false)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 text-sm"
                        />
                        <button
                          onClick={() => removeParticipant(index, false)}
                          disabled={editingMeeting.participants.length === 1}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg text-sm disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agenda Section */}
                <div>
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h4 className="text-sm lg:text-base font-medium text-gray-900">Agenda</h4>
                    <button
                      onClick={() => addAgendaItem(false)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm flex items-center gap-1"
                    >
                      <Plus className="w-3 lg:w-4 h-3 lg:h-4" />
                      Tambah
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editingMeeting.agenda.map((item, index) => (
                      <div key={index} className="flex gap-2 lg:gap-3">
                        <input
                          type="text"
                          placeholder={`Agenda ${index + 1}`}
                          value={item}
                          onChange={(e) => updateAgendaItem(index, e.target.value, false)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 text-sm"
                        />
                        <button
                          onClick={() => removeAgendaItem(index, false)}
                          disabled={editingMeeting.agenda.length === 1}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleUpdateMeeting}
                    disabled={!editingMeeting.title || !editingMeeting.date || !editingMeeting.time}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 text-sm lg:text-base"
                  >
                    Update Meeting
                  </button>
                  <button 
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingMeeting(null);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-colors text-sm lg:text-base"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}