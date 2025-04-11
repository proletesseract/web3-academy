# Creating a Passport Client and Implementing Login

In this step, we'll create a Passport client using the configuration we set up in the previous step, and then implement the login flow using the Ethereum provider.

## Understanding the Passport Client

The Passport client is the main interface for interacting with Immutable Passport services. It provides methods for:

- Connecting to the Ethereum network
- Managing user authentication
- Accessing the user's wallet
- Handling transactions

## Creating the Passport Client

To create a Passport client, you'll need to:

1. Import the necessary modules:
   - `passport` from `@imtbl/sdk` to access the Passport client
   - `BrowserProvider` from `ethers` to create an Ethereum-compatible provider

2. Use the configuration object we created in the previous step to initialize the Passport client.

3. Create a new instance of the Passport client using the `new passport.Passport()` constructor, passing in your configuration.

## Connecting to Ethereum and Triggering Login

To connect to Ethereum and trigger the Passport login popup, you'll need to implement a function that:

1. Gets a Passport provider using the `connectEvm()` method on your Passport client instance
2. Converts this provider to an ethers-compatible BrowserProvider
3. Calls the `eth_requestAccounts` method on the BrowserProvider to trigger the login popup

## How This Works

1. **Passport Provider**: The `connectEvm()` method returns a provider that implements the Ethereum JSON-RPC API. This provider is specifically designed to work with Passport.

2. **BrowserProvider**: We wrap the Passport provider in an ethers `BrowserProvider` to make it compatible with ethers.js, which provides a more convenient interface for interacting with Ethereum.

3. **eth_requestAccounts**: This is a standard Ethereum JSON-RPC method that requests the user to connect their wallet. When called with a Passport provider, it triggers the Passport login popup.

4. **Login Flow**: When the user interacts with the popup, they can either:
   - Log in with an existing Passport account
   - Create a new Passport account
   - Connect an existing wallet

5. **Accounts**: After successful authentication, the `eth_requestAccounts` call returns an array of the user's Ethereum addresses.

## Your Code Challenge

Complete the implementation by:

1. Importing the necessary modules (`passport` from `@imtbl/sdk` and `BrowserProvider` from `ethers`)
2. Creating the Passport client with the provided configuration
3. Implementing a function that:
   - Gets the Passport provider using `connectEvm()`
   - Converts it to a BrowserProvider
   - Calls `eth_requestAccounts` to trigger the login popup

## Next Steps

In the next step, we'll implement a more complete authentication flow with proper error handling and user state management. 