'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6 text-center">
      <h1 className="text-5xl font-bold mb-6 gradient-text">Immutable Academy</h1>
      <p className="text-xl max-w-3xl mb-10 text-gray-300">
        Learn how to build on Immutable X with our interactive tutorials.
        Master blockchain development through hands-on coding exercises and quizzes.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/courses" 
          className="btn-immutable-gradient"
        >
          Start Learning
        </Link>
        <a 
          href="https://docs.immutable.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-immutable"
        >
          Documentation
        </a>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Interactive Learning</h2>
          <p className="text-gray-600">
            Learn by doing with interactive code examples and quizzes that test your understanding.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Real-World Projects</h2>
          <p className="text-gray-600">
            Build practical projects that demonstrate how to implement Immutable X in your applications.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-gray-900">Progress Tracking</h2>
          <p className="text-gray-600">
            Keep track of your learning progress and pick up where you left off at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
