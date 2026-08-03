import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, TrendingUp, Users, Wallet,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, TrendingDown, Trophy
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard",   icon: LayoutDashboard, path: "/admin",            color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/30"    },
  { label: "Markets",     icon: TrendingUp,       path: "/admin/markets",    color: "text-teal-500",   bg: "bg-teal-50 dark:bg-teal-900/30"    },
  { label: "Users",       icon: Users,            path: "/admin/users",      color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/30"},
  { label: "Leaderboard", icon: Trophy,           path: "/admin/leaderboard",color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-900/30" },
  { label: "Analytics",   icon: BarChart3,        path: "/admin/analytics",  color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/30"},
  { label: "Settings",    icon: Settings,         path: "/admin/settings",   color: "text-gray-500",   bg: "bg-gray-100 dark:bg-gray-800"      },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isActive = (path) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  const handleNav = (path) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  const SidebarContent = ({ collapsed }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-gray-800 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shrink-0">
          <TrendingDown size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Live Market</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span className={`shrink-0 ${active ? "text-white" : item.color} group-hover:scale-110 transition-transform duration-200`}>
                <item.icon size={18} />
              </span>
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {active && !collapsed && (
                <motion.div layoutId="activeIndicator" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      {!mobileSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center py-3 border-t border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-sm z-20 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <SidebarContent collapsed={!sidebarOpen} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shadow-xl z-40"
          >
            <SidebarContent collapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}