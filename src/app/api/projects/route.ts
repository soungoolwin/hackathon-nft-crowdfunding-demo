import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        team: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      tagline,
      description,
      category,
      githubUrl,
      demoUrl,
      imageUrl,
      fundingGoal,
      team,
    } = body;

    // Validate required fields
    if (!name || !tagline || !description || !category || !githubUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!team || team.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 }
      );
    }

    // Create project with team members
    const project = await prisma.project.create({
      data: {
        name,
        tagline,
        description,
        category,
        githubUrl,
        demoUrl: demoUrl || null,
        imageUrl: imageUrl || null,
        fundingGoal: fundingGoal ? parseInt(fundingGoal) : null,
        team: {
          create: team
            .filter(
              (member: any) =>
                member.name && member.role && member.walletAddress
            )
            .map((member: any) => ({
              name: member.name,
              role: member.role,
              walletAddress: member.walletAddress,
            })),
        },
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
