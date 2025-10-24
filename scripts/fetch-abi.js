// Script to fetch the actual ABI from Etherscan
const https = require("https");

const CONTRACT_ADDRESS = "0x3b3d58d32a33741a8b44a7f36c9e9759804ff4ad";
const ETHERSCAN_API_URL = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESS}`;

async function fetchABI() {
  return new Promise((resolve, reject) => {
    https
      .get(ETHERSCAN_API_URL, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            if (response.status === "1" && response.result) {
              const abi = JSON.parse(response.result);
              resolve(abi);
            } else {
              reject(
                new Error(`API Error: ${response.message || "Unknown error"}`)
              );
            }
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function testWithRealABI() {
  try {
    console.log("🔍 Fetching contract ABI from Etherscan...");
    const abi = await fetchABI();

    console.log("✅ ABI fetched successfully");
    console.log("📋 Available functions:");

    const functions = abi.filter((item) => item.type === "function");
    functions.forEach((func) => {
      console.log(
        `  - ${func.name}(${func.inputs.map((input) => input.type).join(", ")})`
      );
    });

    // Save ABI to file
    const fs = require("fs");
    fs.writeFileSync("contract-abi.json", JSON.stringify(abi, null, 2));
    console.log("💾 ABI saved to contract-abi.json");
  } catch (error) {
    console.error("❌ Failed to fetch ABI:", error.message);
  }
}

testWithRealABI();
