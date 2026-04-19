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

import { LocalNotifications } from '@capacitor/local-notifications';

function App() {
  const [balance, setBalance] = useState("");
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Load data
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
                on: {
                  hour: 22,
                  minute: 0,
                },
                repeats: true,
              },
            },
          ],
        });

        console.log("Daily reminder scheduled");
      };

      setupNotification();
    }, []);

  // Save balance
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

  // Format ₹
  const formatCurrency = (val) =>
    val !== null ? `₹${Number(val).toFixed(2)}` : "-";

  // Usage
  const getUsage = (arr, index) => {
    if (index === 0) return null;
    return Number(
      (arr[index - 1].balance - arr[index].balance).toFixed(2)
    );
  };

  // Month filter
  const filteredData = data.filter((item) => {
    const d = new Date(item.date);
    return (
      d.getMonth() === selectedMonth.getMonth() &&
      d.getFullYear() === selectedMonth.getFullYear()
    );
  });

  // Latest usage
  const latestUsage =
    filteredData.length > 1
      ? getUsage(filteredData, filteredData.length - 1)
      : 0;


  useEffect(() => {
    if ( data.length > 0) {
      const lastBalance = data[data.length - 1].balance;

    if (lastBalance < 200) {
      alert("⚠️ Low balance! Recharge soon");
    }
  }
}, [data , latestUsage]);


  // Chart data
  const chartData = filteredData.map((item, index) => ({
    date: item.date,
    usage: index === 0 ? 0 : getUsage(filteredData, index),
  }));

  // Opening / Closing
  const getOpening = (index) =>
    index === 0 ? null : filteredData[index - 1].balance;

  const getClosing = (index) => filteredData[index].balance;

  // Month navigation
  const changeMonth = (dir) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + dir);
    setSelectedMonth(newDate);
  };

  const usages = filteredData
    .map((item, index) => {
      if (index === 0) return null;
      return filteredData[index - 1].balance - item.balance;
    })
    .filter(Boolean);

  const avgUsage =
    usages.length > 0  
      ? usages.reduce((a, b) => a + b, 0) / usages.length
      : 0;

  const currentBalance =
    filteredData.length > 0
      ? filteredData[filteredData.length - 1].balance
      : 0;

  const rechargeOptions = [500, 1000, 2000];

  const rechargeSuggestions = rechargeOptions.map((amount) => {
    const days =
      avgUsage > 0 ? Math.floor(amount / avgUsage) : 0;

    return {
      amount,
      days,
    };
  });
  const daysLeft =
    avgUsage > 0 ? Math.floor(currentBalance / avgUsage) : 0;


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-4">
          ⚡ UrjaTrack
        </h1>

        {/* 📅 Month selector */}
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

        {/* Usage card */}
        <div className="bg-gray-100 p-3 rounded-xl text-center mb-4">
          <div className="text-sm text-gray-500">Latest Usage</div>
          <div className={`text-xl font-bold ${
            latestUsage > 50 ? "text-red-500" : "text-green-600"
          }`}>
            ₹{latestUsage}
          </div>
        </div>
        
        {/*days left card */ }
        <div className="bg-blue-50 p-4 rounded-xl text-center mb-4">
          <p className="text-sm text-gray-500">Estimated Days Left</p>
          <p className="text-2xl font-bold text-blue-600">
            {daysLeft} days
          </p>
        </div>

        {/*Recharge Suggestion card */ }
        <div className="bg-green-50 p-4 rounded-xl mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Recharge Suggestions
          </p>

          {rechargeSuggestions.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm py-1"
            >
              <span>₹{item.amount}</span>
              <span className="font-medium text-green-700">
                {item.days} days
              </span>
            </div>
          ))}
        </div>        

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Enter today balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          />

          <button
            onClick={saveBalance}
            className="bg-black text-white px-4 rounded-lg"
          >
            Save
          </button>
        </div>

        
        {/* Graph */}
        <h3 className="font-semibold mb-2">
          Daily Usage (per day) 📊
        </h3>

        <LineChart width={300} height={200} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="usage" stroke="#4f46e5" />
        </LineChart>

        {/* History */}
        <h3 className="font-semibold mt-4 mb-2">History 📅</h3>

        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {filteredData.map((item, index) => {
            const opening = getOpening(index);
            const usage = getUsage(filteredData, index);
            const closing = getClosing(index);

            return (
              <li key={index} className="bg-gray-50 p-3 rounded-xl shadow-sm">

                <div className="text-sm text-gray-500 mb-1">
                  {item.date}
                </div>

                <div className="flex justify-between text-sm">

                  <div>
                    <div className="text-gray-400 text-xs">Opening</div>
                    <div>{formatCurrency(opening)}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-xs">Usage</div>
                    <div className={`font-medium ${
                      usage !== null && usage > 50
                        ? "text-red-500"
                        : "text-green-600"
                    }`}>
                      {formatCurrency(usage)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-xs">Closing</div>
                    <div>{formatCurrency(closing)}</div>
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