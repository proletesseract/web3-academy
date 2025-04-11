import { config, passport } from '@imtbl/sdk';
import { BrowserProvider } from 'ethers';

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

// Initialize the Passport client with the configuration
const passportClient = new passport.Passport(imtblConfig);

const connectEvm = async () => {
  const passportProvider = await passportClient.connectEvm();
  const web3Provider = new BrowserProvider(passportProvider);
  const accounts = await web3Provider.send('eth_requestAccounts', []);
  console.log(accounts);
};

connectEvm();

// Send a transaction

