import {
  X,
  TrendingUp,
  DollarSign,
  Clock,
  Trophy,
  Bell,
} from "lucide-react";

import { useLiveUpdates } from "../context/LiveUpdatesContext";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  trade: {
    icon: <DollarSign size={14} className="text-emerald-500" />,
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },

  market: {
    icon: <TrendingUp size={14} className="text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },

  settlement: {
    icon: <Trophy size={14} className="text-yellow-500" />,
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
  },

  reminder: {
    icon: <Clock size={14} className="text-orange-500" />,
    bg: "bg-orange-50 dark:bg-orange-900/30",
  },

  system: {
    icon: <Bell size={14} className="text-purple-500" />,
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
};

const formatTime = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);

  if (diff < 60) return `${diff}s ago`;

  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;

  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

  return `${Math.floor(diff / 86400)}d ago`;
};

export default function LiveUpdates({ onClose }) {
  const { updates } = useLiveUpdates();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 border-l border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-bold text-gray-900 dark:text-white text-sm">
            Live Updates
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Updates */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/50">
        {updates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <TrendingUp
              size={42}
              className="text-gray-300 dark:text-gray-700 mb-3"
            />

            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              No Live Updates
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Market activity will appear here in real time.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {updates.map((u, i) => {
              const config = iconMap[u.type] || iconMap.system;

              return (
                <motion.div
                  key={u._id || u.id || i}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    {config.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {u.title}
                      </p>

                      <span className="text-[10px] text-gray-400">
                        {formatTime(u.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                      {u.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <button className="w-full text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline text-center">
          View all notifications
        </button>
      </div>
    </div>
  );
}