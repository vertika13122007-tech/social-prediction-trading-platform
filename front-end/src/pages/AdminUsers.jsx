import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, Mail, Wallet, Calendar, RefreshCw, Shield, DollarSign } from "lucide-react";
import { getAllUsers } from "../api/userApi";

const fmtMoney = (val) => Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load user accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(q);
    const emailMatch = u.email?.toLowerCase().includes(q);
    return nameMatch || emailMatch;
  });

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase">
              Admin Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            View registered user accounts and wallet balances ({users.length} total users)
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Users
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user by username or email..."
          className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition shadow-sm"
        />
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <RefreshCw size={28} className="animate-spin text-blue-500 mb-3" />
          <p className="text-sm font-medium">Loading user accounts...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 text-sm">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <UserCheck size={28} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">No users found</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {search ? `No accounts match "${search}"` : "No registered user accounts found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((u) => {
            const isAdmin = u.role === "ADMIN";
            return (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col justify-between gap-3.5 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 group"
              >
                {/* Top Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                      isAdmin
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-200 dark:shadow-none"
                        : "bg-gradient-to-br from-blue-500 to-teal-500 shadow-md shadow-blue-200 dark:shadow-none"
                    }`}>
                      {u.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate leading-tight">
                        {u.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 truncate mt-0.5">
                        <Mail size={11} className="shrink-0" />
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                    isAdmin
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                  }`}>
                    {u.role || "USER"}
                  </span>
                </div>

                {/* Money & Account Stats */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 flex items-center gap-1">
                      <Wallet size={11} className="text-emerald-500" /> Wallet Balance
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{fmtMoney(u.walletBalance)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5 flex items-center gap-1">
                      <Shield size={11} className="text-blue-500" /> Saved Trades
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      {u.savedMarkets?.length || 0} Saved
                    </p>
                  </div>
                </div>

                {/* Account Details Footer */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800/60">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
