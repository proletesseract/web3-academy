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
  const { courses, initializeCourses } = useLessonStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        
        // Add cache-busting query parameter to force fresh data
        const response = await fetch(`/api/courses?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        // Always initialize with fresh data
        initializeCourses(data.courses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    // Always fetch fresh data
    fetchCourses();
    
    // Set up automatic refresh when the component becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCourses();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initializeCourses]);
  
  if (loading) {
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
                <div className="text-sm text-gray-500">
                  {course.lessons.length} {course.lessons.length === 1 ? 'lesson' : 'lessons'}
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
                Start Learning
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
