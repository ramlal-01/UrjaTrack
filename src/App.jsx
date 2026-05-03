import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

import { LocalNotifications } from "@capacitor/local-notifications";

import MonthSelector from "./components/MonthSelector";
import RechargeCard from "./components/RechargeCard";
import MonthlySummaryCard from "./components/MonthlySummaryCard";
import TrendCard from "./components/TrendCard";

import { getUsage, calculateStats } from "./utils/calculations";

function App() {
  const [balance, setBalance] = useState("");
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // ✅ Load dark mode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // ✅ Save dark mode to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // 🔹 Load data
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "urjaData"));
      const arr = [];

      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });

      arr.sort((a, b) => a.date.localeCompare(b.date));
      setData(arr);
    };

    fetchData();
  }, []);

  // 🔹 Notification setup
  useEffect(() => {
    const setupNotification = async () => {
      await LocalNotifications.requestPermissions();

      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "⚡ UrjaTrack Reminder",
            body: "Enter today's electricity balance",
            id: 1,
            schedule: {
              on: { hour: 22, minute: 0 },
              repeats: true,
            },
          },
        ],
      });
    };

    setupNotification();
  }, []);

  // 🔹 Save balance
  const saveBalance = async () => {
    if (!balance) return;

    const now = new Date();
    now.setDate(now.getDate() - 1);

    const today = now.toLocaleDateString("en-CA");

    const alreadyExists = data.find((d) => d.date === today);
    if (alreadyExists) {
      alert("Today's data already added");
      return;
    }

    const newEntry = {
      date: today,
      balance: Number(balance),
    };

    await addDoc(collection(db, "urjaData"), newEntry);

    const updated = [...data, newEntry].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    setData(updated);
    setBalance("");
  };

  // 🔹 Filter month
