"use client";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: string;
  source: string;
}

interface BacktestResult {
  strategy: string;
  symbol: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  totalReturn: number;
  totalTrades: number;
  winningTrades: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Array<{
    date: string;
    type: string;
    amount: number;
    price: number;
    profitLoss: number;
    balance: number;
  }>;
  riskSettings: {
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
}

async function fetchPriceData(symbol: string): Promise<PriceData> {
  const response = await fetch(`/api/trading/price-feeds?symbol=${symbol}`);
  const result = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to fetch price data');
  }
}

async function runBacktest(params: {
  strategy: string;
  symbol: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  riskSettings?: any;
}): Promise<BacktestResult> {
  const response = await fetch('/api/trading/backtest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  const result = await response.json();
  
  if (result.success) {
    return result.backtest;
  } else {
    throw new Error(result.error || 'Failed to run backtest');
  }
}

export function TradingOperations() {

  const { toast } = useToast();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDC");
  const [backtestParams, setBacktestParams] = useState({
    strategy: "Buy when RSI < 30, sell when RSI > 70",
    symbol: "BTC/USDC",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    initialBalance: 1000
  });
  const [isRunningBacktest, setIsRunningBacktest] = useState(false);

  const { data: priceData, isLoading: loadingPrice } = useQuery({
    queryKey: ["priceData", selectedSymbol],
    queryFn: () => fetchPriceData(selectedSymbol),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: backtestResult, refetch: runBacktestQuery } = useQuery({
    queryKey: ["backtest", backtestParams],
    queryFn: () => runBacktest(backtestParams),
    enabled: false, // Don't run automatically
  });

  const handleRunBacktest = async () => {
    setIsRunningBacktest(true);
    try {
      await runBacktestQuery();
      toast({
        title: "Backtest completed",
        description: "Historical performance analysis is ready.",
      });
    } catch (error) {
      toast({
        title: "Backtest failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunningBacktest(false);
    }
  };

  const symbols = ["BTC/USDC", "ETH/USDC", "APT/USDC", "SOL/USDC"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Operations</CardTitle>
        <CardDescription>
          Monitor real-time prices and test trading strategies with historical data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prices" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prices">Price Feeds</TabsTrigger>
            <TabsTrigger value="backtest">Strategy Backtest</TabsTrigger>
          </TabsList>

          <TabsContent value="prices" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="symbol">Select Symbol</Label>
                <select
                  id="symbol"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {symbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol}
                    </option>
                  ))}
                </select>
              </div>

              {loadingPrice ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
              ) : priceData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold">${priceData.price.toFixed(2)}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">24h Change</p>
                    <p className={`text-lg font-semibold ${priceData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {priceData.change24h >= 0 ? '+' : ''}{(priceData.change24h * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="text-lg font-semibold">${(priceData.volume24h / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">24h Range</p>
                    <p className="text-sm">
                      ${priceData.low24h.toFixed(2)} - ${priceData.high24h.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="backtest" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="backtest-strategy">Strategy</Label>
                <textarea
                  id="backtest-strategy"
                  value={backtestParams.strategy}
                  onChange={(e) => setBacktestParams(prev => ({ ...prev, strategy: e.target.value }))}
                  className="w-full p-2 border rounded-md min-h-[80px]"
                  placeholder="Describe your trading strategy..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backtest-symbol">Symbol</Label>
                  <select
                    id="backtest-symbol"
                    value={backtestParams.symbol}
                    onChange={(e) => setBacktestParams(prev => ({ ...prev, symbol: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {symbols.map((symbol) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="backtest-balance">Initial Balance</Label>
                  <Input
                    id="backtest-balance"
                    type="number"
                    value={backtestParams.initialBalance}
                    onChange={(e) => setBacktestParams(prev => ({ ...prev, initialBalance: parseFloat(e.target.value) || 0 }))}
                    min="1"
                    step="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={backtestParams.startDate}
                    onChange={(e) => setBacktestParams(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={backtestParams.endDate}
                    onChange={(e) => setBacktestParams(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleRunBacktest} 
                disabled={isRunningBacktest}
                className="w-full"
              >
                {isRunningBacktest ? "Running Backtest..." : "Run Backtest"}
              </Button>

              {backtestResult && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold">Backtest Results</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Return</p>
                      <p className={`text-lg font-semibold ${backtestResult.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {backtestResult.totalReturn >= 0 ? '+' : ''}{backtestResult.totalReturn.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Final Balance</p>
                      <p className="text-lg font-semibold">${backtestResult.finalBalance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-lg font-semibold">{backtestResult.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      <p className="text-lg font-semibold">{backtestResult.sharpeRatio.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {backtestResult.totalTrades} total trades • {backtestResult.winningTrades} winning trades
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 