import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 mt-auto bg-black/30 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-white/70 text-sm">
              © {currentYear} Immutable Academy. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="/about" 
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              About
            </Link>
            <Link 
              href="/privacy" 
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="https://github.com/immutable" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              GitHub
            </Link>
            <Link 
              href="https://discord.gg/immutable" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 