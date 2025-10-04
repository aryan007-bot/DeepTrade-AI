"use client";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BridgeTransaction {
  bridgeId: string;
  sourceChain: string;
  destinationChain: string;
  amount: number;
  userAddress: string;
  recipientAddress: string;
  status: string;
  estimatedTime: number;
  timestamp: string;
  transactionHash: string;
  fees: number;
  protocol: string;
}

interface ArbitrageOpportunity {
  id: string;
  token: string;
  sourceChain: string;
  destinationChain: string;
  sourceDex: string;
  destinationDex: string;
  sourcePrice: number;
  destinationPrice: number;
  profitPercentage: number;
  estimatedProfit: number;
  volume: number;
  gasEstimate: number;
  timestamp: string;
  confidence: number;
}

async function fetchArbitrageOpportunities(token: string = "USDC", minProfit: number = 0.5): Promise<ArbitrageOpportunity[]> {
  const response = await fetch(`/api/cross-chain/arbitrage?token=${token}&minProfit=${minProfit}`);
  const result = await response.json();
  
  if (result.success) {
    return result.opportunities;
  } else {
    throw new Error(result.error || 'Failed to fetch arbitrage opportunities');
  }
}

async function bridgeUSDC(params: {
  sourceChain: string;
  destinationChain: string;
  amount: number;
  userAddress: string;
  recipientAddress?: string;
}): Promise<BridgeTransaction> {
  const response = await fetch('/api/cross-chain/bridge-usdc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  const result = await response.json();
  
  if (result.success) {
    return result.bridge;
  } else {
    throw new Error(result.error || 'Failed to bridge USDC');
  }
}

async function executeArbitrage(params: {
  opportunityId: string;
  amount: number;
  userAddress: string;
  executeAutomatically?: boolean;
}): Promise<any> {
  const response = await fetch('/api/cross-chain/arbitrage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  const result = await response.json();
  
  if (result.success) {
    return result.arbitrage;
  } else {
    throw new Error(result.error || 'Failed to execute arbitrage');
  }
}

export function CrossChainOperations() {
  const { account } = useWallet();
  const { toast } = useToast();
  const [bridgeParams, setBridgeParams] = useState({
    sourceChain: "aptos",
    destinationChain: "ethereum",
    amount: 100,
    recipientAddress: ""
  });
  const [arbitrageParams, setArbitrageParams] = useState({
    token: "USDC",
    minProfit: 0.5,
    amount: 1000
  });
  const [isBridging, setIsBridging] = useState(false);
  const [isExecutingArbitrage, setIsExecutingArbitrage] = useState(false);

  const { data: arbitrageOpportunities, refetch: refetchArbitrage } = useQuery({
    queryKey: ["arbitrage", arbitrageParams.token, arbitrageParams.minProfit],
    queryFn: () => fetchArbitrageOpportunities(arbitrageParams.token, arbitrageParams.minProfit),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleBridgeUSDC = async () => {
    if (!account?.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to bridge USDC.",
        variant: "destructive",
      });
      return;
    }

    setIsBridging(true);
    try {
      const result = await bridgeUSDC({
        ...bridgeParams,
        userAddress: String(account.address),
        recipientAddress: bridgeParams.recipientAddress
          ? String(bridgeParams.recipientAddress)
          : String(account.address),
      });

      toast({
        title: "Bridge initiated",
        description: `USDC bridge from ${result.sourceChain} to ${result.destinationChain} started.`,
      });

      // Reset form
      setBridgeParams({
        sourceChain: "aptos",
        destinationChain: "ethereum",
        amount: 100,
        recipientAddress: ""
      });
    } catch (error) {
      toast({
        title: "Bridge failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsBridging(false);
    }
  };

  const handleExecuteArbitrage = async (opportunityId: string) => {
  if (!account?.address) {
    toast({
      title: "Wallet not connected",
      description: "Please connect your wallet to execute arbitrage.",
      variant: "destructive",
    });
    return;
  }

  setIsExecutingArbitrage(true);
  try {
    const userAddress = account.address.toString();

    await executeArbitrage({
      opportunityId,
      amount: arbitrageParams.amount,
      userAddress,
      executeAutomatically: false
    });

    toast({
      title: "Arbitrage executed",
      description: `Arbitrage opportunity ${opportunityId} has been executed.`,
    });

    // Refetch opportunities
    refetchArbitrage();
  } catch (error) {
    toast({
      title: "Arbitrage failed",
      description: error instanceof Error ? error.message : "An error occurred",
      variant: "destructive",
    });
  } finally {
    setIsExecutingArbitrage(false);
  }
};

  const chains = ["aptos", "ethereum", "polygon", "arbitrum", "optimism"];
  const tokens = ["USDC", "USDT", "DAI"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Chain Operations</CardTitle>
        <CardDescription>
          Bridge USDC across chains and find arbitrage opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bridge" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bridge">USDC Bridge</TabsTrigger>
            <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          </TabsList>

          <TabsContent value="bridge" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source-chain">Source Chain</Label>
                  <select
                    id="source-chain"
                    value={bridgeParams.sourceChain}
                    onChange={(e) => setBridgeParams(prev => ({ ...prev, sourceChain: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {chains.map((chain) => (
                      <option key={chain} value={chain}>
                        {chain.charAt(0).toUpperCase() + chain.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="destination-chain">Destination Chain</Label>
                  <select
                    id="destination-chain"
                    value={bridgeParams.destinationChain}
                    onChange={(e) => setBridgeParams(prev => ({ ...prev, destinationChain: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {chains.map((chain) => (
                      <option key={chain} value={chain}>
                        {chain.charAt(0).toUpperCase() + chain.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="bridge-amount">Amount (USDC)</Label>
                <Input
                  id="bridge-amount"
                  type="number"
                  value={bridgeParams.amount}
                  onChange={(e) => setBridgeParams(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  min="1"
                  step="1"
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="recipient-address">Recipient Address (Optional)</Label>
                <Input
                  id="recipient-address"
                  value={bridgeParams.recipientAddress}
                  onChange={(e) => setBridgeParams(prev => ({ ...prev, recipientAddress: e.target.value }))}
                  placeholder="Leave empty to use your wallet address"
                />
              </div>

              <Button 
                onClick={handleBridgeUSDC} 
                disabled={isBridging || !account?.address}
                className="w-full"
              >
                {isBridging ? "Bridging USDC..." : "Bridge USDC"}
              </Button>

              <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/50">
                <p className="font-semibold mb-2">Bridge Information:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Uses Circle CCTP protocol for secure cross-chain transfers</li>
                  <li>• Estimated time: 30 seconds for Aptos, 5 minutes for other chains</li>
                  <li>• Bridge fee: 0.1% of transfer amount</li>
                  <li>• Supported chains: Aptos, Ethereum, Polygon, Arbitrum, Optimism</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="arbitrage" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arbitrage-token">Token</Label>
                  <select
                    id="arbitrage-token"
                    value={arbitrageParams.token}
                    onChange={(e) => setArbitrageParams(prev => ({ ...prev, token: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    {tokens.map((token) => (
                      <option key={token} value={token}>
                        {token}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="min-profit">Min Profit (%)</Label>
                  <Input
                    id="min-profit"
                    type="number"
                    value={arbitrageParams.minProfit}
                    onChange={(e) => setArbitrageParams(prev => ({ ...prev, minProfit: parseFloat(e.target.value) || 0 }))}
                    min="0.1"
                    step="0.1"
                    placeholder="0.5"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Arbitrage Opportunities</h3>
                {arbitrageOpportunities && arbitrageOpportunities.length > 0 ? (
                  <div className="space-y-3">
                    {arbitrageOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{opportunity.token} Arbitrage</h4>
                            <p className="text-sm text-muted-foreground">
                              {opportunity.sourceChain} → {opportunity.destinationChain}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-green-600">
                            +{opportunity.profitPercentage.toFixed(2)}%
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Source Price</p>
                            <p className="font-medium">${opportunity.sourcePrice.toFixed(4)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Dest Price</p>
                            <p className="font-medium">${opportunity.destinationPrice.toFixed(4)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Est. Profit</p>
                            <p className="font-medium">${opportunity.estimatedProfit.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Confidence</p>
                            <p className="font-medium">{(opportunity.confidence * 100).toFixed(0)}%</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {opportunity.sourceDex} → {opportunity.destinationDex}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleExecuteArbitrage(opportunity.id)}
                            disabled={isExecutingArbitrage || !account?.address}
                          >
                            Execute
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No arbitrage opportunities found.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting the minimum profit percentage or token selection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 