import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Gift, RefreshCw, DollarSign, Minus, CheckCircle } from "lucide-react";

const TXS = [
  { user:"CryptoKing",    type:"Buy",        amount:"₹5,000",  date:"Today, 3:45 PM", status:"Completed" },
  { user:"TechOracle",    type:"Sell",       amount:"₹9,250",  date:"Today, 1:20 PM", status:"Completed" },
  { user:"snehar.2536",   type:"Deposit",    amount:"₹10,000", date:"Yesterday",       status:"Completed" },
  { user:"MarketGuru",    type:"Reward",     amount:"₹1,000",  date:"22 Jun",          status:"Completed" },
  { user:"WallStreetPro", type:"Withdrawal", amount:"₹2,000",  date:"20 Jun",          status:"Pending"   },
  { user:"CryptoWhale",   type:"Refund",     amount:"₹3,000",  date:"18 Jun",          status:"Completed" },
];

const TYPE_CONFIG = {
  Buy:        { icon:<ArrowDownLeft size={13}/>, bg:"bg-blue-100 dark:bg-blue-900/30",     color:"text-blue-600 dark:text-blue-400",     badge:"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"       },
  Sell:       { icon:<ArrowUpRight size={13}/>,  bg:"bg-purple-100 dark:bg-purple-900/30", color:"text-purple-600 dark:text-purple-400", badge:"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  Deposit:    { icon:<DollarSign size={13}/>,    bg:"bg-emerald-100 dark:bg-emerald-900/30",color:"text-emerald-600 dark:text-emerald-400",badge:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"},
  Reward:     { icon:<Gift size={13}/>,          bg:"bg-amber-100 dark:bg-amber-900/30",   color:"text-amber-600 dark:text-amber-400",   badge:"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"   },
  Withdrawal: { icon:<Minus size={13}/>,         bg:"bg-red-100 dark:bg-red-900/30",       color:"text-red-500",                        badge:"bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"           },
  Refund:     { icon:<RefreshCw size={13}/>,     bg:"bg-teal-100 dark:bg-teal-900/30",     color:"text-teal-600 dark:text-teal-400",     badge:"bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"       },
};

export default function Transactions() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {TXS.map((tx,i)=>{
          const cfg = TYPE_CONFIG[tx.type];
          return (
            <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
              <div className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{tx.user}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{tx.date}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>{tx.type}</span>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-gray-800 dark:text-white">{tx.amount}</p>
                <p className="text-[10px] flex items-center justify-end gap-1 text-gray-400">
                  <CheckCircle size={9} className={tx.status==="Completed"?"text-emerald-400":"text-orange-400"}/>
                  {tx.status}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}