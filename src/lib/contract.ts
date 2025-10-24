// Smart Contract Configuration
export const CONTRACT_CONFIG = {
  // Your deployed contract address on Sepolia Ethereum Testnet
  address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    process.env.CONTRACT_ADDRESS) as `0x${string}`,

  // Sepolia Ethereum Testnet
  chainId: parseInt(process.env.CONTRACT_CHAIN_ID || "11155111"),

  // Contract ABI (simplified version of your deployed contract)
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "databaseProjectId",
          type: "string",
        },
        {
          internalType: "string",
          name: "metadataUri",
          type: "string",
        },
      ],
      name: "mintHackathonNFT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "databaseProjectId",
          type: "string",
        },
      ],
      name: "isProjectMinted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const,
};

// Network configuration for Sepolia Ethereum Testnet
export const NETWORK_CONFIG = {
  chainId: 11155111,
  name: "Sepolia Testnet",
  rpcUrl: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Public Infura endpoint
  blockExplorer: "https://sepolia.etherscan.io",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
};

// Validate contract configuration
export function validateContractConfig(): boolean {
  if (!CONTRACT_CONFIG.address) {
    console.error("❌ CONTRACT_ADDRESS not configured in .env.local");
    console.error(
      "💡 Make sure to add NEXT_PUBLIC_CONTRACT_ADDRESS to .env.local"
    );
    return false;
  }

  if (!CONTRACT_CONFIG.address.startsWith("0x")) {
    console.error("❌ CONTRACT_ADDRESS must start with 0x");
    return false;
  }

  if (CONTRACT_CONFIG.address.length !== 42) {
    console.error("❌ CONTRACT_ADDRESS must be 42 characters long");
    return false;
  }

  console.log("✅ Contract configuration valid");
  console.log("📍 Contract Address:", CONTRACT_CONFIG.address);
  console.log("🔗 Chain ID:", CONTRACT_CONFIG.chainId);

  return true;
}
