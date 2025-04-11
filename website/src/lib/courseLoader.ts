import fs from 'fs';
import path from 'path';

// Define types that match our course structure
export interface CourseManifest {
  courseId: string;
  version: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  difficulty: string;
  estimatedTime: string;
  image?: string;
  lessons: LessonInfo[];
  prerequisites: Prerequisite[];
  resources: Resource[];
}

export interface LessonInfo {
  id: string;
  path: string;
  title: string;
  description: string;
  difficulty: string;
  timeToComplete: string;
  comingSoon?: boolean;
}

export interface Prerequisite {
  title: string;
  description: string;
}

export interface Resource {
  title: string;
  url: string;
}

export interface LessonManifest {
  lessonId: string;
  version: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  difficulty: string;
  timeToComplete: string;
  steps: StepInfo[];
  starter: {
    description: string;
    directory: string;
  };
  complete: {
    description: string;
    directory: string;
  };
  resources: Resource[];
}

export interface StepInfo {
  id: string;
  title: string;
  contentFile: string;
  codeFile: string;
  isCodeRequired: boolean;
  context?: {
    hint?: string;
  };
  quiz?: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  checklist?: {
    items: {
      id: string;
      text: string;
    }[];
  };
}

// Define types that match our website's expected structure
export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  lessons: Lesson[];
  prerequisites: Prerequisite[];
  resources: Resource[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  comingSoon?: boolean;
  difficulty: string;
  timeToComplete: string;
  steps: LessonStep[];
}

export interface LessonStep {
  id: string;
  title: string;
  content: string;
  codeChallenge?: {
    defaultCode: string;
    language?: string;
    solution: string;
    expectedOutput?: string;
    hints?: string[];
  };
  quiz?: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  checklist?: {
    items: {
      id: string;
      text: string;
      type?: 'checkbox' | 'input';
      placeholder?: string;
      validationPattern?: string;
    }[];
  };
  _timestamp?: number; // Optional timestamp for cache busting
}

// Function to load all courses
export async function loadCourses(): Promise<Course[]> {
  const coursesDir = path.join(process.cwd(), '..', 'nextjs-courses');
  const courseFolders = fs.readdirSync(coursesDir).filter(folder => {
    return fs.statSync(path.join(coursesDir, folder)).isDirectory();
  });

  // Clear require cache in development to ensure fresh data
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Clearing require cache to ensure fresh data');
    Object.keys(require.cache).forEach(key => {
      if (key.includes('nextjs-courses')) {
        delete require.cache[key];
      }
    });
  }

  const courses: Course[] = [];

  for (const courseFolder of courseFolders) {
    const coursePath = path.join(coursesDir, courseFolder);
    const courseManifestPath = path.join(coursePath, 'course.json');
    
    // Skip if no course manifest
    if (!fs.existsSync(courseManifestPath)) continue;
    
    // Read course manifest
    const courseManifest: CourseManifest = JSON.parse(
      fs.readFileSync(courseManifestPath, 'utf-8')
    );
    
    // Ensure image path has a leading slash
    let imagePath = courseManifest.image || `/images/courses/${courseManifest.courseId}.jpg`;
    if (imagePath && !imagePath.startsWith('/')) {
      imagePath = `/${imagePath}`;
    }
    
    // Create course object with lessons
    const course: Course = {
      id: courseManifest.courseId,
      title: courseManifest.title,
      description: courseManifest.description,
      image: imagePath, // Use processed image path
      lessons: [],
      prerequisites: courseManifest.prerequisites,
      resources: courseManifest.resources
    };
    
    // Load lessons
    for (const lessonInfo of courseManifest.lessons) {
      const lesson = await loadLesson(coursePath, lessonInfo);
      course.lessons.push(lesson);
    }
    
    courses.push(course);
  }
  
  return courses;
}

// Function to load a single lesson
async function loadLesson(coursePath: string, lessonInfo: LessonInfo): Promise<Lesson> {
  const lessonPath = path.join(coursePath, lessonInfo.path);
  const lessonManifestPath = path.join(lessonPath, 'manifest.json');
  
  // For lessons marked as coming soon, create a placeholder
  if (lessonInfo.comingSoon) {
    return {
      id: lessonInfo.id,
      title: lessonInfo.title,
      description: lessonInfo.description,
      completed: false,
      comingSoon: true,
      difficulty: lessonInfo.difficulty,
      timeToComplete: lessonInfo.timeToComplete,
      steps: []
    };
  }
  
  // Read lesson manifest
  const lessonManifest: LessonManifest = JSON.parse(
    fs.readFileSync(lessonManifestPath, 'utf-8')
  );
  
  // Create lesson object with steps
  const lesson: Lesson = {
    id: lessonManifest.lessonId,
    title: lessonManifest.title,
    description: lessonManifest.description,
    completed: false,
    difficulty: lessonManifest.difficulty,
    timeToComplete: lessonManifest.timeToComplete,
    steps: []
  };
  
  // Load steps
  for (const stepInfo of lessonManifest.steps) {
    const step = await loadStep(lessonPath, stepInfo);
    lesson.steps.push(step);
  }
  
  return lesson;
}

// Function to load a single step
async function loadStep(lessonPath: string, stepInfo: StepInfo): Promise<LessonStep> {
  const contentPath = path.join(lessonPath, stepInfo.contentFile);
  const codePath = path.join(lessonPath, stepInfo.codeFile.replace('code.ts', 'code-start.ts'));
  const solutionPath = path.join(lessonPath, stepInfo.codeFile.replace('code.ts', 'code-solution.ts'));
  
  // Read content from markdown file
  const content = fs.existsSync(contentPath) 
    ? fs.readFileSync(contentPath, 'utf-8') 
    : '# Content coming soon';
  
  // Read code if available and required
  let codeChallenge;
  if (stepInfo.isCodeRequired && fs.existsSync(codePath)) {
    const code = fs.readFileSync(codePath, 'utf-8');
    
    // Try to read solution file if it exists
    let solution = '';
    if (fs.existsSync(solutionPath)) {
      solution = fs.readFileSync(solutionPath, 'utf-8');
    }
    
    codeChallenge = {
      defaultCode: code,
      language: 'typescript',
      solution: solution,
    };
  }
  
  // Create step object
  const step: LessonStep = {
    id: stepInfo.id,
    title: stepInfo.title,
    content,
    ...(codeChallenge ? { codeChallenge } : {}),
    ...(stepInfo.quiz ? { quiz: stepInfo.quiz } : {}),
    ...(stepInfo.checklist ? { checklist: stepInfo.checklist } : {}),
    _timestamp: Date.now() // Add timestamp to prevent caching
  };
  
  return step;
} 