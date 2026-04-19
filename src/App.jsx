import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

import { LocalNotifications } from "@capacitor/local-notifications";

import MonthSelector from "./components/MonthSelector";
import DaysLeftCard from "./components/DaysLeftCard";
import RechargeCard from "./components/RechargeCard";
import MonthlySummaryCard from "./components/MonthlySummaryCard";
import TrendCard from "./components/TrendCard";

import { getUsage, calculateStats } from "./utils/calculations";

function App() {
  const [balance, setBalance] = useState("");
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

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

  // 🔹 Month filter
  const filteredData = data.filter((item) => {
    const d = new Date(item.date);
    return (
      d.getMonth() === selectedMonth.getMonth() &&
      d.getFullYear() === selectedMonth.getFullYear()
    );
  });

  // 🔹 Stats (clean logic from utils)
  const {
        daysLeft,
        rechargeSuggestions ,
        avgUsage,
        totalSpent,
        maxUsage,
        trend,
      } = calculateStats(filteredData);

  // 🔹 Latest usage
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

  // 🔹 Chart data
  const chartData = filteredData.map((item, index) => ({
    date: item.date,
    usage: index === 0 ? 0 : getUsage(filteredData, index),
  }));

  // 🔹 Month navigation
  const changeMonth = (dir) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + dir);
    setSelectedMonth(newDate);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 flex justify-center items-center">
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 w-full max-w-md">

        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            UrjaTrack
          </h1>
          <p className="text-xs text-gray-500">
            Smart Electricity Tracker
          </p>
        </div>

        {/* ✅ Components */}
        <MonthSelector
          selectedMonth={selectedMonth}
          changeMonth={changeMonth}
        />

        {/* Usage card */}
        <div className="bg-white shadow-sm border border-gray-200 p-4 rounded-xl mb-4 shadow-sm">

          <div className="flex justify-between items-center">

            {/* Latest Usage */}
            <div className="text-center flex-1">
              <div className="text-xs text-gray-500">Latest Usage</div>
              <div className={`text-lg font-bold ${
                latestUsage > 50 ? "text-red-500" : "text-green-600"
              }`}>
                ₹{latestUsage}
              </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-gray-300"></div>

            {/* Days Left */}
            <div className="text-center flex-1">
              <div className="text-xs text-gray-500">Days Left</div>
              <div className="text-lg font-bold text-blue-600">
                {daysLeft} days
              </div>
            </div>

          </div>

        </div>
        
        <div className="bg-white border border-green-100 p-4 rounded-xl mb-4 shadow-sm">
          <RechargeCard rechargeSuggestions={rechargeSuggestions} />
        </div>
        
        <MonthlySummaryCard
          totalSpent={totalSpent}
          avgUsage={avgUsage}
          maxUsage={maxUsage}
        />

        <TrendCard trend={trend} />

        {/* Input */}
        <div className="flex gap-2 mb-4 items-center">
          <input
            type="number"
            placeholder="Enter today balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={saveBalance}
            className="bg-blue-600 hover:bg-blue-700 transition rounded-xl px-4 py-2 text-white"
          >
            Save
          </button>
        </div>

        {/* Graph */}

        <h3 className="font-semibold mb-2">
          Daily Usage (per day) 📊
        </h3>
        <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
          <LineChart width={300} height={200} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="usage" stroke="#4f46e5" />
          </LineChart>
        </div>
        

        {/* History */}
        <h3 className="font-semibold mt-4 mb-2">History 📅</h3>

        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {filteredData.map((item, index) => {
            const opening =
              index === 0 ? null : filteredData[index - 1].balance;

            const usage = getUsage(filteredData, index);
            const closing = item.balance;

            return (
              <li key={index} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                <div className="text-sm text-gray-500 mb-1">
                  {item.date}
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-400 text-xs">Opening</div>
                    <div>{opening !== null ? `₹${opening}` : "-"}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-xs">Usage</div>
                    <div className="font-medium">
                      {usage !== null ? `₹${usage}` : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-xs">Closing</div>
                    <div>₹{closing}</div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}

export default App;