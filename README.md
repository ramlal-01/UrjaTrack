# ⚡ UrjaTrack — Smart Electricity Tracker

![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Database-Firebase-orange)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Android-lightgrey)

UrjaTrack is a **smart prepaid electricity tracking app** that helps you monitor daily balance, analyze usage patterns, detect recharge events, and predict how long your balance will last — all with minimal manual input.

---

## 🚀 Features

### 📊 Daily Tracking
- Enter **daily electricity balance**
- Automatic **usage calculation**
- Handles **month transitions seamlessly**
- Continuous timeline tracking

---

### ⚡ Smart Analytics
- 📉 Daily usage graph
- 📅 Monthly summary:
  - Total consumption
  - Average usage
  - Maximum usage
- 📈 Usage trend detection:
  - Increasing 📈
  - Decreasing 📉
  - Stable ➖

---

### 🔋 Recharge Intelligence
- Automatically detects **recharge events**
- Differentiates between:
  - Consumption
  - Recharge
- Prevents incorrect negative usage
- Smart recharge suggestions

---

### ⏳ Prediction System
- Calculates **days left**
- Uses average consumption
- Automatically adapts after recharge

---

### 🌙 Modern UI
- Clean, minimal design
- Fully responsive
- Premium **dark mode support**
- Smooth graph visualization
  
| Image 1 | Image 2 |
|--------|--------|
| ![](https://github.com/user-attachments/assets/3706d16c-7635-4817-bedd-94d1bf397bd1) | ![](https://github.com/user-attachments/assets/0933df20-a1e3-44f4-b612-70321320e9b2) |

---

### 🔔 Notifications
- Daily reminder to enter balance
- Improves consistency of tracking

---

## 🧠 How It Works

### 📌 Data Format
```json
{
  "date": "YYYY-MM-DD",
  "balance": number
}
```

Each day, the system stores the remaining balance and derives insights using the following logic:

### 🔹 Usage Calculation
```
usage = previous_day_balance - current_balance
```

### 🔹 Recharge Detection
```
if current_balance > previous_balance → recharge
```
- Recharge is **NOT treated as usage**
- Prevents incorrect analytics

### 🔹 Graph Logic
- Uses real usage values
- Skips recharge days (null values)
- Avoids fake drops/spikes
- Uses smooth line rendering (`connectNulls`)

### 🔹 Days Left Calculation
```
days_left = current_balance / average_daily_usage
```

---

## 🛠 Tech Stack
- **Frontend:** React (Vite)  
- **Styling:** Tailwind CSS  
- **Charts:** Recharts  
- **Database:** Firebase Firestore  
- **Mobile App:** Capacitor (Android)  
- **Notifications:** Capacitor Local Notifications  

---

## 🧑‍💻 Installation (Local Setup)

### 1. Clone repository
```bash
git clone https://github.com/your-username/urjatrack.git
cd urjatrack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build project
```bash
npm run build
```

---

## 📱 Build APK

### 1. Sync project with Android
```bash
npx cap sync android
```

### 2. Open Android Studio
```bash
npx cap open android
```

### 3. Build APK

In Android Studio:

**Build → Build APK(s)**

---

## 📂 APK Location
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## ⚠️ Important Notes
- If APK doesn't install:
  - Uninstall previous version first  
- Always increment `versionCode` in:
  ```
  android/app/build.gradle
  ```
- Use correct APK path (not intermediates folder)

---

## 🎯 Key Highlights
- No dependency on external APIs  
- Designed to work reliably with manual input  
- Handles real-world cases:
  - Recharge  
  - Month transitions  
- Minimal input, maximum actionable insights  
- Clean and intuitive UI  

---

## 📌 Limitations
- Requires manual daily balance entry  
- Automatic data fetching is not supported (no public API available)  
- Assumes one entry per day  
- Cannot track multiple same-day events  

---

## 🚀 Future Improvements
- Run-out date prediction (exact date)  
- Monthly comparison (previous vs current)  
- Multi-user / family tracking  
- Data export & backup  
- Advanced smart alerts  

---

## 👨‍💻 Author
**Ram Lal**

---

## 📜 License
MIT License  

---

## ⭐ Support
If you like this project:

- ⭐ Star the repository  
- 📢 Share with others  
- 💡 Suggest improvements  
