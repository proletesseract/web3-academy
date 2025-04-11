import { config } from '@imtbl/sdk';

const imtblConfig = {
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: '4567-8901-2345-6789',
  },
  clientId: '1234-5678-9012-3456',
  redirectUri: 'http://localhost:3000/redirect',
  logoutRedirectUri: 'http://localhost:3000/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
}; 