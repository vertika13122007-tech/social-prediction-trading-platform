import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search, Bell, Moon, Sun, TrendingUp,
  Menu, X, PanelRightOpen, PanelRightClose,
  User, Settings, LogOut
} from "lucide-react";
import { getWallet } from "../api/walletApi";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ darkMode, setDarkMode, liveUpdatesOpen, setLiveUpdatesOpen, searchTerm, setSearchTerm }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onNotifications = location.pathname === "/notifications";
  const onHome = location.pathname === "/home";
  const onWallet = location.pathname === "/wallet";

  // Close profile dropdown on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() =>{
    const fetchWallet = async () =>{
      try{

        const wallet = await getWallet();

        setBalance(wallet.walletBalance);

      }catch(error){
        console.error(error);
      }
    };

    fetchWallet();

  },[]);

  const handleProfileNav = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-2">

        {/* Logo */}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Bell */}
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
            {!onNotifications && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                3
              </span>
            )}
          </button>

          {/* Wallet */}
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
            <span>{balance}</span>
          </button>

          {/* ── Profile Avatar + Dropdown ── */}
          <div className="relative shrink-0" ref={profileRef}>
            {/* Avatar button */}
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              title="Profile"
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md hover:shadow-purple-300/40 dark:hover:shadow-purple-900/40 ${
                profileOpen
                  ? "ring-2 ring-purple-400 ring-offset-2 dark:ring-offset-gray-950 scale-110"
                  : ""
              }`}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-gray-900/60 py-1.5 z-50 animate-[profileDropIn_0.2s_ease]">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{user?.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {/* Profile */}
                  <button
                    onClick={() => handleProfileNav("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-xl mx-auto hover:text-gray-900 dark:hover:text-white group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <User size={14} className="text-blue-600 dark:text-blue-400" />
                    </span>
                    Profile
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => handleProfileNav("/settings")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-xl mx-auto hover:text-gray-900 dark:hover:text-white group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <Settings size={14} className="text-gray-600 dark:text-gray-400" />
                    </span>
                    Settings
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 rounded-xl mx-auto group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <LogOut size={14} className="text-red-500" />
                    </span>
                    Logout
                  </button>
                </div>
              </div>
            )}
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
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">snehar.2536</span>
          </div>
        </div>
      )}
    </nav>
  );
}