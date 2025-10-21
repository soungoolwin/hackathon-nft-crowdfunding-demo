"use client";

import Link from "next/link";
import { useState } from "react";

interface TeamMemberForm {
  name: string;
  role: string;
  walletAddress: string;
}

export default function SubmitProjectPage() {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "",
    githubUrl: "",
    demoUrl: "",
    imageUrl: "",
    fundingGoal: "",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMemberForm[]>([
    { name: "", role: "", walletAddress: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "DeFi",
    "NFT",
    "DAO",
    "Gaming",
    "Identity",
    "Sustainability",
    "Infrastructure",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTeamMemberChange = (
    index: number,
    field: keyof TeamMemberForm,
    value: string
  ) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index][field] = value;
    setTeamMembers(newTeamMembers);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", role: "", walletAddress: "" }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.tagline.trim()) newErrors.tagline = "Tagline is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.githubUrl.trim())
      newErrors.githubUrl = "GitHub URL is required";
    if (formData.githubUrl && !formData.githubUrl.startsWith("http")) {
      newErrors.githubUrl = "Please enter a valid URL";
    }

    const validTeamMembers = teamMembers.filter(
      (member) =>
        member.name.trim() && member.role.trim() && member.walletAddress.trim()
    );
    if (validTeamMembers.length === 0) {
      newErrors.team = "At least one complete team member is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          team: teamMembers.filter((m) => m.name.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit project");
      }

      setShowSuccess(true);

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      console.error("Error submitting project:", error);
      setErrors({ submit: "Failed to submit project. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Project Submitted Successfully!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your project has been submitted for review. Redirecting to
            homepage...
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              New Next
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Submit Your Project
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Share your innovative hackathon project with the community and start
            your crowdfunding journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., DeFi Savings Protocol"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                    errors.name
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label
                  htmlFor="tagline"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Tagline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="A brief one-liner about your project"
                  maxLength={100}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                    errors.tagline
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400`}
                />
                {errors.tagline && (
                  <p className="mt-1 text-sm text-red-500">{errors.tagline}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {formData.tagline.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project in detail..."
                  rows={6}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                    errors.description
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400 resize-none`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                    errors.category
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Links & Media */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Links & Media
            </h2>

            <div className="space-y-6">
              {/* GitHub URL */}
              <div>
                <label
                  htmlFor="githubUrl"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  GitHub Repository <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/project"
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                    errors.githubUrl
                      ? "border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400`}
                />
                {errors.githubUrl && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.githubUrl}
                  </p>
                )}
              </div>

              {/* Demo URL */}
              <div>
                <label
                  htmlFor="demoUrl"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Live Demo URL (Optional)
                </label>
                <input
                  type="url"
                  id="demoUrl"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-demo.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Project Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Use Unsplash, Imgur, or upload to IPFS
                </p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Team Members
              </h2>
              <button
                type="button"
                onClick={addTeamMember}
                className="px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg text-sm font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
              >
                + Add Member
              </button>
            </div>

            {errors.team && (
              <p className="mb-4 text-sm text-red-500">{errors.team}</p>
            )}

            <div className="space-y-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Team Member {index + 1}
                    </h3>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleTeamMemberChange(index, "name", e.target.value)
                        }
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) =>
                          handleTeamMemberChange(index, "role", e.target.value)
                        }
                        placeholder="Full Stack Developer"
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={member.walletAddress}
                      onChange={(e) =>
                        handleTeamMemberChange(
                          index,
                          "walletAddress",
                          e.target.value
                        )
                      }
                      placeholder="0x..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400 font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funding */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Crowdfunding (Optional)
            </h2>

            <div>
              <label
                htmlFor="fundingGoal"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Funding Goal (USD)
              </label>
              <input
                type="number"
                id="fundingGoal"
                name="fundingGoal"
                value={formData.fundingGoal}
                onChange={handleInputChange}
                placeholder="50000"
                min="0"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
              <p className="mt-1 text-xs text-slate-500">
                Set a funding goal for your project
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </button>
            <Link
              href="/"
              className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            New Next © 2025 - Empowering builders with blockchain technology
          </p>
        </div>
      </footer>
    </div>
  );
}
