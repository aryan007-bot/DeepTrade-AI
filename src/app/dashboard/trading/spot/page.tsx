"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { TradingOperations } from "@/components/TradingOperations";

export default function SpotTradingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Spot Trading</h1>
          <p className="text-gray-400">
            Monitor real-time prices and test trading strategies with historical data.
          </p>
        </div>

        <TradingOperations />
      </div>
    </DashboardLayout>
  );
}