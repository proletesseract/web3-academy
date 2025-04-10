'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useLessonStore from '../../../store/lessonStore';
import Lesson from '../../../components/Lesson/Lesson';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  
  const { getLessonById, markLessonAsCompleted } = useLessonStore();
  const lesson = getLessonById(lessonId);
  
  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Lesson Not Found</h1>
        <p className="mb-6">The lesson you are looking for does not exist.</p>
        <Link 
          href="/courses" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Courses
        </Link>
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
    <div>
      <Lesson 
        lesson={lesson} 
        onComplete={handleLessonComplete}
      />
    </div>
  );
} 