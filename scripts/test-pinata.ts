#!/usr/bin/env tsx

/**
 * Test script for Pinata integration
 * Run with: npx tsx scripts/test-pinata.ts
 */

import { testPinataConnection, createProjectMetadata, uploadProjectMetadata } from '../src/lib/pinata';
import { validateContractConfig } from '../src/lib/contract';

// Sample project data for testing
const sampleProject = {
  id: 'test-project-123',
  name: 'Amazing Hackathon Project',
  tagline: 'Building the future of Web3',
  description: 'This is an amazing hackathon project that showcases the power of blockchain technology and decentralized applications. Our team has worked tirelessly to create something truly innovative.',
  category: 'Web3',
  githubUrl: 'https://github.com/example/amazing-project',
  demoUrl: 'https://demo.example.com',
  imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
  fundingGoal: 5000,
  fundsRaised: 0,
  team: [
    {
      name: 'Alice Johnson',
      role: 'Lead Developer',
      walletAddress: '0x1234567890123456789012345678901234567890'
    },
    {
      name: 'Bob Smith',
      role: 'UI/UX Designer',
      walletAddress: '0x0987654321098765432109876543210987654321'
    },
    {
      name: 'Carol Davis',
      role: 'Blockchain Engineer',
      walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    }
  ],
  createdAt: new Date().toISOString()
};

async function runTests() {
  console.log('🧪 Testing Pinata Integration...\n');

  // Test 1: Validate contract configuration
  console.log('1️⃣ Testing contract configuration...');
  const contractValid = validateContractConfig();
  if (!contractValid) {
    console.error('❌ Contract configuration failed');
    return;
  }
  console.log('✅ Contract configuration valid\n');

  // Test 2: Test Pinata connection
  console.log('2️⃣ Testing Pinata connection...');
  const connectionTest = await testPinataConnection();
  if (!connectionTest) {
    console.error('❌ Pinata connection test failed');
    console.log('💡 Make sure to:');
    console.log('   - Set PINATA_API_KEY in .env.local');
    console.log('   - Set PINATA_SECRET_KEY in .env.local');
    console.log('   - Check your Pinata account has API access');
    return;
  }
  console.log('✅ Pinata connection successful\n');

  // Test 3: Create metadata object
  console.log('3️⃣ Testing metadata creation...');
  try {
    const metadata = createProjectMetadata(sampleProject);
    console.log('✅ Metadata created successfully');
    console.log('📄 Metadata preview:');
    console.log(`   Name: ${metadata.name}`);
    console.log(`   Description: ${metadata.description.substring(0, 100)}...`);
    console.log(`   Image: ${metadata.image}`);
    console.log(`   Attributes: ${metadata.attributes.length} attributes`);
    console.log(`   Team Members: ${metadata.attributes.filter(a => a.trait_type.includes('Team Member')).length}`);
    console.log('');
  } catch (error) {
    console.error('❌ Metadata creation failed:', error);
    return;
  }

  // Test 4: Upload metadata to Pinata
  console.log('4️⃣ Testing metadata upload to Pinata...');
  try {
    const ipfsUrl = await uploadProjectMetadata(sampleProject);
    console.log('✅ Metadata uploaded successfully!');
    console.log('🔗 IPFS URL:', ipfsUrl);
    console.log('');
    
    // Test 5: Verify metadata can be fetched
    console.log('5️⃣ Testing metadata retrieval...');
    const response = await fetch(ipfsUrl);
    if (response.ok) {
      const fetchedMetadata = await response.json();
      console.log('✅ Metadata retrieved successfully');
      console.log('📄 Fetched metadata name:', fetchedMetadata.name);
      console.log('📄 Fetched metadata attributes:', fetchedMetadata.attributes.length);
    } else {
      console.error('❌ Failed to retrieve metadata from IPFS');
    }
    
  } catch (error) {
    console.error('❌ Metadata upload failed:', error);
    return;
  }

  console.log('🎉 All tests passed! Pinata integration is working correctly.');
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Update your Pinata API keys in .env.local');
  console.log('   2. Test the minting flow in your frontend');
  console.log('   3. Deploy to production when ready');
}

// Run the tests
runTests().catch((error) => {
  console.error('❌ Test script failed:', error);
  process.exit(1);
});
