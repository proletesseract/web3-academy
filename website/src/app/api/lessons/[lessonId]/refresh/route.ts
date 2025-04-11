import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const lessonId = params.lessonId;

  try {
    // Find the lesson manifest file
    const coursesDir = path.join(process.cwd(), '..', 'nextjs-courses');
    let lessonPath = '';
    let lessonInfo = null;
    
    // Walk through the courses to find the lesson
    const courseFolders = fs.readdirSync(coursesDir).filter(folder => {
      return fs.statSync(path.join(coursesDir, folder)).isDirectory();
    });
    
    for (const course of courseFolders) {
      const coursePath = path.join(coursesDir, course);
      const lessonFolders = fs.readdirSync(coursePath).filter(folder => {
        const folderPath = path.join(coursePath, folder);
        return fs.statSync(folderPath).isDirectory() && fs.existsSync(path.join(folderPath, 'manifest.json'));
      });
      
      for (const lesson of lessonFolders) {
        const currentLessonPath = path.join(coursePath, lesson);
        const lessonManifestPath = path.join(currentLessonPath, 'manifest.json');
        
        if (fs.existsSync(lessonManifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(lessonManifestPath, 'utf-8'));
            if (manifest.lessonId === lessonId) {
              lessonPath = currentLessonPath;
              lessonInfo = {
                id: lessonId,
                path: lesson,
                title: manifest.title,
                description: manifest.description,
                difficulty: manifest.difficulty,
                timeToComplete: manifest.timeToComplete
              };
              break;
            }
          } catch (error) {
            console.error(`Error parsing manifest at ${lessonManifestPath}:`, error);
          }
        }
      }
      
      if (lessonPath) break;
    }
    
    if (!lessonPath || !lessonInfo) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Read the manifest to confirm it can be loaded
    const manifestContent = fs.readFileSync(path.join(lessonPath, 'manifest.json'), 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    // Create response with no-cache headers
    const response = NextResponse.json({ 
      success: true, 
      lessonId,
      manifest,
      timestamp: Date.now() 
    });
    
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error refreshing lesson:', error);
    return NextResponse.json(
      { error: 'Failed to refresh lesson data' },
      { status: 500 }
    );
  }
} 