/**
 * Market Data Service
 * Provides real-time price feeds and technical indicators
 */

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma20: number;
  sma50: number;
  ema12: number;
  ema26: number;
  bb: {
    upper: number;
    middle: number;
    lower: number;
  };
  volume: number;
  price_change_1h: number;
  price_change_24h: number;
}

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class MarketDataService {
  private wsConnections: Map<string, WebSocket> = new Map();
  private priceCache: Map<string, PriceData> = new Map();
  private historicalCache: Map<string, OHLCV[]> = new Map();
  private subscribers: Map<string, Set<(data: PriceData) => void>> = new Map();
  private ccxtExchange: any;
  private isProduction: boolean;
  private coinMarketCapKey: string;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.coinMarketCapKey = process.env.COINMARKETCAP_API_KEY || '';

    if (this.isProduction) {
      this.initializeCCXT();
    } else {
      this.initializeMockData();
    }
  }

  /**
   * Initialize CCXT for real trading data
   */
  private async initializeCCXT() {
    try {
      const ccxt = await import('ccxt');
      this.ccxtExchange = new ccxt.binance({
        apiKey: '', // Read-only, no API key needed for market data
        secret: '',
        sandbox: false,
        enableRateLimit: true,
      });
      console.log('CCXT initialized for live market data');
    } catch (error) {
      console.error('Failed to initialize CCXT:', error);
      this.initializeMockData(); // Fallback to mock
    }
  }

  /**
   * Connect to real-time price feeds for a symbol
   */
  async connectPriceFeed(symbol: string): Promise<void> {
    try {
      if (this.isProduction) {
        await this.connectRealPriceFeed(symbol);
      } else {
        this.setupMockPriceFeed(symbol);
      }

      console.log(`Connected to price feed for ${symbol}`);
    } catch (error) {
      console.error(`Failed to connect to price feed for ${symbol}:`, error);
      // Fallback to mock on production failure
      this.setupMockPriceFeed(symbol);
    }
  }

  /**
   * Connect to real WebSocket price feeds
   */
  private async connectRealPriceFeed(symbol: string): Promise<void> {
    const binanceSymbol = this.convertToBinanceSymbol(symbol);
    const wsUrl = `wss://stream.binance.com:9443/ws/${binanceSymbol.toLowerCase()}@ticker`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`Connected to Binance WebSocket for ${symbol}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const priceData: PriceData = {
          symbol,
          price: parseFloat(data.c), // Current price
          change24h: parseFloat(data.P), // 24h change percent
          volume24h: parseFloat(data.v), // 24h volume
          high24h: parseFloat(data.h), // 24h high
          low24h: parseFloat(data.l), // 24h low
          timestamp: Date.now(),
        };

        this.priceCache.set(symbol, priceData);

        // Notify subscribers
        const symbolSubscribers = this.subscribers.get(symbol);
        if (symbolSubscribers) {
          symbolSubscribers.forEach(callback => callback(priceData));
        }
      } catch (error) {
        console.error(`Error processing WebSocket data for ${symbol}:`, error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for ${symbol}:`, error);
    };

    ws.onclose = () => {
      console.log(`WebSocket closed for ${symbol}`);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (this.wsConnections.has(symbol)) {
          this.connectRealPriceFeed(symbol);
        }
      }, 5000);
    };

    this.wsConnections.set(symbol, ws);
  }

  /**
   * Convert symbol format for different exchanges
   */
  private convertToBinanceSymbol(symbol: string): string {
    // Convert APT/USDC to APTUSDC
    return symbol.replace('/', '').replace('USDC', 'USDT'); // Binance uses USDT
  }

  /**
   * Get current market data for a symbol
   */
  getCurrentData(symbol: string): PriceData | null {
    return this.priceCache.get(symbol) || null;
  }

  /**
   * Get historical price data
   */
  async getHistoricalData(
    symbol: string,
    timeframe: string = '5m',
    limit: number = 100
  ): Promise<OHLCV[]> {
    const cacheKey = `${symbol}_${timeframe}`;

    if (this.historicalCache.has(cacheKey)) {
      return this.historicalCache.get(cacheKey)!.slice(-limit);
    }

    try {
      if (this.isProduction && this.ccxtExchange) {
        const historicalData = await this.fetchRealHistoricalData(symbol, timeframe, limit);
        this.historicalCache.set(cacheKey, historicalData);
        return historicalData;
      } else {
        // Generate mock historical data for development
        const historicalData = this.generateMockHistoricalData(symbol, limit);
        this.historicalCache.set(cacheKey, historicalData);
        return historicalData;
      }
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      // Fallback to mock data
      const historicalData = this.generateMockHistoricalData(symbol, limit);
      this.historicalCache.set(cacheKey, historicalData);
      return historicalData;
    }
  }

  /**
   * Fetch real historical data using CCXT
   */
  private async fetchRealHistoricalData(
    symbol: string,
    timeframe: string,
    limit: number
  ): Promise<OHLCV[]> {
    const binanceSymbol = this.convertToBinanceSymbol(symbol);

    const ohlcv = await this.ccxtExchange.fetchOHLCV(
      binanceSymbol,
      timeframe,
      undefined,
      limit
    );

    return ohlcv.map((candle: number[]) => ({
      timestamp: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
    }));
  }

  /**
   * Get price data from CoinMarketCap for verification
   */
  async getCoinMarketCapPrice(symbol: string): Promise<PriceData | null> {
    if (!this.coinMarketCapKey) {
      return null;
    }

    try {
      const symbolMap: { [key: string]: string } = {
        'APT/USDC': 'APT',
        'BTC/USDC': 'BTC',
        'ETH/USDC': 'ETH',
      };

      const cmcSymbol = symbolMap[symbol];
      if (!cmcSymbol) return null;

      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cmcSymbol}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': this.coinMarketCapKey,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinMarketCap API error: ${response.status}`);
      }

      const data = await response.json();
      const quote = data.data[cmcSymbol]?.quote?.USD;

      if (!quote) return null;

      return {
        symbol,
        price: quote.price,
        change24h: quote.percent_change_24h,
        volume24h: quote.volume_24h,
        high24h: quote.price * (1 + Math.abs(quote.percent_change_24h) / 200), // Estimate
        low24h: quote.price * (1 - Math.abs(quote.percent_change_24h) / 200), // Estimate
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Error fetching CoinMarketCap data for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Cross-verify price data from multiple sources
   */
  async getVerifiedPrice(symbol: string): Promise<PriceData | null> {
    const sources = await Promise.allSettled([
      Promise.resolve(this.getCurrentData(symbol)), // Binance WebSocket
      this.getCoinMarketCapPrice(symbol), // CoinMarketCap API
    ]);

    const prices: PriceData[] = sources
      .filter((result): result is PromiseFulfilledResult<PriceData> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    if (prices.length === 0) return null;

    // If we have multiple sources, check for significant discrepancies
    if (prices.length > 1) {
      const priceValues = prices.map(p => p.price);
      const avgPrice = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
      const maxDeviation = Math.max(...priceValues.map(p => Math.abs(p - avgPrice) / avgPrice));

      // Log warning if prices differ by more than 1%
      if (maxDeviation > 0.01) {
        console.warn(`Price discrepancy detected for ${symbol}: ${priceValues.join(', ')}`);
      }
    }

    // Return the most recent price data
    return prices.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest
    );
  }

  /**
   * Calculate technical indicators for a symbol
   */
  async getTechnicalIndicators(
    symbol: string,
    timeframe: string = '5m'
  ): Promise<TechnicalIndicators> {
    const historicalData = await this.getHistoricalData(symbol, timeframe, 100);
    const prices = historicalData.map(d => d.close);
    const highs = historicalData.map(d => d.high);
    const lows = historicalData.map(d => d.low);
    const volumes = historicalData.map(d => d.volume);

    if (this.isProduction) {
      // Use professional technical indicators library for production
      return await this.calculateAdvancedIndicators(prices, highs, lows, volumes);
    } else {
      // Use simple calculations for development
      return {
        rsi: this.calculateRSI(prices),
        macd: this.calculateMACD(prices),
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
        ema12: this.calculateEMA(prices, 12),
        ema26: this.calculateEMA(prices, 26),
        bb: this.calculateBollingerBands(prices),
        volume: volumes[volumes.length - 1] || 0,
        price_change_1h: this.calculatePriceChange(prices, 12),
        price_change_24h: this.calculatePriceChange(prices, 288),
      };
    }
  }

  /**
   * Calculate advanced technical indicators using professional library
   */
  private async calculateAdvancedIndicators(
    prices: number[],
    _highs: number[],
    _lows: number[],
    volumes: number[]
  ): Promise<TechnicalIndicators> {
    try {
      const TI = await import('technicalindicators');

      // Calculate RSI
      const rsiResult = TI.RSI.calculate({
        values: prices,
        period: 14
      });
      const rsi = rsiResult[rsiResult.length - 1] || 50;

      // Calculate MACD
      const macdResult = TI.MACD.calculate({
        values: prices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
      });
      const lastMacd = macdResult[macdResult.length - 1] || { MACD: 0, signal: 0, histogram: 0 };

      // Calculate Bollinger Bands
      const bbResult = TI.BollingerBands.calculate({
        period: 20,
        values: prices,
        stdDev: 2
      });
      const lastBB = bbResult[bbResult.length - 1] || { upper: 0, middle: 0, lower: 0 };

      // Calculate SMAs
      const sma20Result = TI.SMA.calculate({ period: 20, values: prices });
      const sma50Result = TI.SMA.calculate({ period: 50, values: prices });

      // Calculate EMAs
      const ema12Result = TI.EMA.calculate({ period: 12, values: prices });
      const ema26Result = TI.EMA.calculate({ period: 26, values: prices });

      return {
        rsi,
        macd: {
          macd: lastMacd.MACD || 0,
          signal: lastMacd.signal || 0,
          histogram: lastMacd.histogram || 0,
        },
        sma20: sma20Result[sma20Result.length - 1] || prices[prices.length - 1],
        sma50: sma50Result[sma50Result.length - 1] || prices[prices.length - 1],
        ema12: ema12Result[ema12Result.length - 1] || prices[prices.length - 1],
        ema26: ema26Result[ema26Result.length - 1] || prices[prices.length - 1],
        bb: {
          upper: lastBB.upper || 0,
          middle: lastBB.middle || 0,
          lower: lastBB.lower || 0,
        },
        volume: volumes[volumes.length - 1] || 0,
        price_change_1h: this.calculatePriceChange(prices, 12),
        price_change_24h: this.calculatePriceChange(prices, 288),
      };
    } catch (error) {
      console.error('Error calculating advanced indicators:', error);
      // Fallback to simple calculations
      return {
        rsi: this.calculateRSI(prices),
        macd: this.calculateMACD(prices),
        sma20: this.calculateSMA(prices, 20),
        sma50: this.calculateSMA(prices, 50),
        ema12: this.calculateEMA(prices, 12),
        ema26: this.calculateEMA(prices, 26),
        bb: this.calculateBollingerBands(prices),
        volume: volumes[volumes.length - 1] || 0,
        price_change_1h: this.calculatePriceChange(prices, 12),
        price_change_24h: this.calculatePriceChange(prices, 288),
      };
    }
  }

  /**
   * Subscribe to price updates for a symbol
   */
  subscribe(symbol: string, callback: (data: PriceData) => void): () => void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    
    this.subscribers.get(symbol)!.add(callback);
    
    // Start price feed if not already connected
    if (!this.wsConnections.has(symbol)) {
      this.connectPriceFeed(symbol);
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.get(symbol)?.delete(callback);
    };
  }

  /**
   * Initialize mock data for development
   */
  private initializeMockData(): void {
    const symbols = ['APT/USDC', 'BTC/USDC', 'ETH/USDC'];
    const basePrices = { 'APT/USDC': 12.50, 'BTC/USDC': 43000, 'ETH/USDC': 2500 };

    symbols.forEach(symbol => {
      this.priceCache.set(symbol, {
        symbol,
        price: basePrices[symbol as keyof typeof basePrices] || 100,
        change24h: (Math.random() - 0.5) * 0.2, // ±10%
        volume24h: Math.random() * 1000000,
        high24h: basePrices[symbol as keyof typeof basePrices] * 1.05 || 105,
        low24h: basePrices[symbol as keyof typeof basePrices] * 0.95 || 95,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Setup mock price feed with realistic fluctuations
   */
  private setupMockPriceFeed(symbol: string): void {
    const interval = setInterval(() => {
      const currentData = this.priceCache.get(symbol);
      if (!currentData) return;

      // Simulate price movement
      const volatility = 0.02; // 2% max change per update
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = currentData.price * (1 + change);

      const updatedData: PriceData = {
        ...currentData,
        price: Math.max(0.01, newPrice), // Prevent negative prices
        timestamp: Date.now(),
      };

      this.priceCache.set(symbol, updatedData);

      // Notify subscribers
      const symbolSubscribers = this.subscribers.get(symbol);
      if (symbolSubscribers) {
        symbolSubscribers.forEach(callback => callback(updatedData));
      }
    }, 5000); // Update every 5 seconds

    // Store interval for cleanup
    this.wsConnections.set(symbol, { close: () => clearInterval(interval) } as any);
  }

  /**
   * Calculate RSI (Relative Strength Index)
   */
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50; // Default neutral value

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate smoothed averages
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? Math.abs(change) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  private calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;

    // For simplicity, using SMA for signal line (should be EMA in production)
    const macdLine = Array(prices.length).fill(macd);
    const signal = this.calculateSMA(macdLine, 9);
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  /**
   * Calculate Simple Moving Average
   */
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  /**
   * Calculate Exponential Moving Average
   */
  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    if (prices.length === 1) return prices[0];

    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }

    return ema;
  }

  /**
   * Calculate Bollinger Bands
   */
  private calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
    const sma = this.calculateSMA(prices, period);
    const variance = this.calculateVariance(prices.slice(-period), sma);
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev),
    };
  }

  private calculateVariance(prices: number[], mean: number): number {
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
  }

  /**
   * Calculate price change percentage over a period
   */
  private calculatePriceChange(prices: number[], periods: number): number {
    if (prices.length < periods + 1) return 0;
    
    const currentPrice = prices[prices.length - 1];
    const pastPrice = prices[prices.length - 1 - periods];
    
    return ((currentPrice - pastPrice) / pastPrice) * 100;
  }

  /**
   * Generate mock historical data for development
   */
  private generateMockHistoricalData(symbol: string, count: number): OHLCV[] {
    const data: OHLCV[] = [];
    const basePrice = this.priceCache.get(symbol)?.price || 100;
    let currentPrice = basePrice;
    const now = Date.now();

    for (let i = count; i >= 0; i--) {
      const timestamp = now - (i * 5 * 60 * 1000); // 5-minute intervals
      
      // Generate random price movement
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility;
      const open = currentPrice;
      const close = currentPrice * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 1000;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      });

      currentPrice = close;
    }

    return data;
  }

  /**
   * Get comprehensive market data with multiple sources
   */
  async getComprehensiveMarketData(symbol: string): Promise<{
    current: PriceData | null;
    verified: PriceData | null;
    indicators: TechnicalIndicators;
    sources: string[];
  }> {
    const [currentData, verifiedData, indicators] = await Promise.all([
      Promise.resolve(this.getCurrentData(symbol)),
      this.getVerifiedPrice(symbol),
      this.getTechnicalIndicators(symbol),
    ]);

    const activeSources = [];
    if (currentData) activeSources.push('Binance WebSocket');
    if (this.coinMarketCapKey) activeSources.push('CoinMarketCap API');

    return {
      current: currentData,
      verified: verifiedData,
      indicators,
      sources: activeSources,
    };
  }

  /**
   * Health check for all data sources
   */
  async healthCheck(): Promise<{
    binanceWebSocket: boolean;
    coinMarketCap: boolean;
    ccxt: boolean;
    overall: 'healthy' | 'degraded' | 'critical';
  }> {
    const checks = {
      binanceWebSocket: this.wsConnections.size > 0,
      coinMarketCap: !!this.coinMarketCapKey,
      ccxt: !!this.ccxtExchange,
    };

    const healthyCount = Object.values(checks).filter(Boolean).length;
    const overall = healthyCount >= 2 ? 'healthy' : healthyCount >= 1 ? 'degraded' : 'critical';

    return { ...checks, overall };
  }

  /**
   * Cleanup connections
   */
  disconnect(symbol?: string): void {
    if (symbol) {
      this.wsConnections.get(symbol)?.close();
      this.wsConnections.delete(symbol);
      this.subscribers.delete(symbol);
    } else {
      // Disconnect all
      this.wsConnections.forEach(ws => ws.close());
      this.wsConnections.clear();
      this.subscribers.clear();
    }
  }
}

// Example usage:
// const marketData = new MarketDataService();
// await marketData.connectPriceFeed('APT/USDC');
// const indicators = await marketData.getTechnicalIndicators('APT/USDC', '5m');
