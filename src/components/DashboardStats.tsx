"use client";

import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, Bot, PiggyBank } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <Card className="bg-gray-700/50 border-gray-600 hover:border-[#00d2cee6] transition-all duration-200 transform hover:scale-[1.02] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
          <div className={`flex items-center mt-1 text-sm ${
            changeType === "positive" ? "text-green-500" : "text-red-500"
          }`}>
            {changeType === "positive" ? (
              <TrendingUp size={16} className="mr-1" />
            ) : (
              <TrendingDown size={16} className="mr-1" />
            )}
            {change}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: "Total Portfolio Value",
      value: "$24,568.80",
      change: "+8.2% (24h)",
      changeType: "positive" as const,
      icon: <DollarSign size={20} className="text-blue-500" />
    },
    {
      title: "Active Bots",
      value: "12",
      change: "+2 (24h)",
      changeType: "positive" as const,
      icon: <Bot size={20} className="text-blue-500" />
    },
    {
      title: "Total Profit",
      value: "$1,245.32",
      change: "-2.4% (24h)",
      changeType: "negative" as const,
      icon: <PiggyBank size={20} className="text-blue-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}