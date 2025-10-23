import axios from "axios";

// Pinata API configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_GATEWAY =
  process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud";

// Pinata API endpoints
const PINATA_PIN_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
const PINATA_PIN_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// NFT Metadata interface (OpenSea standard)
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
}

// Project metadata interface
export interface ProjectMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// Team member interface
export interface TeamMember {
  name: string;
  role: string;
  walletAddress: string;
}

// Project data interface
export interface ProjectData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  githubUrl: string;
  demoUrl?: string;
  imageUrl?: string;
  fundingGoal?: number;
  fundsRaised?: number;
  team: TeamMember[];
  createdAt: string;
}

/**
 * Upload JSON metadata to Pinata and return IPFS hash
 * @param metadata - The metadata object to upload
 * @returns Promise<string> - IPFS hash (QmXYZ...)
 */
export async function uploadMetadataToPinata(
  metadata: NFTMetadata
): Promise<string> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error(
      "Pinata API keys not configured. Please check your .env.local file."
    );
  }

  try {
    const response = await axios.post(
      PINATA_PIN_JSON_URL,
      {
        pinataContent: metadata,
        pinataMetadata: {
          name: `hackathon-project-${metadata.name}-${Date.now()}`,
        },
        pinataOptions: {
          cidVersion: 1,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    console.log("✅ Metadata uploaded to Pinata:", ipfsHash);
    return ipfsHash;
  } catch (error) {
    console.error("❌ Error uploading metadata to Pinata:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
    }
    throw new Error(`Failed to upload metadata to Pinata: ${error}`);
  }
}

/**
 * Create NFT metadata from project data
 * @param project - Project data from database
 * @returns NFTMetadata object ready for Pinata
 */
export function createProjectMetadata(project: ProjectData): NFTMetadata {
  const attributes = [
    // Basic project info
    { trait_type: "Category", value: project.category },
    { trait_type: "Tagline", value: project.tagline },
    { trait_type: "Team Size", value: project.team.length },
    { trait_type: "Funding Goal", value: project.fundingGoal || 0 },
    { trait_type: "Funds Raised", value: project.fundsRaised || 0 },

    // Project URLs
    { trait_type: "GitHub Repository", value: project.githubUrl },
    { trait_type: "Demo URL", value: project.demoUrl || "N/A" },

    // Timestamps
    {
      trait_type: "Created At",
      value: new Date(project.createdAt).toISOString(),
    },
    { trait_type: "Project ID", value: project.id },

    // Team members
    ...project.team.map((member, index) => ({
      trait_type: `Team Member ${index + 1}`,
      value: `${member.name} (${member.role})`,
    })),

    // Team member wallet addresses
    ...project.team.map((member, index) => ({
      trait_type: `Team Member ${index + 1} Wallet`,
      value: member.walletAddress,
    })),
  ];

  return {
    name: project.name,
    description: project.description,
    image:
      project.imageUrl ||
      "https://via.placeholder.com/400x300/6366f1/ffffff?text=Hackathon+Project",
    external_url: project.githubUrl,
    attributes,
  };
}

/**
 * Get IPFS URL from hash
 * @param ipfsHash - IPFS hash (QmXYZ...)
 * @returns Full IPFS URL
 */
export function getIPFSUrl(ipfsHash: string): string {
  return `${PINATA_GATEWAY}/ipfs/${ipfsHash}`;
}

/**
 * Upload project metadata to Pinata and return IPFS URL
 * @param project - Project data from database
 * @returns Promise<string> - Full IPFS URL (https://gateway.pinata.cloud/ipfs/QmXYZ...)
 */
export async function uploadProjectMetadata(
  project: ProjectData
): Promise<string> {
  try {
    // Create metadata object
    const metadata = createProjectMetadata(project);

    // Upload to Pinata
    const ipfsHash = await uploadMetadataToPinata(metadata);

    // Return full IPFS URL
    const ipfsUrl = getIPFSUrl(ipfsHash);
    console.log("🎉 Project metadata uploaded successfully!");
    console.log("📄 IPFS URL:", ipfsUrl);

    return ipfsUrl;
  } catch (error) {
    console.error("❌ Error uploading project metadata:", error);
    throw error;
  }
}

/**
 * Test Pinata connection
 * @returns Promise<boolean> - True if connection successful
 */
export async function testPinataConnection(): Promise<boolean> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.error("❌ Pinata API keys not configured");
    return false;
  }

  try {
    const testMetadata = {
      name: "Test Project",
      description: "This is a test metadata upload",
      image: "https://via.placeholder.com/400x300",
      attributes: [{ trait_type: "Test", value: "Connection" }],
    };

    const ipfsHash = await uploadMetadataToPinata(testMetadata);
    console.log("✅ Pinata connection test successful!");
    console.log("🔗 Test metadata URL:", getIPFSUrl(ipfsHash));
    return true;
  } catch (error) {
    console.error("❌ Pinata connection test failed:", error);
    return false;
  }
}
