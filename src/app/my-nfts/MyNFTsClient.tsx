"use client";

import { useState, useEffect } from "react";
import { useMetaMask } from "@/hooks/useMetaMask";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/lib/contract";

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
  team: Array<{
    id: string;
    name: string;
    role: string;
    walletAddress: string;
    projectId: string;
  }>;
}

interface MyNFTsClientProps {
  projects: Project[];
}

export default function MyNFTsClient({ projects }: MyNFTsClientProps) {
  const { isConnected, address, isConnecting, error } = useMetaMask();
  const [ownedNFTs, setOwnedNFTs] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address && isMounted) {
      checkOwnedNFTs();
    } else {
      setOwnedNFTs([]);
    }
  }, [isConnected, address, isMounted]);

  const checkOwnedNFTs = async () => {
    if (!address || !window.ethereum) {
      return;
    }

    setIsLoading(true);

    try {
      // Create provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        provider
      );

      // Check ownership for each minted NFT
      const ownedProjects = [];

      for (const project of projects) {
        if (project.nftTokenId) {
          try {
            const owner = await contract.ownerOf(project.nftTokenId);

            // Check if owner is valid (not null or zero address)
            if (!owner || owner === ethers.ZeroAddress || owner === "0x") {
              console.log(
                `Skipping project ${project.id} - invalid owner or token burned`
              );
              continue;
            }

            // Check if the current wallet owns this NFT
            if (owner.toLowerCase() === address.toLowerCase()) {
              ownedProjects.push(project);
            }
          } catch (err) {
            // Silently skip if token doesn't exist or was burned
            console.error(
              `Error checking ownership for project ${project.id}:`,
              err
            );
          }
        }
      }

      setOwnedNFTs(ownedProjects);
    } catch (error) {
      console.error("Error checking NFT ownership:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My NFTs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all NFTs you own on the Sepolia network
          </p>
        </div>

        {/* Wallet Connection Status */}
        {!isConnected && !isConnecting ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
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
                  Please connect your MetaMask wallet to view your NFTs.
                </p>
              </div>
            </div>
          </div>
        ) : isConnecting ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 dark:text-blue-200">
                Connecting to wallet...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-green-800 dark:text-green-200 font-medium">
                    Wallet Connected
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    {address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : ""}
                  </p>
                </div>
              </div>
              {isLoading && (
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              )}
            </div>
          </div>
        )}

        {/* NFTs Grid */}
        {isConnected && (
          <>
            {ownedNFTs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No NFTs Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You don't own any NFTs yet. Start by minting an NFT from a
                  project!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Browse Projects
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {ownedNFTs.length} NFT{ownedNFTs.length !== 1 ? "s" : ""}{" "}
                    Owned
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedNFTs.map((project) => (
                    <Link
                      key={project.id}
                      href={`/transfer/${project.id}`}
                      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600">
                        {project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-white text-center">
                              <div className="text-6xl mb-2">🚀</div>
                              <div className="text-sm font-medium">
                                {project.name}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-violet-600 text-white text-xs font-medium px-2 py-1 rounded">
                          NFT #{project.nftTokenId}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {project.tagline}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          <span>{project.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
