# DeepTrade AI
<div align="center">

AI-Powered Trading Bot Platform Built by Aryan Dagar for Hack Aura 2025








Created for Hack Aura 2025

AI + Blockchain = The Future of Autonomous Trading.

🚀 Live Demo
 • 📜 Docs
 • ⚙️ Smart Contract

</div>
🌟 Overview

DeepTrade AI is an AI-powered DeFi trading platform on the Aptos blockchain, designed to make algorithmic trading accessible to everyone.
Users can describe their trading ideas in plain English, and DeepTrade automatically converts them into on-chain bots that trade, analyze, and compete on real-time leaderboards.

🧠 Key Features

🤖 AI Strategy Builder – Create bots using natural language, no coding needed

🔗 On-Chain Execution – Smart contracts on Aptos ensure transparency and trust

💰 USDC Integration – Trade using native Circle USDC on Aptos

🌉 CCTP Bridge – Move USDC seamlessly across Ethereum, Base, and Arbitrum

🏆 Competitive Leaderboard – Battle other traders and earn top ranks

⛽ Gasless Experience – Sponsored gas for a smooth user experience

📊 Analytics Dashboard – Visualize P&L, performance, and trade history

🎮 Gamified Trading – Earn badges, rewards, and compete in tournaments

🚀 Quick Start
Prerequisites

Node.js 18+

Aptos Wallet (Petra, Martian, or Pontem)

Git installed

Setup
# Clone repo
git clone https://github.com/aryan007-bot/DeepTrade-AI
cd DeepTrade-AI

# Install dependencies
npm install

# Setup env
cp .env.example .env
# Fill in your Aptos & Circle details

# Run app
npm run dev


Visit http://localhost:3000
.

📖 Documentation
🧱 Architecture
deeptrade-ai/
├── src/
│   ├── app/                  # Next.js 14 pages & routes
│   ├── components/           # Reusable UI + Bot components
│   ├── hooks/                # Custom Aptos hooks
│   ├── services/             # Trading & contract logic
│   ├── types/                # TypeScript types
│   └── utils/                # Helpers & ABI configs
├── contract/                 # Move smart contracts
│   └── sources/trading_bot.move
└── public/                   # Assets

🧰 Tech Stack

Frontend – Next.js, TypeScript, TailwindCSS, Radix UI
Blockchain – Aptos, Move, @aptos-labs/ts-sdk, @thalalabs/surf
Integrations – Circle USDC, CCTP Bridge, Aptos Wallet Adapter

🎮 How It Works

1️⃣ Describe your strategy – e.g.
"Buy APT when price drops 5%, sell when up 3% or after 24 hours"

2️⃣ AI parses and converts it into a smart trading logic.
3️⃣ Deploy your bot on-chain to Aptos Testnet.
4️⃣ Trade automatically 24/7 with on-chain transparency.
5️⃣ Compete for the top spot on the global leaderboard.

💎 Smart Contract
Contract Address
Testnet: 0xd550dcf26be0fdb01bfe55ab836f394915d22f91719260a9b9781affb9378347

Core Functions
public entry fun create_bot(sender: &signer, name: String, strategy_description: String, risk_level: u8, initial_capital: u64);
public entry fun deposit_usdc_to_bot(sender: &signer, bot_id: u64, amount: u64);
public entry fun withdraw_usdc_from_bot(sender: &signer, bot_id: u64, amount: u64);
public entry fun execute_trade(sender: &signer, bot_id: u64, trade_type: bool, amount: u64, price: u64);
#[view] public fun get_bot_usdc_balance(bot_owner: address, bot_id: u64): u64;

🧠 Environment Variables
NEXT_PUBLIC_MODULE_ADDRESS=0xd550dcf26be0fdb01bfe55ab836f394915d22f91719260a9b9781affb9378347
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_USDC_METADATA_ADDRESS=0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa

🏆 Leaderboard & Competition

Live global rankings based on ROI & win rate

Tournaments with real prizes for top bots

Performance metrics: win rate, P&L, Sharpe ratio

15-second refresh for real-time stats

🛠️ Development Commands
npm run dev          # Start local dev server
npm run build        # Build for production
npm run deploy       # Deploy to Vercel

npm run move:compile # Compile Move contracts
npm run move:test    # Test contracts
npm run move:publish # Publish to testnet

🏗️ Roadmap
Phase 1 – MVP ✅

AI bot creation

On-chain contract deployment

USDC integration

Leaderboard system

Phase 2 – Advanced Trading 🔄

DEX integration (Thala, Liquidswap)

Backtesting system

Strategy marketplace

Phase 3 – Gamified Ecosystem 🚀

Copy-trading

Social leaderboard

NFT badges & tournaments

🤝 Contributing

Fork this repo

Create a branch (feature/new-feature)

Commit your changes

Open a PR 🚀

Code style: TypeScript + Move, formatted with Prettier & ESLint.

📝 License

Licensed under MIT License.

🔗 Links

Live App → https://deeptrade-ai.vercel.app

Twitter (Aryan) → https://x.com/aryan69853

GitHub → https://github.com/aryan007-bot

<div align="center">

💡 Built with ❤️ by Aryan Dagar for Hack Aura 2025
⚙️ Empowering AI x Web3 on Aptos Blockchain

</div>
