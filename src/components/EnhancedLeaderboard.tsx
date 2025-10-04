"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatAddress } from "@/utils/helpers";
import { LeaderboardService, type BotPerformance, type LeaderboardStats, type LeaderboardFilters } from "@/services/leaderboardService";
import { TrendingUp, Trophy, Target, Activity, DollarSign, RefreshCw } from "lucide-react";

export function EnhancedLeaderboard() {
  console.log('🎆 Enhanced Leaderboard Component Loaded');

  const [leaderboardData, setLeaderboardData] = useState<{
    bots: BotPerformance[];
    stats: LeaderboardStats;
    filters: LeaderboardFilters;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<LeaderboardFilters>>({
    timeframe: 'all_time',
    sortBy: 'net_performance',
    minTrades: 0,
    onlyActive: false,
  });
  const [leaderboardService] = useState(() => new LeaderboardService());

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Enhanced Leaderboard: Fetching data with filters:', filters);
      const data = await leaderboardService.getLeaderboard(filters);
      console.log('✅ Enhanced Leaderboard: Data received:', data);
      setLeaderboardData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leaderboard';
      console.error('❌ Enhanced Leaderboard: Error fetching data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [filters]);

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

  const formatCurrency = (value: number) => {
    const usdcValue = value / 1000000; // Convert from micro USDC
    return usdcValue.toFixed(2);
  };

  const formatROI = (roi: number) => {
    return roi > 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Leaderboard</CardTitle>
          <CardDescription>Loading top performers...</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton count={5} height={60} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const isContractError = error.includes("Contract not deployed") || error.includes("Module not found");

    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Leaderboard</CardTitle>
          <CardDescription>Error loading leaderboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-destructive">{error}</p>
            {isContractError ? (
              <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                <p className="text-sm text-yellow-700">
                  Please deploy the trading bot contract first and update the MODULE_ADDRESS.
                </p>
              </div>
            ) : (
              <Button onClick={fetchLeaderboard} variant="outline">
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboardData || leaderboardData.bots.length === 0) {
    const hasRegisteredBots = (leaderboardData?.stats?.total_bots || 0) > 0;
    const totalBots = leaderboardData?.stats?.total_bots || 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Leaderboard</CardTitle>
          <CardDescription>
            {hasRegisteredBots
              ? `${totalBots} bots created, waiting for trading activity`
              : "No trading bots found"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hasRegisteredBots ? (
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Bots are Ready!</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  {totalBots} trading bots have been created and are waiting to execute their first trades.
                  Once they start trading, they'll appear here with their performance metrics.
                </p>
                <p className="text-xs text-blue-600">
                  💡 Tip: Bots need market conditions to match their strategies before they execute trades automatically.
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Be the first to create a trading bot and claim the top spot!
              </p>
            )}
            <Button onClick={fetchLeaderboard} variant="outline">
              Refresh Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { bots, stats } = leaderboardData;
  const topBot = stats.top_performer;

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Bots</p>
                <p className="text-lg font-bold">{stats.total_bots}</p>
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
                <p className="text-lg font-bold">{stats.active_bots}</p>
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
                <p className="text-lg font-bold">${formatCurrency(stats.total_volume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Avg ROI</p>
                <p className="text-lg font-bold">{formatROI(stats.average_roi)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performer Highlight */}
      {topBot && (
        <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top Performing Bot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-yellow-900">{topBot.name}</h3>
                <p className="text-sm text-yellow-700">by {formatAddress(topBot.owner)}</p>
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
      )}

      {/* Leaderboard with Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trading Leaderboard</CardTitle>
              <CardDescription>
                All trading bots ranked by performance ({bots.length} bots)
              </CardDescription>
            </div>
            <Button onClick={fetchLeaderboard} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net_performance">Net Performance</SelectItem>
                  <SelectItem value="roi_percentage">ROI %</SelectItem>
                  <SelectItem value="win_rate">Win Rate</SelectItem>
                  <SelectItem value="total_trades">Total Trades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Timeframe:</label>
              <Select
                value={filters.timeframe}
                onValueChange={(value) => setFilters(prev => ({ ...prev, timeframe: value as any }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_time">All Time</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Min Trades:</label>
              <Select
                value={filters.minTrades?.toString() || '0'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, minTrades: parseInt(value) }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bot List */}
          <div className="space-y-3">
            {bots.map((bot) => {
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
                        by {formatAddress(bot.owner)}
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
                      <Badge variant="outline" className="text-xs">
                        P: ${formatCurrency(bot.profit)} L: ${formatCurrency(bot.loss)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {bots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bots match the current filters.</p>
              <Button
                onClick={() => setFilters({ timeframe: 'all_time', sortBy: 'net_performance', minTrades: 0, onlyActive: false })}
                variant="outline"
                className="mt-2"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}