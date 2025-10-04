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

**DeepTrade AI** is a gamified DeFi platform built on Aptos blockchain that democratizes algorithmic trading through AI-powered natural language processing. Users describe their trading strategies in plain English, and our AI converts them into executable on-chain trading bots that compete in real-time leaderboards.

### Key Features

- 🤖 **Natural Language Bot Creation** - Describe trading strategies in plain English, no coding required
- 🔗 **On-Chain Deployment** - All bots run as smart contracts on Aptos for transparency and security
- 💰 **Circle USDC Integration** - Native USDC deposits and withdrawals via Circle's infrastructure
- 🌉 **Cross-Chain CCTP Bridge** - Bridge USDC from Ethereum, Base, Arbitrum, and other chains
- 🏆 **Real-Time Leaderboards** - Compete with other traders for top rankings and rewards
- ⛽ **Gas-Sponsored Transactions** - Seamless UX with subsidized gas fees
- 📊 **Advanced Analytics** - Track bot performance, P&L, win rates, and trading history
- 🎮 **Gamified Experience** - Achievements, badges, and competitive trading tournaments

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Aptos Wallet (Petra, Martian, or Pontem)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/AJTECH001/DeepTrade-AI
cd DeepTrade-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📖 Documentation

### Architecture

```
deeptrade-ai/
├── src/
│   ├── app/                    # Next.js 14 app router pages
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
```

### Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS
- Radix UI Components
- TanStack Query (React Query)

**Blockchain**
- Aptos Blockchain
- Move Language (Smart Contracts)
- @aptos-labs/ts-sdk
- @aptos-labs/wallet-adapter-react
- @thalalabs/surf (Type-safe contract interactions)

**Integration**
- Circle USDC (Native payments)
- Circle CCTP (Cross-chain transfers)

---

## 🎮 How It Works

### 1. Describe Your Strategy
Use natural language to describe your trading strategy:
```
"Buy APT when RSI drops below 30 and sell when RSI goes above 70 with 2% stop loss"
```

### 2. AI Converts to Logic
Our GPT-powered AI parser converts your strategy into executable trading logic with technical indicators.

### 3. Deploy to Blockchain
Your bot is deployed as a smart contract on Aptos blockchain. All trading happens on-chain with full transparency.

### 4. Trade Autonomously 24/7
Your bot monitors markets continuously and executes trades automatically when conditions match your strategy.

### 5. Compete & Earn
Climb the leaderboard by generating the highest returns. Top performers earn rewards and recognition.

---

## 💎 Smart Contract

### Contract Address
```
Testnet: 0xd550dcf26be0fdb01bfe55ab836f394915d22f91719260a9b9781affb9378347
```

### Core Functions

```move
// Create a new trading bot
public entry fun create_bot(
    sender: &signer,
    name: String,
    strategy_description: String,
    risk_level: u8,
    initial_capital: u64
)

// Deposit USDC to bot
public entry fun deposit_usdc_to_bot(
    sender: &signer,
    bot_id: u64,
    amount: u64,
)

// Withdraw USDC from bot
public entry fun withdraw_usdc_from_bot(
    sender: &signer,
    bot_id: u64,
    amount: u64,
)

// Execute a trade
public entry fun execute_trade(
    sender: &signer,
    bot_id: u64,
    trade_type: bool,    // true = buy, false = sell
    amount: u64,
    price: u64
)

// View bot USDC balance
#[view]
public fun get_bot_usdc_balance(bot_owner: address, bot_id: u64): u64
```

### Move Contract Scripts

```bash
# Compile contracts
npm run move:compile

# Run tests
npm run move:test

# Publish contracts
npm run move:publish

# Upgrade contracts
npm run move:upgrade
```

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run deploy           # Deploy to Vercel

# Code Quality
npm run lint             # Run ESLint
npm run fmt              # Format with Prettier

# Smart Contracts
npm run move:compile     # Compile Move contracts
npm run move:test        # Test Move contracts
npm run move:publish     # Publish contracts to testnet
npm run move:upgrade     # Upgrade existing contracts
```

### Environment Variables

```env
NEXT_PUBLIC_MODULE_ADDRESS=0xd550dcf26be0fdb01bfe55ab836f394915d22f91719260a9b9781affb9378347
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_USDC_METADATA_ADDRESS=0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa
```

---

## 🌐 Circle USDC Integration

DeepTrade AI integrates Circle's native USDC for real-money trading:

### Features
- **Real USDC Deposits** - Fund bots with Circle's native USDC on Aptos
- **Instant Withdrawals** - Withdraw profits directly to your wallet
- **Cross-Chain Bridge** - Use Circle CCTP to bridge USDC from other chains
- **Low Fees** - Benefit from Aptos's sub-cent transaction costs


---

## 🏆 Leaderboard & Competition

Track your performance and compete with traders worldwide:

- **Global Rankings** - See top-performing bots by ROI, total P&L, and win rate
- **Real-Time Updates** - Leaderboard refreshes every 15 seconds
- **Performance Metrics** - Track trades, win rate, average profit, and Sharpe ratio
- **Tournament Mode** - Participate in time-limited competitions for prizes

---

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- ✅ Natural language bot creation
- ✅ On-chain bot deployment
- ✅ Circle USDC integration
- ✅ Basic leaderboards

### Phase 2: Enhanced Trading
- 🔄 DEX integration (PancakeSwap, Liquidswap, Thala)
- 🔄 Advanced technical indicators
- 🔄 Backtesting functionality
- 🔄 Portfolio management

### Phase 3: Social & Gamification
- 📋 Bot marketplace (buy/sell strategies)
- 📋 Social features (follow traders, copy trading)
- 📋 Achievements and NFT badges
- 📋 Tournament prizes and rewards

### Phase 4: Multi-Chain
- 📋 Expand to other Aptos-compatible chains
- 📋 Cross-chain arbitrage bots
- 📋 Multi-DEX liquidity aggregation

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- TypeScript for frontend code
- Move for smart contracts
- Prettier for formatting (120 char width)
- ESLint for linting (max 0 warnings)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [https://deeptrade-ai.vercel.app](https://deeptrade-ai.vercel.app)
- **Twitter**: [@deeptrade_ai]

---

## 🙏 Acknowledgments

- **Aptos Foundation** - For the amazing blockchain infrastructure
- **Circle** - For USDC and CCTP integration
- **Move Language** - For secure smart contract development
- **Vercel** - For seamless deployment and hosting

---

## 📧 Contact

For questions, feedback, or support:
- Email: support@deeptrade.ai
- Discord: [Join our server]
- Twitter: [@deeptrade_ai]

---

<div align="center">

**Built with ❤️ for the CTRL + MOVE Aptos Hackathon**

*Trade smarter, not harder*

</div>
#   D e e p T r a d e - A I  
 