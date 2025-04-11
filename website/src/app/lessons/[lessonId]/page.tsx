'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useLessonStore from '../../../store/lessonStore';
import Lesson from '../../../components/Lesson/Lesson';
import Link from 'next/link';

// Remove the server-side exports that cause the error
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId as string || '';
  const [isLoading, setIsLoading] = useState(true);
  const [courseId, setCourseId] = useState<string | null>(null);
  
  const { getLessonById, markLessonAsCompleted } = useLessonStore();
  const lesson = getLessonById(lessonId);
  
  // Find the course this lesson belongs to
  useEffect(() => {
    // Force rehydrate the lesson data when the component loads
    const fetchData = async () => {
      try {
        // Call the revalidation API first
        await fetch(`/api/revalidate?path=/lessons/${lessonId}`, { 
          cache: 'no-store'
        });
        
        // Then fetch the lesson data
        const response = await fetch(`/api/lessons/${lessonId}/refresh?_=${Date.now()}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        // Even if the fetch fails, we'll still try to get the course from the store
        console.log('Refreshed lesson data from server');
      } catch (error) {
        console.log('Error refreshing lesson data:', error);
      }
      
      const { courses } = useLessonStore.getState();
      
      // Find the course that contains this lesson
      for (const course of courses) {
        if (course.lessons.some(l => l.id === lessonId)) {
          setCourseId(course.id);
          break;
        }
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [lessonId]);
  
  // Show loading state during hydration to prevent mismatch
  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-6 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading lesson...</p>
        </div>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-4">
          <Link 
            href="/courses" 
            className="btn-immutable"
          >
            ← Back to Courses
          </Link>
        </div>
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Lesson Not Found</h1>
          <p className="mb-6 text-gray-300">The lesson you are looking for does not exist.</p>
          <Link 
            href="/courses" 
            className="btn-immutable"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }
  
  const handleLessonComplete = () => {
    markLessonAsCompleted(lessonId);
    
    if (courseId) {
      router.push(`/courses/${courseId}`);
    } else {
      router.push('/courses');
    }
  };
  
  return (
    <div className="w-full">
      <div className="mb-4 mt-4 ml-4">
        <Link 
          href={courseId ? `/courses/${courseId}` : "/courses"} 
        >
          ← Back to {courseId ? 'Lessons' : 'Courses'}
        </Link>
      </div>
      <Lesson 
        lesson={lesson} 
        onComplete={handleLessonComplete}
      />
    </div>
  );
} 