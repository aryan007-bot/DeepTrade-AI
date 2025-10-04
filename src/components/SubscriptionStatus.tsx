"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useCurrentSubscriptionTier,
  useUserMaxBots,
  useUserBotCount,
} from "@/hooks/useContract";
import { SubscriptionTier } from "@/types/contract";
import { Users, Zap, Crown, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function SubscriptionStatus() {
  const { account } = useWallet();
  const router = useRouter();

  const { data: currentTier } = useCurrentSubscriptionTier(account?.address?.toString());
  const { data: maxBots } = useUserMaxBots(account?.address?.toString());
  const { data: botCount } = useUserBotCount(account?.address?.toString());

  if (!account?.address) {
    return null;
  }

  const getTierName = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FREE:
        return "Free";
      case SubscriptionTier.BASIC:
        return "Basic";
      case SubscriptionTier.PREMIUM:
        return "Premium";
      default:
        return "Free";
    }
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FREE:
        return <Users className="w-4 h-4" />;
      case SubscriptionTier.BASIC:
        return <Zap className="w-4 h-4" />;
      case SubscriptionTier.PREMIUM:
        return <Crown className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FREE:
        return "bg-gray-500";
      case SubscriptionTier.BASIC:
        return "bg-blue-500";
      case SubscriptionTier.PREMIUM:
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const botUsagePercent = maxBots ? Math.min((botCount || 0) / maxBots * 100, 100) : 0;
  const isNearLimit = botUsagePercent > 80;
  const canUpgrade = currentTier !== SubscriptionTier.PREMIUM;

  return (
    <Card className="bg-[#051419] border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTierIcon(currentTier || SubscriptionTier.FREE)}
            <span className="font-medium text-white">
              {getTierName(currentTier || SubscriptionTier.FREE)} Plan
            </span>
            <Badge className={`${getTierColor(currentTier || SubscriptionTier.FREE)} text-white text-xs`}>
              {getTierName(currentTier || SubscriptionTier.FREE)}
            </Badge>
          </div>
          {canUpgrade && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/dashboard/settings')}
              className="border-[#00d2cee6] text-[#00d2cee6] hover:bg-[#00d2cee6] hover:text-black text-xs"
            >
              Upgrade
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Bot Usage</span>
            <span className={`${isNearLimit ? 'text-yellow-400' : 'text-gray-300'}`}>
              {botCount || 0} / {maxBots && maxBots > 1000000 ? "∞" : maxBots}
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isNearLimit ? 'bg-yellow-500' : 'bg-[#00d2cee6]'
              }`}
              style={{ width: `${Math.min(botUsagePercent, 100)}%` }}
            />
          </div>

          {isNearLimit && canUpgrade && (
            <p className="text-xs text-yellow-400 mt-2">
              You're near your bot limit. Consider upgrading for more bots.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}