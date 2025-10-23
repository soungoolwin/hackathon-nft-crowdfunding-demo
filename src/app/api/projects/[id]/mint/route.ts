import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadProjectMetadata } from "@/lib/pinata";
import { CONTRACT_CONFIG } from "@/lib/contract";

// POST /api/projects/[id]/mint - Mint NFT for a project
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { walletAddress } = body;

    // Validate wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Get project from database
    const project = await prisma.project.findUnique({
      where: { id },
      include: { team: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if NFT is already minted
    if (project.nftMinted) {
      return NextResponse.json(
        { error: "NFT already minted for this project" },
        { status: 400 }
      );
    }

    // Verify wallet address is a team member
    const isTeamMember = project.team.some(
      (member) => member.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!isTeamMember) {
      return NextResponse.json(
        { error: "Only team members can mint NFTs" },
        { status: 403 }
      );
    }

    // Upload metadata to Pinata
    console.log('🚀 Starting metadata upload to Pinata...');
    const metadataUrl = await uploadProjectMetadata(project);
    console.log('✅ Metadata uploaded successfully:', metadataUrl);

    // Return metadata URL for frontend to call smart contract
    return NextResponse.json({
      success: true,
      metadataUrl,
      contractAddress: CONTRACT_CONFIG.address,
      projectId: project.id,
      message: "Metadata uploaded successfully. Ready to mint NFT!"
    });

  } catch (error) {
    console.error("Error in mint API:", error);
    return NextResponse.json(
      { error: "Failed to prepare NFT minting" },
      { status: 500 }
    );
  }
}
