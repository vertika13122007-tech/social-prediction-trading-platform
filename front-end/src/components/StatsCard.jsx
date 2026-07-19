import { TrendingUp, DollarSign, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getStats } from "../api/statsApi";

export default function StatsCard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    {
      icon: <TrendingUp size={20} className="text-white" />,
      bg: "from-blue-500 to-blue-700",
      label: "Active Trades",
      value: 0,
    },
    {
      icon: <DollarSign size={20} className="text-white" />,
      bg: "from-emerald-500 to-emerald-700",
      label: "Total Pool",
      value: 0,
    },
    {
      icon: <Users size={20} className="text-white" />,
      bg: "from-indigo-500 to-indigo-700",
      label: "Active Traders",
      value: 0,
    },
    {
      icon: <Target size={20} className="text-white" />,
      bg: "from-red-500 to-orange-600",
      label: "Your Rank (click to view)",
      value: 0,
    },
  ]);

  useEffect( () => {
    const fetchStats = async () => {
      try{
        const data = await getStats();

        setStats((prev) => [
          {
            ...prev[0],
            value: data.activeTrades,
          },
          {
            ...prev[1],
            value: data.totalPool,
          },
          {
            ...prev[2],
            value: data.activeTraders,
          },
          {
            ...prev[3],
            value: data.rank,
          },
        ]);
      }catch(error){
        console.error(error);
      }
    }
    fetchStats();
  },[]);

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
