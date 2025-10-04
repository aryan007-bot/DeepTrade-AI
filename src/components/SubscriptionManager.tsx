"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  useUserSubscription,
  useCurrentSubscriptionTier,
  useUserMaxBots,
  useUserBotCount,
  useSubscriptionPrices,
  usePurchaseSubscription
} from "@/hooks/useContract";
import { SubscriptionTier } from "@/types/contract";
import { Zap, Users, Crown, Check, Clock } from "lucide-react";

export function SubscriptionManager() {
  const { account } = useWallet();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

  const { data: subscription } = useUserSubscription(account?.address?.toString());
  const { data: currentTier } = useCurrentSubscriptionTier(account?.address?.toString());
  const { data: maxBots } = useUserMaxBots(account?.address?.toString());
  const { data: botCount } = useUserBotCount(account?.address?.toString());
  const { data: prices } = useSubscriptionPrices();
  const purchaseSubscription = usePurchaseSubscription();

  if (!account?.address) {
    return (
      <Card className="bg-[#051419] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Subscription Management</CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet to manage your subscription.
          </CardDescription>
        </CardHeader>
      </Card>
    );
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
        return <Users className="w-5 h-5" />;
      case SubscriptionTier.BASIC:
        return <Zap className="w-5 h-5" />;
      case SubscriptionTier.PREMIUM:
        return <Crown className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
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

  const formatAPT = (amount: number) => {
    return (amount / 100000000).toFixed(0); // Convert from 8 decimals
  };

  const isSubscriptionExpired = () => {
    if (!subscription || subscription.tier === SubscriptionTier.FREE) return false;
    const now = Math.floor(Date.now() / 1000);
    return subscription.expires_at > 0 && now > subscription.expires_at;
  };

  const getExpirationDate = () => {
    if (!subscription || subscription.expires_at === 0) return null;
    return new Date(subscription.expires_at * 1000);
  };

  const handlePurchaseSubscription = async (tier: SubscriptionTier) => {
    if (tier === SubscriptionTier.FREE) return;

    setSelectedTier(tier);
    try {
      await purchaseSubscription.mutateAsync({ tier });
    } catch (error) {
      console.error("Failed to purchase subscription:", error);
    } finally {
      setSelectedTier(null);
    }
  };

  const botUsagePercent = maxBots ? Math.min((botCount || 0) / maxBots * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="bg-[#051419] border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {getTierIcon(currentTier || SubscriptionTier.FREE)}
                {getTierName(currentTier || SubscriptionTier.FREE)} Plan
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your current subscription status
              </CardDescription>
            </div>
            <Badge className={`${getTierColor(currentTier || SubscriptionTier.FREE)} text-white`}>
              {getTierName(currentTier || SubscriptionTier.FREE)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bot Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Bot Usage</span>
              <span className="text-sm text-gray-300">
                {botCount || 0} / {maxBots && maxBots > 1000000 ? "∞" : maxBots} bots
              </span>
            </div>
            <Progress value={botUsagePercent} className="h-2" />
          </div>

          {/* Expiration Info */}
          {subscription && subscription.tier !== SubscriptionTier.FREE && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">
                {isSubscriptionExpired() ? (
                  <span className="text-red-400">Expired on {getExpirationDate()?.toLocaleDateString()}</span>
                ) : (
                  <span>Expires on {getExpirationDate()?.toLocaleDateString()}</span>
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className={`bg-[#051419] border-gray-700 ${currentTier === SubscriptionTier.FREE ? 'ring-2 ring-gray-500' : ''}`}>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-6 h-6 text-gray-400" />
              <CardTitle className="text-white">Free</CardTitle>
            </div>
            <div className="text-2xl font-bold text-white">$0</div>
            <CardDescription className="text-gray-400">Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-white">10</span>
              <span className="text-gray-400 block">trading bots</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Natural language strategies
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Gas-free trading
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Basic analytics
              </li>
            </ul>
            {currentTier === SubscriptionTier.FREE && (
              <div className="text-center text-sm text-gray-400 mt-4">Current Plan</div>
            )}
          </CardContent>
        </Card>

        {/* Basic Plan */}
        <Card className={`bg-[#051419] border-2 ${currentTier === SubscriptionTier.BASIC ? 'border-blue-500 ring-2 ring-blue-500' : 'border-blue-500'}`}>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-blue-400" />
              <CardTitle className="text-white">Basic</CardTitle>
            </div>
            <div className="text-2xl font-bold text-white">
              {prices ? `${formatAPT(prices.basic_price)} APT` : "10 APT"}
            </div>
            <CardDescription className="text-gray-400">Per month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-white">100</span>
              <span className="text-gray-400 block">trading bots</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Everything in Free
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Advanced risk management
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Priority support
              </li>
            </ul>
            {currentTier === SubscriptionTier.BASIC ? (
              <div className="text-center text-sm text-blue-400 mt-4">Current Plan</div>
            ) : (
              <Button
                onClick={() => handlePurchaseSubscription(SubscriptionTier.BASIC)}
                disabled={purchaseSubscription.isPending && selectedTier === SubscriptionTier.BASIC}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {purchaseSubscription.isPending && selectedTier === SubscriptionTier.BASIC
                  ? "Processing..."
                  : "Upgrade to Basic"
                }
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`bg-[#051419] border-gray-700 ${currentTier === SubscriptionTier.PREMIUM ? 'ring-2 ring-yellow-500' : ''}`}>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <CardTitle className="text-white">Premium</CardTitle>
            </div>
            <div className="text-2xl font-bold text-white">
              {prices ? `${formatAPT(prices.premium_price)} APT` : "50 APT"}
            </div>
            <CardDescription className="text-gray-400">Per month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-white">∞</span>
              <span className="text-gray-400 block">unlimited bots</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Everything in Basic
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Unlimited trading bots
              </li>
              <li className="flex items-center text-gray-300">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Advanced analytics
              </li>
            </ul>
            {currentTier === SubscriptionTier.PREMIUM ? (
              <div className="text-center text-sm text-yellow-400 mt-4">Current Plan</div>
            ) : (
              <Button
                onClick={() => handlePurchaseSubscription(SubscriptionTier.PREMIUM)}
                disabled={purchaseSubscription.isPending && selectedTier === SubscriptionTier.PREMIUM}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                {purchaseSubscription.isPending && selectedTier === SubscriptionTier.PREMIUM
                  ? "Processing..."
                  : "Upgrade to Premium"
                }
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-400">
        <p>All subscriptions are paid in APT tokens and renew automatically every 30 days.</p>
        <p>Subscription management coming soon in dashboard settings.</p>
      </div>
    </div>
  );
}