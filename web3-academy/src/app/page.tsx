'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Immutable Academy</h1>
        <p className="text-xl max-w-3xl mb-10">
          Learn how to build on Immutable X with our interactive tutorials.
          Master blockchain development through hands-on coding exercises and quizzes.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/courses" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
          >
            Start Learning
          </Link>
          <a 
            href="https://docs.immutable.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-lg font-medium"
          >
            Documentation
          </a>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-3">Interactive Learning</h2>
            <p className="text-gray-600">
              Learn by doing with interactive code examples and quizzes that test your understanding.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-3">Real-World Projects</h2>
            <p className="text-gray-600">
              Build practical projects that demonstrate how to implement Immutable X in your applications.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-3">Progress Tracking</h2>
            <p className="text-gray-600">
              Keep track of your learning progress and pick up where you left off at any time.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Immutable Academy</h2>
            <p className="text-gray-400">Learn to build on Immutable X</p>
          </div>
          
          <div className="flex gap-4">
            <a href="https://discord.gg/immutablex" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              Discord
            </a>
            <a href="https://twitter.com/Immutable" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              Twitter
            </a>
            <a href="https://www.immutable.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              Immutable
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
