import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lessonId } = req.query;

  try {
    // Find the lesson manifest file
    const coursesDir = path.join(process.cwd(), '..', 'nextjs-courses');
    let manifestPath = '';
    
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
        const lessonPath = path.join(coursePath, lesson);
        const lessonManifestPath = path.join(lessonPath, 'manifest.json');
        
        if (fs.existsSync(lessonManifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(lessonManifestPath, 'utf-8'));
            if (manifest.lessonId === lessonId) {
              manifestPath = lessonManifestPath;
              break;
            }
          } catch (error) {
            console.error(`Error parsing manifest at ${lessonManifestPath}:`, error);
          }
        }
      }
      
      if (manifestPath) break;
    }
    
    if (!manifestPath) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    // Read the manifest to confirm it can be loaded
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    // Return a success response with a timestamp to prevent caching
    return res.status(200).json({ 
      success: true, 
      lessonId, 
      timestamp: Date.now() 
    });
  } catch (error) {
    console.error('Error refreshing lesson data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 