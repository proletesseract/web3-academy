# Introduction to Immutable Passport

Immutable Passport is a secure authentication and wallet solution designed specifically for web3 applications and games. It provides a seamless way for users to authenticate, manage their digital assets, and interact with blockchain features.

## Prerequisites

Before continuing with this tutorial, make sure you have:

- Node.js 16+ and npm installed
- A basic Next.js application set up
- An Immutable Hub account and a registered application
- Basic knowledge of TypeScript and React

## Getting Your API Keys

To use Passport, you'll need to register your application in the Immutable Hub:

1. Go to [Immutable Hub](https://hub.immutable.com/)
2. Create an account if you don't have one
3. Navigate to "Applications" and click "Create New Application"
4. Fill in your application details
5. Once created, you'll receive a Client ID which we'll use later

## What We'll Build

In this tutorial, we'll create a Next.js application that:

1. Installs and configures the Immutable SDK
2. Initializes a Passport client
3. Implements user login with Passport
4. Displays user information after successful authentication