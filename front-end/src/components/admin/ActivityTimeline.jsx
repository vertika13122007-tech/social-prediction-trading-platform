import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, UserPlus, DollarSign, Award } from "lucide-react";
import { getAdminActivity } from "../../api/statsApi";

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function loadActivity() {
      try {
        const data = await getAdminActivity();
        setActivities(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadActivity();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {activities.map((a, i) => (
            <motion.div key={a.id || i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
              className="flex items-start gap-3 pl-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0 relative z-10">
                <TrendingUp size={13}/>
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                  <span className="font-bold">{a.user}</span> predicted <span className="font-semibold text-blue-600 dark:text-blue-400">{a.side}</span> for ₹{(a.amount || 0).toLocaleString()} on "{a.title}"
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {a.date ? new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                </p>
              </div>
            </motion.div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-xs">No recent platform activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}