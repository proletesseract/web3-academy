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
  const [lessonData, setLessonData] = useState<any>(null);
  
  const { getLessonById, markLessonAsCompleted, initializeCourses } = useLessonStore();
  
  // Find the course this lesson belongs to and fetch fresh lesson data
  useEffect(() => {
    // Force rehydrate the lesson data when the component loads
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Call the revalidation API first
        await fetch(`/api/revalidate?path=/lessons/${lessonId}`, { 
          cache: 'no-store'
        });
        
        // Fetch fresh courses data to update the store
        const coursesResponse = await fetch(`/api/courses?_=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          // Update the global store with fresh data
          initializeCourses(coursesData.courses);
          
          // Find the lesson in the fresh data
          let foundLesson = null;
          let foundCourseId = null;
          
          for (const course of coursesData.courses) {
            const lesson = course.lessons.find((l: any) => l.id === lessonId);
            if (lesson) {
              foundLesson = lesson;
              foundCourseId = course.id;
              break;
            }
          }
          
          if (foundLesson) {
            setLessonData(foundLesson);
            setCourseId(foundCourseId);
          } else {
            console.error('Lesson not found in fresh data');
          }
        }
        
        // Also fetch the specific lesson data
        const lessonResponse = await fetch(`/api/lessons/${lessonId}/refresh?_=${Date.now()}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (lessonResponse.ok) {
          const lessonData = await lessonResponse.json();
          console.log('Refreshed lesson data from server:', lessonData);
          
          // If we have the manifest data, we can use it to update the lesson
          if (lessonData.manifest) {
            // Find the lesson in the store and update it with the fresh data
            const { courses } = useLessonStore.getState();
            const updatedCourses = [...courses];
            
            for (let i = 0; i < updatedCourses.length; i++) {
              const course = updatedCourses[i];
              const lessonIndex = course.lessons.findIndex((l: any) => l.id === lessonId);
              
              if (lessonIndex !== -1) {
                // Update the lesson with fresh data
                const updatedLesson = { ...course.lessons[lessonIndex] };
                
                // Update title and description from manifest
                updatedLesson.title = lessonData.manifest.title;
                updatedLesson.description = lessonData.manifest.description;
                
                // Update the lesson in the course
                updatedCourses[i].lessons[lessonIndex] = updatedLesson;
                
                // Update the store
                initializeCourses(updatedCourses);
                
                // Update the local state
                setLessonData(updatedLesson);
                setCourseId(course.id);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.log('Error refreshing lesson data:', error);
        // Fallback to store data if API fails
        const lesson = getLessonById(lessonId);
        setLessonData(lesson);
        
        // Find the course that contains this lesson
        const { courses } = useLessonStore.getState();
        for (const course of courses) {
          if (course.lessons.some(l => l.id === lessonId)) {
            setCourseId(course.id);
            break;
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [lessonId, getLessonById, initializeCourses]);
  
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
  
  if (!lessonData) {
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
        lesson={lessonData} 
        onComplete={handleLessonComplete}
      />
    </div>
  );
} 