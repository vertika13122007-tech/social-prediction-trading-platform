import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Gift, RefreshCw, DollarSign, Minus, CheckCircle } from "lucide-react";
import { getAdminTransactions } from "../../api/statsApi";

const TYPE_CONFIG = {
  CREDIT:     { icon:<DollarSign size={13}/>,    bg:"bg-emerald-100 dark:bg-emerald-900/30",color:"text-emerald-600 dark:text-emerald-400",badge:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"},
  DEBIT:      { icon:<Minus size={13}/>,         bg:"bg-red-100 dark:bg-red-900/30",       color:"text-red-500",                        badge:"bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"           },
  MARKET_BUY: { icon:<ArrowDownLeft size={13}/>, bg:"bg-blue-100 dark:bg-blue-900/30",     color:"text-blue-600 dark:text-blue-400",     badge:"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"       },
  MARKET_SELL:{ icon:<ArrowUpRight size={13}/>,  bg:"bg-purple-100 dark:bg-purple-900/30", color:"text-purple-600 dark:text-purple-400", badge:"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  REWARD:     { icon:<Gift size={13}/>,          bg:"bg-amber-100 dark:bg-amber-900/30",   color:"text-amber-600 dark:text-amber-400",   badge:"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"   },
};

export default function Transactions() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    async function loadTxs() {
      try {
        const data = await getAdminTransactions();
        setTxs(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadTxs();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-80 overflow-y-auto">
        {txs.map((tx, i) => {
          const cfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.CREDIT;
          const userName = tx.userId?.name || tx.userId?.email || "User";
          return (
            <motion.div key={tx._id || i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
              <div className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{userName}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{tx.description || tx.type}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>{tx.type}</span>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-gray-800 dark:text-white">₹{(tx.amount || 0).toLocaleString()}</p>
                <p className="text-[10px] flex items-center justify-end gap-1 text-gray-400">
                  <CheckCircle size={9} className="text-emerald-400"/>
                  Completed
                </p>
              </div>
            </motion.div>
          );
        })}
        {txs.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs">No recent transactions recorded</p>
          </div>
        )}
      </div>
    </div>
  );
}