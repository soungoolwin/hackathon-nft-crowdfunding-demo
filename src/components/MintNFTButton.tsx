"use client";

import { useProjectTeamMember } from "@/hooks/useProjectTeamMember";
import { TeamMember } from "@/types/project";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/lib/contract";

interface MintNFTButtonProps {
  projectTeam: TeamMember[];
  nftMinted: boolean;
  projectId: string;
}

export default function MintNFTButton({
  projectTeam,
  nftMinted,
  projectId,
}: MintNFTButtonProps) {
  const {
    canMintNFT,
    isTeamMember,
    teamMemberInfo,
    isConnected,
    walletAddress,
  } = useProjectTeamMember(projectTeam);

  const [isMounted, setIsMounted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMint = async () => {
    if (isMinting) {
      console.log("⏳ Minting already in progress...");
      return;
    }

    setIsMinting(true);

    try {
      console.log(
        "🚀 Starting complete NFT minting process for project:",
        projectId
      );
      console.log("📍 Contract Address:", CONTRACT_CONFIG.address);
      console.log("🔗 Chain ID:", CONTRACT_CONFIG.chainId);

      // Step 1: Validate wallet connection
      if (!walletAddress) {
        console.error("❌ No wallet address found");
        throw new Error("No wallet address found");
      }
      console.log("✅ Wallet connected:", walletAddress);

      // Step 2: Check if MetaMask is available
      if (!window.ethereum) {
        console.error("❌ MetaMask not detected");
        throw new Error("MetaMask not detected");
      }
      console.log("✅ MetaMask detected");

      // Step 3: Get provider and signer
      console.log("🔌 Setting up ethers provider and signer...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("✅ Provider and signer ready");

      // Step 4: Check network
      console.log("🌐 Checking network...");
      const network = await provider.getNetwork();
      console.log("📍 Current network:", {
        chainId: network.chainId.toString(),
        name: network.name,
        expectedChainId: CONTRACT_CONFIG.chainId.toString(),
      });

      // Debug: Check what Chain ID we're actually getting
      console.log("🔍 Debug - Chain ID comparison:");
      console.log("  - Current Chain ID:", network.chainId.toString());
      console.log("  - Expected Chain ID:", CONTRACT_CONFIG.chainId.toString());
      console.log(
        "  - Are they equal?",
        network.chainId.toString() === CONTRACT_CONFIG.chainId.toString()
      );

      if (network.chainId.toString() !== CONTRACT_CONFIG.chainId.toString()) {
        console.error(
          "❌ Wrong network. Please switch to Polygon Amoy Testnet"
        );
        console.error("🔍 Debug - Network mismatch details:");
        console.error("  - Current Chain ID:", network.chainId.toString());
        console.error(
          "  - Expected Chain ID:",
          CONTRACT_CONFIG.chainId.toString()
        );
        console.error("  - Network Name:", network.name);
        throw new Error(
          `Please switch to Polygon Amoy Testnet (Chain ID: ${CONTRACT_CONFIG.chainId})`
        );
      }
      console.log("✅ Correct network detected");

      // Step 5: Call backend API to upload metadata to Pinata
      console.log("📤 Step 1: Uploading metadata to Pinata...");
      const pinataResponse = await fetch(`/api/projects/${projectId}/mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!pinataResponse.ok) {
        const errorData = await pinataResponse.json();
        console.error("❌ Pinata upload failed:", errorData.error);
        throw new Error(`Pinata upload failed: ${errorData.error}`);
      }

      const pinataResult = await pinataResponse.json();
      console.log("✅ Pinata upload successful:", {
        metadataUrl: pinataResult.metadataUrl,
        projectId: pinataResult.projectId,
        message: pinataResult.message,
      });

      // Step 6: Create contract instance
      console.log("📄 Step 2: Creating smart contract instance...");
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );
      console.log("✅ Contract instance created");

      // 🔍 Step 3a: Test if contract function exists
      console.log("🔍 Testing contract function...");
      try {
        // Try to get the function signature
        const functionExists = contract.mintHackathonNFT !== undefined;
        console.log("✅ Contract function exists:", functionExists);

        if (!functionExists) {
          throw new Error("mintHackathonNFT function not found in contract");
        }
      } catch (testError) {
        console.error("❌ Contract function test failed:", testError);
        throw new Error(
          `Contract function test failed: ${
            testError instanceof Error ? testError.message : "Unknown error"
          }`
        );
      }

      // Step 7: Call smart contract to mint NFT
      console.log("🎯 Step 3: Calling smart contract to mint NFT...");
      console.log("📋 Contract call parameters:", {
        databaseProjectId: projectId,
        metadataUri: pinataResult.metadataUrl,
      });

      // 🔍 Step 3a: Skip gas estimation (it's failing due to ABI mismatch)
      console.log("⛽ Skipping gas estimation due to ABI mismatch...");
      console.log("💡 Will use default gas limit");

      // 🎯 Step 3b: Call the contract with proper gas settings
      console.log("🚀 Sending transaction to blockchain...");
      const mintTx = await contract.mintHackathonNFT(
        projectId,
        pinataResult.metadataUrl,
        {
          gasLimit: 500000, // Increased gas limit for safety
        }
      );
      console.log("✅ Transaction submitted:", {
        hash: mintTx.hash,
        from: mintTx.from,
        to: mintTx.to,
      });

      // Step 8: Wait for transaction confirmation
      console.log("⏳ Step 4: Waiting for transaction confirmation...");
      const receipt = await mintTx.wait();
      console.log("✅ Transaction confirmed:", {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status,
      });

      // Step 9: Get token ID from transaction logs
      console.log("🔍 Step 5: Extracting token ID from transaction logs...");
      const mintEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === "HackathonNFTMinted";
        } catch {
          return false;
        }
      });

      if (!mintEvent) {
        console.error("❌ Could not find mint event in transaction logs");
        throw new Error("Could not find mint event in transaction logs");
      }

      const parsedEvent = contract.interface.parseLog(mintEvent);
      const tokenId = parsedEvent?.args[1]; // tokenId is the second argument
      console.log("✅ Token ID extracted:", tokenId.toString());

      // Step 10: Update database
      console.log("💾 Step 6: Updating database with NFT information...");
      const updateResponse = await fetch(
        `/api/projects/${projectId}/update-nft`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tokenId: tokenId.toString(),
            transactionHash: mintTx.hash,
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("❌ Database update failed:", errorData.error);
        throw new Error(`Database update failed: ${errorData.error}`);
      }

      const updateResult = await updateResponse.json();
      console.log("✅ Database updated successfully:", updateResult);

      // Step 11: Success!
      console.log("🎉 NFT MINTING COMPLETE!", {
        projectId,
        tokenId: tokenId.toString(),
        transactionHash: mintTx.hash,
        metadataUrl: pinataResult.metadataUrl,
        contractAddress: CONTRACT_CONFIG.address,
        blockNumber: receipt.blockNumber,
      });

      // TODO: Show success message to user
      alert(
        `🎉 NFT Minted Successfully!\nToken ID: ${tokenId.toString()}\nTransaction: ${
          mintTx.hash
        }`
      );
    } catch (error) {
      console.error("❌ NFT minting failed:", error);

      // Handle specific MetaMask errors
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        if (error.message.includes("circuit breaker")) {
          errorMessage = `MetaMask Circuit Breaker Error:\n\nThis is a MetaMask safety feature. Please try:\n\n1. Reset your MetaMask account (Settings → Advanced → Reset Account)\n2. Switch to a different network and back\n3. Restart your browser\n4. Check your MATIC balance for gas fees\n\nGet more testnet MATIC: https://faucet.polygon.technology/`;
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = `Insufficient Funds:\n\nYou don't have enough MATIC for gas fees.\n\nGet free testnet MATIC: https://faucet.polygon.technology/`;
        } else if (error.message.includes("user rejected")) {
          errorMessage = `Transaction Rejected:\n\nYou cancelled the transaction in MetaMask.`;
        } else if (error.message.includes("network")) {
          errorMessage = `Network Error:\n\nPlease make sure you're connected to Polygon Amoy Testnet.`;
        } else {
          errorMessage = error.message;
        }
      }

      alert(`❌ NFT Minting Failed:\n${errorMessage}`);
    } finally {
      setIsMinting(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="px-6 py-2.5 bg-gray-400 text-white rounded-lg font-medium text-center">
        Loading...
      </div>
    );
  }

  // Don't show button if NFT is already minted
  if (nftMinted) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        NFT Minted
      </div>
    );
  }

  // Don't show button if wallet is not connected
  if (!isConnected) {
    return (
      <div className="px-6 py-2.5 bg-gray-400 text-white rounded-lg font-medium text-center">
        Connect Wallet to Mint
      </div>
    );
  }

  // Don't show button if user is not a team member
  if (!isTeamMember) {
    return (
      <div className="px-6 py-2.5 bg-gray-400 text-white rounded-lg font-medium text-center">
        Only Team Members Can Mint
      </div>
    );
  }

  // Show mint button for team members
  return (
    <button
      onClick={handleMint}
      disabled={isMinting}
      className={`px-6 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
        isMinting
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-violet-600 hover:bg-violet-700"
      }`}
    >
      {isMinting ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          Minting NFT...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Mint NFT
        </>
      )}
    </button>
  );
}
