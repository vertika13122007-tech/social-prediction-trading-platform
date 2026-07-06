import { TrendingUp, DollarSign, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    icon: <TrendingUp size={20} className="text-white" />,
    bg: "from-blue-500 to-blue-700",
    badge: "+12%",
    badgeColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400",
    label: "Active Trades",
    value: "1,234",
  },
  {
    icon: <DollarSign size={20} className="text-white" />,
    bg: "from-emerald-500 to-emerald-700",
    badge: "+18%",
    badgeColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400",
    label: "Total Pool",
    value: "$2.4M",
  },
  {
    icon: <Users size={20} className="text-white" />,
    bg: "from-indigo-500 to-indigo-700",
    badge: "+8%",
    badgeColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400",
    label: "Active Traders",
    value: "45.2K",
  },
  {
    icon: <Target size={20} className="text-white" />,
    bg: "from-red-500 to-orange-600",
    badge: "—",
    badgeColor: "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
    label: "Your Rank (click to view)",
    value: "N/A",
  },
];

export default function StatsCard() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          onClick={() =>
            stat.label === "Your Rank (click to view)" && navigate("/leaderboard")
          }
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:shadow-gray-900 transition-shadow group"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
            >
              {stat.icon}
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.badgeColor}`}
            >
              {stat.badge}
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{stat.label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
