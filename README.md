# Immutable Academy

![Immutable Academy](website/public/images/immutable-academy-logo.png)

## Overview

Immutable Academy is an interactive learning platform designed to help developers master Immutable X development. The platform offers a gamified learning experience with step-by-step tutorials, interactive code challenges, quizzes, and practical exercises.

## Features

- **Interactive Learning**: Hands-on tutorials with real-world examples
- **Code Challenges**: Practice coding directly in the browser with our integrated code editor
- **Progress Tracking**: Track your learning progress across courses and lessons
- **Quizzes**: Test your knowledge with interactive quizzes
- **Checklists**: Follow structured checklists to complete complex tasks
- **Responsive Design**: Learn on any device with our mobile-friendly interface

## Available Courses

- **Immutable Passport**: Learn how to integrate Immutable Passport for user authentication
- **Immutable Checkout** (Coming Soon): Master payment processing and checkout flows
- **Smart Contracts** (Coming Soon): Develop and deploy smart contracts on Immutable X
- **In-game Marketplaces** (Coming Soon): Build NFT marketplaces for your games

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Code Editor**: Monaco Editor
- **Authentication**: Immutable Passport
- **Styling**: Tailwind CSS with custom Immutable design system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web3-academy.git
   cd web3-academy
   ```

2. Install dependencies:
   ```bash
   cd website
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `website` directory with the following variables:
   ```
   NEXT_PUBLIC_IMMUTABLE_PASSPORT_CLIENT_ID=your_client_id
   NEXT_PUBLIC_IMMUTABLE_PASSPORT_REDIRECT_URI=http://localhost:3000/redirect
   NEXT_PUBLIC_IMMUTABLE_PASSPORT_LOGOUT_REDIRECT_URI=http://localhost:3000/logout
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `website/`: Main application code
  - `src/`: Source code
    - `app/`: Next.js app router pages and API routes
    - `components/`: Reusable React components
    - `lib/`: Utility functions and helpers
    - `store/`: Zustand state management
  - `public/`: Static assets
- `nextjs-courses/`: Course content
  - `passport/`: Immutable Passport course
  - `checkout/`: Immutable Checkout course (coming soon)
  - `smart-contracts/`: Smart Contracts course (coming soon)
  - `marketplaces/`: In-game Marketplaces course (coming soon)

## Contributing

We welcome contributions to Immutable Academy! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Immutable X team for their excellent documentation and support
- The open-source community for the amazing tools that made this project possible 