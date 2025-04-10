'use client';

import React, { useEffect } from 'react';
import useLessonStore from '../../store/lessonStore';
import Link from 'next/link';
import Image from 'next/image';

// Sample course data (in a real app, this would come from an API or CMS)
const sampleCourses = [
  {
    id: 'immutable-basics',
    title: 'Immutable Basics',
    description: 'Learn the fundamentals of Immutable X and how to build on the platform',
    image: '/images/immutable-basics.jpg',
    lessons: [
      {
        id: 'intro-to-immutable',
        title: 'Introduction to Immutable X',
        description: 'Get started with Immutable X and learn about its key features',
        completed: false,
        steps: [
          {
            id: 'what-is-immutable',
            title: 'What is Immutable X?',
            content: `
# What is Immutable X?

Immutable X is a Layer 2 scaling solution for NFTs on Ethereum that enables gas-free minting and trading.

It was designed to solve the challenges of trading NFTs on Ethereum, such as high gas fees, slow transaction speeds, and poor user experience.

Key features of Immutable X include:

- Zero gas fees for minting and trading
- Instant trade confirmation
- Massive scalability (up to 9,000 transactions per second)
- User and developer experience that matches Web2
- 100% carbon-neutral
            `,
          },
          {
            id: 'why-use-immutable',
            title: 'Why Use Immutable X?',
            content: `
# Why Use Immutable X?

Immutable X offers several advantages for developers and users:

## For Developers:
- Gas-free minting and trading
- Higher throughput (up to 9,000 TPS)
- Easy integration with existing Ethereum wallets
- Shared liquidity with all Immutable X marketplaces
- APIs and SDKs for easy implementation
- Comprehensive developer documentation

## For Users:
- No gas fees
- Instant confirmation of trades
- Secure ownership with the security of Ethereum
- Better user experience
- Carbon-neutral NFTs
            `,
            quiz: [
              {
                id: 'quiz-1',
                question: 'What is the main benefit of using Immutable X?',
                options: [
                  'Higher gas fees',
                  'Zero gas fees for minting and trading',
                  'Slower transaction speeds',
                  'Limited scalability'
                ],
                correctAnswer: 'Zero gas fees for minting and trading'
              },
              {
                id: 'quiz-2',
                question: 'How many transactions per second can Immutable X handle?',
                options: [
                  'Up to 15',
                  'Up to 100',
                  'Up to 1,000',
                  'Up to 9,000'
                ],
                correctAnswer: 'Up to 9,000'
              }
            ]
          },
          {
            id: 'first-code-challenge',
            title: 'Your First Immutable X Code',
            content: `
# Writing Your First Immutable X Code

Let's write some code to interact with Immutable X. In this exercise, we'll set up a basic client connection to Immutable X.

The Immutable SDK provides a simple way to interact with the Immutable X protocol. You'll need to install the SDK first:

\`\`\`bash
npm install @imtbl/sdk
\`\`\`

Now let's write some code to create a connection to Immutable X.
            `,
            codeChallenge: {
              defaultCode: `// Import the Immutable SDK
// Your task is to initialize the Immutable client correctly

import { config, BlockchainData } from '@imtbl/sdk';

async function connectToImmutable() {
  // Initialize the Immutable client
  // Use the Testnet environment
  // Create your code below:
  
  
  
  // Return the client
  return client;
}

// Execute the function
connectToImmutable()
  .then(client => console.log('Successfully connected to Immutable X'))
  .catch(error => console.error('Error connecting to Immutable X:', error));`,
              language: 'typescript',
              solution: `const client = new BlockchainData({
  baseConfig: {
    environment: config.Environment.TESTNET,
  },
});`,
              expectedOutput: 'Successfully connected to Immutable X',
              hints: [
                "You need to create a new BlockchainData client with the correct configuration",
                "Use the Environment.TESTNET constant from the config object",
                "The client needs a baseConfig object with an environment property"
              ]
            }
          }
        ]
      },
      {
        id: 'nft-marketplace',
        title: 'Building an NFT Marketplace',
        description: 'Learn how to create a simple NFT marketplace using Immutable X',
        completed: false,
        steps: [
          {
            id: 'marketplace-intro',
            title: 'Introduction to NFT Marketplaces',
            content: `
# Introduction to NFT Marketplaces

NFT marketplaces are platforms where users can buy, sell, and trade non-fungible tokens (NFTs). Immutable X provides a powerful infrastructure for building scalable and gas-free NFT marketplaces.

In this module, you'll learn how to create a simple NFT marketplace using Immutable X.
            `
          }
        ]
      }
    ]
  }
];

export default function CoursesPage() {
  const { courses, initializeCourses } = useLessonStore();
  
  useEffect(() => {
    // Initialize courses if none exist
    if (courses.length === 0) {
      initializeCourses(sampleCourses);
    }
  }, [courses.length, initializeCourses]);
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {course.image ? (
                <Image 
                  src={course.image}
                  alt={course.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                  <span className="text-blue-800 font-semibold text-lg">Immutable X</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                {course.lessons.length} {course.lessons.length === 1 ? 'lesson' : 'lessons'}
              </div>
              <Link 
                href={`/courses/${course.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Start Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 