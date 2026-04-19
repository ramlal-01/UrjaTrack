export default function TrendCard({ trend }) {
  let text = "Usage stable";
  let color = "text-gray-500";

  if (trend === "up") {
    text = "Usage increasing 📈";
    color = "text-red-500";
  } else if (trend === "down") {
    text = "You are saving energy 📉";
    color = "text-green-600";
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-3 mb-4 text-center">
      <p className={`text-sm font-medium ${color}`}>
        {text}
      </p>
    </div>
  );
}