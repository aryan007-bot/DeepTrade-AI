/**
 * AI Strategy Parser Service
 * Converts plain English trading strategies into executable logic
 */

export interface TradingCondition {
  indicator: string;        // 'rsi', 'price', 'macd', 'sma', etc.
  operator: string;         // '<', '>', '<=', '>=', '=='
  value: number;           // threshold value
  timeframe?: string;      // '1m', '5m', '1h', '1d'
}

export interface TradingAction {
  type: 'buy' | 'sell';
  amount_percent: number;   // Percentage of balance to use
  stop_loss?: number;       // Stop loss percentage
  take_profit?: number;     // Take profit percentage
}

export interface RiskManagement {
  max_position_size: number;
  max_daily_trades: number;
  stop_loss_percent: number;
  max_daily_loss: number;
}

export interface ParsedStrategy {
  symbol: string;
  timeframe: string;
  conditions: TradingCondition[];
  buy_actions: TradingAction[];
  sell_actions: TradingAction[];
  risk_management: RiskManagement;
}

export class AIStrategyParser {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  /**
   * Parse plain English strategy into structured trading logic
   */
  async parseStrategy(englishStrategy: string): Promise<ParsedStrategy> {
    const prompt = this.buildPrompt(englishStrategy);

    try {
      if (this.apiKey && process.env.NODE_ENV === 'production') {
        return await this.parseWithOpenAI(prompt, englishStrategy);
      } else {
        // Use enhanced mock for development
        console.log('Using enhanced mock parser for development');
        return this.mockParseStrategy(englishStrategy);
      }
    } catch (error: any) {
      console.error('Error parsing strategy:', error);
      // Fallback to mock on API failure
      console.log('Falling back to enhanced mock parser due to API issue:', error?.message);
      if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        console.log('💡 OpenAI quota exceeded. Add credits at https://platform.openai.com/settings/organization/billing');
      }
      return this.mockParseStrategy(englishStrategy);
    }
  }

  /**
   * Parse strategy using OpenAI API
   */
  private async parseWithOpenAI(prompt: string, _englishStrategy: string): Promise<ParsedStrategy> {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: this.apiKey });

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert trading strategy parser. Convert plain English trading strategies into structured JSON format for algorithmic trading execution.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsedStrategy = JSON.parse(content) as ParsedStrategy;

    // Validate the parsed strategy
    const validation = this.validateStrategy(parsedStrategy);
    if (!validation.valid) {
      throw new Error(`Invalid strategy from AI: ${validation.errors.join(', ')}`);
    }

    return parsedStrategy;
  }

  private buildPrompt(strategy: string): string {
    return `
Convert this trading strategy to structured JSON: "${strategy}"

Return JSON with this exact structure:
{
  "symbol": "APT/USDC",
  "timeframe": "5m",
  "conditions": [
    {
      "indicator": "rsi",
      "operator": "<",
      "value": 30,
      "timeframe": "5m"
    }
  ],
  "buy_actions": [
    {
      "type": "buy",
      "amount_percent": 10,
      "stop_loss": 5,
      "take_profit": 15
    }
  ],
  "sell_actions": [
    {
      "type": "sell", 
      "amount_percent": 100,
      "stop_loss": null,
      "take_profit": null
    }
  ],
  "risk_management": {
    "max_position_size": 1000,
    "max_daily_trades": 10,
    "stop_loss_percent": 5,
    "max_daily_loss": 500
  }
}

Guidelines:
- Extract clear buy/sell conditions from the text
- Identify technical indicators (RSI, MACD, SMA, price, volume)
- Set reasonable defaults for unspecified parameters
- Use conservative risk management settings
- Support multiple conditions with AND/OR logic
`;
  }

  /**
   * Mock strategy parser for development
   * TODO: Replace with real AI integration
   */
  private mockParseStrategy(strategy: string): ParsedStrategy {
    const lowerStrategy = strategy.toLowerCase();
    
    // Basic pattern matching for common strategies
    const conditions: TradingCondition[] = [];
    const buyActions: TradingAction[] = [];
    const sellActions: TradingAction[] = [];

    // Parse RSI conditions
    if (lowerStrategy.includes('rsi')) {
      if (lowerStrategy.includes('below') || lowerStrategy.includes('<')) {
        const rsiValue = this.extractNumber(lowerStrategy, 'rsi') || 30;
        conditions.push({
          indicator: 'rsi',
          operator: '<',
          value: rsiValue,
          timeframe: '5m'
        });
        buyActions.push({
          type: 'buy',
          amount_percent: 10,
          stop_loss: 5,
          take_profit: 15
        });
      }
      if (lowerStrategy.includes('above') || lowerStrategy.includes('>')) {
        const rsiValue = this.extractNumber(lowerStrategy, 'rsi') || 70;
        conditions.push({
          indicator: 'rsi',
          operator: '>',
          value: rsiValue,
          timeframe: '5m'
        });
        sellActions.push({
          type: 'sell',
          amount_percent: 100
        });
      }
    }

    // Parse price drop conditions
    if (lowerStrategy.includes('drop') || lowerStrategy.includes('fall')) {
      const dropPercent = this.extractPercentage(lowerStrategy) || 5;
      conditions.push({
        indicator: 'price_change',
        operator: '<',
        value: -dropPercent,
        timeframe: '1h'
      });
      buyActions.push({
        type: 'buy',
        amount_percent: 15,
        stop_loss: 3,
        take_profit: 10
      });
    }

    // Default actions if none found
    if (buyActions.length === 0) {
      buyActions.push({
        type: 'buy',
        amount_percent: 10,
        stop_loss: 5,
        take_profit: 15
      });
    }

    if (sellActions.length === 0) {
      sellActions.push({
        type: 'sell',
        amount_percent: 100
      });
    }

    return {
      symbol: 'APT/USDC',
      timeframe: '5m',
      conditions,
      buy_actions: buyActions,
      sell_actions: sellActions,
      risk_management: {
        max_position_size: 1000,
        max_daily_trades: 20,
        stop_loss_percent: 5,
        max_daily_loss: 500
      }
    };
  }

  private extractNumber(text: string, indicator: string): number | null {
    const patterns = [
      new RegExp(`${indicator}[^\\d]*([\\d.]+)`, 'i'),
      new RegExp(`([\\d.]+)[^\\d]*${indicator}`, 'i')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1]);
      }
    }
    return null;
  }

  private extractPercentage(text: string): number | null {
    const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
    return match ? parseFloat(match[1]) : null;
  }

  /**
   * Validate parsed strategy for common issues
   */
  validateStrategy(strategy: ParsedStrategy): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (strategy.conditions.length === 0) {
      errors.push('Strategy must have at least one trading condition');
    }

    if (strategy.buy_actions.length === 0 && strategy.sell_actions.length === 0) {
      errors.push('Strategy must have at least one trading action');
    }

    if (strategy.risk_management.max_position_size <= 0) {
      errors.push('Max position size must be greater than 0');
    }

    if (strategy.risk_management.stop_loss_percent < 0 || strategy.risk_management.stop_loss_percent > 50) {
      errors.push('Stop loss percent must be between 0 and 50');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Example usage:
// const parser = new AIStrategyParser();
// const strategy = await parser.parseStrategy("Buy when RSI is below 30, sell when RSI is above 70");
