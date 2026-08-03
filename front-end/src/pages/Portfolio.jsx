import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import {
  TrendingUp, Clock, DollarSign,
  Lock, CheckCircle, XCircle, Search,
  ShoppingBag, Award, RefreshCw, Gift,
  ArrowUpRight, ArrowDownLeft, Wallet, X,
  BarChart3, Activity
} from "lucide-react";
import { getPortfolio, getTradingHistory } from "../api/portfolioApi";
import { getOpenMarkets } from "../api/marketApi";
import { buyShares, sellShares } from "../api/positionApi";

// ─── DATA CONFIGS ────────────────────────────────────────────────────────────
const HIST_FILTERS = ["All", "Bought", "Sold", "Won", "Lost", "Rewards"];

const typeConfig = {
  Won:     { icon: <Award size={15} />,        color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  Lost:    { icon: <XCircle size={15} />,      color: "text-red-500",                           bg: "bg-red-100 dark:bg-red-900/30",         badge: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"               },
  Bought:  { icon: <ShoppingBag size={15} />,  color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-100 dark:bg-blue-900/30",       badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"           },
  Sold:    { icon: <ArrowUpRight size={15} />, color: "text-purple-600 dark:text-purple-400",   bg: "bg-purple-100 dark:bg-purple-900/30",   badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"   },
  Partial: { icon: <Activity size={15} />,     color: "text-orange-500",                        bg: "bg-orange-100 dark:bg-orange-900/30",   badge: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"  },
  Reward:  { icon: <Gift size={15} />,         color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  Refund:  { icon: <RefreshCw size={15} />,    color: "text-teal-500",                          bg: "bg-teal-100 dark:bg-teal-900/30",       badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"          },
};

const categoryColors = {
  Sports:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Creators: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Trends:   "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Products: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Memes:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-700",
};

// ─── SELL MODAL ───────────────────────────────────────────────────────────────
function SellModal({ position, onClose, onSuccess }) {
  const [qty, setQty] = useState(position.qty);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const pct = Math.round((qty / position.qty) * 100);
  const estReturn = +(qty * position.currentPrice * 100).toFixed(0);
  const pnl = estReturn - Math.round(qty * position.buyPrice * 100);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSell = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await sellShares(position.marketId || position.id, position.prediction, qty);
      setLoading(false);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg(err.response?.data?.message || "Failed to sell shares");
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500" />
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center px-8 py-12 gap-4">
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }} className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
                  <CheckCircle size={42} className="text-white" strokeWidth={1.8} />
                </div>
                <motion.div initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.9, delay: 0.2 }} className="absolute inset-0 rounded-full bg-emerald-400/30" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sold Successfully!</h3>
                <p className="text-gray-400 text-sm mt-1">₹{estReturn.toLocaleString()} will be credited to your wallet.</p>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg">Done</button>
            </motion.div>
          ) : (
            <motion.div key="form" className="px-6 py-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Sell Position</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{position.title}</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition-all">
                  <X size={17} />
                </button>
              </div>
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-800">
                  {errorMsg}
                </div>
              )}
              {/* Qty */}
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quantity to Sell</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all">−</button>
                  <div className="flex-1 text-center font-bold text-2xl text-gray-900 dark:text-white">{qty}</div>
                  <button onClick={() => setQty(Math.min(position.qty, qty + 1))} className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-md">+</button>
                </div>
                <div className="flex gap-2 mt-3">
                  {[25, 50, 75, 100].map(p => (
                    <button key={p} onClick={() => setQty(Math.round((position.qty * p) / 100))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.04] active:scale-95 ${pct === p ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
              {/* Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-4 space-y-2">
                {[
                  { l: "Selling",       v: `${qty} / ${position.qty} shares` },
                  { l: "Est. Return",   v: `₹${estReturn.toLocaleString()}`, c: true },
                  { l: "Profit / Loss", v: `${pnl >= 0 ? "+" : ""}₹${pnl.toLocaleString()}`, c: true, green: pnl >= 0 },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{row.l}</span>
                    <span className={`text-xs font-bold ${row.green === true ? "text-emerald-600 dark:text-emerald-400" : row.green === false ? "text-red-500 dark:text-red-400" : "text-gray-800 dark:text-white"}`}>{row.v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:border-gray-300 active:scale-95 transition-all">Cancel</button>
                <motion.button onClick={handleSell} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Selling…</> : <>Confirm Sell</>}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── BUY MODAL ───────────────────────────────────────────────────────────────
function BuyModal({ item, onClose, onSuccess }) {
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const total = +(qty * item.sellPrice * 100).toFixed(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBuy = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await buyShares(item.marketId || item.id, item.prediction, qty);
      setLoading(false);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMsg(err.response?.data?.message || "Failed to buy position");
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500" />
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center px-8 py-12 gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
                <CheckCircle size={42} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Position Bought!</h3>
                <p className="text-gray-400 text-sm mt-1">₹{total.toLocaleString()} deducted from wallet.</p>
              </div>
              <button onClick={onClose} className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg">Done</button>
            </motion.div>
          ) : (
            <motion.div key="form" className="px-6 py-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Buy Position</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.market}</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"><X size={17} /></button>
              </div>
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-800">
                  {errorMsg}
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 space-y-2 border border-gray-100 dark:border-gray-700/50">
                {[
                  { l: "Seller",     v: item.seller },
                  { l: "Prediction", v: item.prediction, green: item.prediction === "YES" },
                  { l: "Price/Share",v: `₹${(item.sellPrice * 100).toFixed(0)}` },
                  { l: "Available",  v: `${item.qty} shares` },
                  { l: "ROI",        v: item.roi, green: true },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{r.l}</span>
                    <span className={`text-xs font-bold ${r.green === true ? "text-emerald-600 dark:text-emerald-400" : r.green === false ? "text-red-500" : "text-gray-800 dark:text-white"}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all">−</button>
                  <div className="flex-1 text-center font-bold text-2xl text-gray-900 dark:text-white">{qty}</div>
                  <button onClick={() => setQty(Math.min(item.qty, qty + 1))} className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-md">+</button>
                </div>
              </div>
              <div className="flex justify-between px-4 py-3 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-800/30">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Payable</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:border-gray-300 active:scale-95 transition-all">Cancel</button>
                <motion.button onClick={handleBuy} disabled={loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Buying…</> : <>Buy Position</>}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [darkMode,        setDarkMode]        = useState(false);
  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);
  const [activeTab,       setActiveTab]       = useState("Open Positions");
  const [sellPosition,    setSellPosition]    = useState(null);
  const [buyItem,         setBuyItem]         = useState(null);
  const [histFilter,      setHistFilter]      = useState("All");
  const [search,          setSearch]          = useState("");

  const [portfolioData, setPortfolioData] = useState({
    totalInvested: 0,
    totalCurrentValue: 0,
    totalProfitLoss: 0,
    positions: []
  });
  const [marketplace, setMarketplace] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.documentElement.classList.remove("dark"); }, []);
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else          document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [portRes, marketRes, histRes] = await Promise.allSettled([
        getPortfolio(),
        getOpenMarkets(),
        getTradingHistory()
      ]);

      if (portRes.status === "fulfilled" && portRes.value) {
        setPortfolioData(portRes.value);
      }
      if (marketRes.status === "fulfilled" && marketRes.value) {
        const formattedMarketplace = (marketRes.value || []).flatMap(m => [
          {
            id: `${m._id}-YES`,
            marketId: m._id,
            seller: m.createdBy?.name || "Market Creator",
            market: m.title,
            prediction: "YES",
            sellPrice: m.yesPrice ? m.yesPrice / 10 : 0.5,
            roi: `+${((10 - (m.yesPrice || 5)) / (m.yesPrice || 5) * 100).toFixed(1)}%`,
            qty: 100,
            listed: new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          },
          {
            id: `${m._id}-NO`,
            marketId: m._id,
            seller: m.createdBy?.name || "Market Creator",
            market: m.title,
            prediction: "NO",
            sellPrice: m.noPrice ? m.noPrice / 10 : 0.5,
            roi: `+${((10 - (m.noPrice || 5)) / (m.noPrice || 5) * 100).toFixed(1)}%`,
            qty: 100,
            listed: new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
        ]);
        setMarketplace(formattedMarketplace);
      }
      if (histRes.status === "fulfilled" && histRes.value) {
        setHistory(histRes.value || []);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalInvest  = portfolioData.totalInvested || 0;
  const totalPnl     = portfolioData.totalProfitLoss || 0;
  const totalReturn  = portfolioData.totalCurrentValue || (totalInvest + totalPnl);
  const openPositionsList = portfolioData.positions || [];

  const filteredHist = history.filter(h => {
    const matchFilter = histFilter === "All" || h.type === histFilter || (histFilter === "Rewards" && h.type === "Reward");
    const matchSearch = h.market.toLowerCase().includes(search.toLowerCase()) || h.txId.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} liveUpdatesOpen={liveUpdatesOpen} setLiveUpdatesOpen={setLiveUpdatesOpen} />

      <div className="flex max-w-7xl mx-auto">
        <main className="flex-1 min-w-0 px-4 py-6 space-y-6">

          {/* ── Heading ── */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
              <BarChart3 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your open positions and trade history</p>
            </div>
          </div>

          {/* ── Summary cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Invested", value: `₹${totalInvest.toLocaleString()}`, icon: <DollarSign size={18} />, bg: "bg-blue-100 dark:bg-blue-900/30", ic: "text-blue-600 dark:text-blue-400" },
              { label: "Current Value",  value: `₹${totalReturn.toLocaleString()}`, icon: <Wallet size={18} />,     bg: "bg-teal-100 dark:bg-teal-900/30",  ic: "text-teal-600 dark:text-teal-400"  },
              { label: "Total P&L",      value: `${totalPnl >= 0 ? "+" : ""}₹${totalPnl.toLocaleString()}`, icon: <TrendingUp size={18} />, bg: totalPnl >= 0 ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30", ic: totalPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500" },
              { label: "Positions",      value: `${openPositionsList.length} Active`,  icon: <Activity size={18} />,   bg: "bg-purple-100 dark:bg-purple-900/30", ic: "text-purple-600 dark:text-purple-400" },
            ].map((s, i) => (
              <motion.div key={i} variants={cardVariants} initial="hidden" animate="show"
                whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }} transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.ic} flex items-center justify-center mb-2`}>{s.icon}</div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">{s.label}</p>
                <p className="font-bold text-gray-900 dark:text-white text-base">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-800 shadow-sm flex gap-1.5 sticky top-16 z-20">
            {["Open Positions", "History"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ════ OPEN POSITIONS ════ */}
            {activeTab === "Open Positions" && (
              <motion.div key="open" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-6">

                {openPositionsList.length > 0 ? (
                  <div className="space-y-4">
                    {openPositionsList.map((pos, i) => {
                      const isProfit = pos.pnl >= 0;
                      const isLive   = pos.status === "LIVE";
                      return (
                        <motion.div key={pos.id} variants={cardVariants} initial="hidden" animate="show" transition={{ delay: i * 0.07 }}
                          whileHover={{ y: -3, boxShadow: "0 20px 48px rgba(0,0,0,0.10)" }}
                          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group">

                          {/* Header row */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColors[pos.category] || "bg-gray-100 text-gray-600"}`}>{pos.category}</span>
                                {isLive
                                  ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE</span>
                                  : <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400"><Lock size={10} />CLOSED</span>
                                }
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pos.prediction === "YES" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                                  {pos.prediction === "YES" ? "🟢" : "🔴"} {pos.prediction}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{pos.title}</h3>
                            </div>
                            {/* P&L badge */}
                            <div className={`shrink-0 px-3 py-1.5 rounded-xl text-center ${isProfit ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                              <p className={`text-xs font-bold ${isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{pos.pnl >= 0 ? "+" : ""}₹{Math.abs(pos.pnl).toLocaleString()}</p>
                              <p className={`text-[10px] font-semibold ${isProfit ? "text-emerald-500" : "text-red-400"}`}>{pos.roi}</p>
                            </div>
                          </div>

                          {/* Stats grid */}
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                            {[
                              { l: "Buy Price",     v: `₹${(pos.buyPrice * 100).toFixed(0)}` },
                              { l: "Curr. Price",   v: `₹${(pos.currentPrice * 100).toFixed(0)}` },
                              { l: "Quantity",      v: pos.qty },
                              { l: "Invested",      v: `₹${pos.totalInvest.toLocaleString()}` },
                              { l: "Win Prob",      v: `${pos.winProb}%` },
                              { l: "Investors",     v: pos.investors },
                            ].map((s, j) => (
                              <div key={j} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2 border border-gray-100 dark:border-gray-700/30">
                                <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-0.5">{s.l}</p>
                                <p className="text-xs font-bold text-gray-800 dark:text-white">{s.v}</p>
                              </div>
                            ))}
                          </div>

                          {/* Win prob bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                              <span>Win Probability</span><span>{pos.winProb}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pos.winProb}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                                className={`h-full rounded-full ${pos.winProb >= 60 ? "bg-gradient-to-r from-emerald-500 to-teal-500" : pos.winProb >= 40 ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-red-500 to-rose-500"}`} />
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500"><Clock size={11} />{pos.timeLeft}</span>
                            {isLive ? (
                              <button onClick={() => setSellPosition(pos)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-xs font-bold hover:scale-[1.04] active:scale-95 transition-all shadow-md hover:shadow-lg">
                                <ArrowUpRight size={13} /> Sell
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs font-semibold cursor-not-allowed">
                                <Lock size={12} /> Market Closed
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                      <BarChart3 size={28} className="text-blue-500" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">No Active Positions</h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">You don't have any open prediction positions right now. Browse the marketplace below or trade on open markets to get started!</p>
                  </div>
                )}

                {/* ── Marketplace ── */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag size={18} className="text-blue-500" />
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">Marketplace</h2>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Buy positions from other traders</span>
                  </div>
                  {marketplace.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {marketplace.map((item, i) => (
                        <motion.div key={item.id} variants={cardVariants} initial="hidden" animate="show" transition={{ delay: 0.3 + i * 0.07 }}
                          whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(0,0,0,0.09)" }}
                          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Seller</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{item.seller}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.prediction === "YES" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                              {item.prediction === "YES" ? "🟢" : "🔴"} {item.prediction}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{item.market}</p>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {[
                              { l: "Price",    v: `₹${(item.sellPrice * 100).toFixed(0)}` },
                              { l: "ROI",      v: item.roi },
                              { l: "Available",v: `${item.qty} shares` },
                            ].map((s, j) => (
                              <div key={j} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2 text-center">
                                <p className="text-[9px] text-gray-400 mb-0.5">{s.l}</p>
                                <p className="text-xs font-bold text-gray-800 dark:text-white">{s.v}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-400">{item.listed}</span>
                            <button onClick={() => setBuyItem(item)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xs font-bold hover:scale-[1.04] active:scale-95 transition-all shadow-md hover:shadow-lg">
                              <ArrowDownLeft size={13} /> Buy Position
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                      <p className="text-sm text-gray-400">No active marketplace listings currently available.</p>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* ════ HISTORY ════ */}
            {activeTab === "History" && (
              <motion.div key="hist" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-4">

                {/* Filters + Search */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search market or transaction ID…"
                      className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all" />
                  </div>
                  {/* Filter chips */}
                  <div className="flex gap-1.5 flex-wrap">
                    {HIST_FILTERS.map(f => (
                      <button key={f} onClick={() => setHistFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.04] active:scale-95 ${
                          histFilter === f
                            ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* History list */}
                {filteredHist.length > 0 ? (
                  <div className="space-y-3">
                    {filteredHist.map((h, i) => {
                      const cfg = typeConfig[h.type] || typeConfig["Bought"];
                      const hasPnl = h.pnl !== 0;
                      return (
                        <motion.div key={h.id} variants={cardVariants} initial="hidden" animate="show" transition={{ delay: i * 0.06 }}
                          whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-250 flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>{cfg.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{h.type}</span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{h.txId}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{h.market}</p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{h.date}</p>
                              </div>
                              <div className="text-right shrink-0">
                                {h.invested > 0 && <p className="text-xs text-gray-500 dark:text-gray-400">₹{h.invested.toLocaleString()}</p>}
                                {h.returned > 0 && <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">→ ₹{h.returned.toLocaleString()}</p>}
                                {hasPnl && (
                                  <p className={`text-sm font-bold ${h.pnl > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                                    {h.pnl > 0 ? "+" : ""}₹{h.pnl.toLocaleString()}
                                  </p>
                                )}
                                <span className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                                  <CheckCircle size={9} className="text-emerald-400" />{h.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                      <Activity size={28} className="text-blue-300 dark:text-blue-600" />
                    </div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">No transactions found</p>
                    <p className="text-sm text-gray-400 mt-1">Try changing your filter or search term.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Desktop Live Updates */}
        {liveUpdatesOpen && (
          <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
            <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
          </aside>
        )}
      </div>

      {/* Mobile Live Updates */}
      {liveUpdatesOpen && (
        <div className="lg:hidden fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-72 max-w-[85vw] flex flex-col bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800">
          <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {sellPosition && <SellModal position={sellPosition} onClose={() => setSellPosition(null)} onSuccess={loadData} />}
        {buyItem      && <BuyModal  item={buyItem}          onClose={() => setBuyItem(null)}      onSuccess={loadData} />}
      </AnimatePresence>
    </div>
  );
}