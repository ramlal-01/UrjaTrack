export default function DaysLeftCard({ daysLeft }) {
  return (
    <div className="bg-blue-50 p-4 rounded-xl text-center mb-4">
      <p className="text-sm text-gray-500">Estimated Days Left</p>
      <p className="text-2xl font-bold text-blue-600">
        {daysLeft} days
      </p>
    </div>
  );
}