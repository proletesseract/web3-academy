# Immutable Passport Starter Project

This is a starter Next.js project for the Immutable Passport integration tutorial. It includes the basic structure and dependencies needed to follow along with the lesson.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_IMMUTABLE_CLIENT_ID=your-client-id-from-immutable-hub
NEXT_PUBLIC_IMMUTABLE_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_IMMUTABLE_LOGOUT_REDIRECT_URI=http://localhost:3000/
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

This starter project includes:

- A basic Next.js application with TypeScript
- The Immutable SDK installed as a dependency
- Empty directories for you to add your code as you follow the tutorial

## Prerequisites

Before starting the tutorial, make sure you have:

- Node.js 16+ and npm installed
- An Immutable Hub account
- A registered application in the Immutable Hub to get your Client ID 