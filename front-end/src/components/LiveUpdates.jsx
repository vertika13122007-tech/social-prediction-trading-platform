import { X, TrendingUp, Users, DollarSign, Clock } from "lucide-react";

const updates = [
  {
    icon: <TrendingUp size={14} className="text-blue-500" />,
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    title: "New Trending Trade",
    desc: "AI vs Developers prediction is gaining traction",
    time: "2m ago",
    dot: "bg-blue-500",
  },
  {
    icon: <Users size={14} className="text-purple-500" />,
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    title: "500+ New Investors",
    desc: "Tesla stock prediction reached new milestone",
    time: "15m ago",
    dot: "bg-purple-500",
  },
  {
    icon: <DollarSign size={14} className="text-emerald-500" />,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    title: "Major Payout",
    desc: "$50K distributed to winning investors",
    time: "1h ago",
    dot: "bg-emerald-500",
  },
  {
    icon: <Clock size={14} className="text-orange-500" />,
    iconBg: "bg-orange-50 dark:bg-orange-900/30",
    title: "Trade Closing Soon",
    desc: "Lakers championship prediction closes in 2 hours",
    time: "2h ago",
    dot: "bg-orange-500",
  },
  {
    icon: <TrendingUp size={14} className="text-teal-500" />,
    iconBg: "bg-teal-50 dark:bg-teal-900/30",
    title: "Hot Prediction",
    desc: "Bitcoin $150K prediction gaining massive traction",
    time: "3h ago",
    dot: "bg-teal-500",
  },
];

export default function LiveUpdates({ onClose }) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 border-l border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-bold text-gray-900 dark:text-white text-sm">Live Updates</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Updates list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/50">
        {updates.map((u, i) => (
          <div
            key={i}
            className="flex gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-lg ${u.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
            >
              {u.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                  {u.title}
                </p>
                <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{u.time}</span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                {u.desc}
              </p>
            </div>
          </div>
        ))}
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
