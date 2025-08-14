"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
  Save,
  Check,
  Sun,
  Moon,
  Monitor,
  Volume2,
} from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

interface NotificationSettings {
  inApp: boolean;
  sound: boolean;
  meetingReminders: boolean;
  reminderTime: number;
}

/* Toggle */
const ToggleSwitch = ({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <div className="font-medium text-gray-900 text-sm">{label}</div>
      {description && (
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      )}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#009a44]" : "bg-gray-300"
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

/* Theme helpers */
const THEME_STORAGE_KEY = "toolbox-theme";
function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const setDark = (on: boolean) => {
    root.classList.toggle("dark", on);
    root.setAttribute("data-theme", on ? "dark" : "light");
  };
  if (mode === "system") setDark(media.matches);
  else setDark(mode === "dark");
}
function useTheme(): [ThemeMode, (m: ThemeMode) => void] {
  const [theme, setTheme] = useState<ThemeMode>("system");
  useEffect(() => {
    const saved =
      (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || "system";
    setTheme(saved);
    applyTheme(saved);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current =
        (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || "system";
      if (current === "system") applyTheme("system");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);
  const update = (m: ThemeMode) => {
    setTheme(m);
    localStorage.setItem(THEME_STORAGE_KEY, m);
    applyTheme(m);
  };
  return [theme, update];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "appearance">(
    "notifications"
  );
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    inApp: true,
    sound: true,
    meetingReminders: true,
    reminderTime: 15,
  });
  const [theme, setTheme] = useTheme();

  const tabs = useMemo(
    () =>
      [
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "appearance", label: "Theme", icon: Palette },
      ] as const,
    []
  );

  const handleSave = () => {
    localStorage.setItem(
      "toolbox-notifications",
      JSON.stringify(notifications)
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const ThemeCard = ({
    mode,
    title,
    icon: Icon,
  }: {
    mode: ThemeMode;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const selected = theme === mode;
    return (
      <button
        onClick={() => setTheme(mode)}
        className={[
          "w-full rounded-xl border p-4 text-left transition-all",
          selected
            ? "border-[#009a44] ring-2 ring-[#009a44]/30 bg-[#009a44]/5"
            : "border-gray-200 hover:border-[#009a44] hover:bg-[#009a44]/10",
        ].join(" ")}
        aria-pressed={selected}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#009a44] to-[#007d37] text-white">
            <Icon className="w-5 h-5" />
          </div>
          <div className="font-medium text-gray-900">{title}</div>
        </div>
      </button>
    );
  };

  const NotificationsSection = () => (
    <div className="space-y-6">
      <div className="bg-[#FFD500]/15 border border-[#FFD500]/30 rounded-xl p-4">
        <div className="flex items-center gap-2 text-[#6b5d00]">
          <Bell className="w-5 h-5" />
          <h4 className="font-medium">Pengaturan Notifikasi</h4>
        </div>
        <p className="text-[#6b5d00] text-sm mt-1">
          Atur bagaimana aplikasi memberikan pemberitahuan.
        </p>
      </div>

      <div className="space-y-1">
        <ToggleSwitch
          enabled={notifications.inApp}
          onChange={(v) => setNotifications({ ...notifications, inApp: v })}
          label="In‑app Notifications"
          description="Tampilkan notifikasi di icon lonceng"
        />
        <ToggleSwitch
          enabled={notifications.sound}
          onChange={(v) => setNotifications({ ...notifications, sound: v })}
          label="Sound"
          description="Bunyikan suara saat notifikasi masuk"
        />
        <ToggleSwitch
          enabled={notifications.meetingReminders}
          onChange={(v) =>
            setNotifications({ ...notifications, meetingReminders: v })
          }
          label="Meeting Reminders"
          description="Pengingat sebelum meeting dimulai"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Waktu pengingat (menit sebelum meeting)
        </label>
        <select
          value={notifications.reminderTime}
          onChange={(e) =>
            setNotifications({
              ...notifications,
              reminderTime: parseInt(e.target.value, 10),
            })
          }
          className="
            w-full p-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-[#009a44] focus:border-[#009a44]
            disabled:text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-100
            text-gray-900
          "
          disabled={!notifications.meetingReminders}
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

  const ThemeSection = () => (
    <div className="space-y-6">
      <div className="bg-[#009a44]/5 border border-[#009a44]/20 rounded-xl p-4">
        <div className="flex items-center gap-2 text-[#00642d]">
          <Palette className="w-5 h-5" />
          <h4 className="font-medium">Tema Aplikasi</h4>
        </div>
        <p className="text-[#00642d] text-sm mt-1">
          Pilih tampilan terang, gelap, atau mengikuti sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ThemeCard mode="light" title="Light" icon={Sun} />
        <ThemeCard mode="dark" title="Dark" icon={Moon} />
        <ThemeCard mode="system" title="System" icon={Monitor} />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Volume2 className="w-4 h-4" />
        <span>
          Tip: Jika tema diset ke <b>System</b>, aplikasi akan mengikuti
          pengaturan OS secara otomatis.
        </span>
      </div>
    </div>
  );

  const renderContent = () =>
    activeTab === "notifications" ? <NotificationsSection /> : <ThemeSection />;

  return (
    <div className="min-h-full bg-gradient-to-br from-[#f4fbf7] via-[#fffbea] to-[#e9f8f0]">
      {/* Header lokal: STICKY di atas area main (scroll container) */}
      <div
        className="
          sticky top-0 z-10
          bg-white/90 backdrop-blur-md border-b border-[#009a44]/20
          px-4 py-4
          shadow-[0_6px_24px_-12px_rgba(0,0,0,0.12)]
        "
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#009a44] to-[#007d37] rounded-xl">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Pengaturan
              </h1>
              <p className="text-sm text-gray-600">
                Fokus pada notifikasi & tema
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saved}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 text-sm lg:text-base ${
              saved
                ? "bg-[#009a44]/10 text-[#009a44] cursor-default"
                : "bg-gradient-to-r from-[#009a44] to-[#007d37] hover:from-[#007d37] hover:to-[#00642d] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
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

      {/* Body: kasih padding-top kecil supaya konten gak “nempel” header */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6 pt-4 lg:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left nav */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[#009a44]/15 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-[#009a44] to-[#007d37] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-50"
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
            <div className="bg-white rounded-2xl shadow-sm border border-[#009a44]/15 p-6 lg:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
