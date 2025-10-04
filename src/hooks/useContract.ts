import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { contractService } from "@/services/contractService";
import { CreateBotParams, PurchaseSubscriptionParams, SubscriptionTier } from "@/types/contract";
import { useToast } from "@/components/ui/use-toast";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const USDC_METADATA_ADDRESS = "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa";

export function useUserBots(userAddress?: string) {
  return useQuery({
    queryKey: ["userBots", userAddress],
    queryFn: async () => {
      const result = await contractService.getUserBots(userAddress!);
      console.log("User bots query result:", result);
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
    select: (data) => data.success ? data.data : [],
    retry: 3,
  });
}

export function useUserBot(userAddress?: string) {
  return useQuery({
    queryKey: ["userBot", userAddress],
    queryFn: async () => {
      const result = await contractService.getUserBot(userAddress!);
      console.log("User bot query result:", result);
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
    select: (data) => data.success ? data.data : undefined,
    retry: (failureCount, error) => {
      // Don't retry if it's a "no bot found" error
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("No bot found")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const result = await contractService.getLeaderboard();
      console.log("Leaderboard query result:", result);
      return result;
    },
    refetchInterval: 30000,
    select: (data) => data.success ? data.data : [],
    retry: 3,
  });
}

export function useRegistryStats() {
  return useQuery({
    queryKey: ["registryStats"],
    queryFn: () => contractService.getRegistryStats(),
    refetchInterval: 60000, // Refetch every minute
    select: (data) => data.success ? data.data : undefined,
  });
}

export function useHasBot(userAddress?: string) {
  return useQuery({
    queryKey: ["hasBot", userAddress],
    queryFn: () => contractService.hasBot(userAddress!),
    enabled: !!userAddress,
    select: (data) => data.success ? data.data : false,
  });
}

export function useCreateBot() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: CreateBotParams) => {
      if (!signAndSubmitTransaction) {
        throw new Error("Wallet not connected");
      }
      if (!account?.address) {
        throw new Error("No wallet address available");
      }
      
      console.log("Creating bot with params:", params);
      console.log("Wallet address:", account.address);
      
      const result = await contractService.createBot(params, signAndSubmitTransaction);
      console.log("Contract service result:", result);
      return result;
    },
    onSuccess: (data, variables) => {
      console.log("Mutation onSuccess called with data:", data);
      console.log("Variables:", variables);
      
      // Always show success toast if we reach this point
      console.log("Showing success toast...");
      toast({
        title: "Bot created successfully! 🎉",
        description: `${variables.name} has been created and is ready to trade.`,
      });
      
      // Invalidate relevant queries with specific user address
      const userAddress = account?.address?.toString();
      console.log("Invalidating queries for user:", userAddress);
      
      queryClient.invalidateQueries({ queryKey: ["userBot", userAddress] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["registryStats"] });
      queryClient.invalidateQueries({ queryKey: ["hasBot", userAddress] });
      
      // Force refetch after a short delay to ensure contract state is updated
      console.log("Setting up delayed refetch...");
      setTimeout(() => {
        console.log("Executing delayed refetch...");
        queryClient.refetchQueries({ queryKey: ["userBot", userAddress] });
        queryClient.refetchQueries({ queryKey: ["leaderboard"] });
        queryClient.refetchQueries({ queryKey: ["hasBot", userAddress] });
      }, 3000); // Increased delay to 3 seconds
      
      // Check if the response indicates failure and handle it
      if (data && !data.success) {
        console.log("Data indicates failure, throwing error:", data.error);
        throw new Error(data.error || "Failed to create bot");
      }
    },
    onError: (error) => {
      console.error("Create bot mutation error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const isInsufficientGas = errorMessage.includes("Not enough APT") || errorMessage.includes("gas fee");
      const isBotAlreadyExists = errorMessage.includes("Failed to move resource") || errorMessage.includes("MoveTo");
      
      if (isInsufficientGas) {
        toast({
          title: "Insufficient APT for gas fees",
          description: "You need APT tokens to pay for transaction gas fees. Get free testnet APT from the faucet.",
          variant: "destructive",
        });
      } else if (isBotAlreadyExists) {
        toast({
          title: "Bot already exists",
          description: "You already have a trading bot. Each user can only create one bot at a time.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to create bot",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });
}

// Subscription hooks
export function useUserSubscription(userAddress?: string) {
  return useQuery({
    queryKey: ["userSubscription", userAddress],
    queryFn: async () => {
      const result = await contractService.getUserSubscription(userAddress!);
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 60000, // Refetch every minute
    select: (data) => data.success ? data.data : undefined,
  });
}

export function useCurrentSubscriptionTier(userAddress?: string) {
  return useQuery({
    queryKey: ["currentSubscriptionTier", userAddress],
    queryFn: async () => {
      const result = await contractService.getCurrentSubscriptionTier(userAddress!);
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 60000,
    select: (data) => data.success ? data.data : SubscriptionTier.FREE,
  });
}

export function useUserMaxBots(userAddress?: string) {
  return useQuery({
    queryKey: ["userMaxBots", userAddress],
    queryFn: async () => {
      const result = await contractService.getUserMaxBots(userAddress!);
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 60000,
    select: (data) => data.success ? data.data : 10, // Default to free tier limit
  });
}

export function useUserBotCount(userAddress?: string) {
  return useQuery({
    queryKey: ["userBotCount", userAddress],
    queryFn: async () => {
      const result = await contractService.getUserBotCount(userAddress!);
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 30000,
    select: (data) => data.success ? data.data : 0,
  });
}

export function useSubscriptionPrices() {
  return useQuery({
    queryKey: ["subscriptionPrices"],
    queryFn: async () => {
      const result = await contractService.getSubscriptionPrices();
      return result;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    select: (data) => data.success ? data.data : undefined,
  });
}

export function usePurchaseSubscription() {
  const { signAndSubmitTransaction, account } = useWallet();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: PurchaseSubscriptionParams) => {
      if (!signAndSubmitTransaction) {
        throw new Error("Wallet not connected");
      }
      if (!account?.address) {
        throw new Error("No wallet address available");
      }

      console.log("Purchasing subscription with params:", params);
      console.log("Wallet address:", account.address);

      const result = await contractService.purchaseSubscription(params, signAndSubmitTransaction);
      console.log("Subscription purchase result:", result);
      return result;
    },
    onSuccess: (data, variables) => {
      console.log("Subscription purchase successful:", data);

      const tierName = variables.tier === SubscriptionTier.BASIC ? "Basic" : "Premium";
      toast({
        title: "Subscription purchased successfully! 🎉",
        description: `You've upgraded to ${tierName} subscription. Enjoy increased bot limits!`,
      });

      // Invalidate subscription-related queries
      const userAddress = account?.address?.toString();
      queryClient.invalidateQueries({ queryKey: ["userSubscription", userAddress] });
      queryClient.invalidateQueries({ queryKey: ["currentSubscriptionTier", userAddress] });
      queryClient.invalidateQueries({ queryKey: ["userMaxBots", userAddress] });
      queryClient.invalidateQueries({ queryKey: ["userBotCount", userAddress] });

      // Force refetch after delay
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["userSubscription", userAddress] });
        queryClient.refetchQueries({ queryKey: ["currentSubscriptionTier", userAddress] });
        queryClient.refetchQueries({ queryKey: ["userMaxBots", userAddress] });
      }, 3000);

      if (data && !data.success) {
        throw new Error(data.error || "Failed to purchase subscription");
      }
    },
    onError: (error) => {
      console.error("Purchase subscription error:", error);

      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const isInsufficientAPT = errorMessage.includes("insufficient") || errorMessage.includes("balance");

      if (isInsufficientAPT) {
        toast({
          title: "Insufficient APT balance",
          description: "You need more APT tokens to purchase this subscription. Please add APT to your wallet.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to purchase subscription",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });
}

// ======================== USDC Hooks ========================

/**
 * Hook to fetch user's USDC balance on Aptos
 */
export function useUserUSDCBalance(userAddress?: string) {
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  return useQuery({
    queryKey: ["userUSDCBalance", userAddress],
    queryFn: async () => {
      if (!userAddress) return 0;

      try {
        const balance = await aptos.view({
          payload: {
            function: "0x1::primary_fungible_store::balance",
            typeArguments: [],
            functionArguments: [userAddress, USDC_METADATA_ADDRESS],
          },
        });

        return Number(balance[0]) || 0;
      } catch (error) {
        console.error("Failed to fetch USDC balance:", error);
        return 0;
      }
    },
    enabled: !!userAddress,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

/**
 * Hook to fetch a bot's USDC balance
 */
export function useBotUSDCBalance(botOwner?: string, botId?: string) {
  return useQuery({
    queryKey: ["botUSDCBalance", botOwner, botId],
    queryFn: async () => {
      if (!botOwner || !botId) return 0;

      try {
        const result = await contractService.getBotUSDCBalance(botOwner, botId);
        return result.success ? result.data : 0;
      } catch (error) {
        console.error("Failed to fetch bot USDC balance:", error);
        return 0;
      }
    },
    enabled: !!botOwner && !!botId,
    refetchInterval: 15000,
  });
}