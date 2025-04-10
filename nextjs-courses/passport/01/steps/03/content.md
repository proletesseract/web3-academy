# Creating a Passport Client

Now that we have our configuration set up, we'll create a Passport client to handle authentication in our Next.js application.

## Understanding the Passport Client

The Passport client is the main interface for interacting with Immutable Passport services. It provides methods for:

- Logging in and out
- Retrieving user information
- Managing authentication tokens
- Accessing the user's wallet

## Creating a Passport Service

Let's create a service file that will initialize and provide access to the Passport client throughout our application.

Create a new file called `passportService.ts` in your project's `src/lib` directory:

```typescript
// src/lib/passportService.ts
import { passport } from '@imtbl/sdk';
import { imtblConfig } from './imtblConfig';

let passportInstance: passport.Passport | null = null;

// Function to initialize the Passport client
export function initializePassport(): passport.Passport {
  if (!passportInstance) {
    passportInstance = new passport.Passport({
      baseConfig: {
        environment: imtblConfig.environment,
      },
      clientId: imtblConfig.clientId,
      redirectUri: imtblConfig.redirectUri,
      logoutRedirectUri: imtblConfig.logoutRedirectUri,
      audience: imtblConfig.audience,
      scope: imtblConfig.scope,
    });
  }
  
  return passportInstance;
}

// Function to get the existing Passport instance
export function getPassport(): passport.Passport {
  if (!passportInstance) {
    return initializePassport();
  }
  return passportInstance;
}

// Helper functions for common Passport operations
export async function getUserInfo() {
  const passport = getPassport();
  try {
    return await passport.getUserInfo();
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

export async function getAccessToken() {
  const passport = getPassport();
  try {
    return await passport.getAccessToken();
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await getAccessToken();
    return !!token;
  } catch {
    return false;
  }
}
```

This service implements the singleton pattern to ensure we only have one Passport instance throughout our application.

## React Context for Passport

To make the Passport client easily accessible in our React components, let's create a React context.

Create a new file called `PassportContext.tsx` in your project's `src/context` directory:

```typescript
// src/context/PassportContext.tsx
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { passport } from '@imtbl/sdk';
import { getPassport, getUserInfo, isAuthenticated } from '../lib/passportService';

interface PassportContextType {
  passport: passport.Passport | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userInfo: any | null; // Replace with proper type once you know the structure
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const PassportContext = createContext<PassportContextType>({
  passport: null,
  isAuthenticated: false,
  isLoading: true,
  userInfo: null,
  login: async () => {},
  logout: async () => {},
  refreshUserInfo: async () => {},
});

export const usePassport = () => useContext(PassportContext);

export function PassportProvider({ children }: { children: ReactNode }) {
  const [passportInstance, setPassportInstance] = useState<passport.Passport | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any | null>(null);

  // Initialize Passport on component mount
  useEffect(() => {
    const init = async () => {
      const instance = getPassport();
      setPassportInstance(instance);
      
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const userInformation = await getUserInfo();
        setUserInfo(userInformation);
      }
      
      setIsLoading(false);
    };
    
    init();
  }, []);

  const login = async () => {
    if (!passportInstance) return;
    try {
      await passportInstance.login();
      setIsLoggedIn(true);
      await refreshUserInfo();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    if (!passportInstance) return;
    try {
      await passportInstance.logout();
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshUserInfo = async () => {
    if (!passportInstance) return;
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  };

  return (
    <PassportContext.Provider
      value={{
        passport: passportInstance,
        isAuthenticated: isLoggedIn,
        isLoading,
        userInfo,
        login,
        logout,
        refreshUserInfo,
      }}
    >
      {children}
    </PassportContext.Provider>
  );
}
```

## Adding the Provider to Your Application

Finally, wrap your application with the PassportProvider in your `_app.tsx` file:

```typescript
// src/pages/_app.tsx or src/app/layout.tsx
import { PassportProvider } from '../context/PassportContext';

function MyApp({ Component, pageProps }) {
  return (
    <PassportProvider>
      <Component {...pageProps} />
    </PassportProvider>
  );
}

export default MyApp;
```

## Your Code Challenge

Implement the Passport client initialization in the `passportService.ts` file. Make sure you correctly configure the Passport instance using the configuration options from the previous step.

## Next Steps

In the next step, we'll implement the login functionality using the Passport client we just created. 