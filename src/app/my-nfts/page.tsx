import { prisma } from "@/lib/prisma";
import MyNFTsClient from "@/app/my-nfts/MyNFTsClient";

export default async function MyNFTsPage() {
  // This is a server component that fetches all projects
  // The client component will filter based on wallet ownership

  try {
    const projects = await prisma.project.findMany({
      where: {
        nftMinted: true,
      },
      include: {
        team: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return <MyNFTsClient projects={projects} />;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            My NFTs
          </h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">
              Error loading NFTs. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
