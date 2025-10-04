"use client";

import { WalletSelector } from "./WalletSelector";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export function DashboardHeader() {
  const { connected } = useWallet();

  return (
    <header className="h-16 bg-[#051419] border-b border-gray-700 px-6 flex items-center justify-between">
      {/* Logo and Title */}
      <div className="flex-shrink-0">
        <span className="text-[#00d2cee6] text-2xl font-bold">DeepTrade AI</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {connected && (
          <>
            {/* Search */}
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
              <Search size={20} />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
              <Settings size={20} />
            </Button>
          </>
        )}

        {/* Wallet Selector */}
        <WalletSelector />
      </div>
    </header>
  );
}
