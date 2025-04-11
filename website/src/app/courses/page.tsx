'use client';

import React, { useEffect, useState } from 'react';
import useLessonStore from '../../store/lessonStore';
import Link from 'next/link';
import Image from 'next/image';

// Define the Course interface expected by this component
interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  lessons: any[];
  difficulty: string;
}

export default function CoursesPage() {
  const { courses, initializeCourses, userProgress } = useLessonStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the latest courses data to ensure it's up to date
  useEffect(() => {
    async function fetchLatestCourses() {
      try {
        setIsLoading(true);
        
        // Fetch fresh course data
        const response = await fetch('/api/courses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch updated courses');
        }
        
        const data = await response.json();
        
        // Update the completed status for each lesson based on userProgress
        const updatedCourses = data.courses.map((course: Course) => ({
          ...course,
          lessons: course.lessons.map((lesson: any) => ({
            ...lesson,
            completed: userProgress.completedLessons[lesson.id] || false
          }))
        }));
        
        // Update the global store
        initializeCourses(updatedCourses);
        
      } catch (err) {
        console.error('Error refreshing course data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLatestCourses();
  }, [initializeCourses, userProgress.completedLessons]);
  
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading courses...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Available Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {course.image ? (
                <Image 
                  src={course.image}
                  alt={course.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/course-placeholder.jpg';
                    console.error(`Failed to load image: ${course.image}`);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                  <span className="text-blue-800 font-semibold text-lg">{course.title}</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500 flex items-center">
                  {course.lessons.some((lesson: any) => lesson.completed) ? (
                    <div className="flex items-center">
                      <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>
                        {course.lessons.filter((lesson: any) => lesson.completed).length} of {course.lessons.length} completed
                      </span>
                    </div>
                  ) : (
                    <span>
                      {course.lessons.length} {course.lessons.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  )}
                </div>
                {course.difficulty && (
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {course.difficulty}
                  </div>
                )}
              </div>
              <Link 
                href={`/courses/${course.id}`}
                className="btn-immutable-sm-gradient w-full block text-center"
              >
                {course.lessons.some((lesson: any) => lesson.completed) ? 'Continue Learning' : 'Start Learning'}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No courses available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
