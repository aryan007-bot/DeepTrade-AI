"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLeaderboard } from "@/hooks/useContract";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatAddress } from "@/utils/helpers";
import { formatPerformance } from "@/utils/formatters";

export function Leaderboard() {
  const { data: leaderboard, isLoading, error, refetch } = useLeaderboard();

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-black";
      case 2:
        return "bg-neutral-400 text-black";
      case 3:
        return "bg-amber-700 text-white";
      default:
        return "bg-neutral-700 text-white";
    }
  };

  if (isLoading) {
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
    const errorMessage = error instanceof Error ? error.message : "Failed to load leaderboard";
    const isContractError = errorMessage.includes("Contract not deployed") || errorMessage.includes("Module not found");
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Leaderboard</CardTitle>
          <CardDescription>Error loading leaderboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-destructive">{errorMessage}</p>
            {isContractError ? (
              <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                <p className="text-sm text-yellow-700">
                  Please deploy the trading bot contract first and update the MODULE_ADDRESS.
                </p>
              </div>
            ) : (
              <Button onClick={() => refetch()} variant="outline">
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Leaderboard</CardTitle>
          <CardDescription>No trading bots found.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Be the first to create a trading bot and claim the top spot!
            </p>
            
            {/* Debug info for leaderboard */}
            <div className="p-3 border rounded-lg bg-gray-50 border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Debug Info:</p>
              <p className="text-xs text-gray-500">Leaderboard data: {leaderboard ? JSON.stringify(leaderboard) : 'null'}</p>
              <p className="text-xs text-gray-500">Loading: {isLoading ? 'Yes' : 'No'}</p>
              <p className="text-xs text-gray-500">Error: {error ? 'Yes' : 'No'}</p>
              <Button 
                onClick={() => {
                  console.log("Manual leaderboard refetch triggered");
                  refetch();
                }} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Refresh Leaderboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort leaderboard by net performance (highest first)
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    const aPerformance = parseFloat(formatPerformance(a.net_performance));
    const bPerformance = parseFloat(formatPerformance(b.net_performance));
    return bPerformance - aPerformance;
  });

  const bestBot = sortedLeaderboard[0];

  return (
    <div className="space-y-6">
      {/* Best Bot Highlight */}
      {bestBot && (
        <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              🏆 Best Performing Bot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-yellow-900">{bestBot.name}</h3>
                <p className="text-sm text-yellow-700">by {formatAddress(bestBot.owner)}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-900">
                  +{parseFloat(formatPerformance(bestBot.net_performance)).toFixed(3)} USDC
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-yellow-200 text-yellow-800">
                    {bestBot.total_trades} trades
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-yellow-200 text-yellow-800">
                    {bestBot.win_rate}% win rate
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Leaderboard</CardTitle>
          <CardDescription>
            All AI trading bots on the DeepTrade AI platform ranked by performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedLeaderboard.map((entry, index) => {
            const rank = index + 1;
            const performanceUSD = parseFloat(formatPerformance(entry.net_performance));
            
            return (
              <div
                key={entry.bot_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${getRankColor(rank)}`}>
                    {rank}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{entry.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {entry.total_trades} trades
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {formatAddress(entry.owner)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${performanceUSD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {performanceUSD >= 0 ? '+' : ''}{performanceUSD.toFixed(3)} USDC
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {entry.win_rate}% win rate
                    </Badge>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 