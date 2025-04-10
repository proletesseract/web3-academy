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