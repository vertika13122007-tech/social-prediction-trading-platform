import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Activity, DollarSign } from "lucide-react";
import { getAdminAnalytics } from "../../api/statsApi";

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, (target || 0) / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

function StatCard({ stat, index }) {
  const count = useCountUp(stat.value, 1200 + index * 150);
  const formatted = stat.prefix + (count >= 1000 ? count.toLocaleString() : count) + stat.suffix;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center shadow-md ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
          <stat.icon size={20} className="text-white" />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
          stat.up ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
        }`}>
          {stat.up ? "↑" : "↓"} {stat.trend}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">{stat.label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{formatted}</p>
    </motion.div>
  );
}

export default function StatsCards() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminAnalytics();
        setMetrics(data?.overview || {});
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const stats = [
    { label: "Total Users", value: metrics?.totalUsers || 0, prefix: "", suffix: "", trend: "Live", up: true, icon: Users, bg: "from-blue-500 to-blue-700", shadow: "shadow-blue-200/50 dark:shadow-blue-900/30" },
    { label: "Open Markets", value: metrics?.openMarketsCount || 0, prefix: "", suffix: "", trend: "Live", up: true, icon: TrendingUp, bg: "from-teal-500 to-teal-700", shadow: "shadow-teal-200/50 dark:shadow-teal-900/30" },
    { label: "Total Predictions", value: metrics?.totalTradesCount || 0, prefix: "", suffix: "", trend: "Live", up: true, icon: Activity, bg: "from-purple-500 to-purple-700", shadow: "shadow-purple-200/50 dark:shadow-purple-900/30" },
    { label: "Trading Volume", value: metrics?.totalVolume || 0, prefix: "₹", suffix: "", trend: "Live", up: true, icon: DollarSign, bg: "from-emerald-500 to-emerald-700", shadow: "shadow-emerald-200/50 dark:shadow-emerald-900/30" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
    </div>
  );
}