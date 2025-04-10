'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useLessonStore from '../../../store/lessonStore';
import Link from 'next/link';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [isLoading, setIsLoading] = useState(true);
  
  const { getCourseById, setCurrentLesson } = useLessonStore();
  const course = getCourseById(courseId);
  
  // Ensure consistent rendering between server and client
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  // Show loading state during hydration to prevent mismatch
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-6 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading course...</p>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">Course Not Found</h1>
        <p className="mb-6 text-gray-300">The course you are looking for does not exist.</p>
        <Link 
          href="/courses" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Courses
        </Link>
      </div>
    );
  }
  
  const handleStartLesson = (lessonId: string) => {
    setCurrentLesson(lessonId);
    router.push(`/lessons/${lessonId}`);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link 
        href="/courses" 
        className="text-blue-400 mb-6 inline-block hover:underline"
      >
        ← Back to Courses
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">{course.title}</h1>
        <p className="text-gray-300">{course.description}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Lessons</h2>
        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
            <div 
              key={lesson.id} 
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-2">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4 ml-11">{lesson.description}</p>
              
              <div className="ml-11 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {lesson.steps.length} {lesson.steps.length === 1 ? 'step' : 'steps'}
                </div>
                
                <button
                  onClick={() => handleStartLesson(lesson.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {lesson.completed ? 'Continue' : 'Start Lesson'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 