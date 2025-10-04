"use client";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserBots } from "@/hooks/useContract";
import { BotPerformanceCard } from "@/components/ui/BotPerformanceCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export function UserBots() {
  const { account } = useWallet();
  const userAddress = account?.address?.toString();

  console.log("UserBots component - userAddress:", userAddress);
  const { data: userBots, isLoading, error, refetch } = useUserBots(userAddress);
  console.log("UserBots component - userBots:", userBots, "isLoading:", isLoading, "error:", error);

  if (!account?.address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Trading Bots</CardTitle>
          <CardDescription>
            Connect your wallet to view your trading bots.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Trading Bots</CardTitle>
          <CardDescription>Loading your bots...</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton count={1} height={200} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load trading bots";
    const isContractError = errorMessage.includes("Contract not deployed") || errorMessage.includes("Module not found");
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Trading Bots</CardTitle>
          <CardDescription>Error loading your bots.</CardDescription>
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

  if (!userBots || userBots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Trading Bots</CardTitle>
          <CardDescription>You haven't created any trading bots yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Create your first trading bot to get started with automated trading.
            </p>
            
            {/* Debug info */}
            <div className="p-3 border rounded-lg bg-gray-50 border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Debug Info:</p>
              <p className="text-xs text-gray-500">User Address: {userAddress}</p>
              <p className="text-xs text-gray-500">Loading: {isLoading ? 'Yes' : 'No'}</p>
              <p className="text-xs text-gray-500">Error: {error ? 'Yes' : 'No'}</p>
              <p className="text-xs text-gray-500">Bot Data: {userBots && userBots.length > 0 ? `Found ${userBots.length}` : 'None'}</p>
              <Button 
                onClick={() => {
                  console.log("Manual refetch triggered");
                  refetch();
                }} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Refresh Bot Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Trading Bots ({userBots.length})</CardTitle>
          <CardDescription>
            Manage your AI-powered trading bots and monitor their performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userBots.map((bot, index) => (
            <div key={`${bot.owner}-${index}`} className="space-y-4">
              <BotPerformanceCard
                bot={bot}
                onViewDetails={(botId) => {
                  console.log('View details for bot:', botId);
                  // TODO: Implement bot details modal
                }}
                onToggleStatus={(botId, currentStatus) => {
                  console.log('Toggle status for bot:', botId, currentStatus);
                  // TODO: Implement bot status toggle
                }}
              />

              {/* Bot Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-500">Total Trades</h4>
                  <p className="text-2xl font-bold text-white">{bot.total_trades}</p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-500">Win Rate</h4>
                  <p className="text-2xl font-bold text-green-500">
                    {bot.total_trades > 0
                      ? Math.round((bot.performance / (bot.performance + bot.total_loss)) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className={`text-2xl font-bold ${bot.active ? 'text-green-500' : 'text-red-500'}`}>
                    {bot.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {/* Separator between bots */}
              {index < userBots.length - 1 && <hr className="border-gray-700" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}