import { Network } from "@aptos-labs/ts-sdk";

export const NETWORK: Network = (process.env.NEXT_PUBLIC_APP_NETWORK as Network) ?? Network.TESTNET;
// Your deployed contract address from the deployment output
export const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS || "0x64b0d0c590ac866988e39442f4bb7dc69f9ee956d9b45ed3128f751f2e430c1a";
export const APTOS_API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY;

// Contract deployment instructions:
// 1. Deploy your contract using: aptos move publish --named-addresses trading_bot_addr=default
// 2. Copy the deployed contract address from the output
// 3. Set NEXT_PUBLIC_MODULE_ADDRESS environment variable to that address
// 4. Or replace the fallback address above with your deployed contract address