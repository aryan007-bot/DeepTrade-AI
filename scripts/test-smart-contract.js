/**
 * Test Smart Contract Connection
 * Verifies that the contract is deployed and functions are available
 */

const { Aptos, AptosConfig, Network } = require("@aptos-labs/ts-sdk");

async function testSmartContract() {
  console.log('🧪 Testing Smart Contract Connection...');

  // Get environment variables
  const NETWORK = process.env.NEXT_PUBLIC_APP_NETWORK || 'testnet';
  const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS || '0x64b0d0c590ac866988e39442f4bb7dc69f9ee956d9b45ed3128f751f2e430c1a';

  console.log('🔧 Configuration:');
  console.log('   Network:', NETWORK);
  console.log('   Module Address:', MODULE_ADDRESS);

  const config = new AptosConfig({ network: NETWORK });
  const aptos = new Aptos(config);

  // Test 1: Check if contract module exists
  console.log('\n📋 Test 1: Check contract module existence...');
  try {
    const accountInfo = await aptos.getAccountInfo({ accountAddress: MODULE_ADDRESS });
    console.log('✅ Contract account exists:', accountInfo);
  } catch (error) {
    console.log('❌ Contract account not found:', error.message);
    return;
  }

  // Test 2: Try to get registry stats
  console.log('\n📊 Test 2: Test get_registry_stats function...');
  try {
    const response = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::trading_bot::get_registry_stats`,
        functionArguments: [],
      },
    });
    console.log('✅ Registry stats response:', response);
  } catch (error) {
    console.log('❌ Registry stats failed:', error.message);
  }

  // Test 3: Try to get leaderboard
  console.log('\n🏆 Test 3: Test get_leaderboard function...');
  try {
    const response = await aptos.view({
      payload: {
        function: `${MODULE_ADDRESS}::trading_bot::get_leaderboard`,
        functionArguments: [],
      },
    });
    console.log('✅ Leaderboard response:', response);
  } catch (error) {
    console.log('❌ Leaderboard failed:', error.message);
  }

  // Test 4: Try to get module info
  console.log('\n🔍 Test 4: Get account modules...');
  try {
    const modules = await aptos.getAccountModules({ accountAddress: MODULE_ADDRESS });
    console.log('✅ Available modules:', modules.map(m => m.abi?.name || 'Unknown'));

    // Find trading_bot module
    const tradingBotModule = modules.find(m => m.abi?.name === 'trading_bot');
    if (tradingBotModule) {
      console.log('📋 Trading bot module functions:');
      tradingBotModule.abi?.exposed_functions?.forEach(func => {
        console.log(`   - ${func.name}(${func.params.join(', ')})`);
      });
    } else {
      console.log('❌ trading_bot module not found');
    }
  } catch (error) {
    console.log('❌ Failed to get modules:', error.message);
  }

  console.log('\n🎯 Contract Test Complete');
}

// Run the test
testSmartContract().catch(console.error);