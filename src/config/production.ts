/**
 * Production Configuration
 * Real integrations for live trading
 */

export interface ProductionConfig {
  ai: {
    provider: 'openai' | 'anthropic';
    apiKey: string;
    model: string;
  };
  marketData: {
    primary: 'binance' | 'coinbase';
    fallback: 'coingecko' | 'coinmarketcap';
    websocketUrls: {
      binance: string;
      coinbase: string;
    };
    restApiKeys: {
      coingecko?: string;
      coinmarketcap?: string;
    };
  };
  trading: {
    enabled: boolean;
    maxPositionSize: number;
    defaultRiskPercent: number;
    slippageLimit: number;
    confirmationTimeout: number;
  };
  aptos: {
    network: 'mainnet' | 'testnet' | 'devnet';
    moduleAddress: string;
    nodeUrl: string;
    gasSettings: {
      maxGasAmount: number;
      gasUnitPrice: number;
    };
  };
}

export const getProductionConfig = (): ProductionConfig => ({
  ai: {
    provider: process.env.AI_PROVIDER as 'openai' | 'anthropic' || 'openai',
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4',
  },
  marketData: {
    primary: 'binance',
    fallback: 'coingecko',
    websocketUrls: {
      binance: process.env.BINANCE_WS_URL || 'wss://stream.binance.com:9443/ws',
      coinbase: process.env.COINBASE_WS_URL || 'wss://ws-feed.exchange.coinbase.com',
    },
    restApiKeys: {
      coingecko: process.env.COINGECKO_API_KEY,
      coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
  },
  trading: {
    enabled: process.env.TRADING_ENABLED === 'true',
    maxPositionSize: parseInt(process.env.MAX_POSITION_SIZE || '1000'),
    defaultRiskPercent: parseInt(process.env.DEFAULT_RISK_PERCENT || '2'),
    slippageLimit: parseFloat(process.env.SLIPPAGE_LIMIT || '0.02'), // 2%
    confirmationTimeout: parseInt(process.env.CONFIRMATION_TIMEOUT || '30000'), // 30 seconds
  },
  aptos: {
    network: process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'testnet' | 'devnet' || 'testnet',
    moduleAddress: process.env.NEXT_PUBLIC_MODULE_ADDRESS || '',
    nodeUrl: getAptosNodeUrl(),
    gasSettings: {
      maxGasAmount: parseInt(process.env.MAX_GAS_AMOUNT || '10000'),
      gasUnitPrice: parseInt(process.env.GAS_UNIT_PRICE || '100'),
    },
  },
});

function getAptosNodeUrl(): string {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';

  switch (network) {
    case 'mainnet':
      return 'https://fullnode.mainnet.aptoslabs.com/v1';
    case 'testnet':
      return 'https://fullnode.testnet.aptoslabs.com/v1';
    case 'devnet':
      return 'https://fullnode.devnet.aptoslabs.com/v1';
    default:
      return 'https://fullnode.testnet.aptoslabs.com/v1';
  }
}

/**
 * Validate production configuration
 */
export const validateProductionConfig = (config: ProductionConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate AI configuration
  if (!config.ai.apiKey) {
    errors.push('AI API key is required for production');
  }

  // Validate Aptos configuration
  if (!config.aptos.moduleAddress) {
    errors.push('Aptos module address is required');
  }

  // Validate trading settings
  if (config.trading.enabled && config.trading.maxPositionSize <= 0) {
    errors.push('Max position size must be greater than 0 when trading is enabled');
  }

  if (config.trading.slippageLimit <= 0 || config.trading.slippageLimit > 0.1) {
    errors.push('Slippage limit must be between 0 and 10%');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get environment-specific settings
 */
export const getEnvironmentSettings = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    isProduction,
    isDevelopment,
    enableMockData: isDevelopment && process.env.ENABLE_MOCK_DATA !== 'false',
    enableRealTrading: isProduction && process.env.TRADING_ENABLED === 'true',
    enableDebugLogging: isDevelopment || process.env.DEBUG_LOGGING === 'true',
  };
};