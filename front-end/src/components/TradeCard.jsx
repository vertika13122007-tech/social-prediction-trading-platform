import { TrendingUp, Users, Clock, ArrowRight, Bookmark } from "lucide-react";

const categoryColors = {
  Sports:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Creators: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Memes:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-700",
  Products: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Trends:   "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

export default function TradeCard({ trade, onToggleSave }) {
  const { id, creator, category, title, poolValue, potentialROI, investors, timeLeft, saved } = trade;

  const roiNum = parseInt(potentialROI);
  const roiColor = roiNum >= 100
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-emerald-500 dark:text-emerald-300";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-3 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 group">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {creator?.[0]}
          </div>
          <div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Created by</p>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">{creator}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[category] || "bg-gray-100 text-gray-600"}`}>
            {category}
          </span>
          {/* Bookmark button — calls onToggleSave with trade id */}
          <button
            onClick={() => onToggleSave(id)}
            title={saved ? "Remove from saved" : "Save trade"}
            className={`p-1.5 rounded-lg transition-all ${
              saved
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-300 dark:text-gray-600 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            }`}
          >
            <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug min-h-[2.5rem]">
        {title}
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Pool Value</p>
          <p className="text-sm font-bold text-gray-800 dark:text-white">{poolValue}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2.5">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Potential ROI</p>
          <p className={`text-sm font-bold ${roiColor}`}>{potentialROI}</p>
        </div>
      </div>

      {/* Investors & Time */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1"><Users size={11} />{investors} investors</span>
        <span className="flex items-center gap-1"><Clock size={11} />{timeLeft}</span>
      </div>

      {/* Invest button */}
      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-sm font-semibold transition-all duration-200 group-hover:shadow-md group-hover:shadow-blue-200 dark:group-hover:shadow-none">
        <TrendingUp size={14} />
        Invest
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