const filteredData = data.filter((item) => {
  const [year, month] = item.date.split("-").map(Number);

  return (
    year === selectedMonth.getFullYear() &&
    month === selectedMonth.getMonth() + 1
  );
});
console.log("Filtered:", filteredData.length);

  const reversedData = [...filteredData].reverse();

  // 🔹 Stats
  const {
    daysLeft,
    rechargeSuggestions,
    avgUsage,
    totalSpent,
    maxUsage,
    trend,
  } = calculateStats(filteredData);

  const latestUsage =
    filteredData.length > 1
      ? getUsage(filteredData, filteredData.length - 1)
      : 0;

  // 🔹 Low balance alert
  useEffect(() => {
    if (data.length > 0) {
      const lastBalance = data[data.length - 1].balance;

      if (lastBalance < 200) {
        alert("⚠️ Low balance! Recharge soon");
      }
    }
  }, [data]);



  // 🔹 Month nav
  const changeMonth = (dir) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + dir);
    setSelectedMonth(newDate);
  };


  // 🔹 Get previous day's balance from FULL data (not filtered)
  const getPreviousBalance = (currentDate) => {
    const index = data.findIndex((d) => d.date === currentDate);

    if (index <= 0) return null;

    return data[index - 1].balance;
  };


    // 🔹 Chart
    const chartData = filteredData.map((item) => {
      const opening = getPreviousBalance(item.date);

      let usage = null;

      if (opening !== null && item.balance <= opening) {
        usage = Number((opening - item.balance).toFixed(2));
      }

      return {
        date: item.date,
        usage: usage,
        recharge: opening !== null && item.balance > opening,
      };
    });

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 dark:from-[#0f172a] dark:to-[#020617] flex justify-center items-center">

        <div className="bg-white/90 dark:bg-[#111827] backdrop-blur-md shadow-lg rounded-2xl p-6 w-full max-w-md">

          {/* 🔘 Dark mode toggle */}
          <div className="mb-4">

            {/* Top Row */}
            <div className="flex items-center justify-between">

              {/* Left spacer (to balance layout) */}
              <div className="w-8"></div>

              {/* Title */}
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                ⚡ UrjaTrack
              </h1>

              {/* Toggle Button */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-xs px-2 py-1 rounded-md 
                bg-gray-200 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200 
                transition"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

            </div>

            {/* Subtitle */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              Smart Electricity Tracker
            </p>

          </div>

          <div className="
            relative overflow-hidden
            rounded-2xl mb-4 p-5
            bg-white/80 dark:bg-[#111827]/80
            backdrop-blur-md
            border border-green-400/20 dark:border-green-500/20
            shadow-md
          ">

            {/* subtle glow effect */}
            <div className="absolute inset-0 
              bg-gradient-to-br 
              from-green-400/10 via-transparent to-transparent 
              pointer-events-none" />

            {/* content */}
            <div className="relative text-center">

              <p className="text-xs tracking-wide 
                text-gray-500 dark:text-gray-400">
                Current Balance
              </p>

              <p className="text-3xl font-semibold mt-1 
                text-green-600 dark:text-green-400">
                ₹{data.length > 0 ? data[data.length - 1].balance : 0}
              </p>

              {/* subtle divider */}
              <div className="w-10 h-[2px] mx-auto mt-2 
                bg-green-400/40 rounded-full" />

            </div>
          </div>

          <MonthSelector
            selectedMonth={selectedMonth}
            changeMonth={changeMonth}
          />

          {/* Usage + Days */}
          <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-600/40 p-3 rounded-xl mb-4 shadow-sm">
            <div className="flex justify-between items-center">

              <div className="text-center flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Latest Usage
                </div>
                <div className={`text-base font-bold ${
                  latestUsage > 50 ? "text-red-500" : "text-green-600"
                }`}>
                  ₹{latestUsage}
                </div>
              </div>

              <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>

              <div className="text-center flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Days Left
                </div>
                <div className="text-base font-bold text-blue-600">
                  {daysLeft} days
                </div>
              </div>

            </div>
          </div>

          {/* Recharge */}
          <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-600/40 p-3 rounded-xl mb-4 shadow-sm">
            <RechargeCard rechargeSuggestions={rechargeSuggestions} />
          </div>

          {/* Summary */}
          <MonthlySummaryCard
            totalSpent={totalSpent}
            avgUsage={avgUsage}
            maxUsage={maxUsage}
          />

          {/* Trend */}
          <TrendCard trend={trend} />

          {/* Input */}
          <div
            className="bg-white dark:bg-[#1f2937] 
            border border-gray-200 dark:border-gray-600/40 
            rounded-xl p-3 mb-4 shadow-sm"
          >

            {/* Label */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Enter Today Balance
            </p>

            {/* Input + Button */}
            <div className="flex items-center gap-2">

              <input
                type="number"
                placeholder="₹ Enter amount"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="flex-1 p-3 rounded-lg 
                bg-gray-50 dark:bg-[#020617] 
                border border-gray-300 dark:border-gray-600/40 
                text-gray-900 dark:text-white text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={saveBalance}
                className="bg-blue-600 hover:bg-blue-700 
                active:scale-95 transition 
                rounded-lg px-4 py-2 text-white text-sm font-medium"
              >
                Save
              </button>

            </div>
          </div>

          {/* Graph */}
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Daily Usage 📊
          </h3>
 

          <ResponsiveContainer width="100%" height={220}>
            <LineChart 
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >

              <CartesianGrid
                strokeDasharray="4 4"
                strokeOpacity={0.15}
              />

              <XAxis
                dataKey="date"
                tickFormatter={(date) => date.slice(5)}
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
              />

              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#9ca3af" }}
              />

              <Line
                type="monotone"
                dataKey="usage"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 3, fill: "#22c55e" }}
                activeDot={{ r: 5 }}
                connectNulls
              />   

            </LineChart>
          </ResponsiveContainer>

          {/* History */}
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
            History 📅
          </h3>

          <div className="relative">

          <ul className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-hide">

            {reversedData.map((item, index) => {

              // Opening (previous day's balance)
              const opening = getPreviousBalance(item.date);

              let usage = null;
              let isRecharge = false;

              if (opening !== null) {
                if (item.balance > opening) {
                  isRecharge = true; // recharge detected
                } else {
                  usage = Number((opening - item.balance).toFixed(2));
                }
              }

              return (
                <li
                  key={index}
                  className="bg-white dark:bg-[#1f2937] 
                  border border-gray-200 dark:border-gray-600/40 
                  p-3 rounded-xl shadow-sm 
                  transition hover:shadow-md"
                >
                  {/* DATE */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {item.date}
                  </div>

                  {/* CONTENT */}
                  <div className="grid grid-cols-3 gap-2 text-sm">

                    {/* Opening */}
                    <div className="text-center">
                      <div className="text-[11px] text-gray-400">Opening</div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {opening !== null ? `₹${opening}` : "-"}
                      </div>
                    </div>

                    {/* Usage */}
                    <div className="text-center">
                      <div className="text-[11px] text-gray-400">Usage</div>
                      <div
                        className={`font-semibold ${
                          isRecharge
                            ? "text-blue-500"
                            : usage !== null && usage > 50
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {isRecharge ? (
                          <span className="text-blue-500 font-semibold">
                            +₹{item.balance - opening}
                          </span>
                        ) : (
                          <span>
                            {usage !== null ? `₹${usage}` : "-"}
                          </span>
                        )}

                      </div>
                    </div>

                    {/* Closing */}
                    <div className="text-center">
                      <div className="text-[11px] text-gray-400">Closing</div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        ₹{item.balance}
                      </div>
                    </div>

                  </div>
                </li>
              );
            })}

          </ul>

          {/* Scroll indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-gray-400 text-4xl animate-bounce pointer-events-none">
            ↓
          </div>

        </div>

        </div>
      </div>
    </div>
  );
}

export default App;