import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const VOLUME_DATA = [
  { day: "Mon", volume: 52000 },
  { day: "Tue", volume: 78000 },
  { day: "Wed", volume: 61000 },
  { day: "Thu", volume: 95000 },
  { day: "Fri", volume: 84000 },
  { day: "Sat", volume: 110000 },
  { day: "Sun", volume: 840000 },
];

const PIE_DATA = [
  { name: "Open",     value: 18, color: "#3b82f6" },
  { name: "Settled",  value: 32, color: "#10b981" },
  { name: "Closed",   value: 14, color: "#f59e0b" },
];

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Line chart */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Trading Volume</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Last 7 days</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white">7 Days</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={VOLUME_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
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
            <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
              {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [`${v} markets`, n]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {PIE_DATA.map((d, i) => (
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