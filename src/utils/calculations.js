export const getUsage = (arr, index) => {
  if (index === 0) return null;
  return Number(
    (arr[index - 1].balance - arr[index].balance).toFixed(2)
  );
};

export const calculateStats = (filteredData) => {
  const usages = filteredData
    .map((item, index) => {
      if (index === 0) return null;
      const diff = filteredData[index - 1].balance - item.balance;

      // ignore recharge
      if (diff < 0) return null;

      return diff;
    })
    .filter((val) => val !== null);

  const avgUsage =
    usages.length > 0
      ? usages.reduce((a, b) => a + b, 0) / usages.length
      : 0;
      
  const totalSpent =
      usages.length > 0
        ? usages.reduce((a, b) => a + b, 0)
        : 0;

  const maxUsage =
    usages.length > 0
      ? Math.max(...usages)
      : 0;
  const currentBalance =
    filteredData.length > 0
      ? filteredData[filteredData.length - 1].balance
      : 0;

  const daysLeft =
    avgUsage > 0 ? Math.floor(currentBalance / avgUsage) : 0;

  const rechargeOptions = [500, 1000, 2000];

  const rechargeSuggestions = rechargeOptions.map((amount) => ({
    amount,
    days: avgUsage > 0 ? Math.floor(amount / avgUsage) : 0,
  }));
  
// 🔥 TREND FIX
  const recentUsages = usages.slice(-4);

  const recentAvg =
    recentUsages.length > 0
      ? recentUsages.reduce((a, b) => a + b, 0) / recentUsages.length
      : 0;

  let trend = "stable";

  const diff = recentAvg - avgUsage;
  const threshold = avgUsage * 0.1;

  if (usages.length < 5) {
    trend = "stable";
  } else if (diff > threshold) {
    trend = "up";
  } else if (diff < -threshold) {
    trend = "down";
  }


  return {
    avgUsage,
    totalSpent,
    maxUsage,
    currentBalance,
    daysLeft,
    rechargeSuggestions,
    trend
  };
};