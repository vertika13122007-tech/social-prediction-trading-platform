import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon, User, Palette, Bell, Lock,
  Sun, Moon, Monitor, Save, Eye, EyeOff, Shield,
  Mail, AtSign, ChevronRight, Check,
  Volume2, ShieldAlert, Users, TrendingUp, AlertTriangle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateUsername, changePassword, getNotificationSettings, updateNotificationSettings } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { playClickSound } from "../utils/soundUtils";

// Reusable toggle switch
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
        checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// Section wrapper with icon header
function SettingsSection({ icon, iconBg, title, desc, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white text-base">{title}</h2>
          {desc && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="px-5 sm:px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  const { darkMode, setDarkMode } = useTheme();

  // ── Account state ──
  const [username, setUsername] = useState("");
  const [savedAccount, setSavedAccount] = useState(false);
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // ── Appearance state ──
  const [themeMode, setThemeMode] = useState(darkMode ? "dark" : "light");

  // ── Admin Notifications state ──
  const [adminNotifSettings, setAdminNotifSettings] = useState(() => {
    const saved = localStorage.getItem("adminNotifSettings");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      systemAlerts: true,
      newRegistrations: true,
      highVolumeTrades: true,
      disputeAlerts: true,
      payoutAlerts: true,
      sound: true,
    };
  });

  // ── Security state ──
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    if (mode === "dark") setDarkMode(true);
    else if (mode === "light") setDarkMode(false);
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.name);
    }
  }, [user]);

  const handleSaveAccount = async () => {
    try {
      const response = await updateUsername(username);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      setSavedAccount(true);
      setTimeout(() => setSavedAccount(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update username.");
    }
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getNotificationSettings();
        if (settings) {
          setAdminNotifSettings((prev) => {
            const merged = { ...prev, ...settings };
            localStorage.setItem("adminNotifSettings", JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchSettings();
  }, []);

  const toggleAdminNotif = async (key) => {
    const nextVal = !adminNotifSettings[key];
    const updated = {
      ...adminNotifSettings,
      [key]: nextVal,
    };
    setAdminNotifSettings(updated);
    localStorage.setItem("adminNotifSettings", JSON.stringify(updated));

    if (nextVal) {
      playClickSound();
    }

    try {
      await updateNotificationSettings(updated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      return alert("Please fill all fields.");
    }

    if (newPwd !== confirmPwd) {
      return alert("Passwords do not match.");
    }

    if (newPwd.length < 6) {
      return alert("Password must be at least 6 characters.");
    }

    try {
      await changePassword(currentPwd, newPwd);
      alert("Password changed successfully.\nRedirecting to login...");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setShowPasswordModal(false);
      setTimeout(() => {
        logout();
        navigate("/");
      }, 1200);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      {/* ── Page Heading ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-md">
            <SettingsIcon size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Admin Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Manage administrator account preferences & security controls
            </p>
          </div>
        </div>
      </div>

      {/* ── Vertical sections stack ── */}
      <div className="space-y-5">

        {/* ════ ACCOUNT SETTINGS ════ */}
        <SettingsSection
          icon={<User size={19} className="text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          title="Admin Account Settings"
          desc="Update your administrator profile details"
        >
          {/* Role badge */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2.5">
              <Shield size={18} className="text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs font-bold text-purple-900 dark:text-purple-200">Account Privilege</p>
                <p className="text-[11px] text-purple-600 dark:text-purple-400">Full System Administrator Access</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              Admin
            </span>
          </div>

          {/* Username */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <AtSign size={12} /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Mail size={12} />
              Email Address
            </label>

            <div className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                {user?.email}
              </span>

              <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                🔒 Locked
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Your administrator email address is permanently linked for platform management and audit security.
            </p>
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveAccount}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-sm font-semibold transition shadow-sm"
          >
            {savedAccount ? <Check size={16} /> : <Save size={16} />}
            {savedAccount ? "Saved!" : "Save Username"}
          </button>
        </SettingsSection>

        {/* ════ APPEARANCE ════ */}
        <SettingsSection
          icon={<Palette size={19} className="text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          title="Appearance"
          desc="Customize how the Admin Panel looks"
        >
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 block">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { mode: "light",  icon: <Sun size={20} />,     label: "Light"  },
                { mode: "dark",   icon: <Moon size={20} />,    label: "Dark"   },
                { mode: "system", icon: <Monitor size={20} />, label: "System" },
              ].map((opt) => (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => handleThemeChange(opt.mode)}
                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all relative ${
                    themeMode === opt.mode
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {opt.icon}
                  <span className="text-xs font-semibold">{opt.label}</span>
                  {themeMode === opt.mode && (
                    <span className="absolute top-2 right-2 text-blue-600 dark:text-blue-400"><Check size={14} /></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* ════ NOTIFICATIONS & SYSTEM ALERTS ════ */}
        <SettingsSection
          icon={<Bell size={19} className="text-orange-600 dark:text-orange-400" />}
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          title="System & Audit Notifications"
          desc="Choose platform events you want to be alerted about"
        >
          {[
            { key: "systemAlerts",     icon: <ShieldAlert size={15} />,   label: "System & Maintenance Alerts", desc: "Critical system errors, database sync & server health" },
            { key: "newRegistrations", icon: <Users size={15} />,         label: "New User Registrations",       desc: "Receive alerts when new traders join the platform" },
            { key: "highVolumeTrades", icon: <TrendingUp size={15} />,    label: "High Volume Trades",           desc: "Alerts when unusually high trade activity is detected" },
            { key: "disputeAlerts",    icon: <AlertTriangle size={15} />, label: "Market Dispute Alerts",        desc: "Notifications for market resolution flags or reports" },
            { key: "payoutAlerts",     icon: <Check size={15} />,         label: "Automatic Payout Distributions", desc: "Notifications when market rewards are distributed" },
            { key: "sound",            icon: <Volume2 size={15} />,       label: "Sound Effects",                desc: "Play sound for admin notifications" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-gray-400 dark:text-gray-500 shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.label}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{item.desc}</p>
                </div>
              </div>
              <Toggle checked={adminNotifSettings[item.key] || false} onChange={() => toggleAdminNotif(item.key)} />
            </div>
          ))}
        </SettingsSection>

        {/* ════ PRIVACY & SECURITY ════ */}
        <SettingsSection
          icon={<Lock size={19} className="text-red-600 dark:text-red-400" />}
          iconBg="bg-red-100 dark:bg-red-900/30"
          title="Security & Access Control"
          desc="Manage administrator password and security preferences"
        >
          {/* Change Password */}
          <button
            type="button"
            onClick={() => setShowPasswordModal(!showPasswordModal)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Change Admin Password</p>
                <p className="text-[11px] text-gray-400">Update your administrative account password</p>
              </div>
            </div>
            <ChevronRight size={16} className={`text-gray-400 transition-transform ${showPasswordModal ? "rotate-90" : ""}`} />
          </button>

          {showPasswordModal && (
            <div className="space-y-3 pl-3 pr-1 py-2 border-l-2 border-blue-200 dark:border-blue-900 ml-2">
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <input
                type={showPwd ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button 
                type="button"
                onClick={handleChangePassword}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
              >
                Update Password
              </button>
            </div>
          )}
        </SettingsSection>

      </div>
    </div>
  );
}
