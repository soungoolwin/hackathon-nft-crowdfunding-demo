"use client";

import { useProjectTeamMember } from "@/hooks/useProjectTeamMember";
import { TeamMember } from "@/types/project";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMint = async () => {
    try {
      console.log("🚀 Starting NFT minting process for project:", projectId);

      // Check if wallet is connected
      if (!walletAddress) {
        console.error("❌ No wallet address found");
        return;
      }

      console.log("📍 Using wallet address:", walletAddress);

      // Call backend API to upload metadata to Pinata
      console.log("📤 Calling backend API to upload metadata to Pinata...");
      const response = await fetch(`/api/projects/${projectId}/mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Backend API error:", errorData.error);
        return;
      }

      const result = await response.json();
      console.log("✅ Backend API response:", result);

      // Log the Pinata URL
      console.log("🎉 Pinata URL:", result.metadataUrl);
      console.log("📄 Contract Address:", result.contractAddress);
      console.log("🆔 Project ID:", result.projectId);
      console.log("💬 Message:", result.message);

      // TODO: Next step - Call smart contract with metadataUrl
      console.log(
        "⏭️  Next: Call smart contract with metadataUrl:",
        result.metadataUrl
      );
    } catch (error) {
      console.error("❌ Error in minting process:", error);
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
      className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
      Mint NFT
    </button>
  );
}
