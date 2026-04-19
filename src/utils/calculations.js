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

  return {
    avgUsage,
    currentBalance,
    daysLeft,
    rechargeSuggestions,
  };
};