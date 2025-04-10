# Implementing User Login

Now that we have created our Passport service and context, let's implement the login functionality in our Next.js application.

## Creating a Login Button Component

First, let's create a reusable login button component that will handle the login process:

```typescript
// src/components/LoginButton.tsx
import { usePassport } from '../context/PassportContext';

export function LoginButton() {
  const { login, isAuthenticated, isLoading, userInfo } = usePassport();

  const handleLogin = () => {
    login();
  };

  if (isLoading) {
    return <button disabled>Loading...</button>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Logged in as: {userInfo?.email || 'User'}</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Login with Immutable
    </button>
  );
}
```

## Creating a Callback Page

When a user logs in with Passport, they will be redirected back to your application at the redirect URI you specified in your configuration. We need to create a callback page to handle this redirect:

```typescript
// src/pages/callback.tsx or src/app/callback/page.tsx
'use client'; // If using App Router

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // or 'next/navigation' for App Router
import { usePassport } from '../context/PassportContext';

export default function CallbackPage() {
  const router = useRouter();
  const { passport, refreshUserInfo } = usePassport();
  const [error, setError] = useState<string | null>(null);

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
        setError('Failed to complete login. Please try again.');
      }
    };

    handleCallback();
  }, [passport, refreshUserInfo, router]);

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Authentication Error</h1>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Logging you in...</h1>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
}
```

## Creating a User Profile Component

Let's also create a component to display user information after a successful login:

```typescript
// src/components/UserProfile.tsx
import { usePassport } from '../context/PassportContext';

export function UserProfile() {
  const { userInfo, logout, isAuthenticated, isLoading } = usePassport();

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  if (!isAuthenticated || !userInfo) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="bg-white shadow rounded p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      
      <div className="mb-4">
        <p><strong>Email:</strong> {userInfo.email || 'Not available'}</p>
        <p><strong>User ID:</strong> {userInfo.sub || 'Not available'}</p>
      </div>
      
      {userInfo.nickname && (
        <p><strong>Nickname:</strong> {userInfo.nickname}</p>
      )}
      
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
```

## Using the Components in a Page

Now, let's update our home page to use these components:

```typescript
// src/pages/index.tsx or src/app/page.tsx
'use client'; // If using App Router

import { LoginButton } from '../components/LoginButton';
import { UserProfile } from '../components/UserProfile';
import { usePassport } from '../context/PassportContext';

export default function HomePage() {
  const { isAuthenticated, isLoading } = usePassport();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Immutable Passport Demo</h1>
      
      <div className="mb-8">
        <LoginButton />
      </div>
      
      {!isLoading && isAuthenticated && (
        <div className="mt-8">
          <UserProfile />
        </div>
      )}
    </div>
  );
}
```

## Testing the Login Flow

To test the login flow:

1. Start your Next.js development server: `npm run dev`
2. Navigate to your home page at http://localhost:3000
3. Click the "Login with Immutable" button
4. You will be redirected to the Immutable Passport login page
5. After logging in, you'll be redirected back to your application's callback page
6. If everything is configured correctly, you should be redirected to your home page and see your user information

## Your Code Challenge

Implement the login callback handling in the callback page. Make sure you correctly handle the redirect from Immutable Passport after a user logs in.

## Congratulations!

You've successfully integrated Immutable Passport into your Next.js application! Users can now log in, view their profile information, and log out.

## Next Steps

Here are some additional features you might want to implement:

- Add protected routes that only authenticated users can access
- Implement wallet functionality to allow users to make transactions
- Add error handling and loading states for a better user experience
- Set up persistent sessions so users remain logged in when they return to your application 