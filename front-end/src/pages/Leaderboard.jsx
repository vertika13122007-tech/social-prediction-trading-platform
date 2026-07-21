import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import { HelpCircle, Sparkles, X } from "lucide-react";
import { Trophy, Crown, TrendingUp, Star, Users } from "lucide-react";
import { getLeaderboard } from "../api/leaderboard";
import { getTopCreators } from "../api/creatorApi";
import { getTopMarkets } from "../api/marketApi";

export default function Leaderboard() {
  const [darkMode, setDarkMode] = useState(false);

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

  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);

  const params = new URLSearchParams(location.search);

  const initalTab = 
    params.get("tab") === "markets"
      ?"Most Profitable"
      :"Top Traders";

  const [activeTab, setActiveTab] = useState(initalTab);

  const [topTraders, setTopTraders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [topTrades, setTopTrades] = useState([]);

  const [topCreators, setTopCreators] = useState([]);

  useEffect(() => {

    const fetchLeaderboard = async () => {

      try{

        const data = await getLeaderboard();

        setTopTraders(data.leaderboard);
        setCurrentUser(data.currentUser);

      }catch(error){
        
        console.error(error);

      }
    };

    fetchLeaderboard();

  }, []);

  const rankingList = topTraders.slice(3);

  useEffect(() => {
    const fetchCreators = async () => {
      try{

        const data = await getTopCreators();

        setTopCreators(data);

      }catch(error){
        console.error(error);
      }
    };
    fetchCreators();
  }, []);

  const creators = topCreators.slice(3);

  useEffect(() => {
    const fetchTrades = async () => {
      try{

        const data = await getTopMarkets();

        setTopTrades(data);

      }catch(error){
        console.error(error);
      }
    };
    fetchTrades();
  }, []);


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

          {/* ── Header ── */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/80 border border-gray-100 dark:border-gray-800 mb-6 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">🏆 Leaderboard</h1>
                <p className="text-gray-500 mt-2">Compete with top traders and creators. Track performance and climb the rankings.</p>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-md dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 mb-8 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-2 overflow-x-auto">
              {["Top Traders", "Most Profitable", "Top Creators"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 rounded-2xl whitespace-nowrap font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* ── Top Traders ── */}
          {activeTab === "Top Traders" && (
            <>
              <div className="mb-8 max-w-5xl mx-auto px-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Traders</h2>
                <p className="text-gray-500 mt-2">Highest performing traders ranked by profit and win rate</p>
              </div>

              {/* ── PODIUM — DO NOT TOUCH ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-10 max-w-5xl mx-auto px-4">
                {/* #2 */}
                <div className="order-2 md:order-1">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white text-center shadow-xl hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(59,130,246,0.35)] transition-all duration-300">
                    <div className="text-5xl mb-3">🥈</div>
                    <h3 className="text-xl font-bold">{topTraders[1]?.name?? "No Trader Yet"}</h3>
                    <p className="text-3xl font-bold mt-3">{topTraders[1]?.totalProfitLoss}</p>
                    <p className="mt-3 text-sm">{topTraders[1]?.totalInvested}</p>
                    <div className="mt-4 bg-white/20 rounded-full py-1">Rank #2</div>
                  </div>
                </div>
                {/* #1 */}
                <div className="order-1 md:order-2">
                  <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600 rounded-3xl p-8 text-white text-center shadow-2xl md:scale-105 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(251,146,60,0.45)] transition-all duration-300">
                    <div className="text-6xl mb-4">👑</div>
                    <h3 className="text-2xl font-bold">{topTraders[0]?.name?? "No Trader Yet"}</h3>
                    <p className="text-4xl font-bold mt-4">{topTraders[0]?.totalProfitLoss}</p>
                    <p className="mt-4">{topTraders[0]?.totalInvested}</p>
                    <div className="mt-5 bg-white/20 rounded-full py-2 font-semibold">🏆 Rank #1</div>
                  </div>
                </div>
                {/* #3 */}
                <div className="order-3">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white text-center shadow-xl hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(239,68,68,0.35)] transition-all duration-300">
                    <div className="text-5xl mb-3">🥉</div>
                    <h3 className="text-xl font-bold">{topTraders[2]?.name?? "No Trader Yet"}</h3>
                    <p className="text-3xl font-bold mt-3">{topTraders[2]?.totalProfitLoss}</p>
                    <p className="mt-3 text-sm">{topTraders[2]?.totalInvested}</p>
                    <div className="mt-4 bg-white/20 rounded-full py-1">Rank #3</div>
                  </div>
                </div>
              </div>

              {/* ── Ranking List ── */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">Full Rankings</h3>
                </div>
                {rankingList.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-gray-800/70 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-lg w-8 text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-teal-500 group-hover:scale-110 transition-transform duration-200">
                        #{user.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500">Invested ₹{user.totalInvested.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className={`${user.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>₹ {user.totalProfitLoss.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* ── User Rank Card ── */}
              <div className="mt-8 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white rounded-3xl p-6 shadow-xl shadow-blue-300/30 dark:shadow-blue-900/40 hover:shadow-2xl hover:shadow-blue-400/30 dark:hover:shadow-blue-900/50 hover:-translate-y-1 transition-all duration-300 mb-8 ring-1 ring-white/10 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-sm opacity-90">Your Current Position</p>
                  <h2 className="text-4xl font-bold mt-2">#{currentUser?.rank ?? "--"}</h2>
                  <p className="mt-2 opacity-90">Keep trading to climb the leaderboard 🚀</p>
                </div>
              </div>
            </>
          )}

          {/* ── Most Profitable ── */}
          {activeTab === "Most Profitable" && (
            <>
              <div className="mb-8 max-w-5xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">💰 Most Profitable Trades</h2>
                <p className="text-gray-500 mt-2">Highest Money Volume prediction markets this season</p>
              </div>
              <div className="space-y-5 mb-8">
                {topTrades.map((trade, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-md dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900/70 hover:-translate-y-1 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 group-hover:shadow-emerald-300/40 transition-all duration-300">
                          {trade.rank}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{trade.title}</h3>
                          <p className="text-gray-500 mt-1">Created by <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 ml-1">{trade.creator}</span></p>
                        </div>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-sm text-gray-400">Volume</p>
                          <p className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform duration-200">₹{trade.totalVolume}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Trade Value</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">YES: ₹{trade.yesPrice}, NO: ₹{trade.noPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Top Creators ── */}
          {activeTab === "Top Creators" && (
            <>
              <div className="mb-8 max-w-5xl mx-auto px-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">⭐ Top Creators</h2>
                <p className="text-gray-500 mt-2">Discover the creators with the highest engagement and best prediction markets.</p>
              </div>

              {/* ── Creator Podium — DO NOT TOUCH ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-6xl mx-auto px-6 md:px-12 lg:px-16 mb-12">
                {/* #2 */}
                <div className="order-2 md:order-1">
                  <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-6 text-white text-center shadow-xl hover:-translate-y-2 transition duration-300">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4">👨‍💻</div>
                    <p className="text-lg font-bold">{topCreators[1]?.name?? "No Creators Yet"}</p>
                    <div className="mt-5 space-y-2 text-sm">
                      <p>💸 Volume : {topCreators[1]?.totalVolume}</p>
                      <p>📊 {topCreators[1]?.totalMarket} Markets</p>
                    </div>
                    <div className="mt-5 bg-white/20 rounded-full py-2 font-semibold">🥈 Rank #2</div>
                  </div>
                </div>
                {/* #1 */}
                <div className="order-1 md:order-2">
                  <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600 rounded-3xl p-8 text-white text-center shadow-2xl md:scale-105 hover:-translate-y-2 transition duration-300">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center text-5xl mb-5">👑</div>
                    <p className="text-2xl font-bold">{topCreators[0]?.name?? "No Creators Yet"}</p>
                    <div className="mt-6 space-y-2">
                      <p className="text-lg">💸 Volume :  {topCreators[0]?.totalVolume}</p>
                      <p className="text-lg">📊 {topCreators[0]?.totalMarket} Markets</p>
                    </div>
                    <div className="mt-6 bg-white/20 rounded-full py-2 font-semibold">🏆 Rank #1</div>
                  </div>
                </div>
                {/* #3 */}
                <div className="order-3">
                  <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl p-6 text-white text-center shadow-xl hover:-translate-y-2 transition duration-300">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4">🚀</div>
                    <p className="text-lg font-bold">{topCreators[2]?.name?? "No Creators Yet"}</p>
                    <div className="mt-5 space-y-2 text-sm">
                      <p>💸 Volume : {topCreators[2]?.totalVolume}</p>
                      <p>📊 {topCreators[2]?.totalMarket} Markets</p>
                    </div>
                    <div className="mt-5 bg-white/20 rounded-full py-2 font-semibold">🥉 Rank #3</div>
                  </div>
                </div>
              </div>

              {/* ── Creator Rankings List ── */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-md dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 mb-8">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Creator Rankings</h3>
                </div>
                {creators.map((creator, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-gray-800/70 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 group cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-white font-bold flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{creator.name}</p>
                        <p className="text-sm text-gray-500"> Volume : {creator.totalVolume}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 group-hover:scale-105 transition-transform duration-200">{creator.totalMarket}</p>
                      <p className="text-sm text-gray-500">Markets</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </main>

        {/* ── Desktop Live Updates sidebar ── */}
        {liveUpdatesOpen && (
          <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
            <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
          </aside>
        )}
      </div>

      {/* ── Mobile Live Updates — slide in from right, no backdrop ── */}
      {liveUpdatesOpen && (
        <div className="lg:hidden fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-72 max-w-[85vw] flex flex-col bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800">
          <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
        </div>
      )}
    </div>
  );
}