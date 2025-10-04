// Mock data for contract integration testing
export const mockContractData = {
  userBots: [
    {
      owner: "0x1234567890abcdef1234567890abcdef12345678",
      bot_id: 1,
      name: "AI Momentum Bot",
      strategy: "RSI-based momentum trading with 5% stop loss",
      balance: 1200000, // 1.2 USDC in micro units
      performance: 150000, // 0.15 USDC profit
      total_loss: 50000, // 0.05 USDC loss
      active: true,
      total_trades: 25,
      created_at: 1703097600, // Dec 20, 2023
      last_trade_at: 1703184000 // Dec 21, 2023
    },
    {
      owner: "0x1234567890abcdef1234567890abcdef12345678",
      bot_id: 2,
      name: "Scalping Expert",
      strategy: "High-frequency scalping with tight spreads",
      balance: 950000, // 0.95 USDC
      performance: 75000, // 0.075 USDC profit
      total_loss: 25000, // 0.025 USDC loss
      active: false,
      total_trades: 48,
      created_at: 1703011200, // Dec 19, 2023
      last_trade_at: 1703097600 // Dec 20, 2023
    }
  ],
  leaderboard: [
    {
      bot_id: 3,
      owner: "0xabcdef1234567890abcdef1234567890abcdef12",
      name: "Crypto Whale",
      net_performance: 500000, // 0.5 USDC
      total_trades: 120,
      win_rate: 85
    },
    {
      bot_id: 1,
      owner: "0x1234567890abcdef1234567890abcdef12345678",
      name: "AI Momentum Bot",
      net_performance: 100000, // 0.1 USDC
      total_trades: 25,
      win_rate: 72
    },
    {
      bot_id: 4,
      owner: "0xfedcba0987654321fedcba0987654321fedcba09",
      name: "DeFi Arbitrage",
      net_performance: 75000, // 0.075 USDC
      total_trades: 67,
      win_rate: 68
    }
  ],
  registryStats: {
    total_bots: 15,
    total_volume: 25000000 // 25 USDC in micro units
  }
};