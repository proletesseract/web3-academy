'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TestBackgroundPage() {
  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-white">Background Image Test</h1>
      
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-3 text-gray-900">Direct Image Test</h2>
        <div className="relative h-64 mb-4">
          <Image 
            src="/images/bg-space.jpg"
            alt="Space background"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <p className="text-gray-800">If you can see a space background above, the image is loading correctly.</p>
      </div>
      
      <Link href="/" className="text-blue-400 hover:underline">
        Back to Home
      </Link>
    </div>
  );
} 