"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { EnhancedLeaderboard } from "@/components/EnhancedLeaderboard";

export default function LeaderboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Leaderboard</h1>
          <p className="text-gray-400">
            Top performing AI trading bots on the DeepTrade AI platform.
          </p>
        </div>

        <EnhancedLeaderboard />
      </div>
    </DashboardLayout>
  );
}