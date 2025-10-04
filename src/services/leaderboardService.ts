/**
 * Leaderboard Service
 * Fetches and ranks all trading bots by performance FROM REAL BLOCKCHAIN DATA ONLY
 */

import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { MODULE_ADDRESS, NETWORK } from "@/constants";

export interface BotPerformance {
  bot_id: string;
  owner: string;
  name: string;
  net_performance: number; // Profit - Loss in micro USDC
  total_trades: number;
  win_rate: number; // Percentage 0-100
  profit: number;
  loss: number;
  created_at: number;
  last_trade_at: number;
  daily_trades: number;
  strategy: string;
  roi_percentage: number; // Return on Investment
  ranking: number;
}

export interface LeaderboardStats {
  total_bots: number;
  total_volume: number;
  active_bots: number;
  top_performer: BotPerformance | null;
  worst_performer: BotPerformance | null;
  average_roi: number;
  total_trades_today: number;
}

export interface LeaderboardFilters {
  timeframe: 'all_time' | '24h' | '7d' | '30d';
  sortBy: 'net_performance' | 'roi_percentage' | 'win_rate' | 'total_trades';
  minTrades: number;
  onlyActive: boolean;
}

export class LeaderboardService {
  private aptos: Aptos;
  private moduleAddress: string;

  constructor() {
    console.log('🚀 LeaderboardService: Initializing with MODULE_ADDRESS:', MODULE_ADDRESS);
    const config = new AptosConfig({ network: NETWORK });
    this.aptos = new Aptos(config);
    this.moduleAddress = MODULE_ADDRESS;

    if (!this.moduleAddress) {
      console.error('❌ LeaderboardService: MODULE_ADDRESS is not configured!');
      throw new Error('MODULE_ADDRESS is required');
    }
  }

  /**
   * Get comprehensive leaderboard data - REAL DATA ONLY
   */
  async getLeaderboard(filters: Partial<LeaderboardFilters> = {}): Promise<{
    bots: BotPerformance[];
    stats: LeaderboardStats;
    filters: LeaderboardFilters;
  }> {
    try {
      const defaultFilters: LeaderboardFilters = {
        timeframe: 'all_time',
        sortBy: 'net_performance',
        minTrades: 0,
        onlyActive: false,
        ...filters,
      };

      console.log('🔍 LeaderboardService: Fetching leaderboard data from blockchain...');

      // Get global leaderboard from smart contract
      const [globalLeaderboard, registryStats] = await Promise.all([
        this.getGlobalLeaderboard(),
        this.getRegistryStats(),
      ]);

      // Get detailed bot data for each bot in leaderboard
      const detailedBots = await this.enrichBotsWithDetails(globalLeaderboard);

      // Apply filters and sorting
      const filteredBots = this.applyFilters(detailedBots, defaultFilters);
      const sortedBots = this.sortBots(filteredBots, defaultFilters.sortBy);

      // Add rankings
      const rankedBots = sortedBots.map((bot, index) => ({
        ...bot,
        ranking: index + 1,
      }));

      // Calculate stats
      const stats = this.calculateLeaderboardStats(rankedBots, registryStats);

      console.log(`✅ Leaderboard loaded: ${rankedBots.length} bots`);

      return {
        bots: rankedBots,
        stats,
        filters: defaultFilters,
      };
    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      throw new Error(`Failed to fetch leaderboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get global leaderboard from smart contract
   */
  private async getGlobalLeaderboard(): Promise<any[]> {
    try {
      console.log('🔗 Calling get_leaderboard on contract...');
      const response = await this.aptos.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::get_leaderboard`,
          functionArguments: [],
        },
      });

