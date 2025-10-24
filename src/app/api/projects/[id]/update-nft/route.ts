import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/projects/[id]/update-nft - Update project after successful NFT minting
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tokenId, transactionHash } = body;

    console.log("🔄 Updating project NFT status:", { projectId: id, tokenId, transactionHash });

    // Validate required fields
    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      );
    }

    // Update project with NFT information
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        nftMinted: true,
        nftTokenId: tokenId.toString(),
        updatedAt: new Date(),
      },
      include: { team: true },
    });

    console.log("✅ Project updated successfully:", {
      projectId: id,
      nftMinted: updatedProject.nftMinted,
      nftTokenId: updatedProject.nftTokenId,
      transactionHash,
    });

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: "Project NFT status updated successfully",
    });

  } catch (error) {
    console.error("❌ Error updating project NFT status:", error);
    return NextResponse.json(
      { error: "Failed to update project NFT status" },
      { status: 500 }
    );
  }
}
