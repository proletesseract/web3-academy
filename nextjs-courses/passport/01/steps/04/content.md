# Implementing NFT Transfer Functionality

In this step, we'll implement the functionality to transfer an NFT using the Passport SDK. This involves connecting to the Ethereum Virtual Machine (EVM), setting up the necessary providers, and executing the transfer transaction.

## Understanding the Components

Before we start coding, let's understand the key components we'll be working with:

### Ethereum Provider Setup

To interact with the Ethereum blockchain, we need to set up two providers:
1. A Passport provider that handles authentication and transaction signing
2. A Web3 provider that interfaces with the Ethereum network

### NFT Transfer Requirements

To transfer an NFT, we need:
1. The contract address of the NFT (ERC721 token)
2. The token ID of the specific NFT we want to transfer
3. The recipient's Ethereum address

## Implementation Steps

### 1. Connect to the EVM

First, we need to establish a connection to the Ethereum Virtual Machine using the Passport client. This will:
- Create a provider that can sign transactions
- Handle the authentication flow
- Manage the connection state

### 2. Set Up the Web3 Provider

After connecting to the EVM, we need to create a Web3 provider that will:
- Interface with the Ethereum network
- Allow us to send transactions
- Handle blockchain interactions

### 3. Prepare the Transfer Parameters

Before executing the transfer, we need to:
- Define the recipient's address
- Specify the NFT contract address
- Identify the token ID to transfer

### 4. Execute the Transfer

Finally, we'll implement the transfer function that will:
- Create the transfer transaction
- Sign it with the user's wallet
- Send it to the blockchain
- Handle the response

## Your Code Challenge

Complete the implementation by:
1. Setting up the necessary imports from the Passport SDK and ethers.js
2. Creating the connection to the EVM
3. Setting up the Web3 provider
4. Implementing the transfer function
5. Handling the transaction response

Make sure to:
- Use proper error handling
- Validate input parameters
- Provide feedback to the user about the transaction status

## Testing Your Implementation

Once you've completed the implementation, you can test it by:
1. Connecting your wallet
2. Attempting to transfer an NFT
3. Verifying the transaction on the blockchain explorer
4. Checking the recipient's wallet for the transferred NFT

## Lesson Complete

This is the end of the first Immutable Passport lesson. Now you know how to configure Passport, login and send an NFT. You are well on your way to becoming a Web3 developer on Immutable&nbsp;zkEVM.