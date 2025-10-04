import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { TradingBotCreator } from './components/TradingBotCreator';
import { UserBots } from './components/UserBots';
import { Leaderboard } from './components/Leaderboard';
import { Toaster } from './components/ui/toaster';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <div className="min-h-screen bg-[#051419] text-white">
      <QueryClientProvider client={queryClient}>
        <AptosWalletAdapterProvider autoConnect={false}>
          <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">
                  DeepTrade AI - Trading Bot Integration
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Integrated with Aptos blockchain for automated trading bot creation and management
                </p>
              </div>

              {/* Bot Creation */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Create Trading Bot
                </h2>
                <TradingBotCreator />
              </div>

              {/* User Bots */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  My Trading Bots
                </h2>
                <UserBots />
              </div>

              {/* Leaderboard */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">
                  Global Leaderboard
                </h2>
                <Leaderboard />
              </div>
            </div>
          </div>
          <Toaster />
        </AptosWalletAdapterProvider>
      </QueryClientProvider>
      
      {/* Debug Toast Test Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => {
            console.log("Test toast button clicked");
            // This will help test if the toast system is working
            const testToast = document.createElement('div');
            testToast.innerHTML = 'Toast system test!';
            testToast.style.cssText = 'position:fixed;top:20px;right:20px;background:green;color:white;padding:10px;border-radius:5px;z-index:9999';
            document.body.appendChild(testToast);
            setTimeout(() => document.body.removeChild(testToast), 3000);
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Test Toast
        </button>
      </div>
    </div>
  );
}

export default App;