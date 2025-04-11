import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    // Get the path to revalidate from the request URL
    const path = request.nextUrl.searchParams.get('path') || '/';
    
    // Revalidate the path
    revalidatePath(path);
    
    // Return a success response
    return NextResponse.json({ 
      revalidated: true,
      now: Date.now(),
      path
    });
  } catch (error) {
    // Return an error response
    return NextResponse.json({ 
      revalidated: false, 
      message: 'Error revalidating', 
      error: (error as Error).message 
    }, { 
      status: 500 
    });
  }
} 