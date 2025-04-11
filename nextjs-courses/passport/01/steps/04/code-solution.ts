// src/app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { passportClient } from '../../lib/passportClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Process the authentication callback
        await passportClient.loginCallback();
        
        // Redirect to the dashboard after successful login
        router.push('/dashboard');
      } catch (error) {
        console.error('Authentication error:', error);
        // Redirect to login page with error
        router.push('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [router]);

  // Return a loading UI component
  return null;
} 