import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import TrendingBanner from "../components/TrendingBanner";
import CategoryTabs from "../components/CategoryTabs";
import TradeCard from "../components/TradeCard";
import LiveUpdates from "../components/LiveUpdates";
import { SlidersHorizontal, ChevronDown, HelpCircle, X, Sparkles, ExternalLink, BookOpen, HeadphonesIcon } from "lucide-react";
import { getOpenMarkets,saveMarket,unsaveMarket } from "../api/marketApi";
import { useAuth } from "../context/AuthContext";
import { sendMessage } from "../api/chatApi";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../socket/socket";

import { useTheme } from "../context/ThemeContext";

const SORT_OPTIONS = [
  { label: "Newest First",    icon: "🆕" },
  { label: "Oldest First",    icon: "📅" },
  { label: "Highest Volume", icon: "💰" },
  { label: "Most Investors",  icon: "👥" },
  { label: "Recently Active", icon: "⚡" },
  { label: "Closing Soon",    icon: "⏰" },
];

const HELP_ITEMS = [
  { icon: <BookOpen size={14} />,      label: "How to trade",  desc: "Learn the basics"    },
  { icon: <ExternalLink size={14} />,  label: "Documentation", desc: "Full guides & API"   },
  { icon: <HeadphonesIcon size={14} />,label: "Support chat",  desc: "Talk to our team"    },
];

