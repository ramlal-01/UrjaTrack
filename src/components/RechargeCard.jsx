export default function RechargeCard({ rechargeSuggestions }) {
  return (
    <div className="bg-green-50 p-4 rounded-xl mb-4">
      <p className="text-sm text-gray-500 mb-2">
        Recharge Suggestions
      </p>

      {rechargeSuggestions.map((item, index) => (
        <div key={index} className="flex justify-between text-sm py-1">
          <span>₹{item.amount}</span>
          <span className="font-medium text-green-700">
            {item.days} days
          </span>
        </div>
      ))}
    </div>
  );
}