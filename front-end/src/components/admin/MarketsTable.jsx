import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Edit2, X, CheckCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const MARKETS = [
  { id:1, title:"Bitcoin > $150K by 2026",     status:"OPEN",    yes:61, no:39, traders:240, date:"22 Jun 2026" },
  { id:2, title:"IPL Winner 2026",              status:"SETTLED", yes:74, no:26, traders:580, date:"18 Jun 2026" },
  { id:3, title:"AI replaces developers 2027",  status:"OPEN",    yes:48, no:52, traders:312, date:"15 Jun 2026" },
  { id:4, title:"Ronaldo 50+ goals season",     status:"OPEN",    yes:63, no:37, traders:167, date:"10 Jun 2026" },
  { id:5, title:"Tesla stock $500 Q3 2026",     status:"CLOSED",  yes:40, no:60, traders:289, date:"5 Jun 2026"  },
  { id:6, title:"Mr Beast 500M subscribers",    status:"OPEN",    yes:71, no:29, traders:98,  date:"1 Jun 2026"  },
];

const STATUS_STYLES = {
  OPEN:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  SETTLED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CLOSED:  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function MarketsTable() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage]     = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const PER_PAGE = 4;

  const filtered = MARKETS.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
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
              {["Title","Status","YES %","NO %","Traders","Date","Actions"].map(h=>(
                <th key={h} className="px-4 py-3 text-left font-semibold first:rounded-tl-none">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {paginated.map((m,i)=>(
              <motion.tr key={m.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                className="hover:bg-blue-50/40 dark:hover:bg-gray-800/40 transition-colors group">
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[200px] truncate">{m.title}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {m.status==="OPEN" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[m.status]}`}>{m.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{m.yes}%</td>
                <td className="px-4 py-3 font-semibold text-red-500 dark:text-red-400">{m.no}%</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{m.traders}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-500 text-xs">{m.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[
                      {icon:<Eye size={13}/>,     tip:"View",   cls:"text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"},
                      {icon:<Edit2 size={13}/>,   tip:"Edit",   cls:"text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"},
                      {icon:<CheckCircle size={13}/>,tip:"Settle",cls:"text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"},
                      {icon:<Trash2 size={13}/>,  tip:"Delete", cls:"text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"},
                    ].map((a,ai)=>(
                      <button key={ai} title={a.tip}
                        onClick={()=>a.tip==="Delete"&&setConfirmDelete(m)}
                        className={`p-1.5 rounded-lg transition-all hover:scale-110 active:scale-95 ${a.cls}`}>
                        {a.icon}
                      </button>
                    ))}
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

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={()=>setConfirmDelete(null)}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.93}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.93}}
              className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 z-10"
              onClick={e=>e.stopPropagation()}>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete Market?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">"{confirmDelete.title}" will be permanently deleted.</p>
              <div className="flex gap-3">
                <button onClick={()=>setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:border-gray-300 transition">Cancel</button>
                <button onClick={()=>setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition shadow-md">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}