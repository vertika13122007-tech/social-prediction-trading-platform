import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import TrendingBanner from "../components/TrendingBanner";
import CategoryTabs from "../components/CategoryTabs";
import TradeCard from "../components/TradeCard";
import LiveUpdates from "../components/LiveUpdates";
import { SlidersHorizontal, ChevronDown, HelpCircle, X, Sparkles, ExternalLink, BookOpen, HeadphonesIcon } from "lucide-react";
import { getOpenMarkets } from "../api/marketApi";

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
  const [darkMode, setDarkMode] = useState(false);

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
  const [aiInput, setAiInput] = useState("");
  const [trades, setTrades] = useState([]);
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI trading assistant 🤖 Ask me anything about trades, predictions, or market trends!" }
  ]);
  const sortMenuRef = useRef(null);

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
              creator: market.createdBy.name,
              category: market.category,
              title: market.title,
              poolValue: market.totalVolume || 0,
              yesPrice: market.yesPrice || 0,
              noPrice: market.noPrice || 0,
              endsAt: market.endsAt,
              investors: market.participantsCount || 0,
              saved: false,
              }))
            );

      }catch(error){
        console.error(error);
      }

    };

    fetchMarkets();

},[activeCategory,sortBy]);

  // Toggle bookmark on a trade
  const toggleSave = (id) => {
    setTrades((prev) =>
      prev.map((t) => t.id === id ? { ...t, saved: !t.saved } : t)
    );
  };

  const savedCount = trades.filter((t) => t.saved).length;

  const filteredTrades =
    activeCategory === "Saved"
      ? trades.filter((t) => t.saved)
      : trades;

  const handleAISend = () => {
    if (!aiInput.trim()) return;
    setAiMessages((prev) => [
      ...prev,
      { role: "user", text: aiInput },
      { role: "assistant", text: `Great question! Based on current market trends, "${aiInput}" looks promising. Always do your own research before investing. 📊` }
    ]);
    setAiInput("");
  };

  const isDesktop = () => window.innerWidth >= 1024;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        liveUpdatesOpen={liveUpdatesOpen}
        setLiveUpdatesOpen={setLiveUpdatesOpen}
      />

      <div className="flex max-w-screen-xl mx-auto">

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 px-4 py-5 space-y-5">

          {/* Welcome */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Welcome back, snehar.2536! <span>👋</span>
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
            <span className="text-gray-400 dark:text-gray-500 font-normal">({filteredTrades.length})</span>
          </h2>

          {/* Trade cards */}
          {filteredTrades.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
              {filteredTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} onToggleSave={toggleSave} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600 pb-24">
              <p className="text-4xl mb-3">{activeCategory === "Saved" ? "🔖" : "🔍"}</p>
              <p className="font-semibold">
                {activeCategory === "Saved" ? "No saved trades yet" : "No trades in this category"}
              </p>
              <p className="text-sm mt-1">
                {activeCategory === "Saved"
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
          <div className="mb-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl w-56 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-semibold text-sm text-gray-800 dark:text-white">Help & Support</span>
              <button onClick={() => setShowHelpMenu(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={14} />
              </button>
            </div>
            {HELP_ITEMS.map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left">
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
          <div className="mb-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl w-72 overflow-hidden flex flex-col" style={{ height: 360 }}>
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
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] text-xs px-3 py-2 rounded-xl leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAISend()}
                placeholder="Ask about trades..."
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button onClick={handleAISend} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
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

    </div>
  );
}