      console.log('📊 Smart contract leaderboard response:', response);
      return response[0] as any[] || [];
    } catch (error) {
      console.error('❌ Error fetching global leaderboard:', error);
      console.log('🔧 This could mean:');
      console.log('   - Contract not deployed at this address');
      console.log('   - get_leaderboard function does not exist');
      console.log('   - Network mismatch');
      console.log('   - Contract has no bots yet');
      return [];
    }
  }

  /**
   * Get registry statistics
   */
  private async getRegistryStats(): Promise<{ total_bots: number; total_volume: number }> {
    try {
      console.log('📊 Calling get_registry_stats on contract...');
      const response = await this.aptos.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::get_registry_stats`,
          functionArguments: [],
        },
      });

      console.log('📈 Registry stats response:', response);
      return {
        total_bots: Number(response[0] || 0),
        total_volume: Number(response[1] || 0),
      };
    } catch (error) {
      console.error('❌ Error fetching registry stats:', error);
      return { total_bots: 0, total_volume: 0 };
    }
  }

  /**
   * Enrich basic leaderboard data with detailed bot information
   */
  private async enrichBotsWithDetails(leaderboardData: any[]): Promise<BotPerformance[]> {
    const enrichedBots: BotPerformance[] = [];

    console.log(`🔍 Enriching ${leaderboardData.length} bots with details...`);

    for (const entry of leaderboardData) {
      try {
        console.log('🤖 Processing bot entry:', entry);

        // Get detailed bot information
        const botDetails = await this.getBotDetails(entry.owner, entry.bot_id);

        if (botDetails) {
          const performance: BotPerformance = {
            bot_id: entry.bot_id?.toString() || '',
            owner: entry.owner || '',
            name: entry.name || `Bot ${entry.bot_id}`,
            net_performance: Number(entry.net_performance || 0),
            total_trades: Number(entry.total_trades || 0),
            win_rate: Number(entry.win_rate || 0),
            profit: Number(botDetails.performance || 0),
            loss: Number(botDetails.total_loss || 0),
            created_at: Number(botDetails.created_at || 0),
            last_trade_at: Number(botDetails.last_trade_at || 0),
            daily_trades: Number(botDetails.daily_trades || 0),
            strategy: botDetails.strategy || 'Unknown Strategy',
            roi_percentage: this.calculateROI(
              Number(botDetails.performance || 0),
              Number(botDetails.total_loss || 0),
              Number(botDetails.balance || 1000000) // Default 1 USDC if no balance
            ),
            ranking: 0, // Will be set later
          };

          console.log('✅ Enriched bot:', performance);
          enrichedBots.push(performance);
        } else {
          console.log('⚠️ Could not get bot details, using basic data');
          // Add basic entry even if enrichment fails
          enrichedBots.push({
            bot_id: entry.bot_id?.toString() || '',
            owner: entry.owner || '',
            name: entry.name || `Bot ${entry.bot_id}`,
            net_performance: Number(entry.net_performance || 0),
            total_trades: Number(entry.total_trades || 0),
            win_rate: Number(entry.win_rate || 0),
            profit: 0,
            loss: 0,
            created_at: 0,
            last_trade_at: 0,
            daily_trades: 0,
            strategy: 'Unknown Strategy',
            roi_percentage: 0,
            ranking: 0,
          });
        }
      } catch (error) {
        console.error(`❌ Error enriching bot ${entry.bot_id}:`, error);
      }
    }

    console.log(`✅ Enriched ${enrichedBots.length} bots total`);
    return enrichedBots;
  }

  /**
   * Get detailed bot information
   */
  private async getBotDetails(owner: string, botId: string): Promise<any> {
    try {
      console.log(`🔍 Getting details for bot ${botId} owned by ${owner}`);
      const response = await this.aptos.view({
        payload: {
          function: `${this.moduleAddress}::trading_bot::get_bot`,
          functionArguments: [owner, botId],
        },
      });

      console.log(`📊 Bot details response for ${botId}:`, response);

      if (response && response.length >= 9) {
        return {
          owner: response[0],
          name: response[1],
          strategy: response[2],
          balance: response[3],
          performance: response[4],
          total_loss: response[5],
          active: response[6],
          total_trades: response[7],
          created_at: response[8],
          last_trade_at: response[9] || 0,
          daily_trades: response[10] || 0,
        };
      }

      return null;
    } catch (error) {
      console.error(`❌ Error fetching bot details for ${botId}:`, error);
      return null;
    }
  }

  /**
   * Apply filters to bot list
   */
  private applyFilters(bots: BotPerformance[], filters: LeaderboardFilters): BotPerformance[] {
    let filtered = [...bots];

    // Filter by minimum trades
    if (filters.minTrades > 0) {
      filtered = filtered.filter(bot => bot.total_trades >= filters.minTrades);
    }

    // Filter by timeframe
    if (filters.timeframe !== 'all_time') {
      const now = Date.now() / 1000; // Convert to seconds
      const timeframes = {
        '24h': 24 * 60 * 60,
        '7d': 7 * 24 * 60 * 60,
        '30d': 30 * 24 * 60 * 60,
      };

      const cutoff = now - timeframes[filters.timeframe];
      filtered = filtered.filter(bot => bot.last_trade_at >= cutoff);
    }

    // Filter active bots only
    if (filters.onlyActive) {
      const oneDayAgo = (Date.now() / 1000) - (24 * 60 * 60);
      filtered = filtered.filter(bot => bot.last_trade_at >= oneDayAgo);
    }

    return filtered;
  }

  /**
   * Sort bots by specified criteria
   */
  private sortBots(bots: BotPerformance[], sortBy: LeaderboardFilters['sortBy']): BotPerformance[] {
    return [...bots].sort((a, b) => {
      switch (sortBy) {
        case 'net_performance':
          return b.net_performance - a.net_performance;
        case 'roi_percentage':
          return b.roi_percentage - a.roi_percentage;
        case 'win_rate':
          return b.win_rate - a.win_rate;
        case 'total_trades':
          return b.total_trades - a.total_trades;
        default:
          return b.net_performance - a.net_performance;
      }
    });
  }

  /**
   * Calculate Return on Investment percentage
   */
  private calculateROI(profit: number, loss: number, initialBalance: number): number {
    const netProfit = profit - loss;
    const balanceInUsdc = initialBalance / 1000000; // Convert from micro USDC
    return balanceInUsdc > 0 ? (netProfit / balanceInUsdc) * 100 : 0;
  }

  /**
   * Calculate leaderboard statistics
   */
  private calculateLeaderboardStats(
    bots: BotPerformance[],
    registryStats: { total_bots: number; total_volume: number }
  ): LeaderboardStats {
    const now = Date.now() / 1000;
    const oneDayAgo = now - (24 * 60 * 60);

    const activeBots = bots.filter(bot => bot.last_trade_at >= oneDayAgo).length;
    const totalTradesAfterToday = bots
      .filter(bot => bot.last_trade_at >= oneDayAgo)
      .reduce((sum, bot) => sum + bot.daily_trades, 0);

    const rois = bots.filter(bot => bot.roi_percentage !== 0).map(bot => bot.roi_percentage);
    const averageRoi = rois.length > 0 ? rois.reduce((a, b) => a + b, 0) / rois.length : 0;

    const topPerformer = bots.length > 0 ? bots[0] : null;
    const worstPerformer = bots.length > 0 ? bots[bots.length - 1] : null;

    return {
      total_bots: registryStats.total_bots,
      total_volume: registryStats.total_volume,
      active_bots: activeBots,
      top_performer: topPerformer,
      worst_performer: worstPerformer,
      average_roi: averageRoi,
      total_trades_today: totalTradesAfterToday,
    };
  }

  /**
   * Get user's bot rankings
   */
  async getUserBotRankings(userAddress: string): Promise<BotPerformance[]> {
    try {
      console.log(`🔍 Getting bot rankings for user: ${userAddress}`);
      const allBots = await this.getLeaderboard();
      const userBots = allBots.bots.filter(bot => bot.owner.toLowerCase() === userAddress.toLowerCase());
      console.log(`👤 Found ${userBots.length} bots for user ${userAddress}`);
      return userBots;
    } catch (error) {
      console.error('❌ Error fetching user bot rankings:', error);
      return [];
    }
  }
}