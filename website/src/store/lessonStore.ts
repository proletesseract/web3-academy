import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LessonStep } from '../components/Lesson/Lesson';

interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  lessons: Lesson[];
  difficulty?: string;
  prerequisites?: { title: string; description: string }[];
  resources?: { title: string; url: string }[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
  completed: boolean;
}

interface UserProgress {
  completedLessons: Record<string, boolean>;
  completedSteps: Record<string, boolean>;
  currentLessonId?: string;
}

interface LessonStore {
  courses: Course[];
  userProgress: UserProgress;
  
  // Actions
  initializeCourses: (courses: Course[]) => void;
  markStepAsCompleted: (lessonId: string, stepId: string) => void;
  markLessonAsCompleted: (lessonId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  resetLessonProgress: (lessonId: string) => void;
  
  // Selectors
  getCurrentLesson: () => Lesson | undefined;
  getLessonById: (lessonId: string) => Lesson | undefined;
  getCourseById: (courseId: string) => Course | undefined;
}

const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      courses: [],
      userProgress: {
        completedLessons: {},
        completedSteps: {},
      },
      
      initializeCourses: (courses) => set({ courses }),
      
      markStepAsCompleted: (lessonId, stepId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          completedSteps: {
            ...state.userProgress.completedSteps,
            [`${lessonId}-${stepId}`]: true,
          },
        },
      })),
      
      markLessonAsCompleted: (lessonId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          completedLessons: {
            ...state.userProgress.completedLessons,
            [lessonId]: true,
          },
        },
      })),
      
      resetLessonProgress: (lessonId) => set((state) => {
        // Create a new completedSteps object without the steps for this lesson
        const newCompletedSteps = { ...state.userProgress.completedSteps };
        Object.keys(newCompletedSteps).forEach(key => {
          if (key.startsWith(`${lessonId}-`)) {
            delete newCompletedSteps[key];
          }
        });
        
        // Create a new completedLessons object without this lesson
        const newCompletedLessons = { ...state.userProgress.completedLessons };
        delete newCompletedLessons[lessonId];
        
        return {
          userProgress: {
            ...state.userProgress,
            completedSteps: newCompletedSteps,
            completedLessons: newCompletedLessons,
          },
        };
      }),
      
      setCurrentLesson: (lessonId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          currentLessonId: lessonId,
        },
      })),
      
      getCurrentLesson: () => {
        const { courses, userProgress } = get();
        if (!userProgress.currentLessonId) return undefined;
        
        for (const course of courses) {
          const lesson = course.lessons.find(l => l.id === userProgress.currentLessonId);
          if (lesson) return lesson;
        }
        
        return undefined;
      },
      
      getLessonById: (lessonId) => {
        const { courses } = get();
        
        for (const course of courses) {
          const lesson = course.lessons.find(l => l.id === lessonId);
          if (lesson) return lesson;
        }
        
        return undefined;
      },
      
      getCourseById: (courseId) => {
        const { courses } = get();
        return courses.find(c => c.id === courseId);
      },
    }),
    {
      name: 'lesson-storage',
    }
  )
);

export default useLessonStore; 