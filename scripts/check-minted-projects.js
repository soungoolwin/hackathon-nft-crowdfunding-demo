// Script to check which projects have been minted
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0x3b3d58d32a33741a8b44a7f36c9e9759804ff4ad";
const RPC_URL = "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

// Simple ABI with just the function we need
const ABI = [
  {
    inputs: [
      { internalType: "string", name: "databaseProjectId", type: "string" },
    ],
    name: "isProjectMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

async function checkProjects() {
  try {
    console.log("🔍 Checking which projects have been minted...");

    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    // List of project IDs to check
    const projectIds = [
      "cmh0tsafl00008zxq6fyxz56w", // First project
      "cmh3n12qx00008zdvileldbss", // Second project
      "cmh4mwdek00028zdvee92fhrp", // Third project (failing)
    ];

    console.log("📋 Checking projects:");

    for (const projectId of projectIds) {
      try {
        const isMinted = await contract.isProjectMinted(projectId);
        console.log(
          `  - ${projectId}: ${isMinted ? "✅ MINTED" : "❌ Not minted"}`
        );
      } catch (error) {
        console.log(`  - ${projectId}: ❌ Error checking (${error.message})`);
      }
    }
  } catch (error) {
    console.error("❌ Contract check failed:", error);
  }
}

checkProjects();
