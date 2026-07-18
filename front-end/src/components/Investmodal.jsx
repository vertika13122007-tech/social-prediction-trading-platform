import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, TrendingUp, TrendingDown, Users, Clock, DollarSign,
  CheckCircle, ChevronDown, ChevronUp, Zap, Shield,
  BarChart3, Activity, Flame, Star, ArrowRight, Wallet
} from "lucide-react";
import { buyShares } from "../api/positionApi";

const RECENT_ACTIVITY = [
  { user: "Rahul",  amount: "₹1,200", side: "YES", time: "2m ago"  },
  { user: "Sneha",  amount: "₹500",   side: "NO",  time: "4m ago"  },
  { user: "Aryan",  amount: "₹2,000", side: "YES", time: "7m ago"  },
  { user: "Priya",  amount: "₹800",   side: "YES", time: "11m ago" },
  { user: "Karan",  amount: "₹3,000", side: "NO",  time: "15m ago" },
  { user: "Ananya", amount: "₹1,500", side: "YES", time: "18m ago" },
];

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

const INSIGHTS = [
  { icon: <Flame size={14} className="text-orange-500" />, label: "Market Sentiment", value: "Bullish 🐂", color: "text-emerald-600" },
  { icon: <Zap size={14} className="text-yellow-500" />,   label: "AI Confidence",   value: "74% YES",   color: "text-blue-600"    },
  { icon: <BarChart3 size={14} className="text-blue-500" />,label: "Trending",        value: "#3 Today",  color: "text-purple-600"  },
  { icon: <Star size={14} className="text-amber-500" />,   label: "News Impact",     value: "High",      color: "text-orange-600"  },
];

function AnimatedNumber({ value }) {
  return <span>{value}</span>;
}

