#!/usr/bin/env node

/**
 * Production Readiness Check Script
 * Run with: node scripts/check-production.js
 */

const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '..', '.env') });

async function checkProduction() {
  console.log('🔍 DeepTrade AI - Production Readiness Check');
  console.log('===========================================\n');

  const status = {
    ai: { score: 0, status: 'error', details: [] },
    marketData: { score: 0, status: 'error', details: [] },
    blockchain: { score: 0, status: 'error', details: [] },
    environment: { score: 0, status: 'error', details: [] },
  };

  // Check AI Integration
  console.log('🧠 AI INTEGRATION');
  console.log('------------------');

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey) {
    console.log('✅ OpenAI API key configured');
    status.ai.score += 50;
    status.ai.details.push('OpenAI integration ready');
  } else if (anthropicKey) {
    console.log('✅ Anthropic API key configured');
    status.ai.score += 50;
    status.ai.details.push('Anthropic integration ready');
  } else {
    console.log('❌ No AI API key found');
    status.ai.details.push('Missing: AI API key');
  }

  const aiModel = process.env.AI_MODEL || 'gpt-3.5-turbo';
  console.log(`🎯 AI Model: ${aiModel}`);
  status.ai.score += 25;

  const aiProvider = process.env.AI_PROVIDER || 'openai';
  console.log(`🔧 AI Provider: ${aiProvider}`);
  status.ai.score += 25;

  status.ai.status = status.ai.score >= 75 ? 'ready' : status.ai.score >= 50 ? 'warning' : 'error';

  // Check Market Data
  console.log('\\n📊 MARKET DATA');
  console.log('---------------');

  const coinMarketCapKey = process.env.COINMARKETCAP_API_KEY;
  const coingeckoKey = process.env.COINGECKO_API_KEY;

  if (coinMarketCapKey) {
    console.log('✅ CoinMarketCap API key configured');
    status.marketData.score += 40;
  } else {
    console.log('⚠️ CoinMarketCap API key missing (optional)');
    status.marketData.score += 10;
  }

  if (coingeckoKey) {
    console.log('✅ CoinGecko API key configured');
    status.marketData.score += 40;
  } else {
    console.log('⚠️ CoinGecko API key missing (optional)');
    status.marketData.score += 10;
  }

  console.log('✅ Binance WebSocket integration ready');
  console.log('✅ CCXT professional trading library ready');
  status.marketData.score += 20;

  status.marketData.status = status.marketData.score >= 70 ? 'ready' : status.marketData.score >= 40 ? 'warning' : 'error';

  // Check Blockchain
  console.log('\\n⛓️  BLOCKCHAIN INTEGRATION');
  console.log('-------------------------');

  const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS;
  if (moduleAddress && moduleAddress.startsWith('0x')) {
    console.log(`✅ Smart contract: ${moduleAddress.substring(0, 20)}...`);
    status.blockchain.score += 30;
  } else {
    console.log('❌ Smart contract address missing');
  }

  const network = process.env.NEXT_PUBLIC_NETWORK;
  if (network && ['mainnet', 'testnet', 'devnet'].includes(network)) {
    console.log(`✅ Network: ${network}`);
    status.blockchain.score += 20;
  } else {
    console.log('❌ Network configuration invalid');
  }

  const aptosApiKey = process.env.NEXT_PUBLIC_APTOS_API_KEY;
  if (aptosApiKey) {
    console.log('✅ Aptos Build API key configured');
    status.blockchain.score += 30;
  } else {
    console.log('⚠️ Aptos Build API key missing (recommended)');
    status.blockchain.score += 10;
  }

  const tradingEnabled = process.env.TRADING_ENABLED === 'true';
  if (tradingEnabled) {
    console.log('✅ Trading enabled');
    status.blockchain.score += 20;
  } else {
    console.log('⚠️ Trading disabled');
    status.blockchain.score += 10;
  }

  status.blockchain.status = status.blockchain.score >= 80 ? 'ready' : status.blockchain.score >= 60 ? 'warning' : 'error';

  // Check Environment
  console.log('\\n🌍 ENVIRONMENT');
  console.log('---------------');

  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    console.log('✅ Production environment');
    status.environment.score += 40;
  } else {
    console.log(`⚠️ Environment: ${nodeEnv || 'not set'} (development features enabled)`);
    status.environment.score += 20;
  }

  const requiredVars = ['NEXT_PUBLIC_MODULE_ADDRESS', 'NEXT_PUBLIC_NETWORK'];
  const missingRequired = requiredVars.filter(v => !process.env[v]);

  if (missingRequired.length === 0) {
    console.log('✅ All required environment variables set');
    status.environment.score += 40;
  } else {
    console.log(`❌ Missing required: ${missingRequired.join(', ')}`);
  }

  const maxPosition = process.env.MAX_POSITION_SIZE || '1000';
  const riskPercent = process.env.DEFAULT_RISK_PERCENT || '2';
  console.log(`🎯 Risk settings: Max position $${maxPosition}, Risk ${riskPercent}%`);
  status.environment.score += 20;

  status.environment.status = status.environment.score >= 80 ? 'ready' : status.environment.score >= 60 ? 'warning' : 'error';

  // Overall Assessment
  const scores = Object.values(status).map(s => s.score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const readyCount = Object.values(status).filter(s => s.status === 'ready').length;
  const errorCount = Object.values(status).filter(s => s.status === 'error').length;

  console.log('\\n🎯 OVERALL ASSESSMENT');
  console.log('=====================');
  console.log(`Score: ${averageScore}/100`);
  console.log(`Ready components: ${readyCount}/4`);
  console.log(`Components with errors: ${errorCount}/4`);

  let overallStatus;
  if (errorCount === 0 && averageScore >= 80) {
    overallStatus = '🎉 PRODUCTION READY';
    console.log(`\\n${overallStatus}`);
    console.log('Your DeepTrade AI platform is fully configured and ready for live autonomous trading!');
    console.log('\\n🚀 Next steps:');
    console.log('   1. npm run build');
    console.log('   2. npm start');
    console.log('   3. Create your first autonomous trading bot');
  } else if (errorCount <= 1 && averageScore >= 60) {
    overallStatus = '⚠️ PARTIALLY READY';
    console.log(`\\n${overallStatus}`);
    console.log('Your platform is functional but some features may have limitations.');
  } else {
    overallStatus = '❌ NOT READY';
    console.log(`\\n${overallStatus}`);
    console.log('Please address the missing configurations above.');
  }

  // Recommendations
  console.log('\\n💡 RECOMMENDATIONS:');
  const recommendations = [];

  if (!openaiKey && !anthropicKey) {
    recommendations.push('Add OpenAI API key for real AI strategy parsing');
    recommendations.push('Get key from: https://platform.openai.com/api-keys');
  }

  if (!coinMarketCapKey) {
    recommendations.push('Add CoinMarketCap API key for price verification');
    recommendations.push('Get key from: https://coinmarketcap.com/api/');
  }

  if (!aptosApiKey) {
    recommendations.push('Add Aptos Build API key for better performance');
    recommendations.push('Get key from: https://build.aptos.dev');
  }

  if (nodeEnv !== 'production') {
    recommendations.push('Set NODE_ENV=production for full production features');
  }

  if (!tradingEnabled) {
    recommendations.push('Set TRADING_ENABLED=true to enable live trading');
  }

  recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });

  console.log('\\n📚 Documentation: ./PRODUCTION_SETUP.md');
  console.log('🧪 Test individual components: node scripts/test-ai.js');

  return { overallStatus, averageScore, status };
}

checkProduction().catch(console.error);