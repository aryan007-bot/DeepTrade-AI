"use client";

import { TradingBotCreator } from "@/components/TradingBotCreator";
import { UserBots } from "@/components/UserBots";
import { Leaderboard } from "@/components/Leaderboard";
import { TradingOperations } from "@/components/TradingOperations";
import { CrossChainOperations } from "@/components/CrossChainOperations";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Plus, Calendar } from "lucide-react";

export default function DashboardPage() {
  const { connected } = useWallet();

  const dashboardContent = connected ? (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-[#051419] rounded-xl border border-gray-700 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-white">Trading Dashboard</h2>
            <p className="text-gray-400">
              Welcome back! Your bots are performing well today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 bg-[#051419] text-gray-300 hover:bg-gray-700">
              <Calendar size={16} className="mr-2" />
              Last 24h
            </Button>
            <Button className="bg-[#00d2cee6] hover:bg-[#00d2cee6]   ">
              <Plus size={16} className="mr-2" />
              New Bot
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <DashboardStats />
        </div>

        {/* Performance Chart */}
        <div className="bg-[#051419] rounded-lg p-4 border border-gray-700 h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Portfolio Performance</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 bg-[#051419] text-gray-300">1D</Button>
              <Button size="sm" className="bg-[#00d2cee6]">1W</Button>
              <Button variant="outline" size="sm" className="border-gray-600 bg-[#051419] text-gray-300">1M</Button>
              <Button variant="outline" size="sm" className="border-gray-600 bg-[#051419] text-gray-300">1Y</Button>
            </div>
          </div>
          <div className="w-full h-[240px] relative">
            <div className="absolute bottom-0 left-0  h-[220px] bg-gradient-to-t from-blue-500/10 "></div>
            <div className="flex items-center justify-center h-full text-gray-400">
              Chart visualization coming soon...
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SubscriptionStatus />
        <div className="lg:col-span-2">
          {/* Quick action cards can go here */}
        </div>
      </div>

      {/* Top Performing Bots and Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#051419] rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Top Performing Bots</h3>
            <Button variant="ghost" size="sm" className="text-[#00d2cee6] hover:text-[#00d2cee6]">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { name: "BTC Momentum", pair: "BTC/USDT", timeframe: "4h", profit: "+12.4%", progress: 78, color: "green" },
              { name: "ETH RSI Strategy", pair: "ETH/USDT", timeframe: "1h", profit: "+8.7%", progress: 64, color: "blue" },
              { name: "Altcoin Swing", pair: "SOL/USDT", timeframe: "12h", profit: "+5.2%", progress: 52, color: "purple" }
            ].map((bot, index) => (
              <div key={index} className="bg-gray-700/30 rounded-lg p-3 border border-gray-700 hover:border-[#00d2cee6] transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-${bot.color}-500/20 flex items-center justify-center`}>
                      <TrendingUp size={16} className={`text-${bot.color}-500`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{bot.name}</h4>
                      <p className="text-xs text-gray-400">{bot.pair} • {bot.timeframe} timeframe</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">{bot.profit}</p>
                    <p className="text-xs text-gray-400">Last 7 days</p>
                  </div>
                </div>
                <div className="w-full bg-gray-600 h-1 rounded-full overflow-hidden">
                  <div className={`bg-${bot.color}-500 h-full rounded-full`} style={{width: `${bot.progress}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#051419] rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Trades</h3>
            <Button variant="ghost" size="sm" className="text-[#00d2cee6] hover:text-[#00d2cee6]">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { pair: "BTC/USDT", type: "BUY", price: "$37,245.80", profit: "+$124.52 (0.3%)", time: "2023-08-12 14:32:45", positive: true },
              { pair: "ETH/USDT", type: "SELL", price: "$1,865.20", profit: "-$42.30 (2.2%)", time: "2023-08-12 13:18:22", positive: false },
              { pair: "SOL/USDT", type: "BUY", price: "$24.35", profit: "+$1.25 (5.4%)", time: "2023-08-12 11:05:16", positive: true }
            ].map((trade, index) => (
              <div key={index} className="bg-gray-700/30 rounded-lg p-3 border border-gray-700 hover:border-[#00d2cee6] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${trade.positive ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                      {trade.positive ? (
                        <TrendingUp size={16} className="text-green-500" />
                      ) : (
                        <TrendingDown size={16} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{trade.pair}</h4>
                        <Badge variant="secondary" className={`${trade.positive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {trade.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">{trade.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{trade.price}</p>
                    <p className={`text-xs ${trade.positive ? 'text-green-500' : 'text-red-500'}`}>{trade.profit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-[#051419] rounded-xl border border-gray-700 p-6">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-700">
            <TabsTrigger value="create" className="data-[state=active]:bg-[#00d2cee6]">Create Bot</TabsTrigger>
            <TabsTrigger value="my-bots" className="data-[state=active]:bg-[#00d2cee6]">My Bots</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#00d2cee6]">Leaderboard</TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-[#00d2cee6]">Trading</TabsTrigger>
            <TabsTrigger value="cross-chain" className="data-[state=active]:bg-[#00d2cee6]">Cross-Chain</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            <TradingBotCreator />
          </TabsContent>

          <TabsContent value="my-bots" className="space-y-6 mt-6">
            <UserBots />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 mt-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="trading" className="space-y-6 mt-6">
            <TradingOperations />
          </TabsContent>

          <TabsContent value="cross-chain" className="space-y-6 mt-6">
            <CrossChainOperations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md bg-[#051419] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Welcome to DeepTrade AI</CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet to start creating AI-powered trading bots and compete in real-time trading competitions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Platform Features:</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Create AI trading bots using natural language</li>
              <li>• Deploy bots on Aptos blockchain with one click</li>
              <li>• Real-time price feeds and market data</li>
              <li>• Cross-chain USDC bridging with Circle CCTP</li>
              <li>• Arbitrage opportunity detection and execution</li>
              <li>• Live leaderboard and competition system</li>
              <li>• Gas-free trading with sponsored transactions</li>
              <li>• Advanced risk management and analytics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      {dashboardContent}
    </DashboardLayout>
  );
}