"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { CrossChainOperations } from "@/components/CrossChainOperations";

export default function CrossChainTradingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Cross-Chain Trading</h1>
          <p className="text-gray-400">
            Bridge USDC across chains and find arbitrage opportunities.
          </p>
        </div>

        <CrossChainOperations />
      </div>
    </DashboardLayout>
  );
}