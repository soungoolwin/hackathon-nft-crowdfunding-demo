# New Next - NFT-Powered Crowdfunding Platform

A decentralized crowdfunding platform where hackathon projects become verifiable on-chain identities through NFTs.

## 🎯 Vision

Turn hackathon projects into fundable digital assets. Each project can mint an NFT that serves as its on-chain identity, enabling transparent crowdfunding and building a pipeline from hackathon → studio → ecosystem.

## ✨ Features Implemented

### Current Pages

1. **Project Listing Page** (`/`)

   - Beautiful grid layout showcasing all projects
   - Project cards with images, funding progress, and team info
   - Real-time statistics (total projects, NFTs minted, funds raised)
   - Responsive design with dark mode support

2. **Project Detail Page** (`/projects/[id]`)
   - Comprehensive project information
   - Team member profiles with wallet addresses
   - Funding progress tracker
   - GitHub and demo links
   - NFT verification status
   - One-click wallet address copying

### Design Features

- ✅ Minimal, modern UI with Tailwind CSS
- ✅ Smooth animations and transitions
- ✅ Gradient accents and glass morphism effects
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Custom 404 page

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Blockchain Ready**: wagmi + viem installed (ready for wallet integration)
- **React Query**: @tanstack/react-query for data management

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Project listing page
│   ├── projects/
│   │   └── [id]/
│   │       ├── page.tsx           # Project detail page
│   │       └── not-found.tsx      # Custom 404
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── data/
│   └── mockProjects.ts            # Mock project data (6 sample projects)
└── types/
    └── project.ts                 # TypeScript interfaces

```

## 🎨 Color Scheme

- Primary: Violet (600-700)
- Secondary: Indigo (600-700)
- Background: Slate gradients
- Accents: Green (success states)

## 📝 Data Model

Each project includes:

- Basic info (name, tagline, description, category)
- Team members with wallet addresses
- GitHub and demo URLs
- Funding goals and progress
- NFT minting status
- Project images

## 🔜 Next Steps (Backend Integration)

- [ ] Connect to real database
- [ ] Implement MetaMask wallet connection
- [ ] Smart contract integration (ERC-721 NFT minting)
- [ ] Polygon network integration
- [ ] Crowdfunding smart contracts
- [ ] IPFS metadata storage
- [ ] Project submission form
- [ ] Token-Bound Accounts (ERC-6551)

## 📦 Dependencies

Core packages installed:

- wagmi - Ethereum wallet integration
- viem@2.x - Ethereum interactions
- @tanstack/react-query - Data fetching

## 🌟 Demo Projects Included

1. **DeFi Savings Protocol** - Automated yield optimization
2. **NFT Marketplace for Artists** - Zero-fee creator platform
3. **DAO Governance Tool** - Simplified Web3 governance
4. **Carbon Credit Tracker** - Blockchain-verified carbon offsets
5. **Decentralized Identity System** - Self-sovereign identity
6. **GameFi Launchpad** - Web3 gaming projects

---

Built with ❤️ for the New Next hackathon community
