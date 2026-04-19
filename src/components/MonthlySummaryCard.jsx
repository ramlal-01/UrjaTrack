export default function MonthlySummaryCard({
  totalSpent,
  avgUsage,
  maxUsage,
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-3 mb-4">

      <p className="text-xs text-gray-500 mb-2">
        Monthly Summary
      </p>

      <div className="flex justify-between text-sm">

        <div className="text-center flex-1">
          <div className="text-gray-400 text-xs">Total</div>
          <div className="font-semibold text-blue-600">
            ₹{totalSpent.toFixed(0)}
          </div>
        </div>

        <div className="text-center flex-1">
          <div className="text-gray-400 text-xs">Avg/day</div>
          <div className="font-semibold">
            ₹{avgUsage.toFixed(0)}
          </div>
        </div>

        <div className="text-center flex-1">
          <div className="text-gray-400 text-xs">Max</div>
          <div className="font-semibold text-red-500">
            ₹{maxUsage.toFixed(0)}
          </div>
        </div>

      </div>
    </div>
  );
}