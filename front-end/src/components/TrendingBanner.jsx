import { Flame, ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";

const trendingItems = [
  "AI vs Developers prediction is gaining traction 🔥",
  "Tesla stock prediction reached new milestone 🚀",
  "$50K distributed to winning investors 💰",
  "Lakers championship prediction closing soon ⏰",
];

export default function TrendingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingItems.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + trendingItems.length) % trendingItems.length);
  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % trendingItems.length);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 p-5 sm:p-6">
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-teal-500/10 pointer-events-none" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-orange-400 shrink-0" />
            <span className="font-bold text-white text-base sm:text-lg">Trending Now</span>
          </div>
          <p className="text-blue-200 text-sm truncate">
            {trendingItems[currentIndex]}
          </p>

          {/* Dots */}
          <div className="flex gap-1.5 mt-3">
            {trendingItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Prev/Next on larger screens */}
          <div className="hidden sm:flex gap-1">
            <button
              onClick={prev}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-900 font-semibold text-sm hover:bg-blue-50 transition shadow-sm">
            View All
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
