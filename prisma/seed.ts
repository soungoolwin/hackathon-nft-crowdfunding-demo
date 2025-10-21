import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.teamMember.deleteMany();
  await prisma.project.deleteMany();

  // Create sample projects
  const projects = [
    {
      name: "DeFi Savings Protocol",
      tagline: "Automated savings with yield optimization",
      description:
        "A decentralized savings protocol that automatically allocates your funds across multiple DeFi protocols to maximize yield while minimizing risk. Users can set savings goals and the smart contract handles the complexity of portfolio rebalancing.",
      category: "DeFi",
      githubUrl: "https://github.com/example/defi-savings",
      demoUrl: "https://demo.defisavings.com",
      imageUrl:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
      fundingGoal: 50000,
      fundsRaised: 12500,
      nftMinted: true,
      nftTokenId: "1",
      team: {
        create: [
          {
            name: "Alice Chen",
            role: "Smart Contract Developer",
            walletAddress: "0x1234567890123456789012345678901234567890",
          },
          {
            name: "Bob Kumar",
            role: "Frontend Developer",
            walletAddress: "0x2345678901234567890123456789012345678901",
          },
        ],
      },
    },
    {
      name: "NFT Marketplace for Artists",
      tagline: "Empowering creators with zero platform fees",
      description:
        "A community-driven NFT marketplace built specifically for independent artists. Features include lazy minting, royalty splits, collaborative drops, and a creator-first revenue model with zero listing fees.",
      category: "NFT",
      githubUrl: "https://github.com/example/nft-marketplace",
      demoUrl: "https://demo.artistnft.com",
      imageUrl:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
      fundingGoal: 30000,
      fundsRaised: 8000,
      nftMinted: false,
      team: {
        create: [
          {
            name: "David Park",
            role: "Full Stack Developer",
            walletAddress: "0x4567890123456789012345678901234567890123",
          },
          {
            name: "Emma Wilson",
            role: "UI/UX Designer",
            walletAddress: "0x5678901234567890123456789012345678901234",
          },
        ],
      },
    },
    {
      name: "DAO Governance Tool",
      tagline: "Simplified governance for Web3 communities",
      description:
        "A comprehensive governance platform for DAOs with features like quadratic voting, delegation, proposal templates, and automated execution. Supports multiple blockchain networks and integrates with popular DAO frameworks.",
      category: "DAO",
      githubUrl: "https://github.com/example/dao-governance",
      imageUrl:
        "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
      fundingGoal: 75000,
      fundsRaised: 45000,
      nftMinted: true,
      nftTokenId: "2",
      team: {
        create: [
          {
            name: "Frank Zhang",
            role: "Blockchain Architect",
            walletAddress: "0x6789012345678901234567890123456789012345",
          },
          {
            name: "Grace Lee",
            role: "Smart Contract Developer",
            walletAddress: "0x7890123456789012345678901234567890123456",
          },
        ],
      },
    },
  ];

  for (const projectData of projects) {
    await prisma.project.create({
      data: projectData,
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`📦 Created ${projects.length} projects`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
