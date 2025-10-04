/**
 * Circle CCTP Bridge Component
 * Provides interface to bridge USDC to Aptos via Circle's CCTP
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export function CircleCCTPBridge() {
  const supportedChains = [
    { name: "Ethereum", icon: "⟠" },
    { name: "Base", icon: "🔵" },
    { name: "Arbitrum", icon: "🔷" },
    { name: "Optimism", icon: "🔴" },
    { name: "Polygon", icon: "🟣" },
    { name: "Avalanche", icon: "🔺" },
    { name: "Solana", icon: "◎" },
  ];

  return (
    <Card className="bg-[#051419] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Bridge USDC to Aptos
          <Badge variant="outline" className="bg-blue-900 text-blue-300 border-blue-600">
            Circle CCTP
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Transfer USDC from other chains to Aptos using Circle's Cross-Chain Transfer Protocol
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* How it Works */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">How it Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-600">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-semibold text-white mb-1">Select Source Chain</h4>
              <p className="text-xs text-gray-400">
                Choose where to bridge USDC from (Ethereum, Base, etc.)
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-600">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-semibold text-white mb-1">Circle Burns & Mints</h4>
              <p className="text-xs text-gray-400">
                USDC is burned on source chain and minted natively on Aptos
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-800/50 border-gray-600">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-semibold text-white mb-1">Receive on Aptos</h4>
              <p className="text-xs text-gray-400">
                Native USDC arrives in your Aptos wallet (~15 minutes)
              </p>
            </div>
          </div>
        </div>

        {/* Supported Chains */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Supported Chains</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {supportedChains.map((chain) => (
              <div
                key={chain.name}
                className="flex items-center gap-2 p-3 border rounded-lg bg-gray-800/30 border-gray-600"
              >
                <span className="text-2xl">{chain.icon}</span>
                <span className="text-sm text-gray-300">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bridge Button */}
        <div className="space-y-3">
          <Button
            onClick={() =>
              window.open("https://www.circle.com/en/cross-chain-transfer-protocol", "_blank")
            }
            className="w-full bg-[#00d2ce] hover:bg-[#00b8b4] text-black font-semibold h-12"
          >
            Open Circle CCTP Bridge
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-center text-gray-400">
            You'll be redirected to Circle's official bridge interface
          </p>
        </div>

        {/* Benefits */}
        <div className="text-sm text-gray-400 p-4 border rounded-lg bg-gray-800/30 border-gray-600">
          <h4 className="font-semibold mb-2 text-white">✨ CCTP Benefits</h4>
          <ul className="space-y-1 text-xs">
            <li>• <strong className="text-white">Native USDC:</strong> No wrapped tokens, just real USDC</li>
            <li>• <strong className="text-white">Secure:</strong> Backed by Circle, the issuer of USDC</li>
            <li>• <strong className="text-white">Fast:</strong> Transfers complete in ~15 minutes</li>
            <li>• <strong className="text-white">Cost-Effective:</strong> Lower fees than traditional bridges</li>
            <li>• <strong className="text-white">Multi-Chain:</strong> Bridge from 7+ major blockchains</li>
          </ul>
        </div>

        {/* Alternative Options */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">Alternative: Buy USDC Directly</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://www.circle.com/en/usdc", "_blank")}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Circle.com
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://www.coinbase.com/", "_blank")}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Coinbase
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="text-sm text-gray-400 p-4 border rounded-lg bg-blue-900/10 border-blue-600">
          <h4 className="font-semibold mb-2 text-blue-300">📖 Quick Guide</h4>
          <ol className="space-y-2 text-xs list-decimal list-inside">
            <li>Click "Open Circle CCTP Bridge" above</li>
            <li>Connect your wallet on the source chain (e.g., MetaMask for Ethereum)</li>
            <li>Select Aptos as the destination chain</li>
            <li>Enter your Aptos wallet address (from Petra/Martian wallet)</li>
            <li>Enter the amount of USDC to bridge</li>
            <li>Approve and confirm the transaction</li>
            <li>Wait ~15 minutes for USDC to arrive on Aptos</li>
            <li>Return here to fund your trading bot!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
