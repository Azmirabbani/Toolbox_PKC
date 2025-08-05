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
  X
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
        return 'bg-green-100 text-green-800 border-green-200'
      case 'coordinator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const filteredMembers = getFilteredMembers()
  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const leaders = teamMembers.filter(m => m.role === 'leader').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tim Management</h1>
                <p className="text-gray-600">Kelola anggota tim dan struktur organisasi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4" />
                  {activeMembers} Aktif
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  <Shield className="w-4 h-4" />
                  {leaders} Leader
                </div>
              </div>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Anggota
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama, ID, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua Departemen</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua Role</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              {filteredMembers.length} dari {teamMembers.length} anggota
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
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
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={newMember.name || ""}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Team ID *</label>
                <input
                  type="text"
                  value={newMember.employeeId || ""}
                  onChange={(e) => setNewMember({...newMember, employeeId: e.target.value})}
                  placeholder="TM001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={newMember.email || ""}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="nama@pupukkujang.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">No. Telepon</label>
                <input
                  type="text"
                  value={newMember.phone || ""}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Departemen</label>
                <select 
                  value={newMember.department || ""} 
                  onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih departemen</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Role Tim</label>
                <select 
                  value={newMember.role || ""} 
                  onChange={(e) => setNewMember({...newMember, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Posisi</label>
                <input
                  type="text"
                  value={newMember.position || ""}
                  onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal Bergabung</label>
                <input
                  type="date"
                  value={newMember.joinDate || ""}
                  onChange={(e) => setNewMember({...newMember, joinDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Lokasi</label>
                <input
                  type="text"
                  value={newMember.location || ""}
                  onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                  placeholder="Cikampek"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select 
                  value={newMember.status || ""} 
                  onChange={(e) => setNewMember({...newMember, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button 
                onClick={editingMember ? handleUpdateMember : handleAddMember}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingMember ? 'Update Anggota' : 'Tambah Anggota'}
              </button>
            </div>
          </div>
        )}

        {/* Team Members List */}
        <div className="grid gap-4">
          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Tidak ada data anggota tim
              </h3>
              <p className="text-gray-500">
                {searchQuery || departmentFilter !== "all" || roleFilter !== "all"
                  ? "Coba ubah filter pencarian" 
                  : "Belum ada data anggota tim yang ditambahkan"
                }
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role)
              return (
                <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 border rounded-full bg-gray-50 text-gray-700">
                            {member.employeeId}
                          </span>
                          <span className={`text-xs px-2 py-1 border rounded-full ${getRoleBadgeColor(member.role)} flex items-center gap-1`}>
                            <RoleIcon className="w-3 h-3" />
                            {getRoleLabel(member.role)}
                          </span>
                          <span className={`text-xs px-2 py-1 border rounded-full ${getStatusBadgeColor(member.status)}`}>
                            {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          {member.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-500" />
                          {member.department}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-500" />
                          {member.position}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {member.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          {formatDate(member.joinDate)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="px-3 py-1.5 text-sm border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}