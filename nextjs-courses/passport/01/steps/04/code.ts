// src/pages/callback.tsx or src/app/callback/page.tsx
'use client'; // If using App Router

import { useEffect } from 'react';
import { useRouter } from 'next/router'; // or 'next/navigation' for App Router
import { usePassport } from '../context/PassportContext';

export default function CallbackPage() {
  const router = useRouter();
  const { passport, refreshUserInfo } = usePassport();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!passport) {
          throw new Error('Passport not initialized');
        }

        // Handle the callback from Immutable Passport
        await passport.loginCallback();
        
        // Refresh user info after successful login
        await refreshUserInfo();
        
        // Redirect to home page or dashboard
        router.push('/');
      } catch (err) {
        console.error('Login callback error:', err);
      }
    };

    handleCallback();
  }, [passport, refreshUserInfo, router]);

  return (
    <div>
      <h1>Logging you in...</h1>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
} 