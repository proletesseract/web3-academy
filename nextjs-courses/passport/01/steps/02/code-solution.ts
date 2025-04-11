import { config } from '@imtbl/sdk';

// Complete Passport configuration with all required properties
export const imtblConfig = {
  // Environment: SANDBOX for development, PRODUCTION for live apps
  environment: config.Environment.SANDBOX,
  
  // Client ID from your Immutable application registration
  clientId: process.env.NEXT_PUBLIC_IMMUTABLE_CLIENT_ID as string,
  
  // Where users will be redirected after authentication
  redirectUri: process.env.NEXT_PUBLIC_IMMUTABLE_REDIRECT_URI as string,
  
  // Where users will be redirected after logout
  logoutRedirectUri: process.env.NEXT_PUBLIC_IMMUTABLE_LOGOUT_REDIRECT_URI as string,
  
  // Audience for Passport authentication
  audience: 'platform_api',
  
  // Required permissions for the application
  scope: 'openid offline_access email transact'
}; 