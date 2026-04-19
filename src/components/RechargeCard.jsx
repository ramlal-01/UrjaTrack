export default function RechargeCard({ rechargeSuggestions }) {
  return (
    <div className="bg-green-50 p-3 rounded-xl mb-4 shadow-sm">

      <p className="text-xs text-gray-500 mb-2">
        Recharge Suggestions
      </p>

      {rechargeSuggestions.map((item, index) => {
        const isBest = index === 1; // highlight ₹1000

        return (
          <div
            key={index}
            className={`flex justify-between items-center py-1 px-2 rounded-lg ${
              isBest ? "bg-green-100" : ""
            }`}
          >
            <span className="text-sm font-medium">
              ₹{item.amount}
            </span>

            <span
              className={`text-sm font-semibold ${
                isBest ? "text-green-700" : "text-green-600"
              }`}
            >
              {item.days} days
            </span>
          </div>
        );
      })}
    </div>
  );
}