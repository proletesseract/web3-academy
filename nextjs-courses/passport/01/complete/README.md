# Complete Next.js Project with Immutable Passport

This directory contains the complete implementation of the Immutable Passport integration with Next.js. You can use this as a reference for your own project.

## Project Structure

```
src/
├── app/                  # Next.js App Router (if using)
│   ├── callback/
│   │   └── page.tsx      # Callback handler for OAuth flow
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout with PassportProvider
├── components/
│   ├── LoginButton.tsx   # Login button component
│   └── UserProfile.tsx   # User profile display component
├── context/
│   └── PassportContext.tsx # Passport React context
├── lib/
│   ├── imtblConfig.ts    # Immutable SDK configuration
│   └── passportService.ts # Passport service functions
└── pages/                # Pages Router (if using instead of App Router)
    ├── _app.tsx          # App wrapper with PassportProvider
    ├── callback.tsx      # Callback handler for OAuth flow
    └── index.tsx         # Home page
```

## Key Files

### Configuration

```typescript
// src/lib/imtblConfig.ts
import { config } from '@imtbl/sdk';

export const imtblConfig = {
  environment: config.Environment.SANDBOX, // Use PRODUCTION for production apps
  clientId: process.env.NEXT_PUBLIC_IMMUTABLE_CLIENT_ID as string,
  redirectUri: process.env.NEXT_PUBLIC_IMMUTABLE_REDIRECT_URI as string,
  logoutRedirectUri: process.env.NEXT_PUBLIC_IMMUTABLE_LOGOUT_REDIRECT_URI as string,
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
};
```

### Passport Service

```typescript
// src/lib/passportService.ts
import { passport } from '@imtbl/sdk';
import { imtblConfig } from './imtblConfig';

let passportInstance: passport.Passport | null = null;

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

// More service functions here...
```

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
NEXT_PUBLIC_IMMUTABLE_CLIENT_ID=your-client-id-from-immutable-hub
NEXT_PUBLIC_IMMUTABLE_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_IMMUTABLE_LOGOUT_REDIRECT_URI=http://localhost:3000/
```

## Running the Project

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Immutable Passport credentials
4. Start the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Next Steps

Once you have this basic integration working, consider:

1. Adding protected routes
2. Implementing wallet functionality
3. Adding transaction support
4. Enhancing the UI/UX
5. Adding error handling and loading states
