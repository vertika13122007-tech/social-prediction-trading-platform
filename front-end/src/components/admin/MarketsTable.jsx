import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Edit2, X, CheckCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminMyMarkets, closeMarket, settleMarket } from "../../api/marketApi";

const STATUS_STYLES = {
  OPEN:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  SETTLED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CLOSED:  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function MarketsTable() {
  const [marketsList, setMarketsList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage]     = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const PER_PAGE = 4;

  const fetchMarketsData = async () => {
    try {
      const data = await getAdminMyMarkets();
      const all = [
        ...(data.openMarkets || []),
        ...(data.closedMarkets || []),
        ...(data.settledMarkets || [])
      ];
      setMarketsList(all);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMarketsData();
  }, []);

  const handleCloseAction = async (marketId) => {
    try {
      await closeMarket(marketId);
      fetchMarketsData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update market");
    }
  };

  const filtered = marketsList.filter(m => {
    const matchSearch = (m.title || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white">Recent Markets</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
              placeholder="Search…" className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-400 transition w-36"/>
          </div>
          {["All","OPEN","SETTLED","CLOSED"].map(f=>(
            <button key={f} onClick={()=>{setFilter(f);setPage(1)}}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition hover:scale-[1.03] active:scale-95 ${
                filter===f ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {["Title","Status","YES Odds","NO Odds","Volume","Date","Actions"].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-semibold first:rounded-tl-none">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {paginated.map((m,i)=>(
              <motion.tr key={m._id || i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                className="hover:bg-blue-50/40 dark:hover:bg-gray-800/40 transition-colors group">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[200px] truncate">{m.title}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {m.status==="OPEN" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[m.status]}`}>{m.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">₹{Number(m.yesPrice || 5).toFixed(2)}</td>
                <td className="px-4 py-3 font-semibold text-red-500 dark:text-red-400">₹{Number(m.noPrice || 5).toFixed(2)}</td>
                <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">₹{(m.totalVolume || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-500 text-xs">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "N/A"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {m.status === "OPEN" && (
                      <button
                        title="Close Market"
                        onClick={() => handleCloseAction(m._id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-110"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="text-center py-10 text-gray-400 dark:text-gray-600">
            <p className="text-sm">No markets found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">{filtered.length} results</span>
          <div className="flex gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition"><ChevronLeft size={14}/></button>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">{page}/{totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition"><ChevronRight size={14}/></button>
          </div>
        </div>
      )}
    </div>
  );
}