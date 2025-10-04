/**
 * Autonomous Trading Engine
 * The core system that monitors market conditions and executes trades automatically
 */

import { type InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { AIStrategyParser, type ParsedStrategy, type TradingCondition } from "./aiStrategyParser";
import { MarketDataService, type TechnicalIndicators, type PriceData } from "./marketDataService";

export interface BotInstance {
  botId: string;
  userId: string;
  strategy: ParsedStrategy;
  isActive: boolean;
  lastTradeTime: number;
  dailyTradeCount: number;
  dailyPnL: number;
  performance: {
    totalTrades: number;
    winningTrades: number;
    totalProfit: number;
    totalLoss: number;
  };
}

export interface TradeSignal {
  botId: string;
  action: 'buy' | 'sell';
  amount: number;
  price: number;
  confidence: number;
  reason: string;
  timestamp: number;
}

export interface EngineStatus {
  isRunning: boolean;
  activeBots: number;
  totalSignals: number;
  totalTrades: number;
  uptime: number;
  errors: string[];
}

export class AutoTradingEngine {
  private isRunning = false;
  private activeBots: Map<string, BotInstance> = new Map();
  private marketData: MarketDataService;
  private strategyParser: AIStrategyParser;
  private tradeHistory: TradeSignal[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private startTime = 0;
  private errors: string[] = [];

  // Wallet connection for transaction signing
  private signAndSubmitTransaction?: (transaction: InputTransactionData) => Promise<any>;

  constructor() {
    this.marketData = new MarketDataService();
    this.strategyParser = new AIStrategyParser();
  }

  /**
   * Initialize the trading engine with wallet connection
   */
  initialize(signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>) {
    this.signAndSubmitTransaction = signAndSubmitTransaction;
    console.log('AutoTradingEngine initialized with wallet connection');
  }

  /**
   * Start the autonomous trading engine
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Trading engine is already running');
      return;
    }

    console.log('Starting autonomous trading engine...');
    this.isRunning = true;
    this.startTime = Date.now();
    this.errors = [];

    // Start market data connections for all active symbols
    const symbols = this.getActiveSymbols();
    for (const symbol of symbols) {
      await this.marketData.connectPriceFeed(symbol);
    }

    // Start monitoring loop
    this.monitoringInterval = setInterval(() => {
      this.monitorAllBots();
    }, 5000); // Check every 5 seconds

    console.log(`Trading engine started with ${this.activeBots.size} active bots`);
  }

  /**
   * Stop the trading engine
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Trading engine is not running');
      return;
    }

    console.log('Stopping autonomous trading engine...');
    this.isRunning = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    // Disconnect market data feeds
    this.marketData.disconnect();

    console.log('Trading engine stopped');
  }

  /**
   * Add a new bot to the trading engine
   */
  async addBot(
    botId: string,
    userId: string,
    englishStrategy: string,
    riskSettings: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Parse the English strategy
      const parsedStrategy = await this.strategyParser.parseStrategy(englishStrategy);
      
      // Validate the strategy
      const validation = this.strategyParser.validateStrategy(parsedStrategy);
      if (!validation.valid) {
        return {
          success: false,
          error: `Invalid strategy: ${validation.errors.join(', ')}`
        };
      }

      // Apply user's risk settings
      parsedStrategy.risk_management = {
        ...parsedStrategy.risk_management,
        ...riskSettings
      };

      // Create bot instance
      const botInstance: BotInstance = {
        botId,
        userId,
        strategy: parsedStrategy,
        isActive: true,
        lastTradeTime: 0,
        dailyTradeCount: 0,
        dailyPnL: 0,
        performance: {
          totalTrades: 0,
          winningTrades: 0,
          totalProfit: 0,
          totalLoss: 0
        }
      };

      this.activeBots.set(botId, botInstance);

      // Connect to market data for this symbol if not already connected
      await this.marketData.connectPriceFeed(parsedStrategy.symbol);

      console.log(`Bot ${botId} added to trading engine`);
      console.log(`Strategy: ${englishStrategy}`);
      console.log(`Parsed conditions:`, parsedStrategy.conditions);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logError(`Failed to add bot ${botId}: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Remove a bot from the trading engine
   */
  removeBot(botId: string): void {
    if (this.activeBots.has(botId)) {
      this.activeBots.delete(botId);
      console.log(`Bot ${botId} removed from trading engine`);
    }
  }

  /**
   * Monitor all active bots for trading opportunities
   */
  private async monitorAllBots(): Promise<void> {
    if (!this.isRunning || this.activeBots.size === 0) return;

    try {
      for (const [, bot] of this.activeBots.entries()) {
        if (!bot.isActive) continue;

        await this.monitorBot(bot);
      }
    } catch (error) {
      this.logError(`Error in monitoring loop: ${error}`);
    }
  }

  /**
   * Monitor a specific bot for trading signals
   */
  private async monitorBot(bot: BotInstance): Promise<void> {
    try {
      const { strategy } = bot;

      // Get comprehensive market data with verification
      const marketData = await this.marketData.getComprehensiveMarketData(strategy.symbol);

      if (!marketData.current && !marketData.verified) {
        console.log(`No price data available for ${strategy.symbol}`);
        return;
      }

      // Use verified price if available, otherwise use current price
      const priceData = marketData.verified || marketData.current;
      if (!priceData) return;

      // Log data source quality
      if (marketData.sources.length > 1) {
        console.log(`${strategy.symbol} monitored via: ${marketData.sources.join(', ')}`);
      }

      // Evaluate trading conditions
      const signal = this.evaluateStrategy(bot, priceData, marketData.indicators);

      if (signal) {
        console.log(`Trade signal generated for bot ${bot.botId}:`, signal);
        console.log(`Signal confidence: ${(signal.confidence * 100).toFixed(1)}%`);
        console.log(`Data sources used: ${marketData.sources.join(', ')}`);
        await this.executeTradeSignal(signal, bot);
      }
    } catch (error) {
      this.logError(`Error monitoring bot ${bot.botId}: ${error}`);
    }
  }

  /**
   * Evaluate if strategy conditions are met
   */
  private evaluateStrategy(
    bot: BotInstance,
    priceData: PriceData,
    indicators: TechnicalIndicators
  ): TradeSignal | null {
    const { strategy } = bot;
    
    // Check risk limits first
    if (!this.checkRiskLimits(bot)) {
      return null;
    }

    // Create market context for evaluation
    const marketContext = {
      price: priceData.price,
      rsi: indicators.rsi,
      macd: indicators.macd.macd,
      macd_signal: indicators.macd.signal,
      sma20: indicators.sma20,
      sma50: indicators.sma50,
      ema12: indicators.ema12,
      ema26: indicators.ema26,
      bb_upper: indicators.bb.upper,
      bb_lower: indicators.bb.lower,
      volume: indicators.volume,
      price_change_1h: indicators.price_change_1h,
      price_change_24h: indicators.price_change_24h,
    };

    // Evaluate buy conditions
    for (const action of strategy.buy_actions) {
      if (this.evaluateConditions(strategy.conditions, marketContext, 'buy')) {
        const amount = this.calculateTradeAmount(bot, action.amount_percent);
        
        return {
          botId: bot.botId,
          action: 'buy',
          amount,
          price: priceData.price,
          confidence: this.calculateConfidence(strategy.conditions, marketContext),
          reason: this.generateSignalReason(strategy.conditions, marketContext, 'buy'),
          timestamp: Date.now()
        };
      }
    }

    // Evaluate sell conditions
    for (const action of strategy.sell_actions) {
      if (this.evaluateConditions(strategy.conditions, marketContext, 'sell')) {
        const amount = this.calculateTradeAmount(bot, action.amount_percent);
        
        return {
          botId: bot.botId,
          action: 'sell',
          amount,
          price: priceData.price,
          confidence: this.calculateConfidence(strategy.conditions, marketContext),
          reason: this.generateSignalReason(strategy.conditions, marketContext, 'sell'),
          timestamp: Date.now()
        };
      }
    }

    return null;
  }

  /**
   * Evaluate if trading conditions are satisfied
   */
  private evaluateConditions(
    conditions: TradingCondition[],
    context: Record<string, number>,
    _actionType: 'buy' | 'sell'
  ): boolean {
    // For now, use simple AND logic between conditions
    // TODO: Implement more sophisticated logic (AND/OR combinations)
    
    for (const condition of conditions) {
      const contextValue = context[condition.indicator];
      if (contextValue === undefined) {
        console.log(`Unknown indicator: ${condition.indicator}`);
        continue;
      }

      const satisfied = this.checkCondition(contextValue, condition.operator, condition.value);
      if (!satisfied) {
        return false;
      }
    }

    return conditions.length > 0; // At least one condition must exist
  }

  /**
   * Check if a single condition is satisfied
   */
  private checkCondition(actualValue: number, operator: string, expectedValue: number): boolean {
    switch (operator) {
      case '<': return actualValue < expectedValue;
      case '<=': return actualValue <= expectedValue;
      case '>': return actualValue > expectedValue;
      case '>=': return actualValue >= expectedValue;
      case '==': return Math.abs(actualValue - expectedValue) < 0.001; // Handle floating point
      case '!=': return Math.abs(actualValue - expectedValue) >= 0.001;
      default:
        console.log(`Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Check if bot is within risk limits
   */
  private checkRiskLimits(bot: BotInstance): boolean {
    const { risk_management } = bot.strategy;
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Reset daily counters if a new day has started
    if (now - bot.lastTradeTime > oneDayMs) {
      bot.dailyTradeCount = 0;
      bot.dailyPnL = 0;
    }

    // Check daily trade limit
    if (bot.dailyTradeCount >= risk_management.max_daily_trades) {
      console.log(`Bot ${bot.botId} reached daily trade limit`);
      return false;
    }

    // Check daily loss limit
    if (bot.dailyPnL <= -risk_management.max_daily_loss) {
      console.log(`Bot ${bot.botId} reached daily loss limit`);
      return false;
    }

    // Check minimum time between trades (prevent spam)
    const minTimeBetweenTrades = 60 * 1000; // 1 minute
    if (now - bot.lastTradeTime < minTimeBetweenTrades) {
      return false;
    }

    return true;
  }

  /**
   * Execute a trade signal
   */
  private async executeTradeSignal(signal: TradeSignal, bot: BotInstance): Promise<void> {
    if (!this.signAndSubmitTransaction) {
      this.logError('No wallet connection available for trading');
      return;
    }

    try {
      console.log(`Executing trade signal:`, signal);

      // Validate signal before execution
      if (!this.validateTradeSignal(signal, bot)) {
        this.logError(`Trade signal validation failed for bot ${bot.botId}`);
        return;
      }

      // Get real-time price for execution
      const currentPrice = await this.getCurrentMarketPrice(bot.strategy.symbol);
      if (!currentPrice) {
        this.logError(`Could not get current price for ${bot.strategy.symbol}`);
        return;
      }

      // Check if price hasn't moved too much since signal generation
      const priceSlippage = Math.abs(currentPrice - signal.price) / signal.price;
      if (priceSlippage > 0.02) { // 2% slippage limit
        this.logError(`Price slippage too high: ${(priceSlippage * 100).toFixed(2)}%`);
        return;
      }

      // Calculate actual trade amount based on current portfolio
      const actualAmount = await this.calculateActualTradeAmount(signal, bot);

      // Call the smart contract execute_trade function
      const transaction: InputTransactionData = {
        data: {
          function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::trading_bot::execute_trade`,
          functionArguments: [
            signal.botId,
            signal.action === 'buy' ? 0 : 1, // 0 = buy, 1 = sell
            Math.floor(actualAmount * 1000000), // Convert to micro units
            Math.floor(currentPrice * 1000000), // Use current price
          ],
        },
      };

      const response = await this.signAndSubmitTransaction(transaction);

      // Wait for transaction confirmation in production
      if (process.env.NODE_ENV === 'production') {
        await this.waitForTransactionConfirmation(response.hash);
      }

      console.log('Trade executed successfully:', response.hash);

      // Create executed trade record with actual values
      const executedSignal = {
        ...signal,
        price: currentPrice,
        amount: actualAmount,
        timestamp: Date.now()
      };

      // Update bot state
      this.updateBotAfterTrade(bot, executedSignal);

      // Store trade in history
      this.tradeHistory.push(executedSignal);

      // Emit trade execution event
      this.emitTradeEvent(executedSignal, response.hash);

    } catch (error) {
      this.logError(`Failed to execute trade for bot ${bot.botId}: ${error}`);
    }
  }

  /**
   * Validate trade signal before execution
   */
  private validateTradeSignal(signal: TradeSignal, bot: BotInstance): boolean {
    // Check bot is still active
    if (!bot.isActive) {
      return false;
    }

    // Check signal is recent (within 30 seconds)
    const signalAge = Date.now() - signal.timestamp;
    if (signalAge > 30000) {
      return false;
    }

    // Check amount is positive and reasonable
    if (signal.amount <= 0 || signal.amount > bot.strategy.risk_management.max_position_size) {
      return false;
    }

    return true;
  }

  /**
   * Get current market price for execution with verification
   */
  private async getCurrentMarketPrice(symbol: string): Promise<number | null> {
    try {
      // Get verified price from multiple sources
      const verifiedPrice = await this.marketData.getVerifiedPrice(symbol);
      if (verifiedPrice) {
        return verifiedPrice.price;
      }

      // Fallback to cached price data
      const cachedData = this.marketData.getCurrentData(symbol);
      return cachedData?.price || null;
    } catch (error) {
      console.error(`Error getting market price for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Calculate actual trade amount based on current portfolio
   */
  private async calculateActualTradeAmount(signal: TradeSignal, bot: BotInstance): Promise<number> {
    // In production, query actual bot balance from smart contract
    // For now, use the signal amount with risk management
    const maxAmount = bot.strategy.risk_management.max_position_size / 1000000;
    return Math.min(signal.amount, maxAmount);
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForTransactionConfirmation(_txHash: string): Promise<void> {
    // In production, implement proper Aptos transaction confirmation
    // For now, just wait a bit
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  /**
   * Emit trade execution event
   */
  private emitTradeEvent(signal: TradeSignal, txHash: string): void {
    // Emit custom event for UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tradeExecuted', {
        detail: { signal, txHash }
      }));
    }
  }

  /**
   * Update bot state after a trade
   */
  private updateBotAfterTrade(bot: BotInstance, signal: TradeSignal): void {
    bot.lastTradeTime = signal.timestamp;
    bot.dailyTradeCount++;
    bot.performance.totalTrades++;

    // Simplified P&L calculation (in production, this would be more sophisticated)
    const estimatedPnL = signal.action === 'buy' ? -signal.amount * 0.001 : signal.amount * 0.002;
    bot.dailyPnL += estimatedPnL;

    if (estimatedPnL > 0) {
      bot.performance.winningTrades++;
      bot.performance.totalProfit += estimatedPnL;
    } else {
      bot.performance.totalLoss += Math.abs(estimatedPnL);
    }

    console.log(`Bot ${bot.botId} updated after trade:`, {
      dailyTrades: bot.dailyTradeCount,
      dailyPnL: bot.dailyPnL,
      totalTrades: bot.performance.totalTrades
    });
  }

  /**
   * Calculate trade amount based on percentage and risk limits
   */
  private calculateTradeAmount(bot: BotInstance, percentage: number): number {
    const { risk_management } = bot.strategy;
    
    // Get bot's current balance (simplified - in production, query from blockchain)
    const botBalance = 1000; // TODO: Get actual balance from smart contract
    
    const amountFromPercentage = (botBalance * percentage) / 100;
    const maxAmount = risk_management.max_position_size / 1000000; // Convert from micro units
    
    return Math.min(amountFromPercentage, maxAmount);
  }

  /**
   * Calculate confidence score for a signal
   */
  private calculateConfidence(
    conditions: TradingCondition[],
    _context: Record<string, number>
  ): number {
    // Simplified confidence calculation
    // TODO: Implement more sophisticated confidence scoring
    return Math.min(0.8, conditions.length * 0.2);
  }

  /**
   * Generate human-readable reason for trade signal
   */
  private generateSignalReason(
    conditions: TradingCondition[],
    context: Record<string, number>,
    action: 'buy' | 'sell'
  ): string {
    const reasons = conditions.map(condition => {
      const value = context[condition.indicator];
      return `${condition.indicator} (${value?.toFixed(2)}) ${condition.operator} ${condition.value}`;
    });

    return `${action.toUpperCase()}: ${reasons.join(' AND ')}`;
  }

  /**
   * Get all unique symbols from active bots
   */
  private getActiveSymbols(): string[] {
    const symbols = new Set<string>();
    for (const bot of this.activeBots.values()) {
      symbols.add(bot.strategy.symbol);
    }
    return Array.from(symbols);
  }

  /**
   * Get engine status
   */
  getStatus(): EngineStatus {
    return {
      isRunning: this.isRunning,
      activeBots: this.activeBots.size,
      totalSignals: this.tradeHistory.length,
      totalTrades: this.tradeHistory.length, // Simplified
      uptime: this.startTime > 0 ? Date.now() - this.startTime : 0,
      errors: [...this.errors]
    };
  }

  /**
   * Get bot information
   */
  getBot(botId: string): BotInstance | undefined {
    return this.activeBots.get(botId);
  }

  /**
   * Get all active bots
   */
  getAllBots(): BotInstance[] {
    return Array.from(this.activeBots.values());
  }

  /**
   * Get recent trade history
   */
  getTradeHistory(limit: number = 50): TradeSignal[] {
    return this.tradeHistory.slice(-limit);
  }

  /**
   * Log errors with timestamp
   */
  private logError(message: string): void {
    const timestampedError = `[${new Date().toISOString()}] ${message}`;
    console.error(timestampedError);
    this.errors.push(timestampedError);
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
  }

  /**
   * Toggle bot active status
   */
  toggleBot(botId: string, active: boolean): boolean {
    const bot = this.activeBots.get(botId);
    if (bot) {
      bot.isActive = active;
      console.log(`Bot ${botId} ${active ? 'activated' : 'deactivated'}`);
      return true;
    }
    return false;
  }
}

// Singleton instance for the application
export const autoTradingEngine = new AutoTradingEngine();
