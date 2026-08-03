import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, UserPlus, DollarSign, Award } from "lucide-react";

const ACTIVITIES = [
  { icon:<TrendingUp size={13}/>,  bg:"bg-blue-100 dark:bg-blue-900/30",     color:"text-blue-500",    text:"Rahul bought Bitcoin Market",          time:"2m ago"  },
  { icon:<CheckCircle size={13}/>, bg:"bg-emerald-100 dark:bg-emerald-900/30",color:"text-emerald-500", text:"Admin settled IPL Winner 2026",         time:"15m ago" },
  { icon:<UserPlus size={13}/>,    bg:"bg-purple-100 dark:bg-purple-900/30",  color:"text-purple-500",  text:"New user registered: Priya Sharma",     time:"32m ago" },
  { icon:<DollarSign size={13}/>,  bg:"bg-teal-100 dark:bg-teal-900/30",      color:"text-teal-500",    text:"Wallet withdrawal of ₹2,000 approved", time:"1h ago"  },
  { icon:<Award size={13}/>,       bg:"bg-amber-100 dark:bg-amber-900/30",    color:"text-amber-500",   text:"Season 3 rewards distributed",          time:"2h ago"  },
  { icon:<TrendingUp size={13}/>,  bg:"bg-blue-100 dark:bg-blue-900/30",      color:"text-blue-500",    text:"CryptoKing invested ₹5,000 on YES",    time:"3h ago"  },
];

export default function ActivityTimeline() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-4">
          {ACTIVITIES.map((a,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
              className="flex items-start gap-3 pl-2">
              <div className={`w-8 h-8 rounded-xl ${a.bg} ${a.color} flex items-center justify-center shrink-0 relative z-10`}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{a.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}