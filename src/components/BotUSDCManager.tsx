/**
 * Bot USDC Manager Component
 * Handles depositing and withdrawing USDC for trading bots
 */

"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Circle USDC metadata address on Aptos
const USDC_METADATA_ADDRESS = "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa";
const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS || "";

interface BotUSDCManagerProps {
  botId: string;
  currentBalance: number; // in micro USDC
  ownerAddress: string;
}

export function BotUSDCManager({ botId, currentBalance, ownerAddress }: BotUSDCManagerProps) {
  const { account, signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [userUSDCBalance, setUserUSDCBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Initialize Aptos client
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  // Fetch user's USDC balance
  const fetchUserUSDCBalance = async () => {
    if (!account?.address) return;

    setLoadingBalance(true);
    try {
      // Query user's USDC balance using primary fungible store
      const balance = await aptos.view({
        payload: {
          function: "0x1::primary_fungible_store::balance",
          typeArguments: [],
          functionArguments: [account.address, USDC_METADATA_ADDRESS],
        },
      });

      setUserUSDCBalance(Number(balance[0]) || 0);
    } catch (error) {
      console.error("Failed to fetch USDC balance:", error);
      setUserUSDCBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Deposit USDC to bot
  const handleDeposit = async () => {
    if (!account?.address || !signAndSubmitTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deposit USDC.",
        variant: "destructive",
      });
      return;
    }

    const amountInMicroUSDC = parseFloat(depositAmount) * 1_000_000;
    if (isNaN(amountInMicroUSDC) || amountInMicroUSDC <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    if (amountInMicroUSDC > userUSDCBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough USDC in your wallet.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: `${MODULE_ADDRESS}::trading_bot::deposit_usdc_to_bot`,
          typeArguments: [],
          functionArguments: [botId, Math.floor(amountInMicroUSDC)],
        },
      });

      // Wait for transaction confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });

      toast({
        title: "✅ Deposit successful!",
        description: `Deposited ${depositAmount} USDC to your bot.`,
      });

      setDepositAmount("");
      fetchUserUSDCBalance();
    } catch (error) {
      console.error("Deposit failed:", error);
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Withdraw USDC from bot
  const handleWithdraw = async () => {
    if (!account?.address || !signAndSubmitTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to withdraw USDC.",
        variant: "destructive",
      });
      return;
    }

    const amountInMicroUSDC = parseFloat(withdrawAmount) * 1_000_000;
    if (isNaN(amountInMicroUSDC) || amountInMicroUSDC <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    if (amountInMicroUSDC > currentBalance) {
      toast({
        title: "Insufficient bot balance",
        description: "Your bot doesn't have enough USDC.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: `${MODULE_ADDRESS}::trading_bot::withdraw_usdc_from_bot`,
          typeArguments: [],
          functionArguments: [botId, Math.floor(amountInMicroUSDC)],
        },
      });

      // Wait for transaction confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });

      toast({
        title: "✅ Withdrawal successful!",
        description: `Withdrew ${withdrawAmount} USDC from your bot.`,
      });

      setWithdrawAmount("");
      fetchUserUSDCBalance();
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load user USDC balance on mount
  useState(() => {
    if (account?.address) {
      fetchUserUSDCBalance();
    }
  });

  if (!account?.address || account.address.toString() !== ownerAddress) {
    return (
      <Card className="bg-[#051419] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">USDC Management</CardTitle>
          <CardDescription className="text-gray-400">
            Connect wallet to manage bot funds
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-[#051419] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          USDC Management
          <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-600">
            Circle USDC
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Deposit or withdraw USDC for your trading bot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balances Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-600">
            <Label className="text-gray-400 text-xs">Your Wallet</Label>
            <div className="text-2xl font-bold text-white mt-1">
              {loadingBalance ? (
                <div className="animate-pulse">...</div>
              ) : (
                `${(userUSDCBalance / 1_000_000).toFixed(2)} USDC`
              )}
            </div>
            <Button
              onClick={fetchUserUSDCBalance}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white mt-1"
            >
              Refresh
            </Button>
          </div>

          <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-600">
            <Label className="text-gray-400 text-xs">Bot Balance</Label>
            <div className="text-2xl font-bold text-[#00d2ce] mt-1">
              {(currentBalance / 1_000_000).toFixed(2)} USDC
            </div>
          </div>
        </div>

        {/* Deposit Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Deposit USDC</h3>
          <div>
            <Label htmlFor="deposit-amount" className="text-gray-300">
              Amount (USDC)
            </Label>
            <Input
              id="deposit-amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="bg-gray-800 border-gray-600 text-white"
              disabled={loading}
            />
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDepositAmount((userUSDCBalance / 1_000_000 / 4).toFixed(2))}
                className="text-xs"
              >
                25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDepositAmount((userUSDCBalance / 1_000_000 / 2).toFixed(2))}
                className="text-xs"
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDepositAmount((userUSDCBalance / 1_000_000).toFixed(2))}
                className="text-xs"
              >
                Max
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDeposit}
            disabled={loading || !depositAmount || parseFloat(depositAmount) <= 0}
            className="w-full bg-[#00d2ce] hover:bg-[#00b8b4] text-black font-semibold"
          >
            {loading ? "Depositing..." : "Deposit to Bot"}
          </Button>
        </div>

        {/* Withdraw Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Withdraw USDC</h3>
          <div>
            <Label htmlFor="withdraw-amount" className="text-gray-300">
              Amount (USDC)
            </Label>
            <Input
              id="withdraw-amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="bg-gray-800 border-gray-600 text-white"
              disabled={loading}
            />
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWithdrawAmount((currentBalance / 1_000_000 / 4).toFixed(2))}
                className="text-xs"
              >
                25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWithdrawAmount((currentBalance / 1_000_000 / 2).toFixed(2))}
                className="text-xs"
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWithdrawAmount((currentBalance / 1_000_000).toFixed(2))}
                className="text-xs"
              >
                Max
              </Button>
            </div>
          </div>
          <Button
            onClick={handleWithdraw}
            disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
            variant="outline"
            className="w-full border-gray-600 text-white hover:bg-gray-800"
          >
            {loading ? "Withdrawing..." : "Withdraw from Bot"}
          </Button>
        </div>

        {/* Info Section */}
        <div className="text-sm text-gray-400 p-4 border rounded-lg bg-gray-800/30 border-gray-600">
          <h4 className="font-semibold mb-2 text-white">💡 About USDC</h4>
          <ul className="space-y-1 text-xs">
            <li>• Using Circle's native USDC on Aptos blockchain</li>
            <li>• Deposit USDC to fund your bot's trading activities</li>
            <li>• Withdraw anytime to get your profits back</li>
            <li>• All transactions are instant and gas-efficient</li>
          </ul>
        </div>

        {/* Get USDC Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Don't have USDC on Aptos?</p>
          <Button
            variant="link"
            className="text-[#00d2ce]"
            onClick={() => window.open("https://www.circle.com/en/cross-chain-transfer-protocol", "_blank")}
          >
            Bridge USDC via Circle CCTP →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
