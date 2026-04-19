export default function MonthlySummaryCard({
  totalSpent,
  avgUsage,
  maxUsage,
}) {
  return (
    <div
      className="bg-white dark:bg-[#1f2937] 
      border border-gray-200 dark:border-gray-600/40 
      shadow-sm rounded-xl p-4 mb-4"
    >

      {/* Title */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Monthly Summary
      </p>

      {/* Stats Row */}
      <div className="flex justify-between items-center text-sm">

        {/* Total */}
        <div className="flex-1 text-center">
          <div className="text-[11px] text-gray-400">Total</div>
          <div className="font-semibold text-blue-500 text-base">
            ₹{totalSpent.toFixed(0)}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600/40"></div>

        {/* Avg */}
        <div className="flex-1 text-center">
          <div className="text-[11px] text-gray-400">Avg/day</div>
          <div className="font-semibold text-gray-800 dark:text-gray-200 text-base">
            ₹{avgUsage.toFixed(0)}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600/40"></div>

        {/* Max */}
        <div className="flex-1 text-center">
          <div className="text-[11px] text-gray-400">Max</div>
          <div className="font-semibold text-red-500 text-base">
            ₹{maxUsage.toFixed(0)}
          </div>
        </div>

      </div>
    </div>
  );
}