export default function Home({ firstVisit = false, onMount }) {
  const { darkMode, setDarkMode } = useTheme();

  // Set live updates open only on first visit (from login), mark visited
  useEffect(() => {
    if (firstVisit) {
      setLiveUpdatesOpen(true);
    }
    if (onMount) onMount();
  }, []); // runs once on mount

  const [activeCategory, setActiveCategory] = useState("Home");
  // Open live updates only on very first visit (coming from login)
  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest First");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpDocTab, setHelpDocTab] = useState("How to trade");
  const [aiInput, setAiInput] = useState("");
  const [trades, setTrades] = useState([]);
  const [aiMessages, setAiMessages] = useState([
    { sender: "ai", text: "Hi! I'm your AI trading assistant 🤖 Ask me anything about trades, predictions, or ask 'How to trade in Social Prediction Platform'!" }
  ]);
  const [loading, setLoading] = useState(false);
  const sortMenuRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();

  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {

    const fetchMarkets = async () => {

      try{

        const categoryMap = {
          Home: "",
          Sports: "SPORTS",
          Creators: "CREATORS",
          Memes: "MEMES",
          Products: "PRODUCTS",
          Trends: "TRENDS",
          Saved: "Saved",
        };

        let category = categoryMap[activeCategory];

        if (category === "Saved"){
          return;
        }

        let sort = "newest";

        switch (sortBy) {

          case "Newest First":
            sort = "newest";
            break;

          case "Oldest First":
            sort = "oldest";
            break;

          case "Highest Volume":
            sort = "volume";
            break;

          case "Most Investors":
            sort = "investors";
            break;

          case "Recently Active":
            sort = "recent";
            break;

          case "Closing Soon":
            sort = "endingSoon";
            break;

          default:
            sort = "newest";

        }

        const markets = await getOpenMarkets(category,sort);

          setTrades(
            markets.map((market) => ({
              id: market._id,
              creator: market.createdBy?.name || "Admin",
              category: market.category,
              title: market.title,
              poolValue: market.totalVolume || 0,
              yesPrice: market.yesPrice || 0,
              noPrice: market.noPrice || 0,
              totalYesInvestment: market.totalYesInvestment || 0,
              totalNoInvestment: market.totalNoInvestment || 0,
              endsAt: market.endsAt,
              investors: market.participationCount || 0,
              saved: market.saved,
              }))
            );

      }catch(error){
        console.error(error);
      }
    };
    fetchMarkets();
  },[activeCategory,sortBy]);

  useEffect(() => {
    console.log("Socket Connected:", socket.connected);

    socket.on("connect", () => {
        console.log("Connected!", socket.id);
    });

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    return () => {
        socket.off("connect");
        socket.offAny();
    };
  }, []);

  useEffect(() => {
    const handleMarketUpdate = (updatedMarket) => {
      console.log("Received socket event:", updatedMarket);

      setTrades((prevTrades) =>
        prevTrades.map((trade) =>
          trade.id === updatedMarket.marketId
            ? {
                ...trade,
                yesPrice: updatedMarket.yesPrice,
                noPrice: updatedMarket.noPrice,
                poolValue: updatedMarket.totalVolume,
              }
            : trade
        )
      );
    };

    socket.on("marketUpdated", handleMarketUpdate);

    return () => {
      socket.off("marketUpdated", handleMarketUpdate);
    };
  }, []);

  const toggleSave = async (id) => {
    try {
      const trade = trades.find(t => t.id === id);
      if (!trade) return;

      if (trade.saved) {
        await unsaveMarket(id);
      } else {
        await saveMarket(id);
      }

      setTrades(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, saved: !t.saved }
              : t
            )
        );

    } catch (error) {
        console.error(error);
    }
  };

  const savedCount = trades.filter((t) => t.saved).length;

  let visibleTrades = 
    activeCategory == "Saved"
      ? trades.filter((t) => t.saved)
      : trades;

  if( searchTerm.trim() !== ""){
    visibleTrades = visibleTrades.filter((trade) => {
      return(
        trade.title?.toLowerCase().includes(searchTerm.toLowerCase())
        ||
        trade.creator?.toLowerCase().includes(searchTerm.toLowerCase())
        || 
        trade.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  }

  const handleAISend = async (customMsg) => {
    const userMessage = typeof customMsg === "string" ? customMsg : aiInput;

    if (!userMessage.trim()) return;

    // Add user's message
    setAiMessages((prev) => [
        ...prev,
        {
            sender: "user",
            text: userMessage,
        },
    ]);

    setAiInput("");

    // Show typing indicator immediately
    setAiMessages((prev) => [
        ...prev,
        {
            sender: "ai",
            typing: true,
        },
    ]);

    setLoading(true);

    try {
        const reply = await sendMessage(userMessage);
        
        setAiMessages((prev) => {

            const updated = [...prev];

            updated[updated.length - 1] = {
                sender: "ai",
                text: reply,
                typing: false,
            };

            return updated;
        });
    } catch (err) {
        setAiMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
                sender: "ai",
                text: userMessage.includes("How to trade")
                  ? "📈 Trading Guide on Social Prediction Platform:\n\n1. Browse open markets (Sports, Creators, Memes, Products, Trends).\n2. Choose YES if you predict it happens, or NO if not.\n3. Click Invest, select your amount (₹100, ₹500, ₹1000 or custom) and confirm.\n4. Track P&L in Portfolio. You can sell early or hold until settlement when winning shares pay ₹10.00 each!"
                  : "Sorry, something went wrong. Please try again.",
                typing: false,
            };
            return updated;
        });
    } finally {
        setLoading(false);
    }
};

  const isDesktop = () => window.innerWidth >= 1024;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        liveUpdatesOpen={liveUpdatesOpen}
        setLiveUpdatesOpen={setLiveUpdatesOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex max-w-screen-xl mx-auto">

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 py-5 space-y-5">

          {/* Welcome */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Welcome back, {user?.name}! <span>👋</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Explore trending predictions and make profitable trades
            </p>
          </div>

          <StatsCard />
          <TrendingBanner />

          {/* Tabs + sort */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CategoryTabs active={activeCategory} setActive={setActiveCategory} savedCount={savedCount} />
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 hover:border-blue-300 transition"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">
                  {SORT_OPTIONS.find(o => o.label === sortBy)?.icon} {sortBy}
                </span>
                <ChevronDown size={13} />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-20 py-1 min-w-[200px]">
                  <div className="px-4 py-2 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                    Sort by
                  </div>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => { setSortBy(opt.label); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2.5 ${
                        sortBy === opt.label
                          ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="text-base leading-none">{opt.icon}</span>
                      <span>{opt.label}</span>
                      {sortBy === opt.label && <span className="ml-auto text-blue-500">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trades count */}
          <h2 className="font-bold text-gray-800 dark:text-white text-sm">
            {activeCategory === "Saved" ? "Saved Trades" : "All Trades"}{" "}
            <span className="text-gray-400 dark:text-gray-500 font-normal">({visibleTrades.length})</span>
          </h2>

          {/* Trade cards */}
          {visibleTrades.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
              {visibleTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} onToggleSave={toggleSave} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600 pb-24">
              <p className="text-4xl mb-3">
                {searchTerm.trim()
                  ? "🔍"
                  : activeCategory === "Saved"
                  ? "🔖"
                  : "🔍"}
              </p>

              <p className="font-semibold">
                {searchTerm.trim()
                  ? "No matching trades found"
                  : activeCategory === "Saved"
                  ? "No saved trades yet"
                  : "No trades in this category"}
              </p>

              <p className="text-sm mt-1">
                {searchTerm.trim()
                  ? `No results for "${searchTerm}"`
                  : activeCategory === "Saved"
                  ? "Tap the bookmark icon on any trade to save it"
                  : "Check back soon or explore other categories"}
              </p>
            </div>
          )}
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

      {/* ── Floating buttons ── */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">

        {showHelpMenu && (
          <div className="mb-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl w-60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-semibold text-sm text-gray-800 dark:text-white">Help & Support</span>
              <button onClick={() => setShowHelpMenu(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={14} />
              </button>
            </div>
            {HELP_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setHelpDocTab(item.label);
                  setShowHelpModal(true);
                  setShowHelpMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
              >
                <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {showAIChat && (
          <div className="mb-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl w-80 overflow-hidden flex flex-col" style={{ height: 400 }}>
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-white" />
                <span className="font-semibold text-sm text-white">AI Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <button onClick={() => setShowAIChat(false)} className="text-white/70 hover:text-white">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
              {aiMessages.map((msg, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                            msg.sender === "user"
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-sm"
                        }`}
                    >
                        {msg.typing ? (
                          <div className="flex gap-1">
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.15s" }} />
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
                          </div>
                        ) : (
                          msg.text
                        )}
                    </div>
                </motion.div>
              ))}
            </div>

            {/* Quick AI Suggestion Prompt */}
            <div className="px-3 pt-2 pb-1 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  handleAISend("How to trade in Social Prediction Platform");
                }}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition flex items-center gap-1"
              >
                <Sparkles size={10} />
                How to trade in Social Prediction Platform
              </button>
            </div>

            <div className="px-3 py-2.5 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAISend()}
                placeholder="Ask about trades..."
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button onClick={() => handleAISend()} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                Send
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowHelpMenu(!showHelpMenu); setShowAIChat(false); }}
            title="Help & Support"
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
              showHelpMenu ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <HelpCircle size={20} />
          </button>
          <button
            onClick={() => { setShowAIChat(!showAIChat); setShowHelpMenu(false); }}
            title="AI Assistant"
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
              showAIChat ? "bg-teal-600 text-white" : "bg-gradient-to-br from-blue-600 to-teal-600 text-white"
            }`}
          >
            <Sparkles size={20} />
          </button>
        </div>
      </div>

      {/* ── Help & Documentation Modal ── */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    📚
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">Help & Platform Documentation</h3>
                    <p className="text-xs text-gray-400">Everything you need to know about trading & rules</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-1.5 gap-1 overflow-x-auto">
                {[
                  { id: "How to trade", label: "How to Trade", icon: <BookOpen size={14} /> },
                  { id: "Documentation", label: "Full Documentation", icon: <ExternalLink size={14} /> },
                  { id: "Support chat", label: "Support & FAQs", icon: <HeadphonesIcon size={14} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHelpDocTab(tab.id)}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      helpDocTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-md"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-700 dark:text-gray-300">

                {/* TAB 1: HOW TO TRADE */}
                {helpDocTab === "How to trade" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-start gap-3">
                      <Sparkles className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">How to Trade on Social Prediction Platform</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Predict outcomes on trending events in Sports, Creators, Memes, Products, and Trends. Earn real payouts when your predictions come true!
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <div>
                          <h5 className="font-bold text-gray-900 dark:text-white text-xs">Select a Market & Outcome</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Browse categories or use search to find active events. Choose <strong>YES</strong> if you predict the event will happen, or <strong>NO</strong> if you predict it won't.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div>
                          <h5 className="font-bold text-gray-900 dark:text-white text-xs">Evaluate Prices & Potential Payout</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Share prices dynamically range between ₹0.50 and ₹9.50 based on market probability. If your outcome wins, each share pays out <strong>₹10.00</strong> at market settlement!
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <div>
                          <h5 className="font-bold text-gray-900 dark:text-white text-xs">Enter Amount & Confirm Trade</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Click "Invest", enter your trading amount (or choose quick presets like ₹100, ₹500, ₹1,000), review estimated shares, and confirm your investment.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <div>
                          <h5 className="font-bold text-gray-900 dark:text-white text-xs">Track P&L & Sell Positions Early</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Visit your <strong>Portfolio</strong> to view real-time Profit & Loss. You can hold until settlement or use the <strong>Sell</strong> feature to exit trades early for profit.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: FULL DOCUMENTATION */}
                {helpDocTab === "Documentation" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">System Mechanics & Trading Rules</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Detailed technical overview of market states, settlement rules, and portfolio calculation logic.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-1">🟢 Market Lifecycle</h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          <strong>OPEN</strong>: Trading active.<br/>
                          <strong>CLOSED</strong>: Expiry reached, awaiting settlement.<br/>
                          <strong>SETTLED</strong>: Outcome declared & payouts distributed.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-1">💰 Payout Formula</h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          Winning Share Value = <strong>₹10.00</strong><br/>
                          Payout = Shares Owned × ₹10.00.<br/>
                          Losing shares resolve to ₹0.00.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-1">📜 Wallet & Ledger</h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          Every transaction (Market Buy, Sell, Payout Reward) is logged immutably in your account ledger.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-1">🏆 Leaderboard Scoring</h5>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          Traders ranked by net portfolio profit. Top creators ranked by market liquidity created.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: SUPPORT CHAT & FAQS */}
                {helpDocTab === "Support chat" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Frequently Asked Questions & Support</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Have questions? Find quick answers or ask our 24/7 AI Assistant below.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-1">Q: How are market outcomes verified?</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Platform administrators declare winners using verifiable, real-world public data sources upon event completion.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-1">Q: Can I exit a trade before the market ends?</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Yes! Go to your Portfolio tab and click "Sell" on any active open position to cash out instantly at current market value.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                        <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-1">Q: Are there any trading or withdrawal fees?</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          No! Trading, position liquidations, and settlements carry zero hidden commission fees.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    setShowAIChat(true);
                    handleAISend("How to trade in Social Prediction Platform");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-bold hover:scale-[1.02] active:scale-95 transition shadow-sm"
                >
                  <Sparkles size={14} />
                  Ask AI Assistant "How to trade in Social Prediction Platform"
                </button>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
