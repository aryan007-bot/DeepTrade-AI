/**
 * Enhanced Trading Bot Creator with Autonomous Trading Support
 * Creates bots that can trade automatically based on plain English strategies
 */

"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateBot,
  useUserMaxBots,
  useUserBotCount
} from "@/hooks/useContract";
import { CreateBotParams } from "@/types/contract";
import { MODULE_ADDRESS } from "@/constants";
import { autoTradingEngine } from "@/services/autoTradingEngine";
import { AIStrategyParser } from "@/services/aiStrategyParser";

interface StrategyPreview {
  valid: boolean;
  conditions: string[];
  actions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  estimatedTrades: string;
  errors: string[];
}

export function AutoTradingBotCreator() {
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();
  
  // Form state
  const [botName, setBotName] = useState("");
  const [englishStrategy, setEnglishStrategy] = useState("");
  const [initialBalance, setInitialBalance] = useState(1000000); // 1 USDC in micro units
  const [maxPositionSize, setMaxPositionSize] = useState(200000); // 0.2 USDC
  const [stopLossPercent, setStopLossPercent] = useState(10);
  const [maxTradesPerDay, setMaxTradesPerDay] = useState(20);
  const [maxDailyLoss, setMaxDailyLoss] = useState(100000); // 0.1 USDC
  const [enableAutoTrading, setEnableAutoTrading] = useState(true);
  
  // Strategy analysis
  const [strategyPreview, setStrategyPreview] = useState<StrategyPreview | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [strategyParser] = useState(() => new AIStrategyParser());

  // Hooks
  const createBotMutation = useCreateBot();
  const { data: maxBots } = useUserMaxBots(account?.address?.toString());
  const { data: botCount } = useUserBotCount(account?.address?.toString());

  // Fallback to free tier defaults
  const safeMaxBots = maxBots || 10;
  const safeBotCount = botCount || 0;

  // Initialize trading engine with wallet connection
  useEffect(() => {
    if (signAndSubmitTransaction) {
      autoTradingEngine.initialize(signAndSubmitTransaction);
    }
  }, [signAndSubmitTransaction]);

  // Auto-analyze strategy when it changes
  useEffect(() => {
    if (englishStrategy.trim().length > 10) {
      const delayedAnalysis = setTimeout(() => {
        analyzeStrategy();
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(delayedAnalysis);
    } else {
      setStrategyPreview(null);
    }
  }, [englishStrategy]);

  const analyzeStrategy = async () => {
    if (!englishStrategy.trim()) return;

    setAnalyzeLoading(true);
    try {
      const parsed = await strategyParser.parseStrategy(englishStrategy);
      const validation = strategyParser.validateStrategy(parsed);
      
      const preview: StrategyPreview = {
        valid: validation.valid,
        conditions: parsed.conditions.map(c => 
          `${c.indicator} ${c.operator} ${c.value}${c.timeframe ? ` (${c.timeframe})` : ''}`
        ),
        actions: [
          ...parsed.buy_actions.map(a => `Buy ${a.amount_percent}% when conditions met`),
          ...parsed.sell_actions.map(a => `Sell ${a.amount_percent}% when conditions met`)
        ],
        riskLevel: calculateRiskLevel(parsed),
        estimatedTrades: estimateTradeFrequency(parsed),
        errors: validation.errors
      };

      setStrategyPreview(preview);
    } catch (error) {
      setStrategyPreview({
        valid: false,
        conditions: [],
        actions: [],
        riskLevel: 'high',
        estimatedTrades: 'Unknown',
        errors: ['Failed to analyze strategy. Please check your description.']
      });
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const calculateRiskLevel = (strategy: any): 'low' | 'medium' | 'high' => {
    const factors = [
      strategy.risk_management.max_position_size > 500000 ? 1 : 0, // > 0.5 USDC
      strategy.risk_management.max_trades_per_day > 30 ? 1 : 0,
      strategy.risk_management.stop_loss_percent < 5 ? 1 : 0,
      strategy.conditions.length < 2 ? 1 : 0, // Few conditions = higher risk
    ];
    
    const riskScore = factors.reduce((a, b) => a + b, 0);
    if (riskScore <= 1) return 'low';
    if (riskScore <= 2) return 'medium';
    return 'high';
  };

  const estimateTradeFrequency = (strategy: any): string => {
    const tradesPerDay = strategy.risk_management.max_trades_per_day;
    if (tradesPerDay > 20) return 'High (20+ trades/day)';
    if (tradesPerDay > 10) return 'Medium (10-20 trades/day)';
    if (tradesPerDay > 5) return 'Low (5-10 trades/day)';
    return 'Very Low (<5 trades/day)';
  };

  const isFormValid = 
    botName.trim() && 
    englishStrategy.trim() && 
    initialBalance >= 1000000 &&
    strategyPreview?.valid;

  const handleCreateBot = async () => {
    if (!account?.address || !isFormValid || !signAndSubmitTransaction) {
      toast({
        title: "Invalid form",
        description: "Please fill all fields correctly and connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Create bot on blockchain
      const params: CreateBotParams = {
        name: botName.trim(),
        strategy: englishStrategy.trim(),
        initial_balance: initialBalance,
        max_position_size: maxPositionSize,
        stop_loss_percent: stopLossPercent,
        max_trades_per_day: maxTradesPerDay,
        max_daily_loss: maxDailyLoss,
      };

      toast({
        title: "Creating bot...",
        description: "Deploying your trading bot to the blockchain.",
      });

      const result = await createBotMutation.mutateAsync(params);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create bot');
      }

      // 2. Add bot to autonomous trading engine (if enabled)
      if (enableAutoTrading && result.data) {
        const engineResult = await autoTradingEngine.addBot(
          result.data.bot_id.toString(),
          account.address.toString(),
          englishStrategy.trim(),
          {
            max_position_size: maxPositionSize,
            stop_loss_percent: stopLossPercent,
            max_trades_per_day: maxTradesPerDay,
            max_daily_loss: maxDailyLoss,
          }
        );

        if (!engineResult.success) {
          console.warn('Bot created but autonomous trading failed:', engineResult.error);
          toast({
            title: "Bot created with limited functionality",
            description: `Bot deployed successfully, but automatic trading is disabled: ${engineResult.error}`,
            variant: "destructive",
          });
        } else {
          // Start the trading engine if it's not running
          const status = autoTradingEngine.getStatus();
          if (!status.isRunning) {
            await autoTradingEngine.start();
          }
        }
      }

      toast({
        title: "🎉 Bot created successfully!",
        description: `${botName} is now ${enableAutoTrading ? 'trading autonomously' : 'ready for manual trading'}.`,
      });

      // Reset form
      setBotName("");
      setEnglishStrategy("");
      setStrategyPreview(null);
      setInitialBalance(1000000);
      setMaxPositionSize(200000);
      setStopLossPercent(10);
      setMaxTradesPerDay(20);
      setMaxDailyLoss(100000);

    } catch (error) {
      console.error("Bot creation failed:", error);
      toast({
        title: "Failed to create bot",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  if (!account?.address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Autonomous Trading Bot</CardTitle>
          <CardDescription>
            Connect your wallet to create an AI-powered trading bot that trades automatically.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!MODULE_ADDRESS || MODULE_ADDRESS === "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Autonomous Trading Bot</CardTitle>
          <CardDescription>Contract not deployed yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Contract Deployment Required</h4>
            <p className="text-sm text-yellow-700">
              The trading bot contract needs to be deployed to Aptos first.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAtBotLimit = Number(safeBotCount) >= Number(safeMaxBots);

  if (isAtBotLimit) {
    return (
      <Card className="bg-[#051419] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Create Autonomous Trading Bot</CardTitle>
          <CardDescription className="text-gray-400">
            You've reached your bot limit. Upgrade to create more bots.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-[#051419] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Create Autonomous Trading Bot
          <Badge variant="outline" className="bg-green-900 text-green-300 border-green-600">
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Describe your trading strategy in plain English. Our AI will execute trades automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bot Name */}
        <div>
          <Label htmlFor="bot-name" className="text-gray-300">Bot Name</Label>
          <Input
            id="bot-name"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            placeholder="e.g., RSI Momentum Bot, DCA Strategy, Scalper Pro"
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            required
          />
        </div>

        {/* Trading Strategy in Plain English */}
        <div>
          <Label htmlFor="strategy" className="text-gray-300 flex items-center gap-2">
            Trading Strategy (Plain English)
            <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-600 text-xs">
              AI Powered
            </Badge>
          </Label>
          <textarea
            id="strategy"
            value={englishStrategy}
            onChange={(e) => setEnglishStrategy(e.target.value)}
            className="w-full p-3 border rounded-md min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            placeholder="Example: Buy APT when RSI is below 30 and price drops more than 5% in 1 hour. Sell when RSI goes above 70 or profit reaches 15%. Use maximum 10% of balance per trade."
            required
          />
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
            <span>💡 Try mentioning:</span>
            <code className="bg-gray-700 px-1 rounded">RSI</code>
            <code className="bg-gray-700 px-1 rounded">price drops</code>
            <code className="bg-gray-700 px-1 rounded">moving average</code>
            <code className="bg-gray-700 px-1 rounded">volume</code>
            <code className="bg-gray-700 px-1 rounded">MACD</code>
          </div>
        </div>

        {/* Strategy Analysis */}
        {analyzeLoading && (
          <div className="p-4 border rounded-lg bg-blue-900/20 border-blue-600">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="text-blue-300">Analyzing strategy...</span>
            </div>
          </div>
        )}

        {strategyPreview && !analyzeLoading && (
          <div className={`p-4 border rounded-lg ${
            strategyPreview.valid 
              ? 'bg-green-900/20 border-green-600' 
              : 'bg-red-900/20 border-red-600'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              strategyPreview.valid ? 'text-green-300' : 'text-red-300'
            }`}>
              {strategyPreview.valid ? '✅ Strategy Analysis' : '❌ Strategy Issues'}
            </h4>
            
            {strategyPreview.valid ? (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-300">Conditions:</span>
                  <ul className="ml-4 text-green-200">
                    {strategyPreview.conditions.map((condition, i) => (
                      <li key={i}>• {condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-gray-300">Actions:</span>
                  <ul className="ml-4 text-green-200">
                    {strategyPreview.actions.map((action, i) => (
                      <li key={i}>• {action}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-300">
                    Risk Level: 
                    <Badge variant="outline" className={`ml-1 ${
                      strategyPreview.riskLevel === 'low' ? 'text-green-400 border-green-600' :
                      strategyPreview.riskLevel === 'medium' ? 'text-yellow-400 border-yellow-600' :
                      'text-red-400 border-red-600'
                    }`}>
                      {strategyPreview.riskLevel.toUpperCase()}
                    </Badge>
                  </span>
                  <span className="text-gray-300">Expected: {strategyPreview.estimatedTrades}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {strategyPreview.errors.map((error, i) => (
                  <p key={i} className="text-red-200 text-sm">• {error}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Risk Management Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Risk Management</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Initial Balance: ${(initialBalance / 1000000).toFixed(2)} USDC</Label>
              <Input
                type="number"
                value={initialBalance / 1000000}
                onChange={(e) => setInitialBalance(parseFloat(e.target.value) * 1000000 || 1000000)}
                min="1"
                step="0.1"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Max Position Size: ${(maxPositionSize / 1000000).toFixed(2)} USDC</Label>
              <input
                type="range"
                min={50000}
                max={500000}
                step={10000}
                value={maxPositionSize}
                onChange={(e) => setMaxPositionSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <Label className="text-gray-300">Stop Loss: {stopLossPercent}%</Label>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={stopLossPercent}
                onChange={(e) => setStopLossPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <Label className="text-gray-300">Max Trades Per Day: {maxTradesPerDay}</Label>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={maxTradesPerDay}
                onChange={(e) => setMaxTradesPerDay(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Autonomous Trading Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-800/50 border-gray-600">
          <div>
            <h4 className="text-white font-medium">Enable Autonomous Trading</h4>
            <p className="text-sm text-gray-400">
              When enabled, your bot will trade automatically based on your strategy.
            </p>
          </div>
          <Switch
            checked={enableAutoTrading}
            onCheckedChange={setEnableAutoTrading}
          />
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateBot}
          disabled={!isFormValid || createBotMutation.isPending}
          className="w-full bg-[#00d2ce] hover:bg-[#00b8b4] text-black font-semibold"
        >
          {createBotMutation.isPending ? "Creating Bot..." : 
           enableAutoTrading ? "🤖 Create Autonomous Bot" : "Create Manual Bot"}
        </Button>

        {/* Information */}
        <div className="text-sm text-gray-400 p-4 border rounded-lg bg-gray-800/30 border-gray-600">
          <h4 className="font-semibold mb-2 text-white">🚀 How Autonomous Trading Works:</h4>
          <ul className="space-y-1 text-xs">
            <li>• AI parses your English strategy into executable conditions</li>
            <li>• Bot monitors real-time market data (price, RSI, MACD, etc.)</li>
            <li>• Automatically executes trades when conditions are met</li>
            <li>• Enforces your risk management rules at all times</li>
            <li>• You can monitor and control everything in real-time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
