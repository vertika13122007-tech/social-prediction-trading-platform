import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import {
  Bell, BellRing, TrendingUp, DollarSign, Users,
  Clock, Trophy, Sparkles, CheckCheck, Trash2, Filter, X, CheckCircle, Circle
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "welcome",
    icon: <Sparkles size={20} className="text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconGlow: "shadow-blue-200/60 dark:shadow-blue-900/40",
    title: "Welcome to Live Market! 🎉",
    desc: "Explore trades, make predictions, and climb the leaderboard. Your journey starts now!",
    time: "Just now",
    read: false,
    tag: "System",
    tagColor: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: 2,
    type: "trade",
    icon: <TrendingUp size={20} className="text-emerald-500" />,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconGlow: "shadow-emerald-200/60 dark:shadow-emerald-900/40",
    title: "New Trending Trade 🔥",
    desc: "AI vs Developers prediction is gaining massive traction. 234 investors already in!",
    time: "2m ago",
    read: false,
    tag: "Trending",
    tagColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    id: 3,
    type: "payout",
    icon: <DollarSign size={20} className="text-yellow-500" />,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconGlow: "shadow-yellow-200/60 dark:shadow-yellow-900/40",
    title: "Major Payout Alert 💰",
    desc: "$50K has been distributed to winning investors in the Tesla stock prediction.",
    time: "1h ago",
    read: false,
    tag: "Payout",
    tagColor: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500",
  },
  {
    id: 4,
    type: "investors",
    icon: <Users size={20} className="text-purple-500" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconGlow: "shadow-purple-200/60 dark:shadow-purple-900/40",
    title: "500+ New Investors Joined",
    desc: "The Tesla stock prediction reached a new milestone with over 500 new investors today.",
    time: "2h ago",
    read: true,
    tag: "Milestone",
    tagColor: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: 5,
    type: "closing",
    icon: <Clock size={20} className="text-orange-500" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconGlow: "shadow-orange-200/60 dark:shadow-orange-900/40",
    title: "Trade Closing Soon ⏰",
    desc: "Lakers Championship prediction closes in 2 hours. Don't miss your chance to invest!",
    time: "3h ago",
    read: true,
    tag: "Urgent",
    tagColor: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: 6,
    type: "leaderboard",
    icon: <Trophy size={20} className="text-amber-500" />,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconGlow: "shadow-amber-200/60 dark:shadow-amber-900/40",
    title: "You Moved Up the Leaderboard! 🏆",
    desc: "You jumped 5 spots to #127 on the global leaderboard. Keep trading to reach the top!",
    time: "5h ago",
    read: true,
    tag: "Rank",
    tagColor: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500",
  },
  {
    id: 7,
    type: "trade",
    icon: <TrendingUp size={20} className="text-teal-500" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconGlow: "shadow-teal-200/60 dark:shadow-teal-900/40",
    title: "Bitcoin Prediction Surging 📈",
    desc: "Bitcoin to $150K prediction is up +156% ROI. 312 investors have already joined this trade.",
    time: "8h ago",
    read: true,
    tag: "Trending",
    tagColor: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    id: 8,
    type: "system",
    icon: <Bell size={20} className="text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconGlow: "shadow-blue-200/60 dark:shadow-blue-900/40",
    title: "Season 3 is Now Live! 🚀",
    desc: "A new competitive season has started. Compete with top traders and win exclusive rewards.",
    time: "1d ago",
    read: true,
    tag: "System",
    tagColor: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
];

const FILTERS = ["All", "Unread", "Trending", "Payout", "Urgent", "System"];

export default function Notifications() {
  const [darkMode, setDarkMode] = useState(false);
  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [selectedNotif, setSelectedNotif] = useState(null);
  const closeButtonRef = useRef(null);

  // Disable body scroll when popup open
  useEffect(() => {
    if (selectedNotif) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedNotif]);

  // Escape key closes popup
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setSelectedNotif(null); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const openNotif = (n) => {
    markRead(n.id);
    setSelectedNotif(n);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.tag === activeFilter;
  });

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        liveUpdatesOpen={liveUpdatesOpen}
        setLiveUpdatesOpen={setLiveUpdatesOpen}
      />

      <div className="flex max-w-7xl mx-auto">
        <main className="flex-1 min-w-0 px-4 py-6">

          {/* ── Hero Header ── */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 rounded-3xl p-8 mb-6 shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/40 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-blue-500/30 transition-all duration-300 ring-1 ring-white/10">
            {/* Shimmer top line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Bell icon — glows on hover */}
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-lg hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  <BellRing size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">Notifications</h1>
                  <p className="text-blue-200 mt-1 text-sm">
                    {unreadCount > 0
                      ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                      : "You're all caught up!"}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/35 text-white text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm hover:shadow-md"
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95"
                  >
                    <Trash2 size={15} />
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Unread badge strip */}
            {unreadCount > 0 && (
              <div className="relative z-10 mt-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-blue-100 text-xs font-medium">
                  {unreadCount} new since your last visit
                </span>
              </div>
            )}
          </div>

          {/* ── Filter tabs ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-md dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 mb-5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <Filter size={14} className="text-gray-400 shrink-0 ml-1" />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                    activeFilter === f
                      ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-md"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {f}
                  {f === "Unread" && unreadCount > 0 && (
                    <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeFilter === "Unread"
                        ? "bg-white/30 text-white"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Notifications list ── */}
          {filtered.length > 0 ? (
            <div className="space-y-3 pb-10">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => openNotif(n)}
                  className={`group relative bg-white dark:bg-gray-900 rounded-2xl border p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${
                    !n.read
                      ? "border-blue-200 dark:border-blue-800/70 shadow-md shadow-blue-100/60 dark:shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/40 border-l-4 border-l-blue-500 dark:border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                      : "border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/60 hover:border-gray-200 dark:hover:border-gray-700"
                  }`}
                >
                  {/* Unread dot */}
                  {!n.read && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-sm shadow-blue-300 animate-pulse" />
                  )}

                  {/* Icon — scales on hover */}
                  <div className={`w-11 h-11 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0 shadow-sm ${n.iconGlow} group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    {n.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-bold ${!n.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {n.title}
                        </p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${n.tagColor}`}>
                          {n.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0 hover:scale-110 active:scale-95"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/30 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <Bell size={36} className="text-blue-300 dark:text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {activeFilter === "Unread" ? "No unread notifications" : "No notifications here"}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {activeFilter !== "All"
                  ? "Try switching to 'All' to see everything"
                  : "You're all caught up! Check back later."}
              </p>
              {activeFilter !== "All" && (
                <button
                  onClick={() => setActiveFilter("All")}
                  className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white text-sm font-medium hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </main>


        {/* ── Notification Detail Popup ── */}
        {selectedNotif && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            aria-modal="true"
            role="dialog"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.25s_ease]"
              onClick={() => setSelectedNotif(null)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-[popIn_0.25s_ease] z-10">

              {/* Gradient header */}
              <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-5 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${selectedNotif.iconBg} flex items-center justify-center shadow-md`}>
                      {selectedNotif.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                        {selectedNotif.tag}
                      </span>
                      <h2 className="text-base font-bold text-white leading-tight mt-0.5">
                        {selectedNotif.title}
                      </h2>
                    </div>
                  </div>
                  <button
                    ref={closeButtonRef}
                    onClick={() => setSelectedNotif(null)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/35 text-white transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">

                {/* Full message */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Message</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    {selectedNotif.desc}
                  </p>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Category</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedNotif.tagColor}`}>
                      {selectedNotif.tag}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Received</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{selectedNotif.time}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Type</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">{selectedNotif.type}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-1.5">
                      {selectedNotif.read
                        ? <CheckCircle size={13} className="text-emerald-500" />
                        : <Circle size={13} className="text-blue-500" />
                      }
                      <p className={`text-xs font-semibold ${selectedNotif.read ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {selectedNotif.read ? "Read" : "Unread"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ── Desktop Live Updates sidebar ── */}
        {liveUpdatesOpen && (
          <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
            <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
          </aside>
        )}
      </div>

      {/* ── Mobile Live Updates panel ── */}
      {liveUpdatesOpen && (
        <div className="lg:hidden fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-72 max-w-[85vw] flex flex-col bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800">
          <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
        </div>
      )}
    </div>
  );
}
