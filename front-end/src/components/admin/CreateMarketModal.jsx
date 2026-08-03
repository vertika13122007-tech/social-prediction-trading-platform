import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, TrendingUp, Clock, CheckCircle, Plus, Calendar, FileText, Tag, ArrowRight
} from "lucide-react";
import { createMarket } from "../../api/marketApi";

const CATEGORIES = ["SPORTS", "CREATORS", "MEMES", "PRODUCTS", "TRENDS"];

const DURATION_PRESETS = [
  { label: "1 Day", days: 1 },
  { label: "3 Days", days: 3 },
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
];

export default function CreateMarketModal({ onClose, onMarketCreated }) {
  const overlayRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TRENDS");
  const [durationDays, setDurationDays] = useState(7);
  const [customEndsAt, setCustomEndsAt] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [createdMarketTitle, setCreatedMarketTitle] = useState("");

  // Calculate default endsAt date
  const getEndsAtDate = () => {
    if (customEndsAt) return new Date(customEndsAt);
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d;
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category) {
      setError("Please fill all required market details.");
      return;
    }

    const finalEndsAt = getEndsAtDate();
    if (isNaN(finalEndsAt.getTime()) || finalEndsAt <= new Date()) {
      setError("End date must be in the future.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await createMarket({
        title: title.trim(),
        description: description.trim(),
        category,
        endsAt: finalEndsAt.toISOString(),
      });

      setCreatedMarketTitle(title);
      setSuccess(true);
      if (onMarketCreated) onMarketCreated(response.market);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create market. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-center justify-center px-3 py-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10"
      >
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 shrink-0" />

        <AnimatePresence mode="wait">
          {success ? (
            /* ══ SUCCESS VIEW ══ */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center px-8 py-14 gap-5"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Created Successfully!</h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                  "{createdMarketTitle}" is now live and open for trader predictions! 🚀
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    Category: {category} · Status: OPEN
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setTitle("");
                    setDescription("");
                  }}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  Create Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-200/50"
                >
                  Done
                </button>
              </div>
            </motion.div>

          ) : (
            /* ══ CREATE FORM VIEW ══ */
            <motion.div key="form" className="flex flex-col overflow-hidden">

              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold">
                      ADMIN PORTAL
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> NEW MARKET
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-snug">
                    Create Prediction Market
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Launch a new prediction market for community trading
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:scale-110 active:scale-95 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                {error && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                {/* Market Title */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp size={13} /> Market Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Will Bitcoin cross $150K before December 2026?"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Tag size={13} /> Category *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          category === cat
                            ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md scale-[1.03]"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={13} /> Description & Rules *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the market conditions and how outcome will be resolved..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Duration / Ends At */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Clock size={13} /> Market Expiry / Duration *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {DURATION_PRESETS.map((preset) => (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => {
                          setDurationDays(preset.days);
                          setCustomEndsAt("");
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          !customEndsAt && durationDays === preset.days
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Input */}
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={customEndsAt}
                      onChange={(e) => setCustomEndsAt(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-800 dark:text-white font-mono focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar size={11} /> Closes on: <span className="font-semibold text-gray-700 dark:text-gray-300">{getEndsAtDate().toLocaleString()}</span>
                  </p>
                </div>

                {/* Sticky Bottom Buttons */}
                <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-blue-200/50 dark:shadow-blue-900/40 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        <Plus size={15} />
                        Publish Market
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
