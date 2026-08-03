import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getAllUsers } from "../../api/userApi";

const AVATAR_COLORS = ["from-blue-500 to-indigo-600","from-purple-500 to-pink-500","from-emerald-500 to-teal-600","from-orange-500 to-red-500","from-blue-600 to-teal-500"];

export default function UsersTable() {
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers();
        setUsersList(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadUsers();
  }, []);

  const filtered = usersList.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white">Recent Users</h3>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…"
            className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-400 transition w-36"/>
        </div>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-80 overflow-y-auto">
        {filtered.slice(0, 6).map((u, i) => (
          <motion.div key={u._id || i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50/40 dark:hover:bg-gray-800/40 transition-colors group">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i%AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {u.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{u.name}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{u.email}</p>
            </div>
            <span className="text-[10px] text-gray-400 hidden sm:block shrink-0">
              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              u.role === "ADMIN"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            }`}>
              {u.role || "USER"}
            </span>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}