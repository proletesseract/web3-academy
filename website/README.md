# Immutable Academy

An interactive learning platform for Immutable X development, inspired by CryptoZombies. This platform offers step-by-step tutorials with interactive coding challenges and quizzes to help users learn how to build on Immutable X.

## Features

- Interactive code editor with real-time validation
- Step-by-step tutorials with markdown content
- Progress tracking across courses and lessons
- Comprehension quizzes to test understanding
- Interactive checklists for complex tasks
- Responsive design for desktop and mobile

## Available Courses

- **Immutable Passport**: Learn how to integrate Immutable Passport for user authentication
- **Immutable Checkout** (Coming Soon): Master payment processing and checkout flows
- **Smart Contracts** (Coming Soon): Develop and deploy smart contracts on Immutable X
- **In-game Marketplaces** (Coming Soon): Build NFT marketplaces for your games

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Monaco Editor for code editing
- Zustand for state management
- React Markdown for tutorial content
- Tailwind CSS for styling
- Immutable Passport for authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm

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
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `website` directory with the following variables:
   ```
   NEXT_PUBLIC_IMMUTABLE_PASSPORT_CLIENT_ID=your_client_id
   NEXT_PUBLIC_IMMUTABLE_PASSPORT_REDIRECT_URI=http://localhost:3000/redirect
   NEXT_PUBLIC_IMMUTABLE_PASSPORT_LOGOUT_REDIRECT_URI=http://localhost:3000/logout
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js app router pages and API routes
  - `api`: API routes for course data
  - `courses`: Course listing and detail pages
  - `lessons`: Lesson pages
- `src/components`: Reusable React components
  - `CodeEditor`: Monaco editor integration
  - `Quiz`: Interactive quiz component
  - `Lesson`: Main lesson component combining content, code, and quizzes
  - `Navigation`: Navbar and other navigation components
- `src/lib`: Utility functions and helpers
  - `courseLoader`: Functions for loading course content
- `src/store`: State management using Zustand
- `public`: Static assets

## Course Content Structure

Course content is stored in the `nextjs-courses` directory at the root of the project. Each course has its own directory with the following structure:

- `course.json`: Course metadata and lesson information
- `lessons/`: Directory containing lesson content
  - `manifest.json`: Lesson metadata and step information
  - `steps/`: Directory containing step content
    - `content.md`: Markdown content for the step
    - `code-start.ts`: Starting code for code challenges
    - `code-solution.ts`: Solution code for validation

## Adding New Courses and Lessons

To add a new course:

1. Create a new directory in the `nextjs-courses` folder
2. Create a `course.json` file with the course metadata and lesson information
3. Create a `lessons` directory with lesson content
4. Add the course to the API route in `src/app/api/courses/route.ts`

## License

MIT