export default function InvestModal({ trade, onClose }) {
  
  const [prediction, setPrediction] = useState(null); // "YES" | "NO"
  const [amount, setAmount] = useState(500);
  const [inputVal, setInputVal] = useState("500");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const overlayRef = useRef(null);

  const yesStats = { rate: "74%", investors: "2,845", users: "68%", money: "₹18.2L", returns: "1.85x", pct: 68 };
  const noStats  = { rate: "26%", investors: "1,210", users: "32%", money: "₹8.4L",  returns: "3.20x", pct: 32 };

  const selectedStats = prediction === "YES" ? yesStats : prediction === "NO" ? noStats : null;
  const odds      = prediction === "YES" ? trade.yesPrice : trade.noPrice;
  const potential = +(amount * odds).toFixed(0);
  const profit    = potential - amount;
  const fee       = +(amount * 0.02).toFixed(0);
  const payable   = amount + fee;

  const riskMap = [
    { label: "Very Low", color: "bg-emerald-500" },
    { label: "Low",      color: "bg-teal-500"    },
    { label: "Medium",   color: "bg-yellow-500"  },
    { label: "High",     color: "bg-orange-500"  },
    { label: "Very High",color: "bg-red-500"     },
  ];
  const riskIdx   = parseInt(trade?.potentialROI) > 130 ? 3 : parseInt(trade?.potentialROI) > 100 ? 2 : 1;
  const riskLevel = riskMap[riskIdx];

  // Parse timeLeft
  const timeParts = trade?.timeLeft?.match(/(\d+)d\s*(\d+)h/) || [];
  const days = timeParts[1] || "0"; const hours = timeParts[2] || "0";

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(yesStats.pct), 400);
    return () => clearTimeout(t);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAmount = (val) => {
    const n = Math.max(0, parseInt(val) || 0);
    setAmount(n);
    setInputVal(String(n));
  };

  const handleInvest = async () => {

    console.log("Button clicked");

    if (!prediction || amount <= 0) return;

    setLoading(true);

    try {

        const shares = Number((amount / odds).toFixed(4));

        console.log({
            marketId: trade.id,
            side: prediction,
            shares
        });

        const response = await buyShares(
            trade.id,
            prediction,
            shares
        );

        console.log("API Response:", response);

        setSuccess(true);

    } catch (err) {

        console.error("API Error:", err);

        alert(
            err.response?.data?.message ||
            "Investment failed"
        );

    } finally {

        setLoading(false);

    }

  };

  const canInvest = prediction && amount > 0;

  console.log({
    prediction,
    amount,
    canInvest,
  });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-center justify-center px-3 py-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10"
      >
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 shrink-0" />

        <AnimatePresence mode="wait">
          {success ? (
            /* ══ SUCCESS ══ */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center px-8 py-14 gap-5"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0   }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200/60 dark:shadow-emerald-900/40">
                  <CheckCircle size={50} className="text-white" strokeWidth={1.8} />
                </div>
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.3, opacity: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="absolute inset-0 rounded-full bg-emerald-400/30"
                />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Investment Successful!</h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  Your prediction has been placed successfully. Good luck! 🚀
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    {prediction} · ₹{amount.toLocaleString()} · {odds}x
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  View Portfolio
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-200/50"
                >
                  Continue Trading
                </button>
              </div>
            </motion.div>

          ) : (
            /* ══ INVEST FORM ══ */
            <motion.div key="form" className="flex flex-col overflow-hidden">

              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      trade.category === "Sports"   ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                      trade.category === "Trends"   ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" :
                      trade.category === "Creators" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" :
                      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                    }`}>{trade.category}</span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2">{trade.title}</h2>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {[
                      { icon: <DollarSign size={11} />, label: trade.poolValue },
                      { icon: <TrendingUp size={11} />, label: trade.potentialROI },
                      { icon: <Users size={11} />,      label: `${trade.investors} investors` },
                      { icon: <Clock size={11} />,      label: trade.timeLeft },
                    ].map((item, i) => (
                      <span key={i} className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="text-gray-400">{item.icon}</span>{item.label}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:scale-110 active:scale-95 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">

                {/* Countdown */}
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-blue-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Market closes in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { val: days,  unit: "Days"  },
                      { val: hours, unit: "Hours" },
                      { val: "18",  unit: "Mins"  },
                    ].map((t, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 leading-none">{t.val}</span>
                        <span className="text-[9px] text-gray-400">{t.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* YES / NO Prediction */}
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Your Prediction</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["YES", "NO"].map((side) => (
                      <motion.button
                        key={side}
                        onClick={() => setPrediction(side)}
                        whileTap={{ scale: 0.97 }}
                        className={`relative flex flex-col items-center py-4 rounded-2xl border-2 transition-all duration-250 overflow-hidden ${
                          prediction === side
                            ? side === "YES"
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
                              : "border-red-400 bg-red-50 dark:bg-red-900/20 shadow-lg shadow-red-200/50 dark:shadow-red-900/30"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                        }`}
                      >
                        {prediction === side && (
                          <motion.div
                            layoutId="selectionGlow"
                            className={`absolute inset-0 ${side === "YES" ? "bg-emerald-400/10" : "bg-red-400/10"}`}
                          />
                        )}
                        <span className="text-2xl mb-1">{side === "YES" ? "🟢" : "🔴"}</span>
                        <span className={`font-bold text-lg ${
                          prediction === side
                            ? side === "YES" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}>{side}</span>
                        <span className="text-[11px] text-gray-400 mt-0.5">
                          {side === "YES" ? `${yesStats.rate} Win Rate` : `${noStats.rate} Win Rate`}
                        </span>
                        {prediction === side && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle size={14} className={side === "YES" ? "text-emerald-500" : "text-red-400"} fill="currentColor" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Prediction Stats */}
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { label: "Winning Rate",     value: selectedStats.rate     },
                      { label: "Investors",        value: selectedStats.investors },
                      { label: "Users",            value: selectedStats.users     },
                      { label: "Money Pooled",     value: selectedStats.money     },
                      { label: "Potential Return", value: selectedStats.returns   },
                      { label: "Odds",             value: `${odds}x`             },
                    ].map((s, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2.5 border border-gray-100 dark:border-gray-700/50">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">{s.label}</p>
                        <p className={`text-sm font-bold ${prediction === "YES" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{s.value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Community Distribution */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Community Distribution</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "YES", pct: yesStats.pct, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
                      { label: "NO",  pct: noStats.pct,  color: "from-red-500 to-rose-500",     bg: "bg-red-100 dark:bg-red-900/20"         },
                    ].map((bar) => (
                      <div key={bar.label} className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-7 ${bar.label === "YES" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{bar.label}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth * (bar.pct / yesStats.pct)}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 w-8 text-right">{bar.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Selector */}
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Investment Amount</p>
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => handleAmount(amount - 100)}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center"
                    >−</button>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                      <input
                        type="number"
                        value={inputVal}
                        min={0}
                        onChange={(e) => { setInputVal(e.target.value); setAmount(Math.max(0, parseInt(e.target.value) || 0)); }}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-bold text-center text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => handleAmount(amount + 100)}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-md shadow-blue-200/40"
                    >+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleAmount(q)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.04] active:scale-95 ${
                          amount === q
                            ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        ₹{q >= 1000 ? `${q/1000}K` : q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment Summary */}
                {prediction && amount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-4 space-y-2"
                  >
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3">Investment Summary</p>
                    {[
                      { label: "Prediction",        value: prediction,                   bold: true  },
                      { label: "Investment",         value: `₹${amount.toLocaleString()}` },
                      { label: "Winning Odds",       value: `${odds}x`                   },
                      { label: "Potential Return",   value: `₹${potential.toLocaleString()}`,color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Estimated Profit",   value: `₹${profit.toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Platform Fee (2%)",  value: `₹${fee}`,                   color: "text-orange-500" },
                      { label: "Total Payable",      value: `₹${payable.toLocaleString()}`,bold: true },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between py-0.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{row.label}</span>
                        <span className={`text-xs font-semibold ${row.color || "text-gray-800 dark:text-white"} ${row.bold ? "font-bold" : ""}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                    {/* Profit calculator */}
                    <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/40">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">If your prediction wins</p>
                      <div className="flex items-center justify-between">
                        {[
                          { label: "Investment", val: `₹${amount.toLocaleString()}` },
                          { label: "→", val: null },
                          { label: "Return",     val: `₹${potential.toLocaleString()}`, green: true },
                          { label: "Profit",     val: `+₹${profit.toLocaleString()}`, green: true },
                        ].map((c, i) =>
                          c.val === null ? (
                            <span key={i} className="text-gray-300 dark:text-gray-600">→</span>
                          ) : (
                            <div key={i} className="text-center">
                              <p className="text-[10px] text-gray-400">{c.label}</p>
                              <p className={`text-xs font-bold ${c.green ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>{c.val}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Risk Indicator */}
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Risk Level</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {riskMap.map((r, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= riskIdx ? riskLevel.color : "bg-gray-200 dark:bg-gray-700"}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-bold ${riskLevel.color.replace("bg-", "text-")}`}>{riskLevel.label}</span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Recent Activity</p>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-hide">
                    {RECENT_ACTIVITY.map((act, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${act.side === "YES" ? "bg-emerald-500" : "bg-red-400"}`} />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{act.user}</span> invested {act.amount} on{" "}
                            <span className={`font-bold ${act.side === "YES" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{act.side}</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{act.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Market Insights — expandable */}
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <button
                    onClick={() => setInsightsOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-blue-500" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Why this prediction?</span>
                    </div>
                    {insightsOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {insightsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
                      >
                        <div className="grid grid-cols-2 gap-2 p-4">
                          {INSIGHTS.map((ins, i) => (
                            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                              <span className="mt-0.5 shrink-0">{ins.icon}</span>
                              <div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500">{ins.label}</p>
                                <p className={`text-xs font-bold ${ins.color} dark:brightness-125`}>{ins.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Sticky bottom buttons */}
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleInvest}
                  disabled={!canInvest || loading}
                  whileHover={canInvest && !loading ? { scale: 1.02 } : {}}
                  whileTap={canInvest && !loading  ? { scale: 0.97 } : {}}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-blue-200/50 dark:shadow-blue-900/40 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Investing…
                    </>
                  ) : (
                    <>
                      <Wallet size={15} />
                      Invest Now
                      <ArrowRight size={14} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}