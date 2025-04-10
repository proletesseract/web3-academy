import { NextResponse } from 'next/server';
import { loadCourses } from '../../../lib/courseLoader';

export async function GET() {
  try {
    const courses = await loadCourses();
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error loading courses:', error);
    return NextResponse.json(
      { error: 'Failed to load courses' },
      { status: 500 }
    );
  }
} 