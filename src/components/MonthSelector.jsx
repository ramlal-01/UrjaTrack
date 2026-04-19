export default function MonthSelector({ selectedMonth, changeMonth }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => changeMonth(-1)}>⬅️</button>

      <div className="font-semibold">
        {selectedMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </div>

      <button onClick={() => changeMonth(1)}>➡️</button>
    </div>
  );
}