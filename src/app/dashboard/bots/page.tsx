"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { UserBots } from "@/components/UserBots";
import { TradingBotCreator } from "@/components/TradingBotCreator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BotsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Trading Bots</h1>
          <p className="text-gray-400">
            Manage your AI-powered trading bots and create new ones.
          </p>
        </div>

        <Tabs defaultValue="my-bots" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="my-bots" className="data-[state=active]:bg-blue-600">
              My Bots
            </TabsTrigger>
            <TabsTrigger value="create-bot" className="data-[state=active]:bg-blue-600">
              Create New Bot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-bots" className="mt-6">
            <UserBots />
          </TabsContent>

          <TabsContent value="create-bot" className="mt-6">
            <TradingBotCreator />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}