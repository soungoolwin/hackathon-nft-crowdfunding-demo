// Test environment variables
console.log("🔍 Environment Variables Test:");
console.log("NEXT_PUBLIC_CONTRACT_ADDRESS:", process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
console.log("CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS);
console.log("CONTRACT_CHAIN_ID:", process.env.CONTRACT_CHAIN_ID);

// Test contract config
const { CONTRACT_CONFIG } = require('../src/lib/contract.ts');
console.log("Contract Config:");
console.log("  - Address:", CONTRACT_CONFIG.address);
console.log("  - Chain ID:", CONTRACT_CONFIG.chainId);
console.log("  - Chain ID Type:", typeof CONTRACT_CONFIG.chainId);
