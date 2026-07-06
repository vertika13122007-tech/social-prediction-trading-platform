import { Bookmark } from "lucide-react";

const CATEGORIES = ["Home", "Sports", "Creators", "Memes", "Products", "Trends"];

export default function CategoryTabs({ active, setActive, savedCount = 0 }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            active === cat
              ? "bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {cat}
        </button>
      ))}

      {/* Saved tab with bookmark icon + count badge */}
      <button
        onClick={() => setActive("Saved")}
        className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          active === "Saved"
            ? "bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <Bookmark size={13} fill={active === "Saved" ? "white" : "none"} />
        <span>Saved</span>
        {savedCount > 0 && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
            active === "Saved"
              ? "bg-white/30 text-white"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
          }`}>
            {savedCount}
          </span>
        )}
      </button>
    </div>
  );
}