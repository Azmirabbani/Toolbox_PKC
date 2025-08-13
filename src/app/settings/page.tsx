"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  ArrowLeft,
  Check
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  avatar: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  meetingReminders: boolean;
  dailyDigest: boolean;
  soundEnabled: boolean;
  reminderTime: number; // minutes before meeting
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12' | '24';
  autoSave: boolean;
  compactView: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  shareCalendar: boolean;
}

export default function MeetingSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@company.com',
    phone: '+62 812-3456-7890',
    position: 'Production Manager',
    department: 'Operations',
    location: 'Jakarta, Indonesia',
    avatar: 'AR'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    meetingReminders: true,
    dailyDigest: false,
    soundEnabled: true,
    reminderTime: 15
  });

  const [preferences, setPreferences] = useState<AppPreferences>({
    theme: 'system',
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    autoSave: true,
    compactView: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'team',
    showOnlineStatus: true,
    allowDirectMessages: true,
    shareCalendar: false
  });

  const handleSave = () => {
    // Simulate saving
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'preferences', label: 'Preferensi', icon: Palette },
    { id: 'privacy', label: 'Privasi', icon: Shield }
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }: any) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-gray-900 text-sm">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SelectField = ({ label, value, onChange, options }: any) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const ProfileSection = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">{userProfile.avatar}</span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{userProfile.name}</h3>
          <p className="text-gray-600">{userProfile.position}</p>
          <p className="text-sm text-gray-500">{userProfile.department}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            value={userProfile.name}
            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Jabatan</label>
          <input
            type="text"
            value={userProfile.position}
            onChange={(e) => setUserProfile({...userProfile, position: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={userProfile.phone}
              onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            value={userProfile.department}
            onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Lokasi</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={userProfile.location}
              onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationsSection = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <Bell className="w-5 h-5" />
          <h4 className="font-medium">Pengaturan Notifikasi</h4>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Atur bagaimana Anda ingin menerima pemberitahuan tentang meeting dan aktivitas lainnya.
        </p>
      </div>

      <div className="space-y-1">
        <ToggleSwitch
          enabled={notifications.emailNotifications}
          onChange={(value: boolean) => setNotifications({...notifications, emailNotifications: value})}
          label="Email Notifications"
          description="Terima notifikasi melalui email"
        />
        
        <ToggleSwitch
          enabled={notifications.pushNotifications}
          onChange={(value: boolean) => setNotifications({...notifications, pushNotifications: value})}
          label="Push Notifications"
          description="Notifikasi langsung di browser atau aplikasi"
        />
        
        <ToggleSwitch
          enabled={notifications.meetingReminders}
          onChange={(value: boolean) => setNotifications({...notifications, meetingReminders: value})}
          label="Meeting Reminders"
          description="Pengingat sebelum meeting dimulai"
        />
        
        <ToggleSwitch
          enabled={notifications.dailyDigest}
          onChange={(value: boolean) => setNotifications({...notifications, dailyDigest: value})}
          label="Daily Digest"
          description="Ringkasan harian meeting dan aktivitas"
        />
        
        <ToggleSwitch
          enabled={notifications.soundEnabled}
          onChange={(value: boolean) => setNotifications({...notifications, soundEnabled: value})}
          label="Sound Notifications"
          description="Suara notifikasi untuk peringatan"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Waktu Pengingat (menit sebelum meeting)</label>
        <select
          value={notifications.reminderTime}
          onChange={(e) => setNotifications({...notifications, reminderTime: parseInt(e.target.value)})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value={5}>5 menit</option>
          <option value={10}>10 menit</option>
          <option value={15}>15 menit</option>
          <option value={30}>30 menit</option>
          <option value={60}>1 jam</option>
        </select>
      </div>
    </div>
  );

  const PreferencesSection = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800">
          <Palette className="w-5 h-5" />
          <h4 className="font-medium">Preferensi Aplikasi</h4>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Sesuaikan tampilan dan pengalaman menggunakan aplikasi sesuai preferensi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Tema"
          value={preferences.theme}
          onChange={(value: string) => setPreferences({...preferences, theme: value as any})}
          options={[
            { value: 'light', label: 'Terang' },
            { value: 'dark', label: 'Gelap' },
            { value: 'system', label: 'Ikuti Sistem' }
          ]}
        />

        <SelectField
          label="Bahasa"
          value={preferences.language}
          onChange={(value: string) => setPreferences({...preferences, language: value})}
          options={[
            { value: 'id', label: 'Bahasa Indonesia' },
            { value: 'en', label: 'English' }
          ]}
        />

        <SelectField
          label="Zona Waktu"
          value={preferences.timezone}
          onChange={(value: string) => setPreferences({...preferences, timezone: value})}
          options={[
            { value: 'Asia/Jakarta', label: 'WIB (Jakarta)' },
            { value: 'Asia/Makassar', label: 'WITA (Makassar)' },
            { value: 'Asia/Jayapura', label: 'WIT (Jayapura)' }
          ]}
        />

        <SelectField
          label="Format Tanggal"
          value={preferences.dateFormat}
          onChange={(value: string) => setPreferences({...preferences, dateFormat: value})}
          options={[
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
          ]}
        />

        <SelectField
          label="Format Waktu"
          value={preferences.timeFormat}
          onChange={(value: string) => setPreferences({...preferences, timeFormat: value as any})}
          options={[
            { value: '24', label: '24 Jam (14:30)' },
            { value: '12', label: '12 Jam (2:30 PM)' }
          ]}
        />
      </div>

      <div className="space-y-1">
        <ToggleSwitch
          enabled={preferences.autoSave}
          onChange={(value: boolean) => setPreferences({...preferences, autoSave: value})}
          label="Auto Save"
          description="Simpan otomatis perubahan pada notulensi"
        />
        
        <ToggleSwitch
          enabled={preferences.compactView}
          onChange={(value: boolean) => setPreferences({...preferences, compactView: value})}
          label="Compact View"
          description="Tampilan lebih ringkas untuk daftar meeting"
        />
      </div>
    </div>
  );

  const PrivacySection = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <Shield className="w-5 h-5" />
          <h4 className="font-medium">Pengaturan Privasi</h4>
        </div>
        <p className="text-red-700 text-sm mt-1">
          Kelola informasi pribadi Anda dan siapa yang dapat melihat aktivitas Anda.
        </p>
      </div>

      <SelectField
        label="Visibilitas Profil"
        value={privacy.profileVisibility}
        onChange={(value: string) => setPrivacy({...privacy, profileVisibility: value as any})}
        options={[
          { value: 'public', label: 'Publik - Semua dapat melihat' },
          { value: 'team', label: 'Tim - Hanya anggota tim' },
          { value: 'private', label: 'Privat - Hanya saya' }
        ]}
      />

      <div className="space-y-1">
        <ToggleSwitch
          enabled={privacy.showOnlineStatus}
          onChange={(value: boolean) => setPrivacy({...privacy, showOnlineStatus: value})}
          label="Tampilkan Status Online"
          description="Orang lain dapat melihat kapan Anda online"
        />
        
        <ToggleSwitch
          enabled={privacy.allowDirectMessages}
          onChange={(value: boolean) => setPrivacy({...privacy, allowDirectMessages: value})}
          label="Izinkan Pesan Langsung"
          description="Terima pesan langsung dari rekan kerja"
        />
        
        <ToggleSwitch
          enabled={privacy.shareCalendar}
          onChange={(value: boolean) => setPrivacy({...privacy, shareCalendar: value})}
          label="Bagikan Kalender"
          description="Orang lain dapat melihat jadwal meeting Anda"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSection />;
      case 'notifications': return <NotificationsSection />;
      case 'preferences': return <PreferencesSection />;
      case 'privacy': return <PrivacySection />;
      default: return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-green-200 px-4 py-4 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Pengaturan</h1>
                <p className="text-sm text-gray-600">Kelola profil dan preferensi Anda</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saved}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 text-sm lg:text-base ${
              saved 
                ? 'bg-green-100 text-green-700 cursor-default' 
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Tersimpan
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 lg:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}