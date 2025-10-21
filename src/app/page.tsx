import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/project";

async function getProjects(): Promise<Project[]> {
  try {
    const baseUrl =
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL) ||
      "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/projects`, {
      cache: "no-store", // Always get fresh data
    });

    if (!res.ok) {
      console.error("Failed to fetch projects");
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  const mockProjects = await getProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                New Next
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                NFT-Powered Crowdfunding for Builders
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/submit"
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
              >
                Submit Project
              </Link>
              <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Connect MetaMask
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Discover Innovative Projects
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore hackathon projects turned into verifiable on-chain
            identities. Support builders, fund innovation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-violet-600 mb-1">
              {mockProjects.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Projects
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-violet-600 mb-1">
              {mockProjects.filter((p) => p.nftMinted).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              NFTs Minted
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-3xl font-bold text-violet-600 mb-1">
              $
              {(
                mockProjects.reduce((acc, p) => acc + (p.fundsRaised || 0), 0) /
                1000
              ).toFixed(1)}
              k
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Raised
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all hover:shadow-xl hover:shadow-violet-500/10 h-full">
                {/* Project Image */}
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
                        <div className="text-4xl mb-2">🚀</div>
                        <div className="text-sm font-medium">
                          {project.name}
                        </div>
                      </div>
                    </div>
                  )}
                  {project.nftMinted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      NFT Minted
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                    {project.category}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {project.tagline}
                  </p>

                  {/* Team */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-semibold"
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {project.team.length} team member
                      {project.team.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Funding Progress */}
                  {project.fundingGoal && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          ${(project.fundsRaised || 0).toLocaleString()} raised
                        </span>
                        <span className="text-slate-500 dark:text-slate-500">
                          {Math.round(
                            ((project.fundsRaised || 0) / project.fundingGoal) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              ((project.fundsRaised || 0) /
                                project.fundingGoal) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
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
