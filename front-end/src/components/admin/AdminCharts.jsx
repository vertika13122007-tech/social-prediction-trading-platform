import { useEffect, useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { getAdminAnalytics } from "../../api/statsApi";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const VolumeTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-blue-600">₹{payload[0].value.toLocaleString()}</p>
    </div>
  );
  return null;
};

export default function AdminCharts() {
  const [volumeData, setVolumeData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    async function loadChartsData() {
      try {
        const data = await getAdminAnalytics();

        // Volume trend
        const rawTrend = data?.volumeTrend || [];
        if (rawTrend.length > 0) {
          setVolumeData(rawTrend.map(t => ({
            day: `${MONTH_NAMES[(t._id?.month || 1) - 1]}`,
            volume: t.openVolume !== undefined ? t.openVolume : (t.totalVolume || t.volume || 0),
            fullTitle: `Open Markets Volume (${MONTH_NAMES[(t._id?.month || 1) - 1]} ${t._id?.year || ""})`
          })));
        } else {
          setVolumeData([
            { day: "Jan", volume: 15000 },
            { day: "Feb", volume: 32000 },
            { day: "Mar", volume: 48000 },
            { day: "Apr", volume: 75000 },
            { day: "May", volume: data?.overview?.openMarketVolume || 98000 },
          ]);
        }

        // Pie status data
        const overview = data?.overview || {};
        setPieData([
          { name: "Open", value: overview.openMarketsCount || 0, color: "#3b82f6" },
          { name: "Settled", value: overview.settledMarketsCount || 0, color: "#10b981" },
          { name: "Closed", value: overview.closedMarketsCount || 0, color: "#f59e0b" },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
    loadChartsData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Line chart */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Open Markets Volume Trajectory</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Total amount in active unclosed open markets</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white">
            Open Markets Volume
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={volumeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip content={<VolumeTooltip />} />
            <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2.5} fill="url(#volGrad)"
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="mb-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Market Distribution</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">By status</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" isAnimationActive={false}>
              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v} markets`, n]} isAnimationActive={false} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {pieData.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{d.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-white">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}