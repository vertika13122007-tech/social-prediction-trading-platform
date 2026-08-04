import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Users, Clock, ShieldCheck, CheckCircle2, XCircle,
  AlertCircle, RefreshCw, Trophy, Lock
} from "lucide-react";
import {
  getAdminMyMarkets,
  closeMarket as apiCloseMarket,
  declareWinner as apiDeclareWinner,
  settleMarket as apiSettleMarket
} from "../api/marketApi";
import { useAuth } from "../context/AuthContext";

const categoryColors = {
  SPORTS:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  CREATORS: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  MEMES:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-700",
  PRODUCTS: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  TRENDS:   "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

const fmtMoney = (val) => Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getTimeLeft = (endsAt) => {
  if (!endsAt) return "Closed";
  const diff = new Date(endsAt) - new Date();
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h left`;
};

export default function AdminMarkets() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("OPEN"); // "OPEN" | "CLOSED" | "SETTLED"
  
  const [openMarkets, setOpenMarkets] = useState([]);
  const [closedMarkets, setClosedMarkets] = useState([]);
  const [settledMarkets, setSettledMarkets] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // marketId currently performing action
  const [error, setError] = useState("");

  const fetchMarkets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminMyMarkets();
      setOpenMarkets(data.openMarkets || []);
      setClosedMarkets(data.closedMarkets || []);
      setSettledMarkets(data.settledMarkets || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin markets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  // Handle closing an OPEN market
  const handleCloseMarket = async (marketId) => {
    setActionLoading(marketId);
    try {
      const response = await apiCloseMarket(marketId);
      const updatedMarket = response.market;

      // Automatically move from open to closed
      setOpenMarkets((prev) => prev.filter((m) => m._id !== marketId));
      setClosedMarkets((prev) => [updatedMarket, ...prev]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to close market.");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle declaring winner and settling market
  const handleDeclareWinner = async (marketId, winningSide) => {
    if (!window.confirm(`Declare "${winningSide}" as the winning side and distribute rewards?`)) return;

    setActionLoading(marketId);
    try {
      // 1. Declare winner
      const declareRes = await apiDeclareWinner(marketId, winningSide);
      let targetMarket = declareRes.market;

      // 2. Settle market
      await apiSettleMarket(marketId);
      targetMarket.status = "SETTLED";
      targetMarket.winningSide = winningSide;

      // Automatically move from closed to settled
      setClosedMarkets((prev) => prev.filter((m) => m._id !== marketId));
      setSettledMarkets((prev) => [targetMarket, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to declare winner & settle market.");
    } finally {
      setActionLoading(null);
    }
  };

  const getActiveMarketsList = () => {
    if (activeTab === "OPEN") return openMarkets;
    if (activeTab === "CLOSED") return closedMarkets;
    if (activeTab === "SETTLED") return settledMarkets;
    return [];
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase">
              Admin Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Markets
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Manage markets created by {user?.name || "Admin"} ({openMarkets.length} Open · {closedMarkets.length} Pending Winner · {settledMarkets.length} Settled)
          </p>
        </div>

        <button
          onClick={fetchMarkets}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Markets
        </button>
      </div>

      {/* Category Tabs: Open Markets, Closed Markets, Settled Markets */}
      <div className="w-full flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200/80 dark:border-gray-800">
        {[
          { key: "OPEN", label: "Open Markets", count: openMarkets.length, color: "text-emerald-600 dark:text-emerald-400" },
          { key: "CLOSED", label: "Closed Markets", count: closedMarkets.length, color: "text-red-500 dark:text-red-400" },
          { key: "SETTLED", label: "Settled Markets", count: settledMarkets.length, color: "text-blue-600 dark:text-blue-400" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === tab.key
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200/60 dark:border-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-100 dark:bg-gray-700 ${tab.color}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <RefreshCw size={28} className="animate-spin text-blue-500 mb-3" />
          <p className="text-sm font-medium">Loading markets...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 text-sm">
          {error}
        </div>
      ) : getActiveMarketsList().length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <TrendingUp size={28} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">No {activeTab.toLowerCase()} markets found</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-sm mx-auto">
            {activeTab === "OPEN" && "You haven't created any active open markets yet."}
            {activeTab === "CLOSED" && "No closed markets awaiting winner declaration."}
            {activeTab === "SETTLED" && "No settled markets recorded yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {getActiveMarketsList().map((market) => {
            const creatorName = market.createdBy?.name || user?.name || "Admin";
            const poolVal = market.totalVolume || 0;
            const yesP = market.yesPrice || 5;
            const noP = market.noPrice || 5;

            return (
              <motion.div
                key={market._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col justify-between gap-3 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 group relative"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {creatorName[0]}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">Created by</p>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">{creatorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[market.category] || "bg-gray-100 text-gray-600"}`}>
                      {market.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      market.status === "OPEN"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : market.status === "CLOSED"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}>
                      {market.status === "OPEN" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {market.status}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug min-h-[2.5rem]">
                  {market.title}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Pool Value</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">₹{fmtMoney(poolVal)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-emerald-600 font-bold">YES ₹{Number(yesP).toFixed(2)}</span>
                      <span className="text-red-500 font-bold">NO ₹{Number(noP).toFixed(2)}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden flex bg-gray-200 dark:bg-gray-700">
                      <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${yesP * 10}%` }} />
                      <div className="bg-red-500 transition-all duration-500" style={{ width: `${noP * 10}%` }} />
                    </div>
                  </div>
                </div>

                {/* Investors & Time */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><Users size={11} />{market.participationCount || 0} traders</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{getTimeLeft(market.endsAt)}</span>
                </div>

                {/* ACTION BUTTONS BASED ON CATEGORY */}

                {/* 1. OPEN MARKETS TAB ACTION: CLOSE MARKET */}
                {activeTab === "OPEN" && (
                  <button
                    onClick={() => handleCloseMarket(market._id)}
                    disabled={actionLoading === market._id}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading === market._id ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <>
                        <Lock size={13} />
                        Close Market for Predictions
                      </>
                    )}
                  </button>
                )}

                {/* 2. CLOSED MARKETS TAB ACTION: DECLARE WINNER */}
                {activeTab === "CLOSED" && (
                  <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center">
                      Declare Winner & Settle Market
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDeclareWinner(market._id, "YES")}
                        disabled={actionLoading === market._id}
                        className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {actionLoading === market._id ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 size={13} />
                            Declare YES Winner
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeclareWinner(market._id, "NO")}
                        disabled={actionLoading === market._id}
                        className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        {actionLoading === market._id ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <>
                            <XCircle size={13} />
                            Declare NO Winner
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. SETTLED MARKETS TAB: DISPLAY WINNER BADGE */}
                {activeTab === "SETTLED" && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Winning Side:
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                      market.winningSide === "YES"
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                    }`}>
                      {market.winningSide || market.result || "SETTLED"}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
