# Setting Up the Passport Instance

In this step, we'll focus specifically on configuring the Passport instance for your Next.js application. Passport is Immutable's authentication solution that provides secure, seamless user authentication and wallet connection.

## Understanding Passport Configuration

Passport requires specific configuration options to function correctly. Let's go through each option in detail:

### Base Configuration

The `baseConfig` object contains core configuration settings for connecting to Immutable's services:

- `environment`: Determines which Immutable environment your application will connect to:
  - `SANDBOX`: Use this for development and testing. It connects to Immutable's sandbox environment where you can test features without using real assets.
  - `PRODUCTION`: Use this for your live application. It connects to Immutable's production environment where real transactions occur.
- `publishableKey`: A public key that identifies your application to Immutable's services. This is different from your client ID and is used for certain API operations.

```typescript
baseConfig: {
  environment: config.Environment.SANDBOX, // or config.Environment.PRODUCTION
  publishableKey: process.env.NEXT_PUBLIC_IMMUTABLE_PUBLISHABLE_KEY as string
}
```

### Client ID

The `clientId` is a unique identifier for your application. You obtain this when registering your application with Immutable:

- It's used to identify your application to Immutable's services
- It's required for all authentication flows
- It should be stored as an environment variable for security

```typescript
clientId: process.env.NEXT_PUBLIC_IMMUTABLE_CLIENT_ID as string
```

### Redirect URI

The `redirectUri` is where users will be sent after completing the authentication process:

- It must match exactly what you registered with Immutable
- It should be a valid URL in your application (typically a callback route)
- It's used in the OAuth flow to return users to your application

```typescript
redirectUri: process.env.NEXT_PUBLIC_IMMUTABLE_REDIRECT_URI as string
```

### Logout Redirect URI

The `logoutRedirectUri` is where users will be sent after logging out:

- Similar to the redirect URI, it must match what you registered
- It's typically a page in your application where users land after signing out
- It helps provide a seamless user experience during the logout flow

```typescript
logoutRedirectUri: process.env.NEXT_PUBLIC_IMMUTABLE_LOGOUT_REDIRECT_URI as string
```

### Audience

The `audience` option specifies which API the authentication token is intended for:

- For Passport, this should be set to `'platform_api'`
- It's used in the JWT token to indicate which service should accept the token
- This is a required field for proper authentication

```typescript
audience: 'platform_api'
```

### Scope

The `scope` option defines what permissions your application is requesting:

- `openid`: Required for OpenID Connect authentication
- `offline_access`: Allows your application to refresh tokens
- `email`: Requests access to the user's email
- `transact`: Allows your application to initiate transactions on behalf of the user

```typescript
scope: 'openid offline_access email transact'
```

## Your Code Challenge

Complete the configuration by setting up the `imtblConfig.ts` file with all the required configuration options for the Passport client. Make sure to include all the properties we've discussed: baseConfig (with environment and publishableKey), clientId, redirectUri, logoutRedirectUri, audience, and scope.

## Next Steps

In the next step, we'll create a Passport client using this configuration and implement the authentication flow. 