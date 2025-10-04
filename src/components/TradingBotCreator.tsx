"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateBot,
  useUserMaxBots,
  useUserBotCount,
  useCurrentSubscriptionTier
} from "@/hooks/useContract";
import { CreateBotParams, SubscriptionTier } from "@/types/contract";
import { MODULE_ADDRESS } from "@/constants";

export function TradingBotCreator() {
  const { account } = useWallet();
  const [botName, setBotName] = useState("");
  const [strategy, setStrategy] = useState("");
  const [initialBalance, setInitialBalance] = useState(1000000); // 1 USDC in micro units
  const [maxPositionSize, setMaxPositionSize] = useState(200000); // 0.2 USDC
  const [stopLossPercent, setStopLossPercent] = useState(10);
  const [maxTradesPerDay, setMaxTradesPerDay] = useState(20);
  const [maxDailyLoss, setMaxDailyLoss] = useState(100000); // 0.1 USDC

  const createBotMutation = useCreateBot();
  const { data: maxBots } = useUserMaxBots(account?.address?.toString());
  const { data: botCount } = useUserBotCount(account?.address?.toString());
  const { data: currentTier } = useCurrentSubscriptionTier(account?.address?.toString());

  // Fallback to free tier defaults if functions fail
  const safeMaxBots = maxBots || 10; // Default to 10 for free tier
  const safeBotCount = botCount || 0;
  const safeTier = currentTier || SubscriptionTier.FREE;

  const isFormValid = botName.trim() && strategy.trim() && initialBalance >= 1000000;

  const handleCreateBot = async () => {
    if (!account?.address) {
      console.log("No account address available");
      return;
    }
    if (!isFormValid) {
      console.log("Form is not valid");
      return;
    }

    const params: CreateBotParams = {
      name: botName.trim(),
      strategy: strategy.trim(),
      initial_balance: initialBalance,
      max_position_size: maxPositionSize,
      stop_loss_percent: stopLossPercent,
      max_trades_per_day: maxTradesPerDay,
      max_daily_loss: maxDailyLoss,
    };

    console.log("Submitting bot creation with params:", params);
    console.log("Mutation state before call:", {
      isPending: createBotMutation.isPending,
      isError: createBotMutation.isError,
      isSuccess: createBotMutation.isSuccess
    });

    try {
      const result = await createBotMutation.mutateAsync(params);
      console.log("Mutation completed with result:", result);
      
      // Reset form on success
      console.log("Resetting form...");
      setBotName("");
      setStrategy("");
      setInitialBalance(1000000);
      setMaxPositionSize(200000);
      setStopLossPercent(10);
      setMaxTradesPerDay(20);
      setMaxDailyLoss(100000);
    } catch (error) {
      console.error("Bot creation failed in component:", error);
      // Error is handled by the mutation hook
    }
  };

  if (!account?.address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Trading Bot</CardTitle>
          <CardDescription>
            Connect your wallet to create a trading bot.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Show contract deployment message if not configured
  if (!MODULE_ADDRESS || MODULE_ADDRESS === "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Trading Bot</CardTitle>
          <CardDescription>
            Contract not deployed yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Contract Deployment Required</h4>
            <p className="text-sm text-yellow-700 mb-3">
              The trading bot contract needs to be deployed to Aptos testnet first.
            </p>
            <div className="text-xs text-yellow-600 space-y-1">
              <p>1. Deploy using: <code className="bg-yellow-100 px-1 rounded">aptos move publish --named-addresses trading_bot_addr=default</code></p>
              <p>2. Copy the deployed contract address</p>
              <p>3. Update MODULE_ADDRESS in constants.ts or set NEXT_PUBLIC_MODULE_ADDRESS environment variable</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Debug: Log the values
  console.log("Debug TradingBotCreator:", { botCount, maxBots, currentTier, safeMaxBots, safeBotCount });

  // Check if user has reached their bot limit using safe values
  // Convert to numbers to ensure proper comparison
  const numBotCount = Number(safeBotCount);
  const numMaxBots = Number(safeMaxBots);
  const isAtBotLimit = numBotCount >= numMaxBots;

  if (isAtBotLimit) {
    const getTierName = (tier: SubscriptionTier) => {
      switch (tier) {
        case SubscriptionTier.FREE: return "Free";
        case SubscriptionTier.BASIC: return "Basic";
        case SubscriptionTier.PREMIUM: return "Premium";
        default: return "Free";
      }
    };

    const canUpgrade = currentTier !== SubscriptionTier.PREMIUM;

    return (
      <Card className="bg-[#051419] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Create Trading Bot</CardTitle>
          <CardDescription className="text-gray-400">
            You've reached your bot limit for the {getTierName(currentTier || SubscriptionTier.FREE)} plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-yellow-900/30 border-yellow-600">
            <h4 className="font-semibold text-yellow-300 mb-2">🚀 Bot Limit Reached</h4>
            <p className="text-sm text-yellow-200 mb-3">
              You have {safeBotCount} of {safeMaxBots > 1000000 ? "unlimited" : safeMaxBots} bots on the {getTierName(safeTier)} plan.
            </p>
            {canUpgrade ? (
              <div className="text-xs text-yellow-100 space-y-2">
                <p>Upgrade your subscription to create more bots:</p>
                <ul className="ml-4 space-y-1">
                  {safeTier === SubscriptionTier.FREE && (
                    <>
                      <li>• Basic Plan: 100 bots for 10 APT/month</li>
                      <li>• Premium Plan: Unlimited bots for 50 APT/month</li>
                    </>
                  )}
                  {safeTier === SubscriptionTier.BASIC && (
                    <li>• Premium Plan: Unlimited bots for 50 APT/month</li>
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-yellow-100">
                You're on the Premium plan with unlimited bots. If you're seeing this message, please contact support.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTierName = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FREE: return "Free";
      case SubscriptionTier.BASIC: return "Basic";
      case SubscriptionTier.PREMIUM: return "Premium";
      default: return "Free";
    }
  };

  return (
    <Card className="bg-[#051419] border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Create Trading Bot</CardTitle>
            <CardDescription className="text-gray-400">
              Create an AI-powered trading bot with custom risk management settings.
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">
              {safeBotCount} / {safeMaxBots > 1000000 ? "∞" : safeMaxBots} bots
            </div>
            <div className="text-xs text-gray-400">
              {getTierName(safeTier)} Plan
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bot Name */}
        <div>
          <Label htmlFor="bot-name" className="text-gray-300">Bot Name</Label>
          <Input
            id="bot-name"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            placeholder="e.g., Momentum Trader, RSI Scalper, DCA Bot"
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            required
          />
        </div>

        {/* Strategy */}
        <div>
          <Label htmlFor="strategy" className="text-gray-300">Trading Strategy</Label>
          <textarea
            id="strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            placeholder="Example: Buy when RSI is below 30 and price is above 20-day moving average. Sell when RSI is above 70 or price drops 5% from entry. Use 2% position size per trade with maximum 3 positions at once."
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            💡 Try: "Buy APT when it drops 5% in 1 hour, sell when it gains 3% or after 24 hours"
          </p>
        </div>

        {/* Initial Balance */}
        <div>
          <Label htmlFor="initial-balance" className="text-gray-300">Initial Balance (USDC)</Label>
          <Input
            id="initial-balance"
            type="number"
            value={initialBalance / 1000000}
            onChange={(e) => setInitialBalance(parseFloat(e.target.value) * 1000000 || 1000000)}
            min="1"
            step="0.1"
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>

        {/* Risk Management Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Risk Management</h3>

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

        {/* Create Button */}
        <Button
          onClick={handleCreateBot}
          disabled={!isFormValid || createBotMutation.isPending}
          className="w-full bg-[#00d2ce] hover:bg-[#00b8b4] text-black font-semibold"
        >
          {createBotMutation.isPending ? "Creating Bot..." : "Create Trading Bot"}
        </Button>

        {/* Info Box */}
        <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/50">
          <p className="font-semibold mb-2">How it works:</p>
          <ul className="space-y-1 text-xs">
            <li>• Describe your strategy in plain English</li>
            <li>• Our AI converts it to executable trading logic</li>
            <li>• Bot deploys on Aptos blockchain automatically</li>
            <li>• Monitor performance in real-time</li>
          </ul>
        </div>

        {/* Gas Fee Notice */}
        <div className="text-sm p-4 border rounded-lg bg-blue-50 border-blue-200">
          <p className="font-semibold text-blue-800 mb-2">⚠️ Need APT for gas fees?</p>
          <p className="text-blue-700 text-xs mb-2">
            Creating a bot requires APT tokens to pay for transaction gas fees.
          </p>
          <p className="text-blue-600 text-xs">
            Get free testnet APT from the{" "}
            <a 
              href="https://aptoslabs.com/testnet-faucet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-800"
            >
              Aptos Testnet Faucet
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}