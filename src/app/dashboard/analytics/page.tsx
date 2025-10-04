"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  Calendar,
  Download
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">
              Comprehensive performance analytics and insights for your trading bots.
            </p>
          </div>
          <div className="flex bg-[#051419] gap-2">
            <Button variant="outline" className="border-gray-600 bg-[#051419] text-gray-300">
              <Calendar size={16} className="mr-2" />
              Last 30 Days
            </Button>
            <Button variant="outline" className="border-gray-600 bg-[#051419] text-gray-300">
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Return</p>
                  <p className="text-2xl font-bold text-white">+24.7%</p>
                  <p className="text-xs text-green-500">+2.3% vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Activity size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-white">2.34</p>
                  <p className="text-xs text-blue-500">Excellent performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Win Rate</p>
                  <p className="text-2xl font-bold text-white">73.2%</p>
                  <p className="text-xs text-purple-500">Above average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#051419] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <TrendingDown size={20} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Max Drawdown</p>
                  <p className="text-2xl font-bold text-white">-8.4%</p>
                  <p className="text-xs text-orange-500">Within limits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="performance" className="data-[state=active]:bg-[#00d2cee6]">
              Performance
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-[#00d2cee6]">
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-[#00d2cee6]">
              Trade History
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-[#00d2cee6]">
              Bot Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 size={20} />
                    Portfolio Performance
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Historical performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Performance chart visualization</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart size={20} />
                    Asset Allocation
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Current portfolio distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Asset allocation chart</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Metrics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Key risk indicators for your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Value at Risk (VaR)</span>
                      <Badge variant="outline" className="text-orange-500 border-orange-500">
                        -$234.56
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Beta</span>
                      <Badge variant="outline" className="text-blue-500 border-blue-500">
                        0.87
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-300">Volatility</span>
                      <Badge variant="outline" className="text-purple-500 border-purple-500">
                        12.4%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Distribution</CardTitle>
                  <CardDescription className="text-gray-400">
                    Risk breakdown by strategy and asset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Risk distribution chart</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="mt-6">
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Trades</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed trade history and execution data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { pair: "BTC/USDC", type: "BUY", amount: "0.5", price: "$37,245", pnl: "+$124.52", time: "2 hours ago" },
                    { pair: "ETH/USDC", type: "SELL", amount: "2.1", price: "$1,865", pnl: "-$42.30", time: "4 hours ago" },
                    { pair: "APT/USDC", type: "BUY", amount: "150", price: "$8.45", pnl: "+$67.89", time: "6 hours ago" }
                  ].map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={trade.type === "BUY" ? "default" : "secondary"}>
                          {trade.type}
                        </Badge>
                        <div>
                          <p className="font-medium text-white">{trade.pair}</p>
                          <p className="text-sm text-gray-400">{trade.amount} @ {trade.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${trade.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.pnl}
                        </p>
                        <p className="text-xs text-gray-400">{trade.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Bot Performance Comparison</CardTitle>
                <CardDescription className="text-gray-400">
                  Compare performance across your trading bots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Bot comparison chart visualization</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}