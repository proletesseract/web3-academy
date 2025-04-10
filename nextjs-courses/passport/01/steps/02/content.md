# Setting Up the Immutable SDK

In this step, we'll install the Immutable SDK in your Next.js project and set up the necessary configuration.

## Installing the SDK

First, let's install the Immutable SDK using npm:

```bash
npm install @imtbl/sdk
```

This package contains everything you need to integrate Immutable services, including Passport, into your application.

## Understanding SDK Structure

The Immutable SDK is modular, with several key components:

- `config`: Environment configuration and shared types
- `passport`: Authentication and wallet functionality
- `blockchain-data`: API for fetching blockchain data
- `checkout`: Integration with checkout experiences

For our authentication use case, we'll primarily be using the `passport` module and `config` for environment settings.

## Setting Up Environment Variables

Next, create a `.env.local` file in the root of your Next.js project to store your environment variables securely:

```
NEXT_PUBLIC_IMMUTABLE_CLIENT_ID=your-client-id-from-immutable-hub
NEXT_PUBLIC_IMMUTABLE_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_IMMUTABLE_LOGOUT_REDIRECT_URI=http://localhost:3000/
```

Replace `your-client-id-from-immutable-hub` with the Client ID you obtained from the Immutable Hub.

## Creating a Config File

Now, let's create a configuration file to centralize our Immutable SDK settings. Create a new file called `imtblConfig.ts` in your project's `src/lib` directory:

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

This file will serve as a central location for all our Immutable SDK configuration options.

## Setting Up Next.js Environment Variable Types

For better TypeScript support, let's update the Next.js environment types. Create or update the `next-env.d.ts` file in your project root:

```typescript
/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_IMMUTABLE_CLIENT_ID: string;
    NEXT_PUBLIC_IMMUTABLE_REDIRECT_URI: string;
    NEXT_PUBLIC_IMMUTABLE_LOGOUT_REDIRECT_URI: string;
  }
}
```

## Your Code Challenge

Complete the configuration by setting up the `imtblConfig.ts` file. Make sure to include all the required configuration options for the Passport client.

## Next Steps

In the next step, we'll create a Passport client using this configuration. 