#!/usr/bin/env node

/**
 * Quick test script for OpenAI integration
 * Run with: node scripts/test-ai.js
 */

const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.join(__dirname, '..', '.env') });

async function testOpenAI() {
  console.log('🧪 Testing OpenAI Integration...\n');

  // Check if API key is present
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('❌ OPENAI_API_KEY not found in environment variables');
    console.log('Please add your OpenAI API key to .env.local');
    return;
  }

  console.log('✅ OpenAI API Key found');
  console.log(`Key preview: ${apiKey.substring(0, 20)}...${apiKey.slice(-4)}\n`);

  try {
    // Dynamic import for OpenAI (ESM module)
    const { default: OpenAI } = await import('openai');

    const openai = new OpenAI({ apiKey });

    console.log('🧠 Testing strategy parsing...');

    const testStrategy = "Buy APT when RSI drops below 30 and price falls more than 5%, sell when RSI goes above 70";

    const prompt = `Convert this trading strategy to structured JSON: "${testStrategy}"

Return JSON with this exact structure:
{
  "symbol": "APT/USDC",
  "timeframe": "5m",
  "conditions": [
    {
      "indicator": "rsi",
      "operator": "<",
      "value": 30,
      "timeframe": "5m"
    }
  ],
  "buy_actions": [
    {
      "type": "buy",
      "amount_percent": 10,
      "stop_loss": 5,
      "take_profit": 15
    }
  ],
  "sell_actions": [
    {
      "type": "sell",
      "amount_percent": 100
    }
  ],
  "risk_management": {
    "max_position_size": 1000,
    "max_daily_trades": 10,
    "stop_loss_percent": 5,
    "max_daily_loss": 500
  }
}

Guidelines:
- Extract clear buy/sell conditions from the text
- Identify technical indicators (RSI, MACD, SMA, price, volume)
- Set reasonable defaults for unspecified parameters
- Use conservative risk management settings`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert trading strategy parser. Convert plain English trading strategies into structured JSON format for algorithmic trading execution.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;

    if (content) {
      console.log('✅ OpenAI Response received!');
      console.log('\n📄 Raw response:');
      console.log(content);

      try {
        const parsed = JSON.parse(content);
        console.log('\n✅ JSON parsing successful!');
        console.log('\n🎯 Parsed Strategy:');
        console.log(`   Symbol: ${parsed.symbol}`);
        console.log(`   Timeframe: ${parsed.timeframe}`);
        console.log(`   Conditions: ${parsed.conditions?.length || 0}`);
        if (parsed.conditions) {
          parsed.conditions.forEach((condition, i) => {
            console.log(`     ${i + 1}. ${condition.indicator} ${condition.operator} ${condition.value}`);
          });
        }
        console.log(`   Buy actions: ${parsed.buy_actions?.length || 0}`);
        console.log(`   Sell actions: ${parsed.sell_actions?.length || 0}`);

        console.log('\n🎉 OpenAI Integration Test PASSED!');
        console.log('Your AI strategy parsing is working correctly.');

      } catch (parseError) {
        console.log('❌ JSON parsing failed:', parseError.message);
        console.log('Response was not valid JSON');
      }
    } else {
      console.log('❌ No response content received from OpenAI');
    }

  } catch (error) {
    console.log('❌ OpenAI API Error:', error.message);

    if (error.status === 401) {
      console.log('\n💡 This usually means:');
      console.log('   - Invalid API key');
      console.log('   - API key not properly set in .env.local');
    } else if (error.status === 429) {
      console.log('\n💡 Rate limit exceeded. Try again in a moment.');
    } else if (error.status === 403) {
      console.log('\n💡 This usually means:');
      console.log('   - API key doesn\'t have GPT-4 access');
      console.log('   - Try changing model to "gpt-3.5-turbo" in the script');
    }
  }
}

testOpenAI().catch(console.error);