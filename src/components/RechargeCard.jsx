export default function RechargeCard({ rechargeSuggestions }) {
  return (
    <div
      className="bg-white dark:bg-[#1f2937] 
      border border-gray-200 dark:border-gray-600/40 
      rounded-xl p-3 mb-4 shadow-sm"
    >
      {/* Title */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Recharge Suggestions
      </p>

      {/* Options */}
      <div className="space-y-2">
        {rechargeSuggestions.map((item, index) => {
          const isBest = index === 1;

          return (
            <div
              key={index}
              className={`flex justify-between items-center px-3 py-2 rounded-lg transition
              ${
                isBest
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-[#020617]"
              }`}
            >
              {/* Amount */}
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                ₹{item.amount}
              </span>

              {/* Days */}
              <span
                className={`text-sm font-semibold ${
                  isBest
                    ? "text-green-600"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.days} days
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}