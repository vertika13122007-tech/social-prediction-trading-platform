import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search, Bell, Moon, Sun, TrendingUp,
  Menu, X, PanelRightOpen, PanelRightClose
} from "lucide-react";

export default function Navbar({ darkMode, setDarkMode, liveUpdatesOpen, setLiveUpdatesOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onNotifications = location.pathname === "/notifications";
  const onHome = location.pathname === "/home";
  const onWallet = location.pathname === "/wallet";

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-2">

        {/* Logo — clicking goes to Home */}
        <div
          className="flex items-center gap-2 shrink-0 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg hidden sm:block">
            Live Market
          </span>
        </div>

        {/* Search */}
        <div className={`flex-1 max-w-md mx-auto relative transition-all duration-200 ${searchFocused ? "max-w-lg" : ""}`}>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trades, creators..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 border border-transparent focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">

          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Live Updates toggle */}
          <button
            onClick={() => setLiveUpdatesOpen(!liveUpdatesOpen)}
            title={liveUpdatesOpen ? "Hide Live Updates" : "Show Live Updates"}
            className={`flex items-center gap-1.5 p-2 rounded-lg transition ${
              liveUpdatesOpen
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {liveUpdatesOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </button>

          {/* ✅ Bell — navigates to /notifications, highlights when active */}
          <button
            onClick={() => navigate("/notifications")}
            title="Notifications"
            className={`relative p-2 rounded-lg transition ${
              onNotifications
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Bell size={18} />
            {/* Red dot — hide when already on notifications page */}
            {!onNotifications && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                3
              </span>
            )}
          </button>

          {/* Wallet — clickable, navigates to /wallet */}
          <button
            onClick={() => navigate("/wallet")}
            title="Wallet"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold transition ${
              onWallet
                ? "border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <span className="text-xs">🪙</span>
            <span>10,000</span>
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer shrink-0">
            S
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => { navigate("/wallet"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition ${
                onWallet
                  ? "border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-xs">🪙</span>
              <span>10,000</span>
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">snehar.2536</span>
          </div>
        </div>
      )}
    </nav>
  );
}