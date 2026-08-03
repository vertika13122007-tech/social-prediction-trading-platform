import { motion } from "framer-motion";
import { Plus, Users, BarChart3, Wallet, Settings } from "lucide-react";

const ACTIONS = [
  { icon:<Plus size={18}/>,      label:"Create Market",     desc:"Launch a new prediction market",  bg:"from-blue-500 to-blue-700",    shadow:"shadow-blue-200/50 dark:shadow-blue-900/30"    },
  { icon:<Users size={18}/>,     label:"Manage Users",      desc:"View and manage user accounts",   bg:"from-purple-500 to-purple-700", shadow:"shadow-purple-200/50 dark:shadow-purple-900/30"},
  { icon:<BarChart3 size={18}/>, label:"View Analytics",    desc:"Detailed platform analytics",     bg:"from-teal-500 to-teal-700",    shadow:"shadow-teal-200/50 dark:shadow-teal-900/30"    },
  { icon:<Wallet size={18}/>,    label:"Wallet Logs",       desc:"Transaction and wallet history",  bg:"from-emerald-500 to-emerald-700",shadow:"shadow-emerald-200/50 dark:shadow-emerald-900/30"},
  { icon:<Settings size={18}/>,  label:"Platform Settings", desc:"Configure platform preferences",  bg:"from-gray-500 to-gray-700",    shadow:"shadow-gray-200/50 dark:shadow-gray-900/30"    },
];

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {ACTIONS.map((a,i)=>(
          <motion.button key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
            whileHover={{x:4}} whileTap={{scale:0.98}}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 group text-left">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.bg} flex items-center justify-center text-white shadow-md ${a.shadow} group-hover:scale-110 transition-transform duration-200 shrink-0`}>
              {a.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{a.label}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{a.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}