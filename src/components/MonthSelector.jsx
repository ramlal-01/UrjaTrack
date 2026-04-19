export default function MonthSelector({ selectedMonth, changeMonth }) {
  return (
    <div className="flex items-center justify-between mb-4">

      {/* Left button */}
      <button
        onClick={() => changeMonth(-1)}
        className="w-8 h-8 flex items-center justify-center 
        rounded-lg bg-white dark:bg-[#1f2937] 
        border border-gray-200 dark:border-gray-600/40 
        shadow-sm hover:scale-105 transition"
      >
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          ←
        </span>
      </button>

      {/* Month text */}
      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
        {selectedMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* Right button */}
      <button
        onClick={() => changeMonth(1)}
        className="w-8 h-8 flex items-center justify-center 
        rounded-lg bg-white dark:bg-[#1f2937] 
        border border-gray-200 dark:border-gray-600/40 
        shadow-sm hover:scale-105 transition"
      >
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          →
        </span>
      </button>

    </div>
  );
}