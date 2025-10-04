"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRightLeft, Clock, DollarSign } from "lucide-react";

export default function ArbitragePage() {
  // Mock arbitrage opportunities data
  const arbitrageOpportunities = [
    {
      id: "1",
      token: "USDC",
      sourceChain: "Aptos",
      destinationChain: "Ethereum",
      sourceDex: "PancakeSwap",
      destinationDex: "Uniswap",
      sourcePrice: 0.9985,
      destinationPrice: 1.0025,
      profitPercentage: 0.4,
      estimatedProfit: 40.15,
      volume: 50000,
      confidence: 0.95,
      timeWindow: "5 minutes"
    },
    {
      id: "2",
      token: "APT",
      sourceChain: "Aptos",
      destinationChain: "Polygon",
      sourceDex: "LiquidSwap",
      destinationDex: "QuickSwap",
      sourcePrice: 8.45,
      destinationPrice: 8.62,
      profitPercentage: 2.01,
      estimatedProfit: 170.85,
      volume: 25000,
      confidence: 0.88,
      timeWindow: "3 minutes"
    },
    {
      id: "3",
      token: "ETH",
      sourceChain: "Ethereum",
      destinationChain: "Arbitrum",
      sourceDex: "Uniswap",
      destinationDex: "SushiSwap",
      sourcePrice: 2456.78,
      destinationPrice: 2471.23,
      profitPercentage: 0.59,
      estimatedProfit: 58.45,
      volume: 15000,
      confidence: 0.92,
      timeWindow: "2 minutes"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Arbitrage Opportunities</h1>
          <p className="text-gray-400">
            Discover and execute profitable cross-chain arbitrage trades automatically.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Opportunities</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <DollarSign size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Profit (24h)</p>
                  <p className="text-2xl font-bold text-white">$1,247.32</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <ArrowRightLeft size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Executed Trades</p>
                  <p className="text-2xl font-bold text-white">28</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Clock size={20} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg. Execution Time</p>
                  <p className="text-2xl font-bold text-white">3.2s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Arbitrage Opportunities */}
        <Card className="bg-[#051419] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Live Arbitrage Opportunities</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time cross-chain arbitrage opportunities with profit potential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {arbitrageOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-500 font-bold text-sm">{opportunity.token}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{opportunity.token} Arbitrage</h4>
                        <p className="text-sm text-gray-400">
                          {opportunity.sourceChain} → {opportunity.destinationChain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        +{opportunity.profitPercentage.toFixed(2)}%
                      </Badge>
                      <Badge variant="outline" className="text-blue-500 border-blue-500">
                        {opportunity.timeWindow}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">Source Price</p>
                      <p className="font-medium text-white">${opportunity.sourcePrice.toFixed(4)}</p>
                      <p className="text-xs text-gray-500">{opportunity.sourceDex}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Dest Price</p>
                      <p className="font-medium text-white">${opportunity.destinationPrice.toFixed(4)}</p>
                      <p className="text-xs text-gray-500">{opportunity.destinationDex}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Est. Profit</p>
                      <p className="font-medium text-green-500">${opportunity.estimatedProfit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Volume</p>
                      <p className="font-medium text-white">${(opportunity.volume / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Confidence</p>
                      <p className="font-medium text-white">{(opportunity.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">Live opportunity</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        Analyze
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                        Execute Trade
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}