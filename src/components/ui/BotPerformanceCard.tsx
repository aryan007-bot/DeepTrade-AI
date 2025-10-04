import { Card, CardContent } from "@/components/ui/card";
import { TradingBotData } from "@/types/contract";
import { formatBalance, formatTimestamp } from "@/utils/formatters";
import { StatusBadge } from "./StatusBadge";

interface BotPerformanceCardProps {
  bot: TradingBotData;
  onViewDetails?: (botId: number) => void;
  onToggleStatus?: (botId: number, currentStatus: boolean) => void;
}

export function BotPerformanceCard({ 
  bot
}: BotPerformanceCardProps) {
  const netPerformance = bot.performance - bot.total_loss;
  const balanceUSD = parseFloat(formatBalance(bot.balance));
  const performanceUSD = netPerformance / 1000000;
  const winRate = bot.total_trades > 0 ? Math.round((bot.performance / (bot.performance + bot.total_loss)) * 100) : 0;

  return (
    <Card className="border-gray-700 hover:border-[#00d2ce] transition-all duration-200 transform hover:scale-[1.02]">
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
          <StatusBadge status={bot.active} />
        </div>

        {/* Strategy */}
        <p className="text-sm text-gray-400">{bot.strategy}</p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Balance</p>
            <p className="font-medium text-white">${balanceUSD.toFixed(3)}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">P&L</p>
            <p className={`font-medium ${performanceUSD >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {performanceUSD >= 0 ? '+' : ''}{performanceUSD.toFixed(3)} USDC
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Trades</p>
            <p className="font-medium text-white">{bot.total_trades}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className="font-medium text-white">{winRate}%</p>
          </div>
        </div>

        {/* Created Date */}
        <p className="text-xs text-gray-500">
          Created: {formatTimestamp(bot.created_at)}
        </p>
      </CardContent>
    </Card>
  );
}