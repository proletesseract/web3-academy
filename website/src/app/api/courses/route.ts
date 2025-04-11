import { NextResponse } from 'next/server';
import { loadCourses } from '../../../lib/courseLoader';

export async function GET() {
  try {
    const courses = await loadCourses();
    
    // Create response with no-cache headers
    const response = NextResponse.json({ courses });
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error loading courses:', error);
    return NextResponse.json(
      { error: 'Failed to load courses' },
      { status: 500 }
    );
  }
} 