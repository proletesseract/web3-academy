'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useLessonStore from '../../../store/lessonStore';
import Lesson from '../../../components/Lesson/Lesson';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const [isLoading, setIsLoading] = useState(true);
  
  const { getLessonById, markLessonAsCompleted } = useLessonStore();
  const lesson = getLessonById(lessonId);
  
  // Ensure consistent rendering between server and client
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  // Show loading state during hydration to prevent mismatch
  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-6 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4">Loading lesson...</p>
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
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </Link>
        </div>
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Lesson Not Found</h1>
          <p className="mb-6">The lesson you are looking for does not exist.</p>
          <Link 
            href="/courses" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }
  
  const handleLessonComplete = () => {
    markLessonAsCompleted(lessonId);
    
    // Find the course this lesson belongs to
    const { courses } = useLessonStore.getState();
    let courseId = '';
    
    for (const course of courses) {
      if (course.lessons.some(l => l.id === lessonId)) {
        courseId = course.id;
        break;
      }
    }
    
    if (courseId) {
      router.push(`/courses/${courseId}`);
    } else {
      router.push('/courses');
    }
  };
  
  return (
    <div className="w-full">
      <div className="p-4">
        <Link 
          href="/courses" 
          className="text-blue-600 hover:underline inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Courses
        </Link>
      </div>
      <Lesson 
        lesson={lesson} 
        onComplete={handleLessonComplete}
      />
    </div>
  );
} 