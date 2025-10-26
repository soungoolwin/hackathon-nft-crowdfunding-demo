import { prisma } from "@/lib/prisma";
import TransferNFTClient from "./TransferNFTClient";

interface TransferPageProps {
  params: Promise<{ id: string }>;
}

export default async function TransferPage({ params }: TransferPageProps) {
  const { id } = await params;

  // Fetch project data from database
  const project = await prisma.project.findUnique({
    where: { id },
    include: { team: true },
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Transfer NFT
          </h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">
              Project not found. Please check the URL and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <TransferNFTClient project={project} />;
}

