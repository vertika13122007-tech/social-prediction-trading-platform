import { useState } from "react";
import { Search, Bell, Moon, Sun, RefreshCw, Plus, Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHeader({ darkMode, setDarkMode, onMenuClick }) {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Menu size={18} />
        </button>

        {/* Title */}
        <div className="hidden sm:block">
          <h1 className="font-bold text-gray-900 dark:text-white text-base leading-tight">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">Welcome back, Admin 👋</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-auto sm:mx-0 sm:ml-4 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users, markets, trades…"
            className="w-full pl-8 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 border border-transparent focus:border-blue-400 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Refresh"
          >
            <motion.div animate={refreshing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.8, ease: "linear", repeat: refreshing ? Infinity : 0 }}>
              <RefreshCw size={17} />
            </motion.div>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <Bell size={17} />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">4</span>
          </button>

          {/* Create Market */}
          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white text-xs font-bold hover:scale-[1.03] active:scale-95 transition-all shadow-md hover:shadow-lg">
            <Plus size={14} />
            Create Market
          </button>
        </div>
      </div>
    </header>
  );
}