import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Mail,
  TrendingUp,
  Trophy,
  Wallet,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  User,
} from "lucide-react";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import { getAchievements, getProfile , getProfileSummary, getRecentTransactions, getPortfolioSummary} from "../api/profileApi";


const tabs = [
  { key: "history", label: "Trading History" },
  { key: "achievements", label: "Achievements" },
];

const badgeStyles = {
  credit:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",

  deposit:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",

  withdrawal:
    "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",

  market_buy:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",

  market_sell:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
};

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");
  const [darkMode, setDarkMode] = useState(false);
  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    rank: "",
    avatarUrl: null,
  });
  const [summary, setSummary] = useState({
    totalTrades: 0,
    winRate: 0,
    walletBalance: 0,
  });
  const [activity, setActivity] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [portfolio, setPortfolio] = useState({
        totalInvested: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0
    });
    const stats = [
    {
      label: "Total Trades",
      value: summary.totalTrades,
      Icon: TrendingUp,
    },
    {
      label: "Win Rate",
      value: `${summary.winRate}%`,
      Icon: Trophy,
    },
    {
      label: "Wallet Balance",
      value: `₹${walletBalance.toLocaleString()}`,
      Icon: Wallet,
    },
  ];

  // Always start light on mount
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {

    const fetchProfile = async () => {

      try {
        const data = await getProfile();

        setUser({
          username: data.name,
          email: data.email,
          walletBalance: data.walletBalance,
          rank: data.rank,
          avatarUrl:
            data.avatar ||
            `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
              data.name
            )}`,
        });

        setWalletBalance(data.walletBalance);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();

  }, []);

  useEffect( () => {

    const fetchSummary = async () => {

      const data = await getProfileSummary();

      setSummary(data);

      };

    fetchSummary();
    
  },[]);

  useEffect( () => {

    const fetchActivity = async () => {

      const activity = await getRecentTransactions();

      setActivity(activity);

    }

    fetchActivity();

  },[]);

  useEffect( () => {

    const fetchAchievements = async () => {

      const data = await getAchievements();

      setAchievements(data);

    };

    fetchAchievements();

  },[]);

  useEffect(() => {

    const fetchPortfolio = async () => {

      const data = await getPortfolioSummary();

      setPortfolio(data);

    };

    fetchPortfolio();

  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] transition-colors duration-300">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        liveUpdatesOpen={liveUpdatesOpen}
        setLiveUpdatesOpen={setLiveUpdatesOpen}
      />

      <div className="flex max-w-screen-xl mx-auto">
      <main className="flex-1 min-w-0">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Profile banner */}
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8
                     bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600
                     shadow-lg shadow-blue-500/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-3xl font-bold text-white">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user?.name}
                </h1>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Rank #{user?.rank?? "Unranked"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 self-start rounded-full bg-white/20 px-4 py-2
                         text-sm font-semibold text-white backdrop-blur-sm
                         transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 hover:shadow-xl"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 dark:border-slate-800
                         bg-white dark:bg-slate-900/60 p-6 shadow-sm
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Icon className="h-4 w-4 text-blue-500 dark:text-cyan-400" />
                {label}
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
        
        {/* Portfolio */}
        <div
          className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800
                    bg-white dark:bg-slate-900/60 p-6 shadow-sm
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
            📊 Portfolio Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Invested
              </p>

              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                ₹{portfolio.totalInvested.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Current Value
              </p>

              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                ₹{portfolio.totalCurrentValue.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Profit / Loss
              </p>

              <p
                className={`text-2xl font-bold mt-2 ${
                  portfolio.totalProfitLoss >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {portfolio.totalProfitLoss >= 0 ? "+" : "-"}₹
                {Math.abs(portfolio.totalProfitLoss).toLocaleString()}
              </p>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-1.5 shadow-sm">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm">
          {activeTab === "history" ? (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>

              {activity.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No activity yet. Your trades and transactions will show up here.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {activity.map((item) => {
                    const isCredit = [
                      "credit",
                      "deposit",
                      "market_sell",
                    ].includes(item.type);

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4
                                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className={`flex items-center justify-end gap-1 text-sm font-bold ${
                              isCredit
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            {isCredit ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}

                            {isCredit ? "+" : "-"}₹
                            {Math.abs(item.amount).toLocaleString()}
                          </p>

                          <span
                            className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                              badgeStyles[item.type]
                            }`}
                          >
                            {item.type
                              .replaceAll("_", " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Achievements
              </h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievements.map(({ id, label, unlocked }) => (
                  <div
                    key={id}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center
                                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      unlocked
                        ? "border-blue-200 dark:border-cyan-900 bg-blue-50 dark:bg-cyan-500/10"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        unlocked
                          ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {unlocked ? (
                          <Trophy className="h-5 w-5 text-yellow-400" />
                      ) : (
                          <Lock className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      </main>

      {/* ── Desktop sidebar ── */}
      {liveUpdatesOpen && (
        <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
        </aside>
      )}
      </div>

      {/* ── Mobile: slide-in panel from right — NO backdrop, NO dimming ── */}
      {liveUpdatesOpen && (
        <div className="lg:hidden fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-72 max-w-[85vw] flex flex-col bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800">
          <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
        </div>
      )}
    </div>
  );
}