# DeepTrade AI

<div align="center">

**AI-Powered Trading Bot Platform on Aptos Blockchain**

[![Aptos](https://img.shields.io/badge/Aptos-Blockchain-00d2ce?style=for-the-badge)](https://aptos.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Move](https://img.shields.io/badge/Move-Smart_Contracts-00d2ce?style=for-the-badge)](https://move-language.github.io/move/)

*Create AI trading bots using natural language. Deploy to blockchain. Compete for glory.*

[Live Demo](https://deeptrade-ai.vercel.app) • [Documentation](#documentation) • [Smart Contract](#smart-contract)

</div>

---

## 🌟 Overview

**DeepTrade AI** is a gamified DeFi platform built on the Aptos blockchain that democratizes algorithmic trading through AI-powered natural language processing.  
Users describe their trading strategies in plain English, and our AI converts them into executable on-chain trading bots that compete in real-time leaderboards.

### Key Features

- 🤖 **Natural Language Bot Creation** — Describe trading strategies in plain English, no coding required  
- 🔗 **On-Chain Deployment** — All bots run as smart contracts on Aptos for transparency and security  
- 💰 **Circle USDC Integration** — Native USDC deposits and withdrawals via Circle's infrastructure  
- 🌉 **Cross-Chain CCTP Bridge** — Bridge USDC from Ethereum, Base, Arbitrum, and more  
- 🏆 **Real-Time Leaderboards** — Compete with other traders for top rankings and rewards  
- ⛽ **Gas-Sponsored Transactions** — Seamless UX with subsidized gas fees  
- 📊 **Advanced Analytics** — Track bot performance, P&L, win rates, and trading history  
- 🎮 **Gamified Experience** — Achievements, badges, and tournaments for top traders  

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn  
- Aptos Wallet (Petra, Martian, or Pontem)  
- Git  

### Installation

```bash
# Clone the repository
git clone https://github.com/aryan007-bot/DeepTrade-AI
cd DeepTrade-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
Visit http://localhost:3000 to see the application.

📖 Documentation
Architecture
php
Copy code
deeptrade-ai/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/          # Main dashboard and trading views
│   │   ├── landing/            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # UI primitives (Button, Card, etc.)
│   │   ├── BotUSDCManager.tsx  # USDC deposit/withdrawal
│   │   └── CircleCCTPBridge.tsx # Cross-chain bridge UI
│   ├── hooks/                  # Custom React hooks
│   │   └── useContract.ts      # Contract interaction hooks
│   ├── services/               # Business logic services
│   │   └── contractService.ts  # Aptos contract service
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions and ABIs
├── contract/                   # Move smart contracts
│   ├── sources/
│   │   └── trading_bot.move    # Main trading bot contract
│   └── Move.toml               # Move package configuration
├── scripts/                    # Deployment and management scripts
│   └── move/                   # Move contract scripts
└── public/                     # Static assets
Tech Stack
Frontend

Next.js 14 (App Router)

React 18

TypeScript 5

Tailwind CSS

Radix UI Components

TanStack Query

Blockchain

Aptos Blockchain

Move Language (Smart Contracts)

@aptos-labs/ts-sdk

@aptos-labs/wallet-adapter-react

@thalalabs/surf

Integration

Circle USDC (Native payments)

Circle CCTP (Cross-chain transfers)

🎮 How It Works
1. Describe Your Strategy
text
Copy code
"Buy APT when RSI drops below 30 and sell when RSI goes above 70 with 2% stop loss"
2. AI Converts to Logic
DeepTrade’s GPT-powered parser converts your natural language into executable on-chain logic.

3. Deploy to Blockchain
Deploy your AI bot as a smart contract on Aptos for transparent, verifiable trading.

4. Trade 24/7
Your bot autonomously monitors markets and executes trades based on your rules.

5. Compete & Earn
Top-performing bots rise up the leaderboard and earn rewards.

💎 Smart Contract
Contract Address
makefile
Copy code
Testnet: 0xd550dcf26be0fdb01bfe55ab836f394915d22f91719260a9b9781affb9378347
Core Functions (Move)
move
Copy code
public entry fun create_bot(
    sender: &signer,
    name: String,
    strategy_description: String,
    risk_level: u8,
    initial_capital: u64
)
public entry fun deposit_usdc_to_bot(sender: &signer, bot_id: u64, amount: u64)
public entry fun withdraw_usdc_from_bot(sender: &signer, bot_id: u64, amount: u64)
public entry fun execute_trade(sender: &signer, bot_id: u64, trade_type: bool, amount: u64, price: u64)
#[view]
public fun get_bot_usdc_balance(bot_owner: address, bot_id: u64): u64
Contract Scripts
bash
Copy code
npm run move:compile
npm run move:test
npm run move:publish
npm run move:upgrade
🔧 Development
Scripts
bash
Copy code
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run deploy           # Deploy to Vercel
npm run lint             # Run ESLint
npm run fmt              # Format with Prettier
npm run move:compile     # Compile Move contracts
npm run move:test        # Test Move contracts
npm run move:publish     # Publish to testnet
npm run move:upgrade     # Upgrade contracts
Environment Variables
env
Copy code
NEXT_PUBLIC_MODULE_ADDRESS=0xd550dcf26be0fdb01bfe55ab836f394915d22f91719260a9b9781affb9378347
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_USDC_METADATA_ADDRESS=0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa
🌐 Circle USDC Integration
DeepTrade AI integrates Circle’s native USDC for real on-chain payments.

Highlights
💵 Real USDC deposits & withdrawals

🔁 Cross-chain transfers via CCTP

⚡ Instant transactions with minimal gas

🧾 Transparent on-chain accounting

🏆 Leaderboard & Competition
Global Rankings — Based on ROI, P&L, and win rate

Real-Time Updates — Leaderboard refresh every 15 seconds

Detailed Stats — Trades, win rate, Sharpe ratio

Tournament Mode — Time-limited competitions

🛣️ Roadmap
Phase 1 – MVP (Now)
✅ AI bot creation
✅ On-chain deployment
✅ Circle USDC integration
✅ Basic leaderboard

Phase 2 – Advanced Trading
🔄 DEX integration (Thala, Liquidswap)
🔄 Technical indicators & backtesting
🔄 Portfolio management

Phase 3 – Gamification
🏪 Bot marketplace
🤝 Copy trading
🏆 NFT badges & achievements

Phase 4 – Multi-Chain
🌐 Cross-chain arbitrage
🔗 Multi-DEX liquidity aggregation

🤝 Contributing
We welcome contributions!

Fork this repo

Create a feature branch

Commit changes

Push to branch

Open a Pull Request

Code Style
TypeScript + Move

Prettier + ESLint

120-char line limit

📝 License
Licensed under the MIT License — see the LICENSE file.

🔗 Links
Website: https://deeptrade-ai.vercel.app

GitHub: https://github.com/aryan007-bot/DeepTrade-AI

Twitter (X): @aryan69853

📧 Contact
For queries, feedback, or collaboration:

📩 Email: contact@deeptrade.ai

🐦 Twitter: @aryan69853

<div align="center">
Built with ❤️ by Aryan Dagar for the CTRL + MOVE Aptos Hackathon
Trade smarter, not harder.

</div> ```
