import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, AlertCircle, Wallet, Flag, X } from "lucide-react";
import { getNotifications, markRead, markAllRead, deleteNotification } from "../../api/notificationApi";

export default function NotificationsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const data = await getNotifications();
      const formatted = (data || []).map((n) => {
        const titleLower = (n.title || "").toLowerCase();
        const isClosed = titleLower.includes("closed") || titleLower.includes("pending");
        const isOpen = titleLower.includes("open") || titleLower.includes("active");

        return {
          id: n._id,
          title: n.title,
          text: n.message,
          read: n.read,
          type: n.type,
          icon: isClosed ? <AlertCircle size={13} /> : isOpen ? <Clock size={13} /> : <Bell size={13} />,
          bg: isClosed ? "bg-orange-100 dark:bg-orange-900/30" : isOpen ? "bg-blue-100 dark:bg-blue-900/30" : "bg-emerald-100 dark:bg-emerald-900/30",
          color: isClosed ? "text-orange-500" : isOpen ? "text-blue-500" : "text-emerald-500",
        };
      });
      setAlerts(formatted);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      setAlerts((prev) => prev.map((x) => ({ ...x, read: true })));
      await markAllRead();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleMarkItemRead = async (id) => {
    try {
      setAlerts((prev) => prev.map((x) => (x.id === id ? { ...x, read: true } : x)));
      await markRead(id);
    } catch (err) {
      console.error("Failed to mark item read:", err);
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      setAlerts((prev) => prev.filter((x) => x.id !== id));
      await deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unread = alerts.filter((a) => !a.read).length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white">Alerts & Notifications</h3>
          {unread > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {alerts.map((a, i) => (
          <motion.div
            key={a.id || i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => !a.read && handleMarkItemRead(a.id)}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group cursor-pointer ${
              !a.read ? "bg-blue-50/30 dark:bg-blue-950/10" : ""
            }`}
          >
            <div className={`w-7 h-7 rounded-lg ${a.bg} ${a.color} flex items-center justify-center shrink-0 mt-0.5`}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-snug ${!a.read ? "font-semibold text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}`}>
                {a.text}
              </p>
              {!a.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />}
            </div>
            <button
              onClick={(e) => handleDeleteItem(a.id, e)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-all p-0.5"
              title="Dismiss notification"
            >
              <X size={11} />
            </button>
          </motion.div>
        ))}
        {alerts.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}