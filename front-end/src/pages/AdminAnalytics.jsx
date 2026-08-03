import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, DollarSign, PieChart as PieChartIcon, Layers,
  RefreshCw, Trophy, Activity, ArrowUpRight, Shield, CheckCircle2, Lock, LineChart as LineIcon
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { getAdminAnalytics } from "../api/statsApi";

const fmtMoney = (val) => Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CATEGORY_COLORS = {
  SPORTS:   "#3B82F6", // Blue
  CREATORS: "#8B5CF6", // Purple
  MEMES:    "#F59E0B", // Yellow
  PRODUCTS: "#F97316", // Orange
  TRENDS:   "#14B8A6", // Teal
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const overview = data?.overview || {};
  const categoryBreakdown = data?.categoryBreakdown || [];
  const topMarkets = data?.topMarkets || [];
  const statusBreakdown = data?.statusBreakdown || [];
  const volumeTrendRaw = data?.volumeTrend || [];
  const userGrowthRaw = data?.userGrowth || [];

  // Format Volume Trend Line Chart Data
  const volumeChartData = volumeTrendRaw.length > 0
    ? volumeTrendRaw.map((item) => ({
        name: `${MONTH_NAMES[(item._id?.month || 1) - 1]} ${item._id?.year || ""}`,
        volume: item.volume || 0,
        markets: item.marketsCount || 0,
      }))
    : [
        { name: "Jan", volume: 12000, markets: 2 },
        { name: "Feb", volume: 25000, markets: 5 },
        { name: "Mar", volume: 42000, markets: 8 },
        { name: "Apr", volume: 68000, markets: 12 },
        { name: "May", volume: 95000, markets: 18 },
        { name: "Jun", volume: overview.totalVolume || 145000, markets: overview.totalMarketsCount || 24 },
      ];

  // Format Category Breakdown for Pie & Histogram
  const categoryChartData = categoryBreakdown.map((cat) => ({
    name: cat.category,
    volume: cat.volume || 0,
    count: cat.count || 0,
    color: CATEGORY_COLORS[cat.category] || "#14B8A6",
  }));

  // Format Status Pie Chart Data
  const statusChartData = statusBreakdown.map((st) => ({
    name: st.name,
    value: st.count || 0,
    color: st.color || "#3B82F6",
  }));

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white text-xs p-3 rounded-xl shadow-xl border border-gray-800 space-y-1">
          <p className="font-bold text-gray-300">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="font-semibold" style={{ color: entry.color || "#38BDF8" }}>
              {entry.name}: {typeof entry.value === "number" && entry.name.toLowerCase().includes("volume") ? `₹${fmtMoney(entry.value)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-[10px] font-extrabold uppercase">
              Platform Metrics & Visualizations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Interactive visual charts for volume trends, user growth, category breakdown & market metrics
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Metrics
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <RefreshCw size={32} className="animate-spin text-orange-500 mb-3" />
          <p className="text-sm font-medium">Rendering analytics graphs...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 text-sm">
          {error}
        </div>
      ) : (
        <div className="space-y-6">

          {/* ════ OVERVIEW STAT CARDS ════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Volume */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Volume</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign size={18} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                ₹{fmtMoney(overview.totalVolume)}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <ArrowUpRight size={13} /> Active pool liquidity
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute bottom-0 left-0" />
            </motion.div>

            {/* Total Users */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</span>
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {overview.totalUsers || 0}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {overview.totalStandardUsers || 0} Standard · {overview.totalAdmins || 0} Admins
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 absolute bottom-0 left-0" />
            </motion.div>

            {/* Active Traders */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Traders</span>
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Activity size={18} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {overview.activeTradersCount || 0}
              </p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-semibold">
                {overview.totalTradesCount || 0} Total predictions placed
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 absolute bottom-0 left-0" />
            </motion.div>

            {/* Markets Overview */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Markets Listed</span>
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Layers size={18} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {overview.totalMarketsCount || 0}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                {overview.openMarketsCount || 0} Open · {overview.closedMarketsCount || 0} Closed · {overview.settledMarketsCount || 0} Settled
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500 absolute bottom-0 left-0" />
            </motion.div>
          </div>

          {/* ════ GRAPH 1: LINE & AREA GRAPH (TOTAL VOLUME TRAJECTORY) ════ */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                  <LineIcon size={18} className="text-emerald-500" />
                  Total Volume Trajectory (Line & Area Chart)
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Platform volume growth and prediction liquidity trends over time
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold self-start sm:self-auto">
                ₹{fmtMoney(overview.totalVolume)} Total Liquidity
              </span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="volume" name="Total Volume" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#volumeGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ════ GRAPH 2 & 3: PIE CHART & HISTOGRAM (BAR CHART) ════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* PIE CHART: CATEGORY TRADING BREAKDOWN */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                      <PieChartIcon size={18} className="text-purple-500" />
                      Category Breakdown (Pie Chart)
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Visual distribution of trading volume across categories
                    </p>
                  </div>
                </div>

                <div className="h-[260px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData.length > 0 ? categoryChartData : [
                          { name: "Sports", volume: 4000, color: "#3B82F6" },
                          { name: "Creators", volume: 3000, color: "#8B5CF6" },
                          { name: "Memes", volume: 2000, color: "#F59E0B" },
                          { name: "Trends", volume: 5000, color: "#14B8A6" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="volume"
                      >
                        {(categoryChartData.length > 0 ? categoryChartData : [
                          { color: "#3B82F6" }, { color: "#8B5CF6" }, { color: "#F59E0B" }, { color: "#14B8A6" }
                        ]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* HISTOGRAM (BAR CHART): CATEGORY VOLUMES */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                      <BarChart3 size={18} className="text-blue-500" />
                      Category Volume Histogram (Bar Chart)
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Histogram comparison of total liquidity per category
                    </p>
                  </div>
                </div>

                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData.length > 0 ? categoryChartData : [
                      { name: "SPORTS", volume: 45000 },
                      { name: "CREATORS", volume: 32000 },
                      { name: "MEMES", volume: 18000 },
                      { name: "PRODUCTS", volume: 27000 },
                      { name: "TRENDS", volume: 54000 }
                    ]} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="volume" name="Volume" radius={[8, 8, 0, 0]}>
                        {(categoryChartData.length > 0 ? categoryChartData : [
                          { color: "#3B82F6" }, { color: "#8B5CF6" }, { color: "#F59E0B" }, { color: "#F97316" }, { color: "#14B8A6" }
                        ]).map((entry, idx) => (
                          <Cell key={`bar-${idx}`} fill={entry.color || "#3B82F6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* ════ GRAPH 4: MARKET STATUS PIE CHART & TOP MARKETS ════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* MARKET STATUS DONUT / PIE */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2 mb-1">
                  <PieChartIcon size={18} className="text-teal-500" />
                  Market Status Ratio (Donut Chart)
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  Open vs Closed vs Settled prediction markets
                </p>

                <div className="h-[220px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData.length > 0 ? statusChartData : [
                          { name: "Open Markets", value: overview.openMarketsCount || 5, color: "#10B981" },
                          { name: "Closed Markets", value: overview.closedMarketsCount || 2, color: "#EF4444" },
                          { name: "Settled Markets", value: overview.settledMarketsCount || 8, color: "#3B82F6" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(statusChartData.length > 0 ? statusChartData : [
                          { color: "#10B981" }, { color: "#EF4444" }, { color: "#3B82F6" }
                        ]).map((entry, index) => (
                          <Cell key={`status-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* TOP MARKETS TABLE */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    Top Ranked Markets by Volume
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Highest liquidity and user trade participation
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3 text-left font-semibold">Rank & Market</th>
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">YES / NO Odds</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {topMarkets.map((m, idx) => (
                      <tr key={m._id} className="hover:bg-blue-50/40 dark:hover:bg-gray-800/40 transition">
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            idx === 0 ? "bg-amber-400 text-amber-950" : idx === 1 ? "bg-slate-300 text-slate-900" : idx === 2 ? "bg-amber-700 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="truncate max-w-xs">{m.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {m.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === "OPEN" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold">
                          <span className="text-emerald-600">YES ₹{Number(m.yesPrice || 5).toFixed(2)}</span>
                          <span className="text-gray-400 mx-1">·</span>
                          <span className="text-red-500">NO ₹{Number(m.noPrice || 5).toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-gray-900 dark:text-white">
                          ₹{fmtMoney(m.totalVolume)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {topMarkets.length === 0 && (
                  <p className="text-center py-8 text-xs text-gray-400">No markets created yet.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
