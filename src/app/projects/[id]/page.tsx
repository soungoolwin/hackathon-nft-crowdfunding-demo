import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Project } from "@/types/project";
import CopyButton from "@/components/CopyButton";
import MintNFTButton from "@/components/MintNFTButton";
import WalletStatus from "@/components/WalletStatus";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const baseUrl =
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL) ||
      "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/projects/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const fundingPercentage = project.fundingGoal
    ? Math.round(((project.fundsRaised || 0) / project.fundingGoal) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <svg
                className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-violet-600 transition-colors">
                Back to Projects
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <MintNFTButton
                projectTeam={project.team}
                nftMinted={project.nftMinted || false}
                projectId={project.id}
              />
              <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                Fund Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full text-sm font-medium">
              {project.category}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-500">
              Created{" "}
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {project.name}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            {project.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Image */}
            <div className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600">
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
                    <div className="text-6xl mb-4">🚀</div>
                    <div className="text-xl font-medium">{project.name}</div>
                    <div className="text-sm opacity-80 mt-2">
                      {project.tagline}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Status */}
            <WalletStatus projectTeam={project.team} />

            {/* About Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                About This Project
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Links */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Resources
              </h2>
              <div className="space-y-3">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                >
                  <svg
                    className="w-6 h-6 text-slate-700 dark:text-slate-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                      View on GitHub
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-500">
                      Source code and documentation
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <svg
                      className="w-6 h-6 text-slate-700 dark:text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                        Live Demo
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-500">
                        Try the application
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Team Members
              </h2>
              <div className="space-y-4">
                {project.team.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {member.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {member.role}
                      </div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-500 truncate mt-1">
                        {member.walletAddress}
                      </div>
                    </div>
                    <CopyButton text={member.walletAddress} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Funding Card */}
            {project.fundingGoal && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 sticky top-24">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    ${(project.fundsRaised || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    raised of ${project.fundingGoal.toLocaleString()} goal
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {fundingPercentage}% funded
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-violet-500/25">
                  Back This Project
                </button>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    By backing this project, you&apos;ll receive rewards and
                    help bring this innovation to life.
                  </div>
                </div>
              </div>
            )}

            {/* NFT Info Card */}
            {project.nftMinted && project.nftTokenId && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    NFT Verified
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 dark:text-green-300">
                      Token ID:
                    </span>
                    <span className="font-mono font-semibold text-green-900 dark:text-green-100">
                      #{project.nftTokenId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 dark:text-green-300">
                      Network:
                    </span>
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      Polygon
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                  <a
                    href={`https://opensea.io/assets/matic/contract/${project.nftTokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors"
                  >
                    View on OpenSea
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            New Next © 2025 - Empowering builders with blockchain technology
          </p>
        </div>
      </footer>
    </div>
  );
}
