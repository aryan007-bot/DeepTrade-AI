"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Activity, DollarSign, Target } from "lucide-react";

export function TestLeaderboard() {
  console.log('🧪 Test Leaderboard Component Loaded');

  // Mock data to test the enhanced leaderboard UI
  const mockStats = {
    total_bots: 15,
    active_bots: 8,
    total_volume: 12500000000, // 12,500 USDC in micro units
    average_roi: 8.5,
  };

  const mockBots = [
    {
      bot_id: "1",
      name: "RSI Master Bot",
      owner: "0x1234...5678",
      strategy: "Buy when RSI < 30, sell when RSI > 70",
      net_performance: 1500000000, // 1,500 USDC
      roi_percentage: 15.2,
      total_trades: 156,
      win_rate: 89,
      ranking: 1,
      daily_trades: 3,
      last_trade_at: Date.now() / 1000 - 3600, // 1 hour ago
    },
    {
      bot_id: "2",
      name: "MACD Trader",
      owner: "0x9876...4321",
      strategy: "MACD crossover with volume confirmation",
      net_performance: 987000000, // 987 USDC
      roi_percentage: 12.8,
      total_trades: 203,
      win_rate: 76,
      ranking: 2,
      daily_trades: 5,
      last_trade_at: Date.now() / 1000 - 1800, // 30 minutes ago
    },
    {
      bot_id: "3",
      name: "Trend Follower",
      owner: "0x5555...9999",
      strategy: "Moving average trend following",
      net_performance: 756000000, // 756 USDC
      roi_percentage: 11.4,
      total_trades: 134,
      win_rate: 82,
      ranking: 3,
      daily_trades: 2,
      last_trade_at: Date.now() / 1000 - 7200, // 2 hours ago
    },
  ];

  const formatCurrency = (value: number) => {
    const usdcValue = value / 1000000;
    return usdcValue.toFixed(2);
  };

  const formatROI = (roi: number) => {
    return roi > 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`;
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-white";
      default:
        return "bg-gradient-to-r from-neutral-600 to-neutral-800 text-white";
    }
  };

  const topBot = mockBots[0];

  return (
    <div className="space-y-6">
      {/* Debug Header */}
      <Card className="border-blue-500 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">🧪 Enhanced Leaderboard Test Mode</CardTitle>
          <CardDescription className="text-blue-700">
            This is showing mock data to demonstrate the enhanced leaderboard features.
            Once your smart contract has trading bots, this will show real data.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Bots</p>
                <p className="text-lg font-bold">{mockStats.total_bots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Active Bots</p>
                <p className="text-lg font-bold">{mockStats.active_bots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Volume</p>
                <p className="text-lg font-bold">${formatCurrency(mockStats.total_volume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Avg ROI</p>
                <p className="text-lg font-bold">{formatROI(mockStats.average_roi)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performer Highlight */}
      <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Performing Bot (Mock Data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-yellow-900">{topBot.name}</h3>
              <p className="text-sm text-yellow-700">by {topBot.owner}</p>
              <p className="text-xs text-yellow-600 mt-1">{topBot.strategy}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-900">
                +${formatCurrency(topBot.net_performance)}
              </div>
              <div className="text-sm text-yellow-700 mb-2">
                ROI: {formatROI(topBot.roi_percentage)}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-yellow-200 text-yellow-800">
                  {topBot.total_trades} trades
                </Badge>
                <Badge variant="outline" className="text-xs bg-yellow-200 text-yellow-800">
                  {topBot.win_rate}% win rate
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot List */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Leaderboard (Mock Data)</CardTitle>
          <CardDescription>
            Enhanced leaderboard with real-time features and comprehensive analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBots.map((bot) => {
              const isProfit = bot.net_performance >= 0;
              const isActive = bot.last_trade_at > (Date.now() / 1000) - 86400;

              return (
                <div
                  key={bot.bot_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(bot.ranking)}`}>
                      #{bot.ranking}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{bot.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {bot.total_trades} trades
                        </Badge>
                        {bot.daily_trades > 0 && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            {bot.daily_trades} today
                          </Badge>
                        )}
                        {isActive && (
                          <Badge variant="outline" className="text-xs">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        by {bot.owner}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {bot.strategy}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-2">
                      <span className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? '+' : ''}${formatCurrency(bot.net_performance)}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        ROI: <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
                          {formatROI(bot.roi_percentage)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {bot.win_rate}% win rate
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-green-500 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">🚀 Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-green-800">
            <p>✅ Enhanced leaderboard UI is working</p>
            <p>✅ Real-time features implemented</p>
            <p>✅ Performance analytics ready</p>
            <p>🎯 Create your first trading bot to see real data!</p>
          </div>
          <Button className="mt-4">
            Create Trading Bot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}