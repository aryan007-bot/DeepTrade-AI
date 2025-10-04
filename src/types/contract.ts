// Trading bot related enums
export enum BotStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused'
}

export enum TradeType {
  BUY = 0,
  SELL = 1
}

export enum ContractFunction {
  CREATE_BOT = 'create_bot',
  EXECUTE_TRADE = 'execute_trade',
  GET_BOT = 'get_bot',
  GET_USER_BOTS = 'get_user_bots',
  GET_LEADERBOARD = 'get_leaderboard',
  GET_REGISTRY_STATS = 'get_registry_stats',
  HAS_BOT = 'has_bot',
  PURCHASE_SUBSCRIPTION = 'purchase_subscription',
  GET_USER_SUBSCRIPTION = 'get_user_subscription',
  GET_CURRENT_SUBSCRIPTION_TIER = 'get_current_subscription_tier',
  GET_USER_MAX_BOTS = 'get_user_max_bots',
  GET_SUBSCRIPTION_PRICES = 'get_subscription_prices',
  GET_USER_BOT_COUNT = 'get_user_bot_count'
}

// Contract interaction types
export interface TradingBotData {
  owner: string;
  bot_id: number;
  name: string;
  strategy: string;
  balance: number;
  performance: number;
  total_loss: number;
  active: boolean;
  total_trades: number;
  created_at: number;
  last_trade_at?: number;
}

export interface BotPerformanceData {
  bot_id: number;
  owner: string;
  name: string;
  net_performance: number;
  total_trades: number;
  win_rate: number;
}

export interface RegistryStats {
  total_bots: number;
  total_volume: number;
}

export interface CreateBotParams {
  name: string;
  strategy: string;
  initial_balance: number;
  max_position_size: number;
  stop_loss_percent: number;
  max_trades_per_day: number;
  max_daily_loss: number;
}

export interface ContractResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Subscription related enums
export enum SubscriptionTier {
  FREE = 0,
  BASIC = 1,
  PREMIUM = 2
}

// Subscription related types
export interface UserSubscription {
  tier: SubscriptionTier;
  expires_at: number;
  auto_renew: boolean;
}

export interface SubscriptionPrices {
  basic_price: number; // in APT (with 8 decimals)
  premium_price: number; // in APT (with 8 decimals)
}

export interface PurchaseSubscriptionParams {
  tier: SubscriptionTier; // 1 for Basic, 2 for Premium
}