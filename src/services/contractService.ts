import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { aptosClient } from "@/utils/aptosClient";
import { MODULE_ADDRESS } from "@/constants";
import {
  TradingBotData,
  BotPerformanceData,
  RegistryStats,
  CreateBotParams,
  ContractResponse,
  ContractFunction,
  UserSubscription,
  SubscriptionPrices,
  PurchaseSubscriptionParams,
  SubscriptionTier
} from "@/types/contract";

export class ContractService {
  private moduleAddress: string;

  constructor() {
    this.moduleAddress = MODULE_ADDRESS || "";
  }

  private validateModuleAddress(): void {
    if (!this.moduleAddress || this.moduleAddress === "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
      throw new Error(
        "Contract not deployed. Please deploy your trading_bot contract to Aptos testnet and update MODULE_ADDRESS in constants.ts"
      );
    }
  }

  async createBot(
    params: CreateBotParams,
    signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>
  ): Promise<ContractResponse<{ bot_id: number }>> {
    try {
      this.validateModuleAddress();

      const transaction: InputTransactionData = {
        data: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.CREATE_BOT}`,
          functionArguments: [
            params.name,
            params.strategy,
            params.initial_balance.toString(),
            params.max_position_size.toString(),
            params.stop_loss_percent.toString(),
            params.max_trades_per_day.toString(),
            params.max_daily_loss.toString(),
          ],
        },
      };

      console.log("Submitting transaction:", transaction);
      const response = await signAndSubmitTransaction(transaction);
      console.log("Transaction response:", response);
      
      // Wait for transaction to be processed
      if (response.hash) {
        console.log("Waiting for transaction:", response.hash);
        const txResult = await aptosClient().waitForTransaction({
          transactionHash: response.hash,
        });
        console.log("Transaction confirmed:", txResult);
      }

      console.log("Bot creation successful, returning success response");
      const successResponse = {
        success: true,
        data: { bot_id: Date.now() }, // Simplified - in real implementation, extract from events
      };
      console.log("Success response:", successResponse);
      return successResponse;
    } catch (error) {
      console.error("Create bot error:", error);
      const errorResponse = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create bot",
      };
      console.log("Error response:", errorResponse);
      return errorResponse;
    }
  }

  async getUserBots(userAddress: string): Promise<ContractResponse<TradingBotData[]>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      console.log("Getting all user bots for address:", userAddress);
      console.log("Module address:", this.moduleAddress);

      // Get all user bots
      const botsResponse = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_USER_BOTS}`,
          functionArguments: [userAddress],
        },
      });

      console.log("User bots response:", botsResponse);

      if (!botsResponse || !botsResponse[0]) {
        console.log("No bots found for user");
        return {
          success: true,
          data: [], // Return empty array instead of error
        };
      }

      const botsData = botsResponse[0] as any[];
      const bots: TradingBotData[] = botsData.map((bot, index) => ({
        owner: userAddress,
        bot_id: index,
        name: bot.name || `Bot ${index + 1}`,
        strategy: bot.strategy || "No strategy defined",
        balance: Number(bot.balance) || 0,
        performance: Number(bot.net_performance) || 0,
        total_loss: Number(bot.total_loss) || 0,
        active: Boolean(bot.active),
        total_trades: Number(bot.total_trades) || 0,
        created_at: Number(bot.created_at) || Date.now(),
      }));

      console.log("Parsed bot data:", bots);

      return {
        success: true,
        data: bots,
      };
    } catch (error) {
      console.error("Error in getUserBots:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user bots",
      };
    }
  }

  async getUserBot(userAddress: string): Promise<ContractResponse<TradingBotData>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();
      
      console.log("Checking if user has bot for address:", userAddress);
      console.log("Module address:", this.moduleAddress);
      
      // Check if user has a bot
      const hasBotResponse = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.HAS_BOT}`,
          functionArguments: [userAddress],
        },
      });

      console.log("Has bot response:", hasBotResponse);

      if (!hasBotResponse[0]) {
        console.log("No bot found for user");
        return {
          success: false,
          error: "No bot found for this user",
        };
      }

      console.log("Bot found, fetching bot data...");
      
      // Get bot data
      const botResponse = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_BOT}`,
          functionArguments: [userAddress],
        },
      });

      console.log("Bot data response:", botResponse);

      const [owner, name, strategy, balance, performance, total_loss, active, total_trades, created_at] = botResponse;

      const botData = {
        owner: owner as string,
        bot_id: Date.now(), // Simplified
        name: name as string,
        strategy: strategy as string,
        balance: balance as number,
        performance: performance as number,
        total_loss: total_loss as number,
        active: active as boolean,
        total_trades: total_trades as number,
        created_at: created_at as number,
      };

      console.log("Parsed bot data:", botData);

      return {
        success: true,
        data: botData,
      };
    } catch (error) {
      console.error("Error in getUserBot:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch bot data",
      };
    }
  }

  async getLeaderboard(): Promise<ContractResponse<BotPerformanceData[]>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();
      
      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_LEADERBOARD}`,
          functionArguments: [],
        },
      });

      console.log("Raw leaderboard response:", response);
      const leaderboardData = response[0] as any[];
      
      if (!Array.isArray(leaderboardData)) {
        console.log("Leaderboard data is not an array, returning empty array");
        return {
          success: true,
          data: [],
        };
      }
      
      const leaderboard: BotPerformanceData[] = leaderboardData.map((entry) => ({
        bot_id: entry.bot_id,
        owner: entry.owner,
        name: entry.name,
        net_performance: entry.net_performance,
        total_trades: entry.total_trades,
        win_rate: entry.win_rate,
      }));

      return {
        success: true,
        data: leaderboard,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch leaderboard",
      };
    }
  }

  async getRegistryStats(): Promise<ContractResponse<RegistryStats>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();
      
      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_REGISTRY_STATS}`,
          functionArguments: [],
        },
      });

      const [total_bots, total_volume] = response;

      return {
        success: true,
        data: {
          total_bots: total_bots as number,
          total_volume: total_volume as number,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch registry stats",
      };
    }
  }

  async hasBot(userAddress: string): Promise<ContractResponse<boolean>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.HAS_BOT}`,
          functionArguments: [userAddress],
        },
      });

      return {
        success: true,
        data: response[0] as boolean,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to check bot existence",
      };
    }
  }

  // Subscription related methods
  async purchaseSubscription(
    params: PurchaseSubscriptionParams,
    signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>
  ): Promise<ContractResponse<{ success: boolean }>> {
    try {
      this.validateModuleAddress();

      const transaction: InputTransactionData = {
        data: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.PURCHASE_SUBSCRIPTION}`,
          functionArguments: [
            params.tier.toString(),
          ],
        },
      };

      console.log("Submitting subscription purchase transaction:", transaction);
      const response = await signAndSubmitTransaction(transaction);
      console.log("Subscription purchase response:", response);

      // Wait for transaction to be processed
      if (response.hash) {
        console.log("Waiting for subscription transaction:", response.hash);
        const txResult = await aptosClient().waitForTransaction({
          transactionHash: response.hash,
        });
        console.log("Subscription transaction confirmed:", txResult);
      }

      return {
        success: true,
        data: { success: true },
      };
    } catch (error) {
      console.error("Purchase subscription error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to purchase subscription",
      };
    }
  }

  async getUserSubscription(userAddress: string): Promise<ContractResponse<UserSubscription>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_USER_SUBSCRIPTION}`,
          functionArguments: [userAddress],
        },
      });

      const [tier, expires_at, auto_renew] = response;

      return {
        success: true,
        data: {
          tier: tier as SubscriptionTier,
          expires_at: expires_at as number,
          auto_renew: auto_renew as boolean,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user subscription",
      };
    }
  }

  async getCurrentSubscriptionTier(userAddress: string): Promise<ContractResponse<SubscriptionTier>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_CURRENT_SUBSCRIPTION_TIER}`,
          functionArguments: [userAddress],
        },
      });

      return {
        success: true,
        data: response[0] as SubscriptionTier,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch subscription tier",
      };
    }
  }

  async getUserMaxBots(userAddress: string): Promise<ContractResponse<number>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_USER_MAX_BOTS}`,
          functionArguments: [userAddress],
        },
      });

      return {
        success: true,
        data: response[0] as number,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user bot limit",
      };
    }
  }

  async getUserBotCount(userAddress: string): Promise<ContractResponse<number>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_USER_BOT_COUNT}`,
          functionArguments: [userAddress],
        },
      });

      return {
        success: true,
        data: response[0] as number,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user bot count",
      };
    }
  }

  async getSubscriptionPrices(): Promise<ContractResponse<SubscriptionPrices>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::${ContractFunction.GET_SUBSCRIPTION_PRICES}`,
          functionArguments: [],
        },
      });

      const [basic_price, premium_price] = response;

      return {
        success: true,
        data: {
          basic_price: basic_price as number,
          premium_price: premium_price as number,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch subscription prices",
      };
    }
  }

  async getBotUSDCBalance(botOwner: string, botId: string): Promise<ContractResponse<number>> {
    try {
      this.validateModuleAddress();
      const client = aptosClient();

      const response = await client.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::get_bot_usdc_balance`,
          functionArguments: [botOwner, botId],
        },
      });

      return {
        success: true,
        data: response[0] as number,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch bot USDC balance",
      };
    }
  }
}

export const contractService = new ContractService();