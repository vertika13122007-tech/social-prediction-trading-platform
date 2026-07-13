import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import {
  Settings as SettingsIcon, User, Palette, Bell, Lock,
  Sun, Moon, Monitor, Save, Eye, EyeOff, Shield,
  Smartphone, Mail, AtSign, ChevronRight, Check,
  Volume2, MessageSquare, TrendingUp, DollarSign
} from "lucide-react";

// Reusable toggle switch
function Toggle({ checked, onChange }) {
  return (
    <button
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

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // ── Account state ──
  const [username, setUsername] = useState("snehar.2536");
  const [email, setEmail] = useState("snehar.2536@example.com");
  const [savedAccount, setSavedAccount] = useState(false);

  // ── Appearance state ──
  const [themeMode, setThemeMode] = useState("light"); // light | dark | system

  // ── Notifications state ──
  const [notifSettings, setNotifSettings] = useState({
    tradeUpdates: true,
    priceAlerts: true,
    payouts: true,
    leaderboard: false,
    marketing: false,
    sound: true,
  });

  // ── Privacy / Security state ──
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    if (mode === "dark") setDarkMode(true);
    else if (mode === "light") setDarkMode(false);
    else {
      // system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  };

  const handleSaveAccount = () => {
    setSavedAccount(true);
    setTimeout(() => setSavedAccount(false), 2000);
  };

  const toggleNotif = (key) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        liveUpdatesOpen={liveUpdatesOpen}
        setLiveUpdatesOpen={setLiveUpdatesOpen}
      />

      <div className="flex max-w-7xl mx-auto">
        <main className="flex-1 min-w-0 px-4 py-6">

          {/* ── Page Heading ── */}
          <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-md">
                <SettingsIcon size={22} className="text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm ml-[3.5rem]">
              Manage your account preferences
            </p>
          </div>

          {/* ── Vertical sections stack ── */}
          <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto space-y-5 pb-10">

            {/* ════ ACCOUNT SETTINGS ════ */}
            <SettingsSection
              icon={<User size={19} className="text-blue-600 dark:text-blue-400" />}
              iconBg="bg-blue-100 dark:bg-blue-900/30"
              title="Account Settings"
              desc="Update your username and email"
            >
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
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveAccount}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-sm font-semibold transition shadow-sm"
              >
                {savedAccount ? <Check size={16} /> : <Save size={16} />}
                {savedAccount ? "Saved!" : "Save Changes"}
              </button>
            </SettingsSection>

            {/* ════ APPEARANCE ════ */}
            <SettingsSection
              icon={<Palette size={19} className="text-purple-600 dark:text-purple-400" />}
              iconBg="bg-purple-100 dark:bg-purple-900/30"
              title="Appearance"
              desc="Customize how Live Market looks"
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
                      onClick={() => handleThemeChange(opt.mode)}
                      className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all ${
                        themeMode === opt.mode
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {opt.icon}
                      <span className="text-xs font-semibold">{opt.label}</span>
                      {themeMode === opt.mode && (
                        <span className="absolute"><Check size={10} /></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </SettingsSection>

            {/* ════ NOTIFICATIONS ════ */}
            <SettingsSection
              icon={<Bell size={19} className="text-orange-600 dark:text-orange-400" />}
              iconBg="bg-orange-100 dark:bg-orange-900/30"
              title="Notifications"
              desc="Choose what you want to be notified about"
            >
              {[
                { key: "tradeUpdates", icon: <TrendingUp size={15} />,    label: "Trade Updates",   desc: "New trends and trade status changes" },
                { key: "priceAlerts",  icon: <DollarSign size={15} />,    label: "Price Alerts",    desc: "When ROI or pool value changes significantly" },
                { key: "payouts",      icon: <Check size={15} />,         label: "Payout Alerts",   desc: "When you win or receive a payout" },
                { key: "leaderboard",  icon: <ChevronRight size={15} />,  label: "Leaderboard Rank","desc": "Updates when your rank changes" },
                { key: "marketing",    icon: <MessageSquare size={15} />, label: "Marketing & Tips", desc: "Product news, tips, and promotions" },
                { key: "sound",        icon: <Volume2 size={15} />,       label: "Sound Effects",   desc: "Play sound for notifications" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-gray-400 dark:text-gray-500 shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.label}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{item.desc}</p>
                    </div>
                  </div>
                  <Toggle checked={notifSettings[item.key]} onChange={() => toggleNotif(item.key)} />
                </div>
              ))}
            </SettingsSection>

            {/* ════ PRIVACY & SECURITY ════ */}
            <SettingsSection
              icon={<Lock size={19} className="text-red-600 dark:text-red-400" />}
              iconBg="bg-red-100 dark:bg-red-900/30"
              title="Privacy & Security"
              desc="Manage your password and account protection"
            >
              {/* Change Password */}
              <button
                onClick={() => setShowPasswordModal(!showPasswordModal)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Change Password</p>
                    <p className="text-[11px] text-gray-400">Update your account password</p>
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
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                    Update Password
                  </button>
                </div>
              )}

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                <div className="flex items-center gap-3">
                  <Smartphone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Two-Factor Authentication</p>
                    <p className="text-[11px] text-gray-400">
                      {twoFA ? "Enabled — your account is extra secure" : "Add an extra layer of security"}
                    </p>
                  </div>
                </div>
                <Toggle checked={twoFA} onChange={setTwoFA} />
              </div>

              {/* Privacy Settings */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                  <Shield size={12} /> Privacy Settings
                </p>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Public Profile</p>
                    <p className="text-[11px] text-gray-400">Allow others to view your trading profile</p>
                  </div>
                  <Toggle checked={profileVisible} onChange={setProfileVisible} />
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 mt-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Show Trade Activity</p>
                    <p className="text-[11px] text-gray-400">Display your trades on the leaderboard</p>
                  </div>
                  <Toggle checked={showActivity} onChange={setShowActivity} />
                </div>
              </div>
            </SettingsSection>

          </div>
        </main>

        {/* Desktop Live Updates sidebar */}
        {liveUpdatesOpen && (
          <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
            <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
          </aside>
        )}
      </div>

      {/* Mobile Live Updates panel */}
      {liveUpdatesOpen && (
        <div className="lg:hidden fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-72 max-w-[85vw] flex flex-col bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800">
          <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
        </div>
      )}
    </div>
  );
}