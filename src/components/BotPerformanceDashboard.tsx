/**
 * Real-time Bot Performance Dashboard
 * Shows live performance metrics and analytics
 */

"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserBotPerformance, useRealtimeLeaderboard } from "@/hooks/useLeaderboard";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  Zap,
  BarChart3
} from "lucide-react";

interface BotPerformanceDashboardProps {
  userAddress?: string;
}

export function BotPerformanceDashboard({ userAddress }: BotPerformanceDashboardProps) {
  const { userBots, loading, error, topUserBot, userRank } = useUserBotPerformance(userAddress);
  const { stats, lastUpdate } = useRealtimeLeaderboard();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | 'all_time'>('24h');

  const formatCurrency = (value: number) => {
    const usdcValue = value / 1000000;
    return usdcValue.toFixed(2);
  };

  const formatROI = (roi: number) => {
    return roi > 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`;
  };

  const getPerformanceIcon = (performance: number) => {
    return performance >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  if (!userAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to view performance data.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (userBots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              You haven't created any trading bots yet.
            </p>
            <Button>Create Your First Bot</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate portfolio metrics
  const totalPortfolioValue = userBots.reduce((sum, bot) => sum + bot.net_performance, 0);
  const averageWinRate = userBots.reduce((sum, bot) => sum + bot.win_rate, 0) / userBots.length;
  const activeBots = userBots.filter(bot =>
    bot.last_trade_at > (Date.now() / 1000) - 86400
  ).length;

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900">Live Performance Dashboard</CardTitle>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Portfolio Value */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Portfolio Value</span>
              </div>
              <div className={`text-2xl font-bold ${totalPortfolioValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPortfolioValue >= 0 ? '+' : ''}${formatCurrency(totalPortfolioValue)}
              </div>
            </div>

            {/* Global Rank */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Global Rank</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {userRank ? `#${userRank}` : 'Unranked'}
              </div>
            </div>

            {/* Active Bots */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Active Bots</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {activeBots}/{userBots.length}
              </div>
            </div>

            {/* Win Rate */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Avg Win Rate</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {averageWinRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Bot Highlight */}
      {topUserBot && (
        <Card className="border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Your Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-900">{topUserBot.name}</h3>
                <p className="text-sm text-green-700">Rank #{topUserBot.ranking} globally</p>
                <p className="text-xs text-green-600 mt-1">{topUserBot.strategy}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">
                  +${formatCurrency(topUserBot.net_performance)}
                </div>
                <div className="text-sm text-green-700 mb-2">
                  ROI: {formatROI(topUserBot.roi_percentage)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-green-200 text-green-800">
                    {topUserBot.total_trades} trades
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-200 text-green-800">
                    {topUserBot.win_rate}% win rate
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Bot Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Trading Bots ({userBots.length})</CardTitle>
            <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userBots.map((bot) => {
              const isProfit = bot.net_performance >= 0;
              const isActive = bot.last_trade_at > (Date.now() / 1000) - 86400;

              return (
                <div
                  key={bot.bot_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getPerformanceIcon(bot.net_performance)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{bot.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            Rank #{bot.ranking}
                          </Badge>
                          {isActive && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
                              Live
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {bot.strategy}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{bot.total_trades} trades</span>
                          <span>{bot.win_rate}% win rate</span>
                          {bot.daily_trades > 0 && (
                            <span className="text-green-600">{bot.daily_trades} today</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {isProfit ? '+' : ''}${formatCurrency(bot.net_performance)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ROI: <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
                        {formatROI(bot.roi_percentage)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      P: ${formatCurrency(bot.profit)} | L: ${formatCurrency(bot.loss)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Comparison */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Your Bots</p>
                <p className="text-2xl font-bold">{userBots.length}</p>
                <p className="text-xs text-muted-foreground">
                  {((userBots.length / stats.total_bots) * 100).toFixed(1)}% of platform
                </p>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Your Volume</p>
                <p className="text-2xl font-bold">
                  ${formatCurrency(userBots.reduce((sum, bot) => sum + (bot.total_trades * 100), 0))}
                </p>
                <p className="text-xs text-muted-foreground">Estimated</p>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Platform Avg ROI</p>
                <p className="text-2xl font-bold">{formatROI(stats.average_roi)}</p>
                <p className="text-xs text-muted-foreground">
                  You: {formatROI(userBots.reduce((sum, bot) => sum + bot.roi_percentage, 0) / userBots.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}