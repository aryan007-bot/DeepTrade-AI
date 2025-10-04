import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  const router = useRouter();
  const [strategyText, setStrategyText] = useState('');

  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-[#051419] p-8 md:p-12 shadow-2xl">
      {/* Background Effect: Subtle Gradient Orb */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00d2ce10] to-[#00d2ce05] opacity-50 blur-3xl" />

      <div className="relative max-w-7xl mx-auto md:flex items-center justify-between gap-8">
        {/* Left Section: Text and CTA */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
            DeepTrade
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ce] to-[#00a8a8]">
              +AI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 mb-6 max-w-md leading-relaxed">
            The world's first platform that lets you create autonomous trading bots using plain English. No coding required - just describe your strategy and watch it trade 24/7 on the blockchain.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-[#00d2ce] text-sm">
              ✅ <span className="text-neutral-300">Ultra-low costs (~$0.01)</span>
            </div>
            <div className="flex items-center gap-2 text-[#00d2ce] text-sm">
              ✅ <span className="text-neutral-300">Your funds stay safe</span>
            </div>
            <div className="flex items-center gap-2 text-[#00d2ce] text-sm">
              ✅ <span className="text-neutral-300">24/7 autonomous trading</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] hover:from-[#00a8a8] hover:to-[#007a7a] px-6 py-3 rounded-xl font-medium text-white shadow-lg transition-transform duration-300 transform hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-[#00d2ce] focus:ring-offset-2 focus:ring-offset-neutral-900"
              aria-label="Create your first trading bot"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Bot
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border border-neutral-600 hover:bg-neutral-700/50 px-6 py-3 rounded-xl font-medium text-white transition-transform duration-300 transform hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-[#00d2ce] focus:ring-offset-2 focus:ring-offset-neutral-900"
              aria-label="Watch demo video"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Right Section: Interactive Strategy Card */}
        <div className="md:w-5/12">
          <Card className="bg-[rgba(5,20,25,0.7)] backdrop-blur-lg border border-neutral-700/50 shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.02] focus-within:scale-[1.02]">
            <CardHeader className="flex items-center justify-between p-6">
              <CardTitle className="text-lg font-semibold text-white">Craft Your Trading Strategy</CardTitle>
              <Badge className="bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] text-xs font-medium">AI-Powered</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <textarea
                value={strategyText}
                onChange={(e) => setStrategyText(e.target.value)}
                className="w-full h-36 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-4 text-sm text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00d2ce] transition-all duration-300 resize-none"
                placeholder="Describe your trading strategy in natural language, e.g., 'Buy when RSI is below 30 and sell when above 70.'"
                aria-label="Trading strategy input"
              />
              <Button
                className="w-full bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] hover:from-[#00a8a8] hover:to-[#007a7a] rounded-xl py-3 font-medium text-white transition-transform duration-300 transform hover:scale-[1.02] focus:scale-[1.02] focus:ring-2 focus:ring-[#00d2ce] focus:ring-offset-2 focus:ring-offset-neutral-900"
                aria-label="Generate trading strategy"
              >
                Generate Strategy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Particles for Visual Flair */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-1 h-1 bg-[#00d2ce] rounded-full absolute top-10 left-20 animate-pulse" />
        <div className="w-2 h-2 bg-[#00d2ce] rounded-full absolute bottom-20 right-40 animate-pulse delay-200" />
        <div className="w-1.5 h-1.5 bg-[#00a8a8] rounded-full absolute top-40 right-20 animate-pulse delay-400" />
      </div>
    </div>
  );
};

export default HeroSection;