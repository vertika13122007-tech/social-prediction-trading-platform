import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, RefreshCw, Layers, DollarSign, Award, Star } from "lucide-react";
import { getTopCreators } from "../api/creatorApi";

const fmtMoney = (val) => Number(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AdminLeaderboard() {
  const [topCreators, setTopCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCreators = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTopCreators();
      setTopCreators(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch top creators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const rankingList = topCreators.slice(3);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase">
              Creator Rankings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            🏆 Admin Creators Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Top market creators ranked by market creation volume and liquidity generated
          </p>
        </div>

        <button
          onClick={fetchCreators}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Leaderboard
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <RefreshCw size={32} className="animate-spin text-amber-500 mb-3" />
          <p className="text-sm font-medium">Loading creator rankings...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 text-sm">
          {error}
        </div>
      ) : (
        <>
          {/* PODIUM (Top 3 Creators) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-10 max-w-5xl mx-auto px-2">
            {/* Rank 2 */}
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white text-center shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="text-5xl mb-3">🥈</div>
                <h3 className="text-xl font-bold truncate">{topCreators[1]?.name || "Creator #2"}</h3>
                <p className="text-xs opacity-80 mt-1">{topCreators[1]?.totalMarket || 0} Markets Listed</p>
                <p className="text-3xl font-extrabold mt-3">₹{fmtMoney(topCreators[1]?.totalVolume)}</p>
                <div className="mt-4 bg-white/20 rounded-full py-1.5 text-xs font-bold uppercase tracking-wider">Rank #2</div>
              </motion.div>
            </div>

            {/* Rank 1 */}
            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600 rounded-3xl p-8 text-white text-center shadow-2xl md:scale-105 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="text-6xl mb-4">👑</div>
                <h3 className="text-2xl font-bold truncate">{topCreators[0]?.name || "Top Creator"}</h3>
                <p className="text-xs opacity-90 mt-1">{topCreators[0]?.totalMarket || 0} Markets Listed</p>
                <p className="text-4xl font-black mt-4">₹{fmtMoney(topCreators[0]?.totalVolume)}</p>
                <div className="mt-5 bg-white/20 rounded-full py-2 font-black text-sm uppercase tracking-wider shadow-inner">
                  🏆 Rank #1 Creator
                </div>
              </motion.div>
            </div>

            {/* Rank 3 */}
            <div className="order-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white text-center shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                <div className="text-5xl mb-3">🥉</div>
                <h3 className="text-xl font-bold truncate">{topCreators[2]?.name || "Creator #3"}</h3>
                <p className="text-xs opacity-80 mt-1">{topCreators[2]?.totalMarket || 0} Markets Listed</p>
                <p className="text-3xl font-extrabold mt-3">₹{fmtMoney(topCreators[2]?.totalVolume)}</p>
                <div className="mt-4 bg-white/20 rounded-full py-1.5 text-xs font-bold uppercase tracking-wider">Rank #3</div>
              </motion.div>
            </div>
          </div>

          {/* FULL CREATOR RANKINGS TABLE */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Star size={18} className="text-amber-500" />
                All Creator Rankings
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                {topCreators.length} Creators
              </span>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {topCreators.map((creator) => (
                <div
                  key={creator.rank}
                  className="flex items-center justify-between p-5 hover:bg-amber-50/30 dark:hover:bg-gray-800/50 transition duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-extrabold text-base w-8 text-amber-500">
                      #{creator.rank}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{creator.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {creator.totalMarket} Markets Created
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{fmtMoney(creator.totalVolume)}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Total Pool Volume</p>
                  </div>
                </div>
              ))}

              {topCreators.length === 0 && (
                <div className="text-center py-10 text-xs text-gray-400">
                  No admin creators recorded yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
