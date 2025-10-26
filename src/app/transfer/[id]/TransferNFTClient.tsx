"use client";

import { useState, useEffect } from "react";
import { useMetaMask } from "@/hooks/useMetaMask";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/lib/contract";
import Link from "next/link";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  walletAddress: string;
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  githubUrl: string;
  demoUrl?: string | null;
  imageUrl?: string | null;
  fundingGoal?: number | null;
  fundsRaised: number;
  nftMinted: boolean;
  nftTokenId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  team: TeamMember[];
}

interface TransferNFTClientProps {
  project: Project;
}

export default function TransferNFTClient({ project }: TransferNFTClientProps) {
  const { isConnected, address, isConnecting, error } = useMetaMask();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferStatus, setTransferStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isOwner, setIsOwner] = useState(false);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(true);

  useEffect(() => {
    if (isConnected && address && project.nftTokenId) {
      checkOwnership();
    }
  }, [isConnected, address, project.nftTokenId]);

  const checkOwnership = async () => {
    if (!address || !window.ethereum || !project.nftTokenId) {
      setIsOwner(false);
      setIsCheckingOwnership(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        provider
      );

      const owner = await contract.ownerOf(project.nftTokenId);
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    } catch (error) {
      console.error("Error checking ownership:", error);
      setIsOwner(false);
    } finally {
      setIsCheckingOwnership(false);
    }
  };

  const handleTransfer = async () => {
    if (!recipientAddress || !isConnected || !address || !project.nftTokenId) {
      return;
    }

    // Validate recipient address
    if (!ethers.isAddress(recipientAddress)) {
      setTransferStatus({
        type: "error",
        message: "Invalid recipient address",
      });
      return;
    }

    // Don't allow transferring to yourself
    if (recipientAddress.toLowerCase() === address.toLowerCase()) {
      setTransferStatus({
        type: "error",
        message: "Cannot transfer to yourself",
      });
      return;
    }

    setIsTransferring(true);
    setTransferStatus({ type: null, message: "" });

    try {
      console.log("🚀 Starting NFT transfer...");
      console.log("📋 Transfer details:", {
        from: address,
        to: recipientAddress,
        tokenId: project.nftTokenId,
      });

      // Step 1: Get provider and signer
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Step 2: Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );

      // Step 3: Call transferFrom function
      console.log("📤 Calling transferFrom...");
      const transferTx = await contract.transferFrom(
        address,
        recipientAddress,
        project.nftTokenId,
        {
          gasLimit: 200000, // Transfer doesn't need as much gas
        }
      );

      console.log("✅ Transfer transaction submitted:", transferTx.hash);

      // Step 4: Wait for confirmation
      console.log("⏳ Waiting for transaction confirmation...");
      const receipt = await transferTx.wait();

      console.log("✅ Transfer confirmed:", {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      });

      setTransferStatus({
        type: "success",
        message: `Successfully transferred NFT! Transaction: ${transferTx.hash}`,
      });

      // Clear the form
      setRecipientAddress("");
      setIsOwner(false); // They no longer own it

      // Show success alert
      alert(
        `🎉 NFT Successfully Transferred!\n\nTo: ${recipientAddress}\n\nTransaction Hash: ${transferTx.hash}\n\nThe NFT will no longer appear in your collection.`
      );
    } catch (error: any) {
      console.error("❌ Transfer failed:", error);

      let errorMessage = "Transfer failed. Please try again.";

      if (error.message) {
        if (error.message.includes("user rejected")) {
          errorMessage = "Transfer cancelled by user.";
        } else if (error.message.includes("not owner")) {
          errorMessage = "You are not the owner of this NFT.";
        } else if (error.message.includes("approve")) {
          errorMessage = "Transfer approval required.";
        } else {
          errorMessage = error.message;
        }
      }

      setTransferStatus({
        type: "error",
        message: errorMessage,
      });

      alert(`❌ Transfer Failed:\n${errorMessage}`);
    } finally {
      setIsTransferring(false);
    }
  };

  const isMounted = typeof window !== "undefined";

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/my-nfts"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to My NFTs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transfer NFT
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transfer your NFT to another wallet address
          </p>
        </div>

        {/* NFT Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-center">
                  <div className="text-8xl mb-4">🚀</div>
                  <div className="text-xl font-medium">{project.name}</div>
                  <div className="text-sm opacity-80 mt-2">
                    {project.tagline}
                  </div>
                </div>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-violet-600 text-white text-sm font-medium px-3 py-1 rounded">
              NFT #{project.nftTokenId}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {project.tagline}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Category
                </span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.category}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Team Size
                </span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.team.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Form */}
        {!isConnected ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Connect Your Wallet
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                  Please connect your MetaMask wallet to transfer this NFT.
                </p>
              </div>
            </div>
          </div>
        ) : isCheckingOwnership ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 dark:text-blue-200">
                Checking NFT ownership...
              </p>
            </div>
          </div>
        ) : !isOwner ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-medium">
                  Not Your NFT
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  You are not the owner of this NFT. Only the owner can transfer
                  it.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Transfer NFT
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="recipient"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Recipient Address
                </label>
                <input
                  type="text"
                  id="recipient"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the wallet address you want to transfer this NFT to
                </p>
              </div>

              {transferStatus.type && (
                <div
                  className={`p-4 rounded-lg ${
                    transferStatus.type === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                  }`}
                >
                  {transferStatus.message}
                </div>
              )}

              <button
                onClick={handleTransfer}
                disabled={
                  isTransferring ||
                  !recipientAddress ||
                  recipientAddress.length === 0
                }
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isTransferring || !recipientAddress
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700"
                } text-white flex items-center justify-center gap-2`}
              >
                {isTransferring ? (
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
                    Transferring...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    Transfer NFT
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
