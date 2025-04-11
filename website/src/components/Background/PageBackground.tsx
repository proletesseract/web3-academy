'use client';

import React from 'react';
import Image from 'next/image';

export default function PageBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <Image
        src="/images/bg.avif"
        alt="Background"
        fill
        priority
        quality={100}
        style={{ objectFit: 'cover', opacity: 0.9 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
    </div>
  );
} 