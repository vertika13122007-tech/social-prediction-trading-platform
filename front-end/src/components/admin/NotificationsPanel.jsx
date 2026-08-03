import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, AlertCircle, Wallet, Flag, X } from "lucide-react";

const ALERTS = [
  { icon:<Clock size={13}/>,       bg:"bg-orange-100 dark:bg-orange-900/30",  color:"text-orange-500", text:"Bitcoin Market closes in 2 hours",       read:false },
  { icon:<AlertCircle size={13}/>, bg:"bg-blue-100 dark:bg-blue-900/30",      color:"text-blue-500",   text:"IPL Winner pending settlement",           read:false },
  { icon:<Flag size={13}/>,        bg:"bg-red-100 dark:bg-red-900/30",        color:"text-red-500",    text:"2 new user reports need review",          read:false },
  { icon:<Wallet size={13}/>,      bg:"bg-teal-100 dark:bg-teal-900/30",      color:"text-teal-500",   text:"Wallet withdrawal spike detected",        read:true  },
  { icon:<Bell size={13}/>,        bg:"bg-purple-100 dark:bg-purple-900/30",  color:"text-purple-500", text:"AI Market crossed 500 traders",           read:true  },
];

export default function NotificationsPanel() {
  const [alerts, setAlerts] = useState(ALERTS);
  const unread = alerts.filter(a=>!a.read).length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white">Alerts</h3>
          {unread>0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white">{unread}</span>
          )}
        </div>
        <button onClick={()=>setAlerts(a=>a.map(x=>({...x,read:true})))}
          className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline">Mark all read</button>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {alerts.map((a,i)=>(
          <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.06}}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group ${!a.read?"bg-blue-50/30 dark:bg-blue-950/10":""}`}>
            <div className={`w-7 h-7 rounded-lg ${a.bg} ${a.color} flex items-center justify-center shrink-0 mt-0.5`}>{a.icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-snug ${!a.read?"font-semibold text-gray-800 dark:text-gray-200":"text-gray-600 dark:text-gray-400"}`}>{a.text}</p>
              {!a.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"/>}
            </div>
            <button onClick={()=>setAlerts(prev=>prev.map((x,xi)=>xi===i?{...x,read:true}:x))}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-all p-0.5">
              <X size={11}/>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}