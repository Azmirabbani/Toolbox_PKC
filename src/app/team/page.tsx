"use client"

import { useState } from "react"
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Building2,
  Filter,
  UserPlus,
  Shield,
  Star,
  X,
  Menu,
  ChevronDown
} from "lucide-react"

type TeamMember = {
  id: string
  name: string
  employeeId: string
  email: string
  phone: string
  department: string
  position: string
  role: 'leader' | 'member' | 'coordinator'
  joinDate: string
  location: string
  status: 'active' | 'inactive'
  photo?: string
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedMember, setExpandedMember] = useState<string | null>(null)

  // Sample data team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Ahmad Rizki Pratama",
      employeeId: "TM001",
      email: "ahmad.rizki@pupukkujang.com",
      phone: "+62 812-3456-7890",
      department: "Teknologi Informasi",
      position: "Lead Developer",
      role: "leader",
      joinDate: "2024-01-15",
      location: "Cikampek",
      status: "active"
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      employeeId: "TM002",
      email: "siti.nurhaliza@pupukkujang.com",
      phone: "+62 813-2345-6789",
      department: "Pemasaran",
      position: "Marketing Coordinator",
      role: "coordinator",
      joinDate: "2024-02-20",
      location: "Cikampek",
      status: "active"
    },
    {
      id: "3",
      name: "Budi Setiawan",
      employeeId: "TM003",
      email: "budi.setiawan@pupukkujang.com",
      phone: "+62 814-3456-7890",
      department: "Keuangan",
      position: "Senior Analyst",
      role: "member",
      joinDate: "2023-11-10",
      location: "Cikampek",
      status: "active"
    },
    {
      id: "4",
      name: "Maya Sari",
      employeeId: "TM004",
      email: "maya.sari@pupukkujang.com",
      phone: "+62 815-4567-8901",
      department: "Sumber Daya Manusia",
      position: "HR Team Lead",
      role: "leader",
      joinDate: "2023-08-05",
      location: "Cikampek",
      status: "active"
    },
    {
      id: "5",
      name: "Doni Kurniawan",
      employeeId: "TM005",
      email: "doni.kurniawan@pupukkujang.com",
      phone: "+62 816-5678-9012",
      department: "Administrasi",
      position: "Admin Officer",
      role: "member",
      joinDate: "2024-03-12",
      location: "Cikampek",
      status: "inactive"
    },
    {
      id: "6",
      name: "Rina Wulandari",
      employeeId: "TM006",
      email: "rina.wulandari@pupukkujang.com",
      phone: "+62 817-6789-0123",
      department: "R&D",
      position: "Research Coordinator",
      role: "coordinator",
      joinDate: "2023-12-18",
      location: "Cikampek",
      status: "active"
    },
    {
      id: "7",
      name: "Fajar Hidayat",
      employeeId: "TM007",
      email: "fajar.hidayat@pupukkujang.com",
      phone: "+62 818-7890-1234",
      department: "Bisnis",
      position: "Business Analyst",
      role: "member",
      joinDate: "2024-01-08",
      location: "Cikampek",
      status: "active"
    },
  ])

  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "member",
    joinDate: "",
    location: "",
    status: "active"
  })

  const departments = [
    "Teknologi Informasi",
    "Pemasaran", 
    "Administrasi",
    "Bisnis",
    "Keuangan",
    "Sumber Daya Manusia",
    "R&D"
  ]

  const roles = [
    { value: "leader", label: "Team Leader", icon: Shield },
    { value: "coordinator", label: "Coordinator", icon: Star },
    { value: "member", label: "Member", icon: Users }
  ]

  // Filter team members
  const getFilteredMembers = () => {
    let filtered = [...teamMembers]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(member => member.department === departmentFilter)
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(member => member.role === roleFilter)
    }

    return filtered
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.employeeId) {
      const member: TeamMember = {
        ...newMember,
        id: Date.now().toString(),
      } as TeamMember

      setTeamMembers([member, ...teamMembers])
      setNewMember({
        name: "",
        employeeId: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        role: "member",
        joinDate: "",
        location: "",
        status: "active"
      })
      setShowAddForm(false)
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setNewMember(member)
    setShowAddForm(true)
    setExpandedMember(null) // Close expanded view
  }

  const handleUpdateMember = () => {
    if (editingMember && newMember.name && newMember.email) {
      setTeamMembers(teamMembers.map(member => 
        member.id === editingMember.id 
          ? { ...newMember, id: editingMember.id } as TeamMember
          : member
      ))
      setEditingMember(null)
      setNewMember({
        name: "",
        employeeId: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        role: "member",
        joinDate: "",
        location: "",
        status: "active"
      })
      setShowAddForm(false)
    }
  }

  const handleDeleteMember = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota tim ini?")) {
      setTeamMembers(teamMembers.filter(member => member.id !== id))
      setExpandedMember(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const getRoleIcon = (role: string) => {
    const roleData = roles.find(r => r.value === role)
    return roleData ? roleData.icon : Users
  }

  const getRoleLabel = (role: string) => {
    const roleData = roles.find(r => r.value === role)
    return roleData ? roleData.label : 'Member'
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'leader':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'coordinator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const filteredMembers = getFilteredMembers()
  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const leaders = teamMembers.filter(m => m.role === 'leader').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      {/* Header - Static position, tidak mengikuti scroll */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900">Tim Management</h1>
                <p className="text-sm text-gray-600">{activeMembers} anggota aktif • {leaders} leader</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Tim Management</h1>
                  <p className="text-gray-700">Kelola anggota tim dan struktur organisasi</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                    <Users className="w-4 h-4" />
                    {activeMembers} Aktif
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    {leaders} Leader
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Anggota
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Mobile Search & Filter Toggle - Fixed responsive design */}
        <div className="lg:hidden mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari anggota tim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 flex items-center justify-between text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Filter & Urutkan</span>
              <span className="text-sm text-gray-500">({filteredMembers.length}/{teamMembers.length})</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-4 shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
                <select 
                  value={departmentFilter} 
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="all">Semua Departemen</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="all">Semua Role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              {(departmentFilter !== "all" || roleFilter !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setDepartmentFilter("all")
                    setRoleFilter("all")
                    setSearchQuery("")
                  }}
                  className="w-full py-2 text-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama, ID, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>

            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Semua Departemen</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            >
              <option value="all">Semua Role</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <Filter className="w-4 h-4" />
              {filteredMembers.length} dari {teamMembers.length} anggota
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm mb-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMember ? 'Edit Anggota Tim' : 'Tambah Anggota Tim Baru'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddForm(false)
                  setEditingMember(null)
                  setNewMember({
                    name: "",
                    employeeId: "",
                    email: "",
                    phone: "",
                    department: "",
                    position: "",
                    role: "member",
                    joinDate: "",
                    location: "",
                    status: "active"
                  })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Nama Lengkap *</label>
                <input
                  type="text"
                  value={newMember.name || ""}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Team ID *</label>
                <input
                  type="text"
                  value={newMember.employeeId || ""}
                  onChange={(e) => setNewMember({...newMember, employeeId: e.target.value})}
                  placeholder="TM001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Email *</label>
                <input
                  type="email"
                  value={newMember.email || ""}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="nama@pupukkujang.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">No. Telepon</label>
                <input
                  type="text"
                  value={newMember.phone || ""}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Departemen</label>
                <select 
                  value={newMember.department || ""} 
                  onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Pilih departemen</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Role Tim</label>
                <select 
                  value={newMember.role || ""} 
                  onChange={(e) => setNewMember({...newMember, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Posisi</label>
                <input
                  type="text"
                  value={newMember.position || ""}
                  onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Tanggal Bergabung</label>
                <input
                  type="date"
                  value={newMember.joinDate || ""}
                  onChange={(e) => setNewMember({...newMember, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Lokasi</label>
                <input
                  type="text"
                  value={newMember.location || ""}
                  onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                  placeholder="Cikampek"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">Status</label>
                <select 
                  value={newMember.status || ""} 
                  onChange={(e) => setNewMember({...newMember, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button 
                onClick={editingMember ? handleUpdateMember : handleAddMember}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                {editingMember ? 'Update Anggota' : 'Tambah Anggota'}
              </button>
            </div>
          </div>
        )}

        {/* Team Members List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filteredMembers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Tidak ada data anggota tim
              </h3>
              <p className="text-gray-600">
                {searchQuery || departmentFilter !== "all" || roleFilter !== "all"
                  ? "Coba ubah filter pencarian" 
                  : "Belum ada data anggota tim yang ditambahkan"
                }
              </p>
            </div>
          ) : (
            <>
              {/* Table Header - Desktop Only */}
              <div className="hidden lg:block">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    <div className="col-span-3">Anggota</div>
                    <div className="col-span-2">Departemen</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Kontak</div>
                    <div className="col-span-1 text-center">Aksi</div>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredMembers.map((member) => {
                  const RoleIcon = getRoleIcon(member.role)
                  const isExpanded = expandedMember === member.id
                  
                  return (
                    <div key={member.id} className="hover:bg-gray-50 transition-colors">
                      {/* Mobile Layout - Fixed responsive design */}
                      <div className="lg:hidden p-4">
                        <div className="space-y-4">
                          {/* Header with Avatar and Actions */}
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                              <span className="text-white font-bold text-sm">
                                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            
                            {/* Name and Title */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {member.name}
                              </h3>
                              <p className="text-sm font-medium text-gray-700 mb-1">{member.position}</p>
                              <p className="text-xs text-gray-500">{member.employeeId}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={() => handleEditMember(member)}
                                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Department and Role Badges */}
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border border-purple-200">
                              <Building2 className="w-3.5 h-3.5" />
                              <span className="text-sm font-medium">{member.department}</span>
                            </div>
                            <span className={`text-sm px-3 py-1.5 border rounded-full ${getRoleBadgeColor(member.role)} flex items-center gap-1.5 font-medium`}>
                              <RoleIcon className="w-3.5 h-3.5" />
                              {getRoleLabel(member.role)}
                            </span>
                            <span className={`text-sm px-3 py-1.5 border rounded-full ${getStatusBadgeColor(member.status)} font-medium`}>
                              {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </div>
                          
                          {/* Contact Information */}
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-gray-700 font-medium break-all">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700 font-medium">{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                              <span className="text-gray-600">{member.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                              <span className="text-gray-600">Bergabung {formatDate(member.joinDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:block px-6 py-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Member Info */}
                          <div className="col-span-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                                <p className="text-sm text-gray-600 truncate">{member.position}</p>
                                <p className="text-xs text-gray-500">{member.employeeId}</p>
                              </div>
                            </div>
                          </div>

                          {/* Department */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{member.department}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {member.location}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Role */}
                          <div className="col-span-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium border rounded-full ${getRoleBadgeColor(member.role)}`}>
                              <RoleIcon className="w-3 h-3" />
                              {getRoleLabel(member.role)}
                            </span>
                          </div>

                          {/* Status */}
                          <div className="col-span-2">
                            <div>
                              <span className={`inline-flex items-center px-3 py-1 text-sm font-medium border rounded-full ${getStatusBadgeColor(member.status)}`}>
                                {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                              </span>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(member.joinDate)}
                              </p>
                            </div>
                          </div>

                          {/* Contact */}
                          <div className="col-span-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-gray-700">
                                <Mail className="w-3 h-3 text-blue-500" />
                                <span className="truncate font-medium">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-700">
                                <Phone className="w-3 h-3 text-green-500" />
                                <span className="font-medium">{member.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1">
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={() => handleEditMember(member)}
                                className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}