// Test script to verify contract functions
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0x3b3d58d32a33741a8b44a7f36c9e9759804ff4ad";
const RPC_URL = "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

// Simple ABI with just the function we need
const ABI = [
  {
    inputs: [
      { internalType: "string", name: "databaseProjectId", type: "string" },
      { internalType: "string", name: "metadataUri", type: "string" },
    ],
    name: "mintHackathonNFT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function testContract() {
  try {
    console.log("🔍 Testing contract connection...");

    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    // Test if we can read from the contract
    console.log("✅ Contract instance created");

    // Try to get contract code
    const code = await provider.getCode(CONTRACT_ADDRESS);
    console.log("📄 Contract code length:", code.length);
    console.log("📄 Contract code (first 100 chars):", code.substring(0, 100));

    if (code === "0x" || code.length < 4) {
      console.error("❌ No contract found at this address");
      return;
    }

    console.log("✅ Contract exists at address");

    // Test function signature
    const functionExists = contract.mintHackathonNFT !== undefined;
    console.log("🔍 Function exists:", functionExists);

    // List all available functions
    console.log("📋 Available functions:");
    try {
      const functions = Object.keys(contract.interface.functions);
      functions.forEach((func) => {
        console.log(`  - ${func}`);
      });
    } catch (interfaceError) {
      console.log("⚠️ Could not list functions, but contract exists");
    }

    if (functionExists) {
      console.log("✅ mintHackathonNFT function found");

      // Check if project is already minted
      try {
        const isMinted = await contract.isProjectMinted(
          "cmh0tsafl00008zxq6fyxz56w"
        );
        console.log("🔍 Project already minted:", isMinted);

        if (isMinted) {
          console.log(
            "❌ Project is already minted - this is why gas estimation fails"
          );
          return;
        }
      } catch (checkError) {
        console.log(
          "⚠️ Could not check if project is minted:",
          checkError.message
        );
      }

      // Try to estimate gas with your actual project data
      try {
        const gasEstimate = await contract.mintHackathonNFT.estimateGas(
          "cmh0tsafl00008zxq6fyxz56w", // Your actual project ID
          "https://gateway.pinata.cloud/ipfs/bafkreic3tp6wmutixbpx4j25a5hhor6yllfndxy6ht6y7eja2icvmoo5ya" // Your actual metadata URL
        );
        console.log("✅ Gas estimation successful:", gasEstimate.toString());
      } catch (gasError) {
        console.error("❌ Gas estimation failed:", gasError.message);
        console.error("❌ Gas error details:", gasError);

        // Try to decode the custom error
        if (gasError.data) {
          console.log("🔍 Custom error data:", gasError.data);
        }
      }
    } else {
      console.error("❌ mintHackathonNFT function not found");
      console.log("💡 Available functions:", functions);
    }
  } catch (error) {
    console.error("❌ Contract test failed:", error);
  }
}

testContract();
