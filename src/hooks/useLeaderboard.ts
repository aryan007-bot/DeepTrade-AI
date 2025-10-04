/**
 * Custom hook for leaderboard data management
 */

import { useState, useEffect, useCallback } from 'react';
import { LeaderboardService, type BotPerformance, type LeaderboardStats, type LeaderboardFilters } from '@/services/leaderboardService';

export interface UseLeaderboardReturn {
  bots: BotPerformance[];
  stats: LeaderboardStats | null;
  filters: LeaderboardFilters;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (newFilters: Partial<LeaderboardFilters>) => void;
  getUserBots: (userAddress: string) => Promise<BotPerformance[]>;
}

export function useLeaderboard(initialFilters?: Partial<LeaderboardFilters>): UseLeaderboardReturn {
  const [leaderboardService] = useState(() => new LeaderboardService());
  const [bots, setBots] = useState<BotPerformance[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: 'all_time',
    sortBy: 'net_performance',
    minTrades: 0,
    onlyActive: false,
    ...initialFilters,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await leaderboardService.getLeaderboard(filters);
      setBots(data.bots);
      setStats(data.stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leaderboard';
      setError(errorMessage);
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [leaderboardService, filters]);

  const updateFilters = useCallback((newFilters: Partial<LeaderboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getUserBots = useCallback(async (userAddress: string): Promise<BotPerformance[]> => {
    try {
      return await leaderboardService.getUserBotRankings(userAddress);
    } catch (error) {
      console.error('Error fetching user bots:', error);
      return [];
    }
  }, [leaderboardService]);

  // Fetch data when filters change
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return {
    bots,
    stats,
    filters,
    loading,
    error,
    refetch: fetchLeaderboard,
    updateFilters,
    getUserBots,
  };
}

/**
 * Hook for real-time leaderboard updates
 */
export function useRealtimeLeaderboard(filters?: Partial<LeaderboardFilters>) {
  const leaderboard = useLeaderboard(filters);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // More frequent updates for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      leaderboard.refetch();
      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [leaderboard.refetch]);

  return {
    ...leaderboard,
    lastUpdate,
  };
}

/**
 * Hook for user-specific bot performance
 */
export function useUserBotPerformance(userAddress?: string) {
  const [userBots, setUserBots] = useState<BotPerformance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardService] = useState(() => new LeaderboardService());

  const fetchUserBots = useCallback(async () => {
    if (!userAddress) return;

    try {
      setLoading(true);
      setError(null);

      const bots = await leaderboardService.getUserBotRankings(userAddress);
      setUserBots(bots);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user bots';
      setError(errorMessage);
      console.error('User bots fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [leaderboardService, userAddress]);

  useEffect(() => {
    fetchUserBots();
  }, [fetchUserBots]);

  // Auto-refresh user bots every 30 seconds
  useEffect(() => {
    if (!userAddress) return;

    const interval = setInterval(fetchUserBots, 30000);
    return () => clearInterval(interval);
  }, [fetchUserBots, userAddress]);

  return {
    userBots,
    loading,
    error,
    refetch: fetchUserBots,
    topUserBot: userBots.length > 0 ? userBots[0] : null,
    userRank: userBots.length > 0 ? userBots[0].ranking : null,
  };
}