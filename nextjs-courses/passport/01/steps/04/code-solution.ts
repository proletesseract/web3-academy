import { config, passport } from '@imtbl/sdk';
import { BrowserProvider, ethers } from 'ethers';

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

let passportProvider: passport.Provider;
let web3Provider: BrowserProvider;
let fromAddress: string;

// TODO: Replace with your own address
let toAddress = '0x8f3Cf7a23F3E29aE4B3c9B9c5c5c5c5c5c5c5c5c5';
// TODO: Replace with your own ERC721 contract address
const erc721ContractAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
// TODO: Replace with your own tokenId
const tokenId = '0';

const connectEvm = async () => {
  passportProvider = await passportClient.connectEvm();
  web3Provider = new BrowserProvider(passportProvider);
  const accounts = await web3Provider.send('eth_requestAccounts', []);
  fromAddress = accounts[0];
};

await connectEvm();

// Transfer and ERC721 token
const abi = ['function safeTransferFrom(address from, address to, uint256 tokenId)'];
const signer = await web3Provider.getSigner();


const contract = new ethers.Contract(erc721ContractAddress, abi, signer);

let tx;
// Send the transaction
try {
  tx = await contract.safeTransferFrom(fromAddress, toAddress, tokenId);
} catch (error: any) {
  // Handle user denying signature
  if (error.code === 4001) {
    console.error('user denied signature');
  } else {
    console.error('something went wrong: ', error.message);
  }
}

const receipt = await tx.wait();

console.log('Transaction successful:', receipt);