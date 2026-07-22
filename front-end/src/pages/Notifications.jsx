import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import {
  Bell, BellRing, TrendingUp, DollarSign, Users,
  Clock, Trophy, Sparkles, CheckCheck, Trash2, Filter, X, CheckCircle, Circle
} from "lucide-react";
import {
    getNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    clearNotifications
} from "../api/notificationApi";
import { notificationConfig } from "../utilis/notificationConfig";

const FILTERS = ["All", "Unread", "Trending", "Payout", "Urgent", "System"];

export function formatNotificationTime(date) {
  const now = new Date();
  const created = new Date(date);

  const diff = Math.floor((now - created) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return created.toLocaleDateString();
}

export default function Notifications() {
  const [darkMode, setDarkMode] = useState(false);
  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
          const data = await getNotifications();
          setNotifications(data);
      } catch (error) {
          console.error(error);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.tag === activeFilter;
  });

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true
        }))
      );
    } catch (err) {
        console.error(err);
    } 
  };

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id
            ? { ...n, read: true }
            : n
          )
        );
    } catch (err) {
        console.error(err);
    }
  };

  const openNotif = (n) => {
    handleMarkRead(n._id);
    setSelectedNotif(n);

  };

  const handleDelete = async (id) => {
    try {
        await deleteNotification(id);
        setNotifications((prev) =>
            prev.filter((n) => n._id !== id)
        );
    } catch (err) {
        console.error(err);
    }
  };

  const clearAll = async () => {
    try{
      await clearNotifications();
      setNotifications([]);
    }catch(error){
      console.error(error);
    }
  };

  const selectedConfig = selectedNotif
    ? notificationConfig[selectedNotif.type] || notificationConfig.system
    : null;

  const SelectedIcon = selectedConfig?.Icon;

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
                    onClick={handleMarkAllRead}
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
              {filtered.map((n) => {
                const config = 
                  notificationConfig[n.type] || notificationConfig.system;

                const Icon = config.Icon;
                return (
                <div
                  key={n._id}
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
                  <div className={`w-11 h-11 rounded-xl ${config.iconBg} flex items-center justify-center`}>
                    <Icon size={20} className={config.iconColor} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-bold ${!n.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {n.title}
                        </p>
                        <span className={config.tagColor}>
                          {config.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {formatNotificationTime(n.createdAt)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0 hover:scale-110 active:scale-95"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )})}
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
                    <div
                      className={`w-12 h-12 rounded-2xl ${selectedConfig.iconBg} flex items-center justify-center shadow-md`}
                    >
                      <SelectedIcon size={20} className={selectedConfig.iconColor} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                        {selectedConfig.tag}
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
                    {selectedNotif.message}
                  </p>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Category</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedConfig.tagColor}`}>
                      {selectedConfig.tag}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Received</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{formatNotificationTime(selectedNotif.createdAt)}</p>
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
