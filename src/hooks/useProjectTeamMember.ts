"use client";

import { useMetaMask } from "@/hooks/useMetaMask";
import { TeamMember } from "@/types/project";

export function useProjectTeamMember(projectTeam: TeamMember[]) {
  const { isConnected, address } = useMetaMask();

  const isTeamMember = () => {
    if (!isConnected || !address) {
      return false;
    }

    // Check if the connected wallet address matches any team member's wallet address
    return projectTeam.some(
      (member) => member.walletAddress.toLowerCase() === address.toLowerCase()
    );
  };

  const canMintNFT = () => {
    return isConnected && address && isTeamMember();
  };

  const getTeamMemberInfo = () => {
    if (!isConnected || !address) {
      return null;
    }

    return (
      projectTeam.find(
        (member) => member.walletAddress.toLowerCase() === address.toLowerCase()
      ) || null
    );
  };

  return {
    isTeamMember: isTeamMember(),
    canMintNFT: canMintNFT(),
    teamMemberInfo: getTeamMemberInfo(),
    isConnected,
    walletAddress: address,
  };
}
