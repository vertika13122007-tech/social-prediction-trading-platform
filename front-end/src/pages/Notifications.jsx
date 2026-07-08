import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import {
  Bell, BellRing, TrendingUp, DollarSign, Users,
  Clock, Trophy, Sparkles, CheckCheck, Trash2, Filter
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "welcome",
    icon: <Sparkles size={20} className="text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
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
        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 py-6">

          {/* ── Hero Header ── */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 mb-6 shadow-xl relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Big bell icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-lg">
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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition"
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-sm font-medium transition"
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-800 mb-5">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <Filter size={14} className="text-gray-400 shrink-0 ml-1" />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeFilter === f
                      ? "bg-blue-600 text-white shadow-sm"
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
                  onClick={() => markRead(n.id)}
                  className={`group relative bg-white dark:bg-gray-900 rounded-2xl border p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    !n.read
                      ? "border-blue-200 dark:border-blue-800 shadow-sm"
                      : "border-gray-100 dark:border-gray-800"
                  }`}
                >
                  {/* Unread dot */}
                  {!n.read && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-500" />
                  )}

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0`}>
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

                  {/* Delete button — shows on hover */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-5">
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
                  className="mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </main>

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
