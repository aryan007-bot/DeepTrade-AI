"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroSection from "@/components/HeroSection";

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#051419] text-white font-sans">
            {/* Navigation */}
            <nav className="border-b border-neutral-700 sticky top-0 z-50">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex bg-[#051419] items-center justify-between h-16">
                        <div className="flex  items-center">
                            <div className="flex-shrink-0">
                                <span className="text-[#00d2cee6]  text-2xl font-bold">DeepTrade AI</span>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600/30 transition-all duration-200">
                                        Dashboard
                                    </a>
                                    <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-blue-600/30 transition-all duration-200">
                                        Create Bot
                                    </a>
                                    <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-blue-600/30 transition-all duration-200">
                                        Leaderboard
                                    </a>
                                    <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-blue-600/30 transition-all duration-200">
                                        Cross-Chain
                                    </a>
                                    <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-white hover:bg-blue-600/30 transition-all duration-200">
                                        Analytics
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    className="mr-3 bg-[#00d2cee6] hover:bg-[#00d2cee6] px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                >
                                    Connect Wallet
                                </Button>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <Button variant="ghost" size="sm">
                                <span className="sr-only">Menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <HeroSection />

                {/* New Features Banner */}
                <div className="mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded-xl p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-blue-500 text-white">NEW</Badge>
                            <span className="text-white font-semibold">Circle USDC Integration Live!</span>
                            <span className="text-gray-100 text-sm">Deposit & withdraw native USDC on Aptos</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/dashboard')}
                            className="border-[#00d2ce] text-[#00d2ce] hover:bg-[#00d2ce]/20 hover:text-white"
                        >
                            Try It Now →
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    <Card className="bg-[#051419] border border-neutral-700 transform hover:scale-[1.02] transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">Circle USDC</h3>
                                <svg className="w-6 h-6 text-[#00d2cee6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold mt-2 text-white">Native</p>
                            <div className="flex items-center mt-2 text-blue-500 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Official Circle integration</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#051419] border border-neutral-700 transform hover:scale-[1.02] transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">Total Volume</h3>
                                <svg className="w-6 h-6 text-[#00d2cee6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold mt-2 text-white">$0</p>
                            <div className="flex items-center mt-2 text-blue-500 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span>Bots waiting to trade</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#051419] border border-neutral-700 transform hover:scale-[1.02] transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">Active Trades</h3>
                                <svg className="w-6 h-6 text-[#00d2cee6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold mt-2 text-white">0</p>
                            <div className="flex items-center mt-2 text-gray-300 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                                </svg>
                                <span>Ready to execute</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#051419] border border-neutral-700 transform hover:scale-[1.02] transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">Deployment Cost</h3>
                                <svg className="w-6 h-6 text-[#00d2cee6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <p className="text-3xl font-bold mt-2 text-white">~$0.01</p>
                            <div className="flex items-center mt-2 text-blue-500 text-sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span>Low Aptos gas fees</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* How DeepTrade AI Works Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How DeepTrade AI Works</h2>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            Understand our revolutionary autonomous trading system that lets you create, deploy, and profit from AI-powered trading bots using simple natural language.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Step 1: Create Bot */}
                        <Card className="bg-[#051419] border border-neutral-700 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center text-black font-bold">1</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Describe Your Strategy</h3>
                                    <p className="text-gray-300 mb-4">
                                        Use natural language to describe your trading strategy. No coding required! Our AI understands plain English.
                                    </p>
                                    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                                        <p className="text-sm text-[#00d2ce] font-mono">
                                            "Buy APT when RSI drops below 30 and sell when RSI goes above 70"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Step 2: AI Processing */}
                        <Card className="bg-[#051419] border border-neutral-700 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center text-black font-bold">2</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-white">AI Converts to Logic</h3>
                                    <p className="text-gray-300 mb-4">
                                        Our GPT-powered AI parser converts your strategy into executable trading logic with technical indicators.
                                    </p>
                                    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                                        <p className="text-xs text-gray-200">
                                            ✅ RSI indicator configured<br/>
                                            ✅ Buy/sell thresholds set<br/>
                                            ✅ Risk management applied
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Step 3: Deploy On-Chain */}
                        <Card className="bg-[#051419] border border-neutral-700 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center text-black font-bold">3</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Deploy to Blockchain</h3>
                                    <p className="text-gray-300 mb-4">
                                        Your bot is deployed as a smart contract on Aptos blockchain. All trading happens on-chain with full transparency.
                                    </p>
                                    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                                        <p className="text-xs text-green-400">
                                            🔗 On-chain deployment<br/>
                                            🔒 Funds never leave your wallet<br/>
                                            👁️ 100% transparent execution
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Step 4: Autonomous Trading */}
                        <Card className="bg-[#051419] border border-neutral-700 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center text-black font-bold">4</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Trade Autonomously 24/7</h3>
                                    <p className="text-gray-300 mb-4">
                                        Your bot monitors markets continuously and executes trades automatically when conditions match your strategy.
                                    </p>
                                    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
                                        <p className="text-xs text-blue-400">
                                            ⚡ Real-time market monitoring<br/>
                                            🤖 Automatic trade execution<br/>
                                            📊 Live performance tracking
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Key Benefits */}
                    <div className="bg-gradient-to-r from-[#00d2ce10] to-[#00a8a810] rounded-2xl p-8 border border-neutral-700">
                        <h3 className="text-2xl font-bold mb-6 text-center">Why Choose DeepTrade AI?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#00d2ce] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-bold mb-2">Ultra-Low Costs</h4>
                                <p className="text-gray-300 text-sm">
                                    Deploy bots for ~$0.01 on Aptos. Extremely low transaction costs compared to Ethereum or other chains.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#00d2ce] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-bold mb-2">Your Funds Stay Safe</h4>
                                <p className="text-gray-300 text-sm">
                                    Funds never leave your wallet. Bots trade using your balance but can't access your private keys.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#00d2ce] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-bold mb-2">Compete & Earn</h4>
                                <p className="text-gray-300 text-sm">
                                    Join real-time competitions and earn rewards based on your bot's performance in the leaderboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Circle USDC Features Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h2 className="text-3xl font-bold">Powered by Circle USDC</h2>
                            <Badge className="bg-blue-500 text-white">NEW</Badge>
                        </div>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            DeepTrade AI integrates Circle's native USDC on Aptos for seamless deposits, withdrawals, and cross-chain transfers via CCTP.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* USDC Deposits & Withdrawals */}
                        <Card className="bg-[#0a1929] border border-blue-500/40 p-6 hover:border-blue-500/60 transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 text-white">Real USDC Deposits</h3>
                                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                        Fund your trading bots with Circle's native USDC. Deposit and withdraw anytime with instant on-chain settlements.
                                    </p>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Native USDC on Aptos blockchain
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Instant deposits to bot wallets
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Withdraw profits anytime
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Real-time balance tracking
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        {/* Cross-Chain CCTP */}
                        <Card className="bg-[#0a1929] border border-purple-500/40 p-6 hover:border-purple-500/60 transition-all duration-300">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 text-white">Circle CCTP Bridge</h3>
                                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                        Bridge USDC from Ethereum, Base, Arbitrum, and other chains to Aptos using Circle's Cross-Chain Transfer Protocol.
                                    </p>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Bridge from 7+ major chains
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Native USDC (not wrapped tokens)
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            ~15 minute transfer time
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-200">
                                            <svg className="w-4 h-4 text-[#00d2ce] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Secure & trustless bridging
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-neutral-800/50 px-6 py-3 rounded-full border border-neutral-700">
                            <span className="text-sm text-gray-200">Supported Chains:</span>
                            <Badge variant="outline" className="text-xs text-white">Ethereum</Badge>
                            <Badge variant="outline" className="text-xs text-white">Base</Badge>
                            <Badge variant="outline" className="text-xs text-white">Arbitrum</Badge>
                            <Badge variant="outline" className="text-xs text-white">Optimism</Badge>
                            <Badge variant="outline" className="text-xs text-white">Polygon</Badge>
                            <Badge variant="outline" className="text-xs text-white">+more</Badge>
                        </div>
                    </div>
                </div>

                {/* Trading Examples Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Real Trading Strategy Examples</h2>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            See how easy it is to create profitable trading strategies with natural language. These examples show real strategies you can deploy right now.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* RSI Strategy */}
                        <Card className="bg-[#051419] border border-neutral-700 p-6 hover:border-[#00d2ce] transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">RSI Strategy</Badge>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Beginner</Badge>
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Mean Reversion</h3>
                            <div className="bg-neutral-800/50 rounded-lg p-4 mb-4 border border-neutral-700">
                                <p className="text-sm text-[#00d2ce] font-mono leading-relaxed">
                                    "Buy APT when RSI drops below 30 and sell when RSI goes above 70 with 2% stop loss"
                                </p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Strategy Type:</span>
                                    <span className="text-white">Mean Reversion</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Risk Level:</span>
                                    <span className="text-green-400">Low</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Avg. Trades/Day:</span>
                                    <span className="text-white">2-4</span>
                                </div>
                            </div>
                        </Card>

                        {/* Momentum Strategy */}
                        <Card className="bg-[#051419] border border-neutral-700 p-6 hover:border-[#00d2ce] transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">MACD Strategy</Badge>
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Intermediate</Badge>
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Momentum Following</h3>
                            <div className="bg-neutral-800/50 rounded-lg p-4 mb-4 border border-neutral-700">
                                <p className="text-sm text-[#00d2ce] font-mono leading-relaxed">
                                    "Buy when MACD crosses above signal line and volume is 50% above average, sell when MACD crosses below"
                                </p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Strategy Type:</span>
                                    <span className="text-white">Momentum</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Risk Level:</span>
                                    <span className="text-yellow-400">Medium</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Avg. Trades/Day:</span>
                                    <span className="text-white">1-3</span>
                                </div>
                            </div>
                        </Card>

                        {/* Arbitrage Strategy */}
                        <Card className="bg-[#051419] border border-neutral-700 p-6 hover:border-[#00d2ce] transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Cross-Chain</Badge>
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Advanced</Badge>
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Arbitrage Bot</h3>
                            <div className="bg-neutral-800/50 rounded-lg p-4 mb-4 border border-neutral-700">
                                <p className="text-sm text-[#00d2ce] font-mono leading-relaxed">
                                    "Find price differences for USDC between Ethereum and Aptos, execute arbitrage when profit exceeds 0.5%"
                                </p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Strategy Type:</span>
                                    <span className="text-white">Arbitrage</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Risk Level:</span>
                                    <span className="text-red-400">High</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Avg. Trades/Day:</span>
                                    <span className="text-white">5-10</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="text-center">
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] hover:from-[#00a8a8] hover:to-[#007a7a] px-8 py-3 rounded-xl font-medium text-white transition-transform duration-300 transform hover:scale-105"
                        >
                            Try These Strategies Now
                        </Button>
                    </div>
                </div>

                {/* Quick Start Guide */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Quick Start Guide</h2>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            Ready to start trading? Follow these simple steps to create your first AI-powered trading bot in under 5 minutes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Step 1 */}
                        <Card className="bg-[#051419] border border-neutral-700 text-center p-6 hover:border-[#00d2ce] transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                                1
                            </div>
                            <h3 className="text-lg font-bold mb-3">Connect Wallet</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Connect your Aptos wallet (Petra, Pontem, or Martian) to get started with the platform.
                            </p>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                30 seconds
                            </Badge>
                        </Card>

                        {/* Step 2 */}
                        <Card className="bg-[#051419] border border-neutral-700 text-center p-6 hover:border-[#00d2ce] transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                                2
                            </div>
                            <h3 className="text-lg font-bold mb-3">Fund Your Wallet</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Add USDC to your wallet for trading. Start with any amount - even $10 works for testing strategies.
                            </p>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                2 minutes
                            </Badge>
                        </Card>

                        {/* Step 3 */}
                        <Card className="bg-[#051419] border border-neutral-700 text-center p-6 hover:border-[#00d2ce] transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                                3
                            </div>
                            <h3 className="text-lg font-bold mb-3">Describe Strategy</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Write your trading strategy in plain English. Try "Buy APT when RSI &lt; 30, sell when RSI &gt; 70".
                            </p>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                1 minute
                            </Badge>
                        </Card>

                        {/* Step 4 */}
                        <Card className="bg-[#051419] border border-neutral-700 text-center p-6 hover:border-[#00d2ce] transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                                4
                            </div>
                            <h3 className="text-lg font-bold mb-3">Deploy & Trade</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Deploy your bot to the blockchain and watch it trade automatically 24/7 based on market conditions.
                            </p>
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                1 minute
                            </Badge>
                        </Card>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="bg-gradient-to-r from-[#00d2ce] to-[#00a8a8] hover:from-[#00a8a8] hover:to-[#007a7a] px-8 py-4 rounded-xl font-medium text-white text-lg transition-transform duration-300 transform hover:scale-105"
                        >
                            Start Building Now - It's Free!
                        </Button>
                        <p className="text-gray-300 text-sm mt-3">
                            No credit card required • 10 free bots included • Deploy in under 5 minutes
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <FAQSection />

                {/* CTA Section */}
                <div className="bg-[#051419] border border-neutral-700 rounded-2xl p-8 relative overflow-hidden mb-12">
                    <div className="relative z-10 md:flex items-center justify-between">
                        <div className="md:w-7/12 mb-6 md:mb-0">
                            <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
                            <p className="text-gray-200 mb-6">
                                Join the DeepTrade AI platform today and create your first AI-powered trading bot in minutes. No coding required.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-[#00d2cee6] hover:bg-[#00d2cee6] px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                                >
                                    Get Started Now
                                </Button>
                                <Button variant="outline" className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-lg font-medium transition-all duration-200">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-4/12">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-neutral-700 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-200">
                                    <p className="text-xl font-bold text-[#00d2cee6]">$0.01</p>
                                    <p className="text-sm text-gray-300">Deploy Cost</p>
                                </div>
                                <div className="border border-neutral-700 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-200">
                                    <p className="text-xl font-bold text-[#00d2cee6]">24/7</p>
                                    <p className="text-sm text-gray-300">Automated Trading</p>
                                </div>
                                <div className="border border-neutral-700 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-200">
                                    <p className="text-xl font-bold text-[#00d2cee6]">100%</p>
                                    <p className="text-sm text-gray-300">On-Chain</p>
                                </div>
                                <div className="border border-neutral-700 rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-200">
                                    <p className="text-xl font-bold text-[#00d2cee6]">10</p>
                                    <p className="text-sm text-gray-300">Free Bots</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-12">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-[#00d2cee6] text-xl font-bold mb-4">DeepTrade AI</h3>
                            <p className="text-gray-300 mb-4">
                                AI-powered trading bot platform on the Aptos blockchain. Create, deploy, and compete with automated trading strategies.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-white transition-all duration-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-all duration-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-all duration-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-medium mb-4">Platform</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Dashboard</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Create Bot</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Leaderboard</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Analytics</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Cross-Chain</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-medium mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Documentation</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">API Reference</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Tutorials</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-medium mb-4">Community</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Discord</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Twitter</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Blog</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-200">Events</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// FAQ Accordion Component
function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How does autonomous trading work?",
            answer: "Your trading bot runs as a smart contract on the Aptos blockchain. It continuously monitors market data (prices, technical indicators, volume) and automatically executes trades when your strategy conditions are met. The bot operates 24/7 without manual intervention, but you retain full control over your funds."
        },
        {
            question: "Are my funds safe?",
            answer: "Yes! Your funds never leave your wallet. The trading bot can only execute approved trades using your existing balance, but cannot withdraw or transfer your assets elsewhere. You maintain full custody of your private keys and can disable the bot anytime."
        },
        {
            question: "What trading strategies can I create?",
            answer: "You can create any strategy using technical indicators (RSI, MACD, Moving Averages, Bollinger Bands), price patterns, volume analysis, and cross-chain arbitrage. Popular strategies include mean reversion, momentum trading, scalping, and DCA (Dollar Cost Averaging)."
        },
        {
            question: "What are the costs involved?",
            answer: "Deploying a bot costs ~$0.01 in APT gas fees (very low compared to other blockchains). Each trade execution also incurs minimal Aptos gas fees (~$0.001). USDC deposits and withdrawals have minimal network fees. Optional subscription fees apply for more than 10 bots: Basic (100 bots) = 10 APT/month, Premium (unlimited) = 50 APT/month."
        },
        {
            question: "How do I fund my bot with USDC?",
            answer: "After creating a bot, use the USDC Manager to deposit Circle's native USDC from your wallet. If you don't have USDC on Aptos, you can bridge it from Ethereum, Base, or other chains using Circle's CCTP bridge (takes ~15 minutes). Deposits are instant once USDC is on Aptos."
        },
        {
            question: "How do I monitor my bot's performance?",
            answer: "The dashboard provides real-time performance analytics including P&L, ROI, win rate, trade history, and risk metrics. You can also see your bot's ranking in the global leaderboard and compare performance with other traders."
        },
        {
            question: "Can I modify strategies after deployment?",
            answer: "Yes! You can pause, modify parameters, or completely update your bot's strategy at any time. Changes take effect immediately, giving you flexibility to adapt to market conditions or improve performance based on results."
        },
        {
            question: "What are the trading competitions?",
            answer: "Regular competitions where bots compete based on performance metrics like ROI, total profit, or risk-adjusted returns. Winners earn APT rewards and recognition on the leaderboard. Competitions run weekly with different themes and prize pools."
        },
        {
            question: "How do I get started with no experience?",
            answer: "Start with simple strategies like 'Buy when price drops 5%, sell when it rises 3%'. Use paper trading mode to test strategies risk-free, copy successful strategies from the leaderboard, and gradually learn technical indicators through our tutorials."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mb-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                    Everything you need to know about DeepTrade AI's autonomous trading platform.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-[#051419] border border-neutral-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#00d2ce]/50"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                        >
                            <span className="text-lg font-semibold text-white pr-8 group-hover:text-[#00d2ce] transition-colors">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-5 h-5 text-[#00d2ce] flex-shrink-0 transition-transform duration-300 ${
                                    openIndex === index ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${
                                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                        >
                            <div className="px-6 pb-5 pt-2">
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

           
        </div>
    );
}