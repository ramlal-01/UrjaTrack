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
      return filteredData[index - 1].balance - item.balance;
    })
    .filter(Boolean);

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
  
  const recentUsages = usages.slice(-4);

  const recentAvg =
    recentUsages.length > 0
      ? recentUsages.reduce((a, b) => a + b, 0) / recentUsages.length
      : 0;

  let trend = "stable";

  if (recentAvg > avgUsage + 2) {
    trend = "up";
  } else if (recentAvg < avgUsage - 2) {
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