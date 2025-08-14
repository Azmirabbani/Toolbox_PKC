"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Users,
  Plus,
  Edit3,
  Download,
  X,
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

/* ========= Types ========= */
type MeetingStatus = "scheduled" | "ongoing" | "completed";
interface Participant {
  id: string | number;
  name: string;
  department?: string;
  role?: string;
  avatar: string;
  attended?: boolean;
}
interface AgendaItem {
  id: string | number;
  title: string;
  notes?: string;
  needsFollowUp?: boolean;
  followUpDate?: string;
  completed?: boolean;
}
interface Meeting {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // "HH:mm - HH:mm" / "HH:mm"
  status: MeetingStatus;
  participants: Participant[];
  notes: string;
  agenda: AgendaItem[];
  generalNotes?: string;
  startTime?: string;
  endTime?: string;
}

type CreateDraft = {
  title: string;
  date: string;
  time: string;
  agenda: { id: string; title: string; completed: boolean }[];
  participants: Participant[];
};

/* ========= Utils ========= */
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

const fmtDateID = (d: string | Date, withWeekday = false) =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: withWeekday ? "long" : undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const localISODate = (d = new Date()) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const makeId = () =>
  (typeof crypto !== "undefined" && (crypto as any)?.randomUUID?.()) ||
  String(Date.now() + Math.random());

const startOfRange = (s: string) => s?.split("-")[0]?.trim() ?? "";

/* ========= Master Data ========= */
const DEPARTMENTS: Record<string, string[]> = {
  "Teknologi Informasi": ["Azmi", "Abdul", "Rehan", "Radya"],
  "Pengadaan Jasa & Barang": ["Moses", "Krisna"],
  Keuangan: ["Nova", "Luna", "Rine"],
};

const LOGO_URL = "/Logo_kujang.jpg";

/* ========= Status Badge ========= */
const statusConfig: Record<
  MeetingStatus,
  { text: string; tone: string; icon: React.ComponentType<any> }
> = {
  completed: {
    text: "Selesai",
    tone: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  ongoing: {
    text: "Berlangsung",
    tone: "bg-yellow-100 text-yellow-700",
    icon: PlayCircle,
  },
  scheduled: {
    text: "Terjadwal",
    tone: "bg-blue-100 text-blue-700",
    icon: Clock,
  },
};

const StatusBadge = ({ status }: { status: MeetingStatus }) => {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${cfg.tone}`}
    >
      <Icon className="w-4 h-4" />
      {cfg.text}
    </span>
  );
};

/* ========= Primitives ========= */
const Modal = ({
  title,
  onClose,
  children,
  size = "default",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "default" | "large";
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div
      className={`bg-white rounded-2xl p-6 w-full ${
        size === "large" ? "max-w-4xl" : "max-w-2xl"
      } max-h-[90vh] overflow-y-auto shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const CTAButton = ({
  onClick,
  children = "Buat Meeting Baru",
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="relative inline-flex items-center gap-3 rounded-2xl px-5 sm:px-6 py-3 sm:py-3.5
               bg-gradient-to-r from-emerald-500 via-green-500 to-yellow-500 text-white font-semibold
               shadow-[0_8px_20px_rgba(16,185,129,.35)]
               transition-all hover:shadow-[0_12px_26px_rgba(16,185,129,.45)]
               hover:-translate-y-0.5 active:translate-y-0"
  >
    <span className="grid place-items-center w-7 h-7 rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
      <Plus className="w-4 h-4" />
    </span>
    <span>{children}</span>
  </button>
);

const ProgressIndicator = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: string[];
}) => (
  <div className="flex items-center gap-2 mb-6">
    {steps.map((step, index) => (
      <React.Fragment key={index}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
            index <= currentStep
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index <= currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index < currentStep ? "✓" : index + 1}
          </div>
          {step}
        </div>
        {index < steps.length - 1 && (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </React.Fragment>
    ))}
  </div>
);

const ParticipantCard = ({ participant }: { participant: Participant }) => (
  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl border border-green-100">
    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
      <span className="text-white font-medium text-sm">
        {participant.avatar}
      </span>
    </div>
    <div>
      <div className="font-medium text-gray-900 text-sm">
        {participant.name}
      </div>
      <div className="text-xs text-gray-600">
        {participant.department || "-"}
      </div>
    </div>
  </div>
);

/* ========= Meeting Card ========= */
const MeetingCard = ({
  meeting,
  onOpen,
  onStart,
  onEdit,
  onNotulen,
}: {
  meeting: Meeting;
  onOpen: () => void;
  onStart: () => void;
  onEdit: () => void;
  onNotulen: () => void;
}) => {
  const done = meeting.agenda.filter((a) => a.completed).length;
  const total = meeting.agenda.length || 1;
  const pct = Math.round((done / total) * 100);
  const hasFollowup = meeting.agenda.some((a) => a.needsFollowUp);

  return (
    <div
      id={`meeting-${meeting.id}`}
      className="group relative p-4 sm:p-5 hover:bg-gradient-to-r from-green-50/60 to-yellow-50/40 transition"
      onClick={onOpen}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r bg-gradient-to-b from-green-400 to-yellow-400 opacity-60" />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 break-words">
              {meeting.title}
            </h3>
            {hasFollowup && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Perlu follow-up
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {fmtDateID(meeting.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {meeting.time}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-green-600" />
              {meeting.participants.length} peserta
            </span>
          </div>
          <div className="mt-3 w-full">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              {done}/{total} agenda selesai
            </div>
          </div>
          <div className="mt-3">
            <div className="flex -space-x-2 items-center">
              {meeting.participants.slice(0, 3).map((p) => (
                <div
                  key={String(p.id)}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 text-white flex items-center justify-center text-[10px] font-semibold ring-2 ring-white"
                  title={p.name}
                >
                  {p.avatar}
                </div>
              ))}
              {meeting.participants.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-semibold ring-2 ring-white">
                  +{meeting.participants.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <StatusBadge status={meeting.status} />
          <div
            className="flex flex-wrap items-center gap-2 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {meeting.status === "scheduled" && (
              <button
                onClick={onStart}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Mulai
              </button>
            )}
            {meeting.status === "ongoing" && (
              <button
                onClick={onOpen}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Lanjut
              </button>
            )}
            {meeting.status === "completed" && (
              <button
                onClick={onNotulen}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
              >
                Notulensi
              </button>
            )}
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========= Page ========= */
export default function MeetingsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [currentView, setCurrentView] = useState<
    "list" | "detail" | "ongoing" | "completed"
  >("list");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  type FilterKey = "all" | "today" | "upcoming" | "ongoing" | "completed";
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  // responsive
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const onChange = (ev: MediaQueryListEvent) => setIsMobile(ev.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* ===== Seed data pakai DEPARTMENTS ===== */
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      title: "Weekly Production Review",
      date: "2025-08-07",
      time: "10:30 - 11:30",
      status: "completed",
      participants: [
        {
          id: "TI:Azmi",
          name: "Azmi",
          department: "Teknologi Informasi",
          avatar: initials("Azmi"),
          attended: true,
        },
        {
          id: "KEU:Nova",
          name: "Nova",
          department: "Keuangan",
          avatar: initials("Nova"),
          attended: true,
        },
        {
          id: "PJB:Krisna",
          name: "Krisna",
          department: "Pengadaan Jasa & Barang",
          avatar: initials("Krisna"),
          attended: false,
        },
      ],
      notes:
        "Diskusi mengenai target produksi bulan ini. Kualitas produk sudah mencapai 98%. Perlu perbaikan di line 3 untuk minggu depan.",
      agenda: [
        {
          id: 1,
          title: "Review target produksi",
          notes: "Target tercapai 95%, perlu peningkatan efisiensi.",
          completed: true,
        },
        {
          id: 2,
          title: "Analisis kualitas",
          notes: "Kualitas mencapai 98%, excellent performance.",
          completed: true,
        },
        {
          id: 3,
          title: "Issue mesin line 3",
          notes: "Perlu maintenance mendesak, dijadwalkan Jumat.",
          needsFollowUp: true,
          followUpDate: "2025-08-15",
          completed: false,
        },
        {
          id: 4,
          title: "Planning minggu depan",
          notes: "Target produksi ditingkatkan 5%.",
          completed: true,
        },
      ],
      startTime: "10:30",
      endTime: "11:25",
    },
    {
      id: 2,
      title: "Safety Committee Meeting",
      date: "2025-08-12",
      time: "14:00 - 15:00",
      status: "scheduled",
      participants: [
        {
          id: "PJB:Moses",
          name: "Moses",
          department: "Pengadaan Jasa & Barang",
          avatar: initials("Moses"),
        },
        {
          id: "KEU:Luna",
          name: "Luna",
          department: "Keuangan",
          avatar: initials("Luna"),
        },
      ],
      notes: "",
      agenda: [
        { id: 5, title: "Review incident report", completed: false },
        { id: 6, title: "Safety training schedule", completed: false },
        { id: 7, title: "New safety equipment", completed: false },
      ],
    },
    {
      id: 3,
      title: "Monthly Strategy Review",
      date: "2025-08-11",
      time: "09:00 - 10:30",
      status: "ongoing",
      participants: [
        {
          id: "TI:Abdul",
          name: "Abdul",
          department: "Teknologi Informasi",
          avatar: initials("Abdul"),
          attended: true,
        },
        {
          id: "TI:Rehan",
          name: "Rehan",
          department: "Teknologi Informasi",
          avatar: initials("Rehan"),
          attended: true,
        },
        {
          id: "KEU:Rine",
          name: "Rine",
          department: "Keuangan",
          avatar: initials("Rine"),
          attended: true,
        },
      ],
      notes: "",
      agenda: [
        {
          id: 8,
          title: "Q3 Performance Review",
          notes: "Revenue naik 15% dari target",
          completed: true,
        },
        { id: 9, title: "Budget Planning Q4", notes: "", completed: false },
        { id: 10, title: "Strategic Initiatives", notes: "", completed: false },
      ],
      startTime: "09:00",
    },
  ]);

  const today = localISODate();

  // derived for strip
  const liveMeeting = useMemo(
    () => meetings.find((m) => m.status === "ongoing"),
    [meetings]
  );
  const nextMeeting = useMemo(() => {
    const upcoming = meetings
      .filter(
        (m) => m.status === "scheduled" && new Date(m.date) >= new Date(today)
      )
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
    return upcoming[0];
  }, [meetings, today]);
  const followUpsCount = useMemo(
    () =>
      meetings
        .filter((m) => m.status === "completed")
        .flatMap((m) => m.agenda.filter((a) => a.needsFollowUp)).length,
    [meetings]
  );

  // filter & search
  const filteredMeetings = useMemo(() => {
    let list = [...meetings];
    if (filter === "today") list = list.filter((m) => m.date === today);
    if (filter === "upcoming")
      list = list.filter(
        (m) => m.status === "scheduled" && new Date(m.date) >= new Date(today)
      );
    if (filter === "ongoing") list = list.filter((m) => m.status === "ongoing");
    if (filter === "completed")
      list = list.filter((m) => m.status === "completed");
    if (query.trim())
      list = list.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
    list.sort((a, b) => {
      if (a.status === "ongoing" && b.status !== "ongoing") return -1;
      if (b.status === "ongoing" && a.status !== "ongoing") return 1;
      return +new Date(a.date) - +new Date(b.date);
    });
    return list;
  }, [meetings, filter, query, today]);

  /* ===== Read ?id= from URL to open the meeting directly ===== */
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    const target =
      meetings.find((m) => String(m.id) === id) ||
      meetings.find((m) => m.status === "ongoing");

    if (!target) return;

    setSelectedMeeting(target);
    setCurrentView(
      target.status === "ongoing"
        ? "ongoing"
        : target.status === "completed"
        ? "completed"
        : "detail"
    );
  }, [searchParams, meetings]);

  // Optional: if still on list view, scroll-highlight card
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id || selectedMeeting) return;
    const el = document.getElementById(`meeting-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-yellow-400", "animate-pulse");
    const t = window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-yellow-400", "animate-pulse");
    }, 1500);
    return () => {
      window.clearTimeout(t);
    };
  }, [searchParams, selectedMeeting]);

  /* ===== Handlers ===== */
  const handleMeetingSelect = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setCurrentView(
      meeting.status === "ongoing"
        ? "ongoing"
        : meeting.status === "completed"
        ? "completed"
        : "detail"
    );
  };

  const handleStartMeeting = (meeting: Meeting) => {
    const updated = {
      ...meeting,
      status: "ongoing" as MeetingStatus,
      startTime: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMeetings((prev) => prev.map((m) => (m.id === meeting.id ? updated : m)));
    setSelectedMeeting(updated);
    setCurrentView("ongoing");
  };

  const handleCompleteMeeting = () => {
    if (!selectedMeeting) return;
    const updated = {
      ...selectedMeeting,
      status: "completed" as MeetingStatus,
      endTime: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSelectedMeeting(updated);
    setCurrentView("completed");
  };

  /* ===== Export PDF + logo center ===== */
  async function toDataURL(url: string): Promise<string> {
    try {
      const res = await fetch(url, { cache: "no-store" });
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  }

  const exportToPDF = async () => {
    if (!selectedMeeting) return;
    const m = selectedMeeting;
    const attended = m.participants.filter((p) => p.attended);
    const doneAgendas = m.agenda.filter((a) => a.completed);
    const followUps = m.agenda.filter((a) => a.needsFollowUp);
    const dateStr = fmtDateID(m.date);

    const logoData = await toDataURL(LOGO_URL);
    const w = window.open("", "_blank");
    if (!w) return;

    w.document.write(`
<!DOCTYPE html><html><head><meta charset="UTF-8" />
<title>Notulensi - ${m.title}</title>
<style>
  :root{ --fg:#111; --muted:#666; --line:#222; }
  html,body{-webkit-print-color-adjust:exact; print-color-adjust:exact;}
  @page{ size:A4; margin: 18mm 16mm; }
  body{ font: 12.5px/1.55 Arial, Helvetica, sans-serif; color:var(--fg); }
  .brand{ display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; }
  .brand .logo img{ height:56px; width:auto; display:block; }
  .brand .title{ margin:0; font-size:24px; font-weight:800; letter-spacing:.2px; }
  .brand .subtitle{ margin:2px 0 0 0; color:#444; }
  .brand .meta{ color:#555; margin-top:2px; }
  .rule{ height:1.5px; background: var(--fg); margin: 14px 0 12px; }
  .section{ margin:16px 0 0; page-break-inside:avoid; }
  .sec-title{ font-weight:800; font-size:14px; letter-spacing:.3px; border-bottom:1.5px solid var(--line); padding-bottom:6px; margin:0 0 8px; }
  ul{ margin:6px 0 0 18px; padding:0; } ul li{ margin:3px 0; }
  ol.agenda{ margin:6px 0 0 18px; padding:0; } ol.agenda>li{ margin:6px 0; }
  table.follow{ width:100%; border-collapse:collapse; margin-top:6px; }
  table.follow th, table.follow td{ border:1px solid #333; padding:6px 8px; vertical-align:top; }
  table.follow th{ background:#f3f3f3; font-weight:700; text-align:left; }
  .notes{ background:#f8f8f8; padding:10px 12px; border:1px solid #ddd; border-radius:6px; }
  .footer{ color:var(--muted); text-align:center; margin-top:22px; font-size:11px; }
</style>
</head>
<body>
  <div class="brand">
    ${
      logoData
        ? `<div class="logo"><img src="${logoData}" alt="Logo" /></div>`
        : ""
    }
    <div>
      <h1 class="title">NOTULENSI RAPAT</h1>
      <div class="subtitle">${m.title}</div>
      <div class="meta">${dateStr} | ${m.startTime || m.time} - ${
      m.endTime || "Belum selesai"
    }</div>
    </div>
  </div>
  <div class="rule"></div>

  <div class="section">
    <div class="sec-title">PESERTA HADIR</div>
    ${
      attended.length
        ? `<ul>${attended
            .map((p) => `<li>${p.name} (${p.department ?? "-"})</li>`)
            .join("")}</ul>`
        : `<div>• Belum ada peserta yang hadir</div>`
    }
  </div>

  <div class="section">
    <div class="sec-title">AGENDA YANG DIBAHAS</div>
    ${
      doneAgendas.length
        ? `<ol class="agenda">${doneAgendas
            .map(
              (a) =>
                `<li><div>${a.title}</div><div><b>Hasil:</b> ${
                  a.notes || "Tidak ada catatan khusus."
                }</div></li>`
            )
            .join("")}</ol>`
        : `<div>Belum ada agenda yang diselesaikan</div>`
    }
  </div>

  ${
    followUps.length
      ? `<div class="section">
           <div class="sec-title">TINDAK LANJUT</div>
           <table class="follow">
             <thead><tr><th style="width:32px;">No</th><th>Agenda</th><th style="width:140px;">Target</th><th>Catatan</th></tr></thead>
             <tbody>
               ${followUps
                 .map(
                   (a, i) =>
                     `<tr>
                        <td>${i + 1}</td>
                        <td>${a.title}</td>
                        <td>${
                          a.followUpDate
                            ? new Date(a.followUpDate).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "TBD"
                        }</td>
                        <td>${a.notes || "-"}</td>
                      </tr>`
                 )
                 .join("")}
             </tbody>
           </table>
         </div>`
      : ""
  }

  ${
    m.notes
      ? `<div class="section"><div class="sec-title">CATATAN UMUM & NOTULENSI</div><div class="notes">${m.notes.replace(
          /\n/g,
          "<br/>"
        )}</div></div>`
      : ""
  }

  <div class="footer">
    Dokumen ini dibuat otomatis pada ${new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>

  <script>
    window.addEventListener('load', function(){
      setTimeout(function(){ window.print(); setTimeout(function(){ window.close(); }, 300); }, 80);
    });
  </script>
</body></html>`);
    w.document.close();
    w.focus();
  };

  /* ===== Form helpers ===== */
  const FormInput = ({
    type,
    value,
    onChange,
    placeholder,
    className = "",
  }: {
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
  }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 ${className}`}
      autoComplete="off"
    />
  );

  type ParticipantRow = { id: string; department: string; name: string };
  const rowsToParticipants = (rows: ParticipantRow[]): Participant[] =>
    rows
      .filter((r) => r.department && r.name)
      .map((r) => ({
        id: `${r.department}:${r.name}`,
        name: r.name,
        department: r.department,
        avatar: initials(r.name),
      }));

  const participantsToRows = (parts: Participant[]): ParticipantRow[] =>
    (parts || []).map((p) => {
      let dep = p.department || "";
      if (!dep)
        dep =
          Object.keys(DEPARTMENTS).find((d) =>
            DEPARTMENTS[d].includes(p.name)
          ) || "";
      return {
        id: String(p.id ?? makeId()),
        department: dep,
        name: p.name || "",
      };
    });

  function ParticipantSelectRow({
    row,
    allRows,
    onChange,
    onRemove,
  }: {
    row: ParticipantRow;
    allRows: ParticipantRow[];
    onChange: (patch: Partial<ParticipantRow>) => void;
    onRemove: () => void;
  }) {
    const depOptions = Object.keys(DEPARTMENTS);
    const used = new Set(
      allRows
        .filter((r) => r.id !== row.id)
        .map((r) => `${r.department}::${r.name}`)
    );
    const nameOptions = row.department
      ? (DEPARTMENTS[row.department] || []).filter(
          (n) => !used.has(`${row.department}::${n}`)
        )
      : [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
        <select
          value={row.department}
          onChange={(e) => onChange({ department: e.target.value, name: "" })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
        >
          <option value="">Pilih departemen</option>
          {depOptions.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
        <select
          value={row.name}
          onChange={(e) => onChange({ name: e.target.value })}
          disabled={!row.department}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">
            {row.department ? "Pilih nama" : "Pilih departemen dulu"}
          </option>
          {nameOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  function ParticipantsForm({
    rows,
    onRowsChange,
    title = "Peserta",
  }: {
    rows: ParticipantRow[];
    onRowsChange: (next: ParticipantRow[]) => void;
    title?: string;
  }) {
    const addRow = () =>
      onRowsChange([...rows, { id: makeId(), department: "", name: "" }]);
    const updateRow = (id: string, patch: Partial<ParticipantRow>) =>
      onRowsChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const removeRow = (id: string) =>
      onRowsChange(rows.filter((r) => r.id !== id));

    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-medium text-gray-900">{title}</h4>
          <button
            type="button"
            onClick={addRow}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
        {rows.length === 0 ? (
          <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
            Belum ada peserta. Klik <b>Tambah</b> untuk menambah baris.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <ParticipantSelectRow
                key={r.id}
                row={r}
                allRows={rows}
                onChange={(patch) => updateRow(r.id, patch)}
                onRemove={() => removeRow(r.id)}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  const AgendaForm = ({
    agenda,
    onUpdate,
    onAdd,
    onRemove,
  }: {
    agenda: { id: string; title: string }[];
    onUpdate: (id: string | number, value: string) => void;
    onAdd: () => void;
    onRemove: (id: string | number) => void;
  }) => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-medium text-gray-900">Agenda</h4>
        <button
          type="button"
          onClick={(e) => (e.preventDefault(), onAdd())}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>
      <div className="space-y-3">
        {agenda.map((item, i) => (
          <div key={item.id} className="flex gap-3">
            <FormInput
              type="text"
              placeholder={`Agenda ${i + 1}`}
              value={item.title ?? ""}
              onChange={(e) => onUpdate(item.id, e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={(e) => (e.preventDefault(), onRemove(item.id))}
              disabled={agenda.length === 1}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg text-sm disabled:cursor-not-allowed flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  /* ===== Meeting Form (Create/Edit) ===== */
  const MeetingForm = React.memo(function MeetingForm({
    meeting,
    isCreate,
    onSave,
    onCancel,
  }: {
    meeting: any;
    isCreate: boolean;
    onSave: () => void;
    onCancel: () => void;
  }) {
    const m = meeting as any;
    const [rows, setRows] = useState<ParticipantRow[]>(
      participantsToRows(m.participants || [])
    );
    useEffect(() => setRows(participantsToRows(m.participants || [])), []);

    const handleRowsChange = (next: ParticipantRow[]) => {
      setRows(next);
      const participants = rowsToParticipants(next);
      if (isCreate) setNewMeeting((prev) => ({ ...prev, participants }));
      else
        setEditingMeeting((prev) => (prev ? { ...prev, participants } : null));
    };

    const [start, setStart] = useState(startOfRange(m.time));
    useEffect(() => setStart(startOfRange(m.time)), [m.time]);
    const updateStart = (v: string) => {
      setStart(v);
      if (isCreate) setNewMeeting((prev) => ({ ...prev, time: v }));
      else setEditingMeeting((prev) => (prev ? { ...prev, time: v } : null));
    };

    const handlers = {
      title: (v: string) =>
        isCreate
          ? setNewMeeting((p) => ({ ...p, title: v }))
          : setEditingMeeting((p) => (p ? { ...p, title: v } : null)),
      date: (v: string) =>
        isCreate
          ? setNewMeeting((p) => ({ ...p, date: v }))
          : setEditingMeeting((p) => (p ? { ...p, date: v } : null)),
      agendaUpdate: (id: string | number, value: string) => {
        const op = (arr: any[]) =>
          arr.map((a) => (a.id === id ? { ...a, title: value } : a));
        if (isCreate)
          setNewMeeting((p: any) => ({ ...p, agenda: op(p.agenda) }));
        else
          setEditingMeeting((p: any) =>
            p ? { ...p, agenda: op(p.agenda) } : null
          );
      },
      agendaAdd: () => {
        const newA = { id: makeId(), title: "", completed: false };
        if (isCreate)
          setNewMeeting((p: any) => ({ ...p, agenda: [...p.agenda, newA] }));
        else
          setEditingMeeting((p: any) =>
            p ? { ...p, agenda: [...p.agenda, newA] } : null
          );
      },
      agendaRemove: (id: string | number) => {
        const op = (arr: any[]) => arr.filter((a) => a.id !== id);
        if (isCreate)
          setNewMeeting((p: any) => ({ ...p, agenda: op(p.agenda) }));
        else
          setEditingMeeting((p: any) =>
            p ? { ...p, agenda: op(p.agenda) } : null
          );
      },
    };

    const onSubmit = (e: React.FormEvent) => (e.preventDefault(), onSave());
    const hasBasic = !!m.title && !!m.date && !!m.time;
    const hasParticipants = rowsToParticipants(rows).length > 0;

    return (
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            type="text"
            value={m.title || ""}
            onChange={(e) => handlers.title(e.target.value)}
            placeholder="Judul meeting"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              type="date"
              value={m.date || ""}
              onChange={(e) => handlers.date(e.target.value)}
            />
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Jam</label>
              <input
                type="time"
                value={start}
                onChange={(e) => updateStart(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        <ParticipantsForm rows={rows} onRowsChange={handleRowsChange} />
        <AgendaForm
          agenda={m.agenda || []}
          onUpdate={handlers.agendaUpdate}
          onAdd={handlers.agendaAdd}
          onRemove={handlers.agendaRemove}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!(hasBasic && hasParticipants)}
            className={`flex-1 ${
              isCreate
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            } disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all duration-200`}
          >
            {isCreate ? "Buat Meeting" : "Update Meeting"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    );
  });

  /* ===== Views ===== */
  const PriorityStrip = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      {/* LIVE */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-200/70 grid place-items-center">
            <PlayCircle className="w-5 h-5 text-yellow-700" />
          </div>
          <div>
            <div className="text-sm font-medium text-yellow-800">
              Berlangsung
            </div>
            <div className="text-xs text-yellow-700">
              {liveMeeting ? liveMeeting.title : "Tidak ada meeting live"}
            </div>
          </div>
        </div>
        <button
          disabled={!liveMeeting}
          onClick={() => liveMeeting && handleMeetingSelect(liveMeeting)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
            liveMeeting
              ? "bg-white text-yellow-700 border-yellow-200 hover:bg-yellow-50"
              : "bg-white text-yellow-400 border-yellow-100 cursor-not-allowed"
          }`}
        >
          {liveMeeting ? "Lanjut" : "—"}
        </button>
      </div>

      {/* FOLLOW UP */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-200/70 grid place-items-center">
            <AlertCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="text-sm font-medium text-emerald-800">
              Tindak Lanjut
            </div>
            <div className="text-xs text-emerald-700">
              {followUpsCount > 0 ? `${followUpsCount} agenda` : "Tidak ada"}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowFollowUpModal(true)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
        >
          Lihat
        </button>
      </div>

      {/* NEXT */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-200/70 grid place-items-center">
            <Calendar className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <div className="text-sm font-medium text-indigo-800">
              Meeting Berikutnya
            </div>
            <div className="text-xs text-indigo-700">
              {nextMeeting
                ? `${nextMeeting.title} • ${fmtDateID(nextMeeting.date)} • ${
                    nextMeeting.time
                  }`
                : "Tidak ada jadwal dekat ini"}
            </div>
          </div>
        </div>
        <button
          disabled={!nextMeeting}
          onClick={() => nextMeeting && handleMeetingSelect(nextMeeting)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
            nextMeeting
              ? "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
              : "bg-white text-indigo-400 border-indigo-100 cursor-not-allowed"
          }`}
        >
          Detail
        </button>
      </div>
    </div>
  );

  const FilterChips = () => {
    const chips: {
      key: "all" | "today" | "upcoming" | "ongoing" | "completed";
      label: string;
    }[] = [
      { key: "all", label: "Semua" },
      { key: "today", label: "Hari ini" },
      { key: "upcoming", label: "Mendatang" },
      { key: "ongoing", label: "Berlangsung" },
      { key: "completed", label: "Selesai" },
    ];
    return (
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                active
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-green-100 hover:bg-green-50"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    );
  };

  const ListView = () => (
    <>
      {!isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Meeting Management
          </h1>
          <CTAButton onClick={() => setShowCreateForm(true)} />
        </div>
      )}

      <PriorityStrip />

      <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
        <div className="p-5 border-b border-green-100 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <FilterChips />
            <div className="relative md:w-72">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul meeting..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-green-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder:text-gray-400"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </div>

        <div className="divide-y divide-green-50">
          {filteredMeetings.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onOpen={() => handleMeetingSelect(m)}
              onStart={() => handleStartMeeting(m)}
              onEdit={() => (setEditingMeeting(m), setShowEditForm(true))}
              onNotulen={() => (
                setSelectedMeeting(m), setCurrentView("completed")
              )}
            />
          ))}
          {filteredMeetings.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Tidak ada meeting untuk filter saat ini.
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-yellow-500
                       text-white flex items-center justify-center shadow-lg hover:shadow-xl
                       transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );

  /* ===== Ongoing (LIVE) ===== */
  const OngoingView = () => {
    if (!selectedMeeting) return null;

    // helper update state meeting terpilih + daftar
    const updateMeeting = React.useCallback(
      (updater: (m: Meeting) => Meeting) => {
        const updated = updater(selectedMeeting);
        setSelectedMeeting(updated);
        setMeetings((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      },
      [selectedMeeting]
    );

    // ---------- Autosave Notulensi (meeting level) ----------
    const [meetingNotes, setMeetingNotes] = React.useState(
      selectedMeeting.notes || ""
    );
    const meetingAutosaveRef = React.useRef<number | null>(null);

    React.useEffect(() => {
      setMeetingNotes(selectedMeeting.notes || "");
    }, [selectedMeeting.id]);

    const handleMeetingNotesChange = (v: string) => {
      setMeetingNotes(v);
      if (meetingAutosaveRef.current !== null) {
        window.clearTimeout(meetingAutosaveRef.current);
        meetingAutosaveRef.current = null;
      }
      meetingAutosaveRef.current = window.setTimeout(() => {
        updateMeeting((m) => ({ ...m, notes: v }));
        meetingAutosaveRef.current = null;
      }, 800);
    };

    React.useEffect(() => {
      return () => {
        if (meetingAutosaveRef.current !== null) {
          window.clearTimeout(meetingAutosaveRef.current);
          meetingAutosaveRef.current = null;
        }
      };
    }, []);

    // ---------- Komponen lokal untuk setiap agenda ----------
    const AgendaRow = React.memo(function AgendaRow({
      item,
    }: {
      item: AgendaItem;
    }) {
      const [localNotes, setLocalNotes] = React.useState(item.notes ?? "");
      const debounceRef = React.useRef<number | null>(null);

      React.useEffect(() => {
        setLocalNotes(item.notes ?? "");
      }, [item.id, item.notes]);

      const handleNotesChange = (value: string) => {
        setLocalNotes(value);
        if (debounceRef.current !== null) {
          window.clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        debounceRef.current = window.setTimeout(() => {
          updateMeeting((m) => ({
            ...m,
            agenda: m.agenda.map((ag) =>
              ag.id === item.id ? { ...ag, notes: value } : ag
            ),
          }));
          debounceRef.current = null;
        }, 800);
      };

      React.useEffect(() => {
        return () => {
          if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = null;
          }
        };
      }, []);

      return (
        <div className="border rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">{item.title}</h4>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!item.completed}
                onChange={(e) =>
                  updateMeeting((m) => ({
                    ...m,
                    agenda: m.agenda.map((ag) =>
                      ag.id === item.id
                        ? { ...ag, completed: e.target.checked }
                        : ag
                    ),
                  }))
                }
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">Selesai</span>
            </label>
          </div>

          <textarea
            value={localNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Catatan untuk agenda ini..."
            className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
          />

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!item.needsFollowUp}
                onChange={(e) =>
                  updateMeeting((m) => ({
                    ...m,
                    agenda: m.agenda.map((ag) =>
                      ag.id === item.id
                        ? {
                            ...ag,
                            needsFollowUp: e.target.checked,
                            followUpDate: e.target.checked
                              ? ag.followUpDate
                              : undefined,
                          }
                        : ag
                    ),
                  }))
                }
                className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-600">Perlu tindak lanjut</span>
            </label>

            <input
              type="date"
              value={item.followUpDate ?? ""}
              disabled={!item.needsFollowUp}
              onChange={(e) =>
                updateMeeting((m) => ({
                  ...m,
                  agenda: m.agenda.map((ag) =>
                    ag.id === item.id
                      ? { ...ag, followUpDate: e.target.value || undefined }
                      : ag
                  ),
                }))
              }
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition ${
                item.needsFollowUp
                  ? "text-gray-900 bg-white"
                  : "opacity-50 pointer-events-none bg-gray-100 text-gray-500"
              }`}
            />
          </div>
        </div>
      );
    });

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedMeeting.title}
              </h2>
              <p className="text-gray-600">
                Meeting sedang berlangsung - {selectedMeeting.startTime}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
                <PlayCircle className="w-4 h-4" />
                <span className="text-sm font-medium">LIVE</span>
              </div>
              <button
                onClick={handleCompleteMeeting}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium"
              >
                Selesaikan Meeting
              </button>
            </div>
          </div>

          <ProgressIndicator
            currentStep={
              selectedMeeting.agenda.filter((a) => a.completed).length
            }
            steps={selectedMeeting.agenda.map((a) => a.title)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progress Agenda
          </h3>
          <div className="space-y-4">
            {selectedMeeting.agenda.map((item) => (
              <AgendaRow key={String(item.id)} item={item} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Notulensi Meeting
          </h3>
          <textarea
            value={meetingNotes}
            onChange={(e) => handleMeetingNotesChange(e.target.value)}
            placeholder="Tulis notulensi lengkap meeting di sini..."
            className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Perubahan disimpan otomatis.
          </p>
        </div>
      </div>
    );
  };

  const CompletedView = () => {
    if (!selectedMeeting) return null;
    const [editingNotes, setEditingNotes] = useState(false);
    const [localNotes, setLocalNotes] = useState(selectedMeeting.notes || "");
    const saveRef = useRef<number | null>(null);

    useEffect(() => {
      setLocalNotes(selectedMeeting.notes || "");
      setEditingNotes(false);
    }, [selectedMeeting.id]);

    const saveNotesDebounced = (next: string) => {
      setLocalNotes(next);
      if (saveRef.current !== null) window.clearTimeout(saveRef.current);
      saveRef.current = window.setTimeout(() => {
        const updated = { ...selectedMeeting, notes: next };
        setSelectedMeeting(updated);
        setMeetings((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
        saveRef.current = null;
      }, 600);
    };

    const attended = selectedMeeting.participants.filter((p) => p.attended);
    const doneAgendas = selectedMeeting.agenda.filter((a) => a.completed);
    const followUps = selectedMeeting.agenda.filter((a) => a.needsFollowUp);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedMeeting.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2">
                <span>{fmtDateID(selectedMeeting.date)}</span>
                <span>
                  {selectedMeeting.startTime} - {selectedMeeting.endTime}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Meeting Selesai
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingNotes((v) => !v)}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium"
              >
                {editingNotes ? "Selesai Edit Notulensi" : "Edit Notulensi"}
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Peserta yang Hadir
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attended.map((p) => (
              <ParticipantCard key={p.id} participant={p} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hasil Pembahasan Agenda
          </h3>
          <div className="space-y-4">
            {doneAgendas.map((item, i) => (
              <div
                key={item.id}
                className="border-l-4 border-green-500 pl-4 py-2"
              >
                <h4 className="font-medium text-gray-900 mb-2">
                  {i + 1}. {item.title}
                </h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {item.notes || "Tidak ada catatan khusus."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {followUps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Agenda yang Perlu Tindak Lanjut
            </h3>
            <div className="space-y-4">
              {followUps.map((item, i) => (
                <div
                  key={item.id}
                  className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-r-lg"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {i + 1}. {item.title}
                  </h4>
                  <p className="text-gray-700 mb-2">
                    {item.notes || "Perlu pembahasan lebih lanjut."}
                  </p>
                  {item.followUpDate && (
                    <p className="text-sm text-yellow-700 font-medium">
                      Target follow-up: {fmtDateID(item.followUpDate)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingNotes ? "Notulensi Meeting (Edit)" : "Notulensi Meeting"}
          </h3>
          {editingNotes ? (
            <>
              <textarea
                value={localNotes}
                onChange={(e) => saveNotesDebounced(e.target.value)}
                placeholder="Tulis notulensi lengkap meeting di sini..."
                className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Perubahan disimpan otomatis.
              </p>
            </>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedMeeting.notes || "Belum ada notulensi."}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DetailView = () => {
    if (!selectedMeeting)
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-12 text-center">
          <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pilih Meeting
          </h3>
          <p className="text-gray-600 text-base">
            Pilih meeting dari daftar untuk melihat detail
          </p>
        </div>
      );
    const cfg = statusConfig[selectedMeeting.status];
    const Icon = cfg.icon;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-green-100">
        <div className="p-6 border-b border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedMeeting.title}
              </h2>
              <div className="flex items-center gap-4 text-gray-600 mt-2 flex-wrap">
                <span>{fmtDateID(selectedMeeting.date)}</span>
                <span>{selectedMeeting.time}</span>
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${cfg.tone}`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.text}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {selectedMeeting.status === "scheduled" && (
                <>
                  <button
                    onClick={() => handleStartMeeting(selectedMeeting)}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-medium flex items-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Mulai
                  </button>
                  <button
                    onClick={() => (
                      setEditingMeeting(selectedMeeting), setShowEditForm(true)
                    )}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </>
              )}
              {selectedMeeting.status === "completed" && (
                <>
                  <button
                    onClick={() => (
                      setEditingMeeting(selectedMeeting), setShowEditForm(true)
                    )}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setCurrentView("completed")}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Notulensi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Peserta Meeting
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedMeeting.participants.map((p) => (
                <ParticipantCard key={p.id} participant={p} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-600" />
              Agenda Meeting
            </h3>
            <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl p-4 border border-yellow-100">
              <ul className="space-y-3">
                {selectedMeeting.agenda.map((item, i) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className="bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const FollowUpModal = () => {
    const follow = meetings
      .filter((m) => m.status === "completed")
      .flatMap((m) =>
        m.agenda
          .filter((a) => a.needsFollowUp)
          .map((a) => ({ ...a, meetingTitle: m.title, meetingDate: m.date }))
      );

    return (
      <div className="space-y-4">
        <p className="text-gray-600 mb-4">
          Daftar agenda yang memerlukan tindak lanjut dari meeting yang telah
          selesai.
        </p>
        {follow.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              Tidak ada agenda yang perlu ditindaklanjuti
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {follow.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Dari meeting: {item.meetingTitle} (
                    {fmtDateID(item.meetingDate)})
                  </p>
                  {item.notes && (
                    <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded">
                      {item.notes}
                    </p>
                  )}
                  {item.followUpDate && (
                    <p className="text-sm text-yellow-700 font-medium mt-2">
                      Target: {fmtDateID(item.followUpDate)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowFollowUpModal(false)}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  };

  /* ===== Create/Edit handlers ===== */
  const resetDraft: CreateDraft = {
    title: "",
    date: "",
    time: "",
    agenda: [{ id: makeId(), title: "", completed: false }],
    participants: [],
  };
  const [newMeeting, setNewMeeting] = useState<CreateDraft>(resetDraft);

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) return;
    const participants: Participant[] = (newMeeting.participants || []).map(
      (p) => ({
        id: p.id,
        name: p.name.trim(),
        department: p.department,
        avatar: initials(p.name),
      })
    );
    const agenda: AgendaItem[] = newMeeting.agenda
      .map((a: any) => ({ ...a, title: (a.title ?? "").trim() }))
      .filter((a: any) => a.title);
    const meeting: Meeting = {
      id: (meetings.at(-1)?.id ?? 0) + 1,
      title: newMeeting.title.trim(),
      date: newMeeting.date,
      time: newMeeting.time,
      status: "scheduled",
      participants,
      notes: "",
      agenda,
    };
    setMeetings((prev) => [...prev, meeting]);
    setShowCreateForm(false);
    setNewMeeting(resetDraft);
  };

  const handleSaveEditedMeeting = () => {
    if (!editingMeeting) return;
    const updated: Meeting = {
      ...editingMeeting,
      participants: (editingMeeting.participants || [])
        .map((p) => {
          const name = (p.name ?? "").trim();
          return { ...p, name, avatar: initials(name) };
        })
        .filter((p) => p.name),
      agenda: (editingMeeting.agenda || [])
        .map((a) => ({ ...a, title: (a.title ?? "").trim() }))
        .filter((a) => a.title),
    };
    setMeetings((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSelectedMeeting(updated);
    setShowEditForm(false);
    setEditingMeeting(null);
  };

  /* ===== Render ===== */
  const renderContent = () => {
    if (currentView === "list" || (!selectedMeeting && !isMobile))
      return <ListView />;
    if (currentView === "ongoing" && selectedMeeting) return <OngoingView />;
    if (currentView === "completed" && selectedMeeting)
      return <CompletedView />;
    return <DetailView />;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {isMobile && (
        <div className="bg-white border-b border-green-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentView !== "list" && (
                <button
                  onClick={() => (
                    setCurrentView("list"), setSelectedMeeting(null)
                  )}
                  className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-900" />
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900">
                {currentView === "list"
                  ? "Meeting Management"
                  : selectedMeeting?.title || "Meeting"}
              </h1>
            </div>
            {currentView === "list" && (
              <CTAButton onClick={() => setShowCreateForm(true)} />
            )}
          </div>
        </div>
      )}

      <div className={`p-4 lg:p-6 max-w-7xl mx-auto ${isMobile ? "" : "pt-6"}`}>
        {!isMobile && currentView !== "list" && (
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => (setCurrentView("list"), setSelectedMeeting(null))}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-900" />
              <span className="text-gray-900">Kembali ke Daftar</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedMeeting?.title || "Meeting Detail"}
            </h1>
          </div>
        )}

        {renderContent()}
      </div>

      {showCreateForm && (
        <Modal
          title="Buat Meeting Baru"
          onClose={() => {
            setShowCreateForm(false);
            setNewMeeting(resetDraft);
          }}
        >
          <MeetingForm
            meeting={newMeeting}
            isCreate={true}
            onSave={handleCreateMeeting}
            onCancel={() => {
              setShowCreateForm(false);
              setNewMeeting(resetDraft);
            }}
          />
        </Modal>
      )}

      {showEditForm && editingMeeting && (
        <Modal
          title="Edit Meeting"
          onClose={() => {
            setShowEditForm(false);
            setEditingMeeting(null);
          }}
        >
          <MeetingForm
            meeting={editingMeeting}
            isCreate={false}
            onSave={handleSaveEditedMeeting}
            onCancel={() => {
              setShowEditForm(false);
              setEditingMeeting(null);
            }}
          />
        </Modal>
      )}

      {showFollowUpModal && (
        <Modal
          title="Agenda Tindak Lanjut"
          onClose={() => setShowFollowUpModal(false)}
          size="large"
        >
          <FollowUpModal />
        </Modal>
      )}
    </div>
  );
}
