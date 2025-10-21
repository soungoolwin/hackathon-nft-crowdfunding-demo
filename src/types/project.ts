export interface TeamMember {
  name: string;
  role: string;
  walletAddress: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  githubUrl: string;
  demoUrl?: string;
  imageUrl?: string;
  team: TeamMember[];
  createdAt: string;
  fundingGoal?: number;
  fundsRaised?: number;
  nftMinted?: boolean;
  nftTokenId?: string;
}
