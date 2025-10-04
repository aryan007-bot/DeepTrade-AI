export const formatBalance = (balance: number): string => {
  return (balance / 1000000).toFixed(6); // Convert from micro USDC to USDC
};

export const formatPerformance = (performance: number): string => {
  return (performance / 1000000).toFixed(3);
};

export const formatPerformanceWithSign = (performance: number): string => {
  const formatted = formatPerformance(performance);
  return performance >= 0 ? `+${formatted}` : formatted;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const formatWinRate = (winRate: number): string => {
  return `${winRate}%`;
};

export const formatTradeCount = (count: number): string => {
  return count.toString();
};