/**
 * Autonomous Trading Dashboard
 * Monitor and control autonomous trading bots in real-time
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { autoTradingEngine, type BotInstance, type TradeSignal, type EngineStatus } from "@/services/autoTradingEngine";

export function AutoTradingDashboard() {
  const { toast } = useToast();
  const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null);
  const [activeBots, setActiveBots] = useState<BotInstance[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh data every 5 seconds
  useEffect(() => {
    const refreshData = () => {
      try {
        setEngineStatus(autoTradingEngine.getStatus());
        setActiveBots(autoTradingEngine.getAllBots());
        setTradeHistory(autoTradingEngine.getTradeHistory(20));
        setIsLoading(false);
      } catch (error) {
        console.error('Error refreshing dashboard data:', error);
      }
    };

    refreshData(); // Initial load
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleEngine = async () => {
    try {
      if (engineStatus?.isRunning) {
        autoTradingEngine.stop();
        toast({
          title: "Trading engine stopped",
          description: "Autonomous trading has been disabled for all bots.",
        });
      } else {
        await autoTradingEngine.start();
        toast({
          title: "Trading engine started",
          description: "Autonomous trading is now active for all enabled bots.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to toggle trading engine",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleToggleBot = (botId: string, currentStatus: boolean) => {
    const success = autoTradingEngine.toggleBot(botId, !currentStatus);
    if (success) {
      toast({
        title: `Bot ${!currentStatus ? 'activated' : 'deactivated'}`,
        description: `Trading bot ${botId} is now ${!currentStatus ? 'active' : 'inactive'}.`,
      });
    }
  };

  const formatUptime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const getStatusColor = (status: boolean): string => {
    return status ? 'text-green-400 border-green-600' : 'text-red-400 border-red-600';
  };


  if (isLoading) {
    return (
      <Card className="bg-[#051419] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Autonomous Trading Dashboard</CardTitle>
          <CardDescription className="text-gray-400">Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Engine Status */}
      <Card className="bg-[#051419] border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                🤖 Trading Engine Status
                <Badge variant="outline" className={getStatusColor(engineStatus?.isRunning || false)}>
                  {engineStatus?.isRunning ? 'RUNNING' : 'STOPPED'}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control and monitor the autonomous trading system
              </CardDescription>
            </div>
            <Switch
              checked={engineStatus?.isRunning || false}
              onCheckedChange={handleToggleEngine}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-400">Active Bots</h4>
              <p className="text-2xl font-bold text-white">{engineStatus?.activeBots || 0}</p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-400">Total Signals</h4>
              <p className="text-2xl font-bold text-blue-400">{engineStatus?.totalSignals || 0}</p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-400">Total Trades</h4>
              <p className="text-2xl font-bold text-green-400">{engineStatus?.totalTrades || 0}</p>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-400">Uptime</h4>
              <p className="text-2xl font-bold text-purple-400">
                {engineStatus?.uptime ? formatUptime(engineStatus.uptime) : '0s'}
              </p>
            </div>
          </div>

          {/* Recent Errors */}
          {engineStatus?.errors && engineStatus.errors.length > 0 && (
            <div className="mt-4 p-3 border rounded-lg bg-red-900/20 border-red-600">
              <h4 className="text-red-300 font-medium mb-2">Recent Errors:</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {engineStatus.errors.slice(-3).map((error, i) => (
                  <p key={i} className="text-xs text-red-200">{error}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="bots" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="bots" className="text-gray-300">Active Bots</TabsTrigger>
          <TabsTrigger value="trades" className="text-gray-300">Trade History</TabsTrigger>
          <TabsTrigger value="performance" className="text-gray-300">Performance</TabsTrigger>
        </TabsList>

        {/* Active Bots Tab */}
        <TabsContent value="bots" className="space-y-4">
          {activeBots.length === 0 ? (
            <Card className="bg-[#051419] border-gray-700">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No active bots found. Create your first autonomous trading bot!</p>
              </CardContent>
            </Card>
          ) : (
            activeBots.map((bot) => (
              <Card key={bot.botId} className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        {bot.strategy.symbol}
                        <Badge variant="outline" className={getStatusColor(bot.isActive)}>
                          {bot.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Bot ID: {bot.botId} • User: {bot.userId.slice(0, 8)}...
                      </CardDescription>
                    </div>
                    <Switch
                      checked={bot.isActive}
                      onCheckedChange={() => handleToggleBot(bot.botId, bot.isActive)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Strategy Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Strategy</h4>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p><strong>Conditions:</strong> {bot.strategy.conditions.length} rules</p>
                        <p><strong>Timeframe:</strong> {bot.strategy.timeframe}</p>
                        <p><strong>Max trades/day:</strong> {bot.strategy.risk_management.max_daily_trades}</p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-xs text-gray-400">Total Trades</h4>
                        <p className="text-sm font-bold text-white">{bot.performance.totalTrades}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-400">Win Rate</h4>
                        <p className="text-sm font-bold text-green-400">
                          {bot.performance.totalTrades > 0
                            ? Math.round((bot.performance.winningTrades / bot.performance.totalTrades) * 100)
                            : 0}%
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-400">Daily Trades</h4>
                        <p className="text-sm font-bold text-blue-400">{bot.dailyTradeCount}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-400">Daily P&L</h4>
                        <p className={`text-sm font-bold ${bot.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(bot.dailyPnL)}
                        </p>
                      </div>
                    </div>

                    {/* Risk Status */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        Position: {formatCurrency(bot.strategy.risk_management.max_position_size / 1000000)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Stop Loss: {bot.strategy.risk_management.stop_loss_percent}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Daily Limit: {bot.dailyTradeCount}/{bot.strategy.risk_management.max_daily_trades}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Trade History Tab */}
        <TabsContent value="trades" className="space-y-4">
          {tradeHistory.length === 0 ? (
            <Card className="bg-[#051419] border-gray-700">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No trades executed yet.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Trades</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest autonomous trades executed by the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tradeHistory.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-gray-600 bg-gray-800/30">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={
                          trade.action === 'buy' ? 'text-green-400 border-green-600' : 'text-red-400 border-red-600'
                        }>
                          {trade.action.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="text-sm text-white">Bot {trade.botId}</p>
                          <p className="text-xs text-gray-400">{trade.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{formatCurrency(trade.amount)}</p>
                        <p className="text-xs text-gray-400">
                          @ {formatCurrency(trade.price)} • {Math.round(trade.confidence * 100)}% confidence
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overall Performance */}
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeBots.map((bot) => {
                    const totalPnL = bot.performance.totalProfit - bot.performance.totalLoss;
                    const winRate = bot.performance.totalTrades > 0 
                      ? (bot.performance.winningTrades / bot.performance.totalTrades) * 100 
                      : 0;
                    
                    return (
                      <div key={bot.botId} className="flex items-center justify-between p-2 border rounded border-gray-600">
                        <div>
                          <p className="text-sm text-white">Bot {bot.botId}</p>
                          <p className="text-xs text-gray-400">{bot.strategy.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(totalPnL)}
                          </p>
                          <p className="text-xs text-gray-400">{winRate.toFixed(1)}% win rate</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {activeBots.length === 0 && (
                    <p className="text-gray-400 text-center">No performance data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Engine Status</span>
                    <Badge variant="outline" className={getStatusColor(engineStatus?.isRunning || false)}>
                      {engineStatus?.isRunning ? 'Healthy' : 'Stopped'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Connections</span>
                    <span className="text-white">{activeBots.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Error Rate</span>
                    <span className="text-white">
                      {engineStatus?.errors?.length || 0} errors
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Update</span>
                    <span className="text-white">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
