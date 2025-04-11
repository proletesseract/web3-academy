# Immutable Academy Courses

This directory contains all the course content for the Immutable Academy learning platform. Each course is organized in its own directory with a consistent structure.

## Available Courses

### Immutable Passport

Learn how to integrate Immutable Passport for user authentication in your Next.js applications.

- **Course ID**: `passport`
- **Difficulty**: Beginner to Intermediate
- **Estimated Time**: 2 hours
- **Status**: Active

### Immutable Checkout (Coming Soon)

Master payment processing and checkout flows with Immutable Checkout.

- **Course ID**: `checkout`
- **Difficulty**: Intermediate
- **Estimated Time**: 2 hours
- **Status**: Coming Soon

### Smart Contracts (Coming Soon)

Develop and deploy smart contracts on Immutable X.

- **Course ID**: `smart-contracts`
- **Difficulty**: Advanced
- **Estimated Time**: 4 hours
- **Status**: Coming Soon

### In-game Marketplaces (Coming Soon)

Build NFT marketplaces for your games.

- **Course ID**: `marketplaces`
- **Difficulty**: Intermediate
- **Estimated Time**: 3 hours
- **Status**: Coming Soon

## Course Structure

Each course follows a consistent directory structure:

```
course-id/
├── course.json           # Course metadata and lesson information
├── README.md             # Course-specific documentation
└── lessons/              # Directory containing lesson content
    ├── lesson-id/        # Each lesson has its own directory
    │   ├── manifest.json # Lesson metadata and step information
    │   └── steps/        # Directory containing step content
    │       ├── 01/       # Each step has its own directory
    │       │   ├── content.md       # Markdown content for the step
    │       │   ├── code-start.ts    # Starting code for code challenges
    │       │   └── code-solution.ts # Solution code for validation
    │       └── ...
    └── ...
```

## Course JSON Format

Each course has a `course.json` file with the following structure:

```json
{
  "courseId": "course-id",
  "version": "1.0.0",
  "title": "Course Title",
  "description": "Course description",
  "author": "Immutable Academy",
  "tags": ["tag1", "tag2"],
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedTime": "X hours",
  "image": "/images/courses/course-id.jpg",
  "lessons": [
    {
      "id": "lesson-id",
      "path": "lessons/lesson-id",
      "title": "Lesson Title",
      "description": "Lesson description",
      "difficulty": "Beginner|Intermediate|Advanced",
      "timeToComplete": "X minutes"
    }
  ],
  "prerequisites": [
    {
      "title": "Prerequisite Title",
      "description": "Prerequisite description"
    }
  ],
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://resource-url.com"
    }
  ]
}
```

## Lesson JSON Format

Each lesson has a `manifest.json` file with the following structure:

```json
{
  "lessonId": "lesson-id",
  "version": "1.0.0",
  "title": "Lesson Title",
  "description": "Lesson description",
  "author": "Immutable Academy",
  "tags": ["tag1", "tag2"],
  "difficulty": "Beginner|Intermediate|Advanced",
  "timeToComplete": "X minutes",
  "steps": [
    {
      "id": "step-id",
      "title": "Step Title",
      "contentFile": "content.md",
      "codeFile": "code.ts",
      "isCodeRequired": true,
      "context": {
        "hint": "Optional hint for the step"
      },
      "quiz": [
        {
          "id": "quiz-id",
          "question": "Quiz question",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "Option 1"
        }
      ],
      "checklist": {
        "items": [
          {
            "id": "item-id",
            "text": "Checklist item text"
          }
        ]
      }
    }
  ],
  "starter": {
    "description": "Starter code description",
    "directory": "starter"
  },
  "complete": {
    "description": "Complete code description",
    "directory": "complete"
  },
  "resources": [
    {
      "title": "Resource Title",
      "url": "https://resource-url.com"
    }
  ]
}
```

## Adding a New Course

To add a new course:

1. Create a new directory with the course ID (e.g., `new-course`)
2. Create a `course.json` file with the course metadata
3. Create a `README.md` file with course-specific documentation
4. Create a `lessons` directory with lesson content
5. Follow the directory structure above for organizing lessons and steps

## Contributing

When contributing new courses or updating existing ones:

1. Follow the established directory structure and JSON formats
2. Ensure all required files are present
3. Test the course in the Immutable Academy platform
4. Update the course metadata in the main application if needed 