
# DeepTrade AI 🚀

<div align="center">

**AI-Powered Trading Bot Platform on Aptos Blockchain**  

[![Aptos](https://img.shields.io/badge/Aptos-Blockchain-00d2ce?style=for-the-badge)](https://aptos.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Move](https://img.shields.io/badge/Move-Smart_Contracts-00d2ce?style=for-the-badge)](https://move-language.github.io/move/)

*Create autonomous trading bots using plain English. Deploy on-chain. Trade 24/7.*  

[Live Demo](https://deeptrade-ai.vercel.app) • [Documentation](#documentation) • [Smart Contract](#smart-contract)
<img width="1910" height="911" alt="Screenshot 2025-10-04 225631" src="https://github.com/user-attachments/assets/d6feebdb-f867-4586-8ff5-d8b9ef70e3e2" />


</div>

---

## 🌟 Overview

**DeepTrade AI** is the world's first platform to let you create autonomous trading bots using **plain English** — no coding required! Describe your strategy and watch it trade 24/7 on the blockchain.  

💡 **Key Highlights from the Platform:**
- ✅ Ultra-low transaction costs (~$0.01)  
- ✅ Your funds stay safe on-chain  
- ✅ 24/7 autonomous trading  

---

## 🔑 Key Features

- 🤖 **Natural Language Bot Creation** — Simply describe your trading strategy  
- 🔗 **On-Chain Deployment** — Bots run as Aptos smart contracts  
- 💰 **Circle USDC Integration** — Deposit & withdraw native USDC  
- 🌉 **Cross-Chain CCTP Bridge** — Send USDC across Ethereum, Base, Arbitrum  
- 🏆 **Real-Time Leaderboards** — Compete with global traders  
- ⛽ **Gas-Sponsored Transactions** — Trade without worrying about fees  
- 📊 **Analytics Dashboard** — Monitor performance, P&L, and win rates  
- 🎮 **Gamified Experience** — Earn badges, achievements & rewards  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn  
- Aptos Wallet (Petra, Martian, Pontem)  
- Git  

### Installation
```bash
# Clone the repository
git clone https://github.com/aryan007-bot/DeepTrade-AI
cd DeepTrade-AI

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env as required

# Start development server
npm run dev
````

Visit [http://localhost:3000](http://localhost:3000) to see it in action! 🌐

---

## 📖 Platform Overview

### 🏠 Hero Section

> "The world's first platform that lets you create autonomous trading bots using plain English. No coding required — just describe your strategy and watch it trade 24/7 on the blockchain."

### 💎 Circle USDC Integration Live

> Deposit & withdraw native USDC on Aptos instantly with minimal fees.

### Architecture

```
deeptrade-ai/
├── src/
│   ├── app/                    # Next.js pages
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # Business logic
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Helper functions
├── contract/                   # Move smart contracts
├── scripts/                    # Deployment scripts
└── public/                     # Assets
```

---

## 🎮 How It Works

1️⃣ **Describe Your Strategy**

```text
"Buy APT when RSI drops below 30 and sell when above 70 with 2% stop loss"
```

2️⃣ **AI Converts to Logic** — GPT-powered AI converts natural language to on-chain trading logic.

3️⃣ **Deploy On-Chain** — Your bot is deployed as a smart contract on Aptos.

4️⃣ **Trade Autonomously** — Bots monitor markets and execute trades 24/7.

5️⃣ **Compete & Earn** — Climb the leaderboard and earn rewards.

---

## 📝 Smart Contract

### Testnet Contract

```
0xd550dcf26be0fdb01bfe55ab836f394915d22f91719260a9b9781affb9378347
```

### Core Functions (Move)

```move
public entry fun create_bot(sender: &signer, name: String, strategy_description: String, risk_level: u8, initial_capital: u64)
public entry fun deposit_usdc_to_bot(sender: &signer, bot_id: u64, amount: u64)
public entry fun withdraw_usdc_from_bot(sender: &signer, bot_id: u64, amount: u64)
public entry fun execute_trade(sender: &signer, bot_id: u64, trade_type: bool, amount: u64, price: u64)
#[view] public fun get_bot_usdc_balance(bot_owner: address, bot_id: u64): u64
```

---

## 🔧 Development Scripts

```bash
npm run dev
npm run build
npm start
npm run deploy
npm run lint
npm run fmt
npm run move:compile
npm run move:test
npm run move:publish
npm run move:upgrade
```

---

## 🛣️ Roadmap

**Phase 1 – MVP** ✅

* AI bot creation
* On-chain deployment
* USDC integration
* Leaderboard

**Phase 2 – Advanced Trading** 🔄

* DEX integrations
* Advanced indicators & backtesting
* Portfolio management

**Phase 3 – Gamification** 🏆

* Bot marketplace
* Copy trading
* Achievements & NFT badges

**Phase 4 – Multi-Chain** 🌐

* Cross-chain arbitrage
* Multi-DEX liquidity

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch
3. Commit changes
4. Push branch
5. Open PR

---

## 🔗 Links

* 🌐 Website: [https://deeptrade-ai.vercel.app](https://deep-trade-ai-one.vercel.app/)
* 🐦 X: [@aryan69853](https://x.com/aryan69853)
* 📁 GitHub: [aryan007-bot/DeepTrade-AI](https://github.com/aryan007-bot/DeepTrade-AI)

---

## 📧 Contact

* 📩 Email: [contact@deeptrade.ai](mailto:contact@deeptrade.ai)
* 🐦 Twitter: [@aryan69853](https://x.com/aryan69853)

---

<div align="center">

**Built with ❤️ by Aryan Dagar for the CTRL + MOVE Aptos Hackathon**
*Trade smarter, not harder.*

</div>
```

---


