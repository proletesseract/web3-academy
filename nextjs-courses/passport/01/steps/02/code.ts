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