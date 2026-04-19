export default function TrendCard({ trend, avgUsage }) {
  let text = "Usage stable";
  let subtext = "No major change in usage";
  let color = "text-gray-500";
  let bg = "bg-gray-50 dark:bg-[#111827]";
  let icon = "➖";

  if (trend === "up") {
    text = "Usage increasing";
    subtext = "Your recent usage is higher than average";
    color = "text-red-500";
    bg = "bg-red-50 dark:bg-red-900/20";
    icon = "📈";
  } else if (trend === "down") {
    text = "You are saving energy";
    subtext = "Your recent usage is lower than average";
    color = "text-green-600";
    bg = "bg-green-50 dark:bg-green-900/20";
    icon = "📉";
  }

  return (
    <div
      className={`${bg} border border-gray-200 dark:border-gray-600/40 
      shadow-sm rounded-xl p-3 mb-4`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>

        <p className={`text-sm font-medium ${color}`}>
          {text}
        </p>
      </div>

      {/* Subtext */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {subtext}
      </p>

      {/* Optional: show avg */}
      {avgUsage > 0 && (
        <p className="text-[11px] text-gray-400 mt-1">
          Avg usage: ₹{avgUsage}
        </p>
      )}
    </div>
  );
}