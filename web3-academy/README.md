# Immutable Academy

An interactive learning platform for Immutable X development, inspired by CryptoZombies. This platform offers step-by-step tutorials with interactive coding challenges and quizzes to help users learn how to build on Immutable X.

## Features

- Interactive code editor with real-time validation
- Step-by-step tutorials with markdown content
- Progress tracking across courses and lessons
- Comprehension quizzes to test understanding
- Responsive design for desktop and mobile

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Monaco Editor for code editing
- Zustand for state management
- React Markdown for tutorial content
- Tailwind CSS for styling

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
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable React components
  - `CodeEditor`: Monaco editor integration
  - `Quiz`: Interactive quiz component
  - `Lesson`: Main lesson component combining content, code, and quizzes
  - `Navigation`: Navbar and other navigation components
- `src/store`: State management using Zustand
- `public`: Static assets

## Adding New Courses and Lessons

Courses and lessons are currently defined in the `sampleCourses` array in `src/app/courses/page.tsx`. In a production environment, this would be replaced with a CMS or API integration.

Each course consists of:
- `id`: Unique identifier
- `title`: Course title
- `description`: Course description
- `image`: Optional course image
- `lessons`: Array of lesson objects

Each lesson consists of:
- `id`: Unique identifier
- `title`: Lesson title
- `description`: Lesson description
- `steps`: Array of step objects defining the learning content

Steps can include:
- Markdown content
- Code challenges with validation
- Multiple-choice quizzes

## License

MIT